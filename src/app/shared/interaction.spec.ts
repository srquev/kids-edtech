import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  ActivatedRoute,
  convertToParamMap,
} from '@angular/router';
import { GamesComponent } from '../features/games/games.component';
import { AudioService, SpeechAdapter } from '../core/audio/audio.service';
import { I18nService } from '../core/i18n/i18n.service';
import { ContentService } from '../core/content/content.service';
import { StorageAdapter, initialState } from '../core/storage/local.repository';
import { FamilyService } from '../core/storage/family.service';
import { LearningItem } from '../core/models';
const items: LearningItem[] = ['elephant', 'dog', 'cat'].map((id) => ({
  id,
  category: 'animals',
  name: id,
  shortDescription: id,
  emoji: '🐻',
  difficulty: 1,
  tags: [],
  enabled: true,
  audioAvailable: false,
}));
describe('Answer interaction and audio controls', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GamesComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ kind: 'find-it' }),
              queryParamMap: convertToParamMap({
                category: 'animals',
                target: 'elephant',
              }),
            },
          },
        },
        {
          provide: StorageAdapter,
          useValue: {
            read: async () => initialState(),
            write: async () => undefined,
          },
        },
        { provide: ContentService, useValue: { load: async () => items } },
        {
          provide: SpeechAdapter,
          useValue: {
            speak: (_t: string, _l: string, done: () => void) => done(),
            stop: () => undefined,
            pause: () => undefined,
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: (key: string) => key,
            language: () => 'en',
            locale: 'en-IN',
          },
        },
      ],
    });
  });
  it('retains a question after an incorrect answer and disables choices after success', async () => {
    const fixture = TestBed.createComponent(GamesComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.answer('dog');
    fixture.detectChanges();
    expect(component.feedback()).toBe('retry');
    expect(component.index()).toBe(0);
    component.answer('elephant');
    fixture.detectChanges();
    expect(component.feedback()).toBe('correct');
    const buttons = fixture.nativeElement.querySelectorAll(
      '.answer-card',
    ) as NodeListOf<HTMLButtonElement>;
    expect(Array.from(buttons).every((button) => button.disabled)).toBeTrue();
  });
  it('cancels prior speech and respects mute', async () => {
    const speech = TestBed.inject(SpeechAdapter);
    const speak = spyOn(speech, 'speak');
    const stop = spyOn(speech, 'stop');
    const family = TestBed.inject(FamilyService);
    const audio = TestBed.inject(AudioService);
    audio.playInstruction('hello');
    audio.playInstruction('again');
    expect(stop).toHaveBeenCalledTimes(2);
    expect(speak).toHaveBeenCalledTimes(2);
    await family.updateSettings({ muted: true });
    audio.playInstruction('quiet');
    expect(speak).toHaveBeenCalledTimes(2);
    expect(audio.playing()).toBeFalse();
  });
  it('uses slower pronunciation, replays at that speed, and reads the lesson description', () => {
    const speech = TestBed.inject(SpeechAdapter);
    const speak = spyOn(speech, 'speak');
    const audio = TestBed.inject(AudioService);
    audio.playPronunciation(items[0], true);
    expect(speak.calls.mostRecent().args[3]).toBe(0.65);
    audio.replay();
    expect(speak.calls.mostRecent().args[3]).toBe(0.65);
    audio.playLesson({
      ...items[0],
      shortDescription: 'An elephant has a long trunk.',
    });
    expect(speak.calls.mostRecent().args[0]).toBe(
      'elephant. An elephant has a long trunk.',
    );
    expect(speak.calls.mostRecent().args[3]).toBe(0.8);
  });
  it('ignores completion of interrupted speech', () => {
    const speak = spyOn(TestBed.inject(SpeechAdapter), 'speak');
    const audio = TestBed.inject(AudioService);
    audio.playPronunciation(items[0]);
    const oldDone = speak.calls.mostRecent().args[2];
    audio.playPronunciation(items[1]);
    oldDone();
    expect(audio.playing()).toBeTrue();
    speak.calls.mostRecent().args[2]();
    expect(audio.playing()).toBeFalse();
  });
  it('plays bundled name and description audio, and slows the name without changing pitch', () => {
    const media = document.createElement('audio');
    spyOn(media, 'play').and.returnValue(Promise.resolve());
    spyOn(media, 'pause');
    const create = spyOn(window, 'Audio').and.returnValue(media);
    const speak = spyOn(TestBed.inject(SpeechAdapter), 'speak');
    const audio = TestBed.inject(AudioService);
    const item = {
      ...items[0],
      audioAvailable: true,
      audio: '/assets/audio/en/animals/elephant.m4a',
      lessonAudio: '/assets/audio/en/animals/elephant-lesson.m4a',
    };
    audio.playPronunciation(item, true);
    expect(create).toHaveBeenCalledWith(item.audio);
    expect(media.playbackRate).toBe(0.8);
    expect(media.preservesPitch).toBeTrue();
    audio.playLesson(item);
    expect(create).toHaveBeenCalledWith(item.lessonAudio);
    expect(media.playbackRate).toBe(1);
    expect(speak).not.toHaveBeenCalled();
  });
  it('falls back once when a bundled recording cannot be loaded', async () => {
    const media = document.createElement('audio');
    spyOn(media, 'play').and.returnValue(
      Promise.reject(new Error('Missing clip')),
    );
    spyOn(media, 'pause');
    spyOn(window, 'Audio').and.returnValue(media);
    const speak = spyOn(TestBed.inject(SpeechAdapter), 'speak');
    const audio = TestBed.inject(AudioService);
    audio.playPronunciation({
      ...items[0],
      audioAvailable: true,
      audio: '/assets/missing.m4a',
    });
    media.dispatchEvent(new Event('error'));
    await Promise.resolve();
    expect(speak).toHaveBeenCalledTimes(1);
    audio.stop();
  });
});
