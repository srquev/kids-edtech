import { computed, inject, Injectable, signal } from '@angular/core';
import { LearningItem } from '../models';
import { I18nService } from '../i18n/i18n.service';
import { FamilyService } from '../storage/family.service';

export type SpeechFailure = 'blocked' | 'unavailable';

export abstract class SpeechAdapter {
  abstract speak(
    text: string,
    locale: string,
    done: (failure?: SpeechFailure) => void,
    rate?: number,
  ): void;
  abstract stop(): void;
  abstract pause(): void;
}
@Injectable({ providedIn: 'root' })
export class BrowserSpeechAdapter extends SpeechAdapter {
  // Keep the utterance alive until playback finishes (needed by some engines).
  private current?: SpeechSynthesisUtterance;
  speak(
    text: string,
    locale: string,
    done: (failure?: SpeechFailure) => void,
    rate = 0.8,
  ): void {
    if (
      !window.speechSynthesis ||
      typeof window.SpeechSynthesisUtterance !== 'function'
    ) {
      done('unavailable');
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    this.current = speech;
    speech.lang = locale;
    speech.rate = rate;
    speech.pitch = 1;
    const normalize = (lang: string) => lang.toLowerCase().replace('_', '-');
    const voices = speechSynthesis
      .getVoices()
      .filter(
        (voice) =>
          normalize(voice.lang).split('-')[0] ===
            normalize(locale).split('-')[0] &&
          (navigator.onLine || voice.localService),
      );
    // A local voice does not depend on a network speech service being reachable.
    const score = (voice: SpeechSynthesisVoice) =>
      (voice.localService ? 1000 : 0) +
      (normalize(voice.lang) === normalize(locale) ? 100 : 0) +
      (/natural|premium|enhanced/i.test(voice.name) ? 20 : 0) +
      (voice.default ? 1 : 0);
    voices.sort((a, b) => score(b) - score(a));
    if (voices[0]) {
      speech.voice = voices[0];
      speech.lang = voices[0].lang;
    }
    const finish = (failure?: SpeechFailure) => {
      if (this.current !== speech) return;
      this.current = undefined;
      done(failure);
    };
    speech.onend = () => finish();
    speech.onerror = (event) =>
      finish(event.error === 'not-allowed' ? 'blocked' : 'unavailable');
    // Speak within the tap, even if the voice list has not loaded yet. In that
    // case let the browser select its default voice for the requested language.
    try {
      speechSynthesis.resume();
      speechSynthesis.speak(speech);
    } catch {
      finish('unavailable');
    }
  }
  stop(): void {
    this.current = undefined;
    window.speechSynthesis?.cancel();
  }
  pause(): void {
    window.speechSynthesis?.pause();
  }
}
@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly family = inject(FamilyService);
  private readonly i18n = inject(I18nService);
  private readonly speech = inject(SpeechAdapter);
  readonly playing = signal(false);
  readonly failure = signal<SpeechFailure | null>(null);
  readonly muted = computed(() => this.family.settings().muted);
  readonly voiceDisabled = computed(() => !this.family.settings().voice);
  private audio?: HTMLAudioElement;
  private context?: AudioContext;
  private last?: { text: string; path?: string; slow: boolean; locale: string };
  private generation = 0;
  playPronunciation(item: LearningItem, slow = false): void {
    this.play(item.name, item.audioAvailable ? item.audio : undefined, slow);
  }
  playLesson(item: LearningItem): void {
    this.play(`${item.name}. ${item.shortDescription}`, item.lessonAudio);
  }
  playInstruction(text: string): void {
    this.play(text);
  }
  playNarration(
    text: string,
    path: string,
    locale: string,
    slow = false,
  ): void {
    this.play(text, path, slow, locale);
  }
  replay(): void {
    if (this.last)
      this.play(
        this.last.text,
        this.last.path,
        this.last.slow,
        this.last.locale,
      );
  }
  private play(
    text: string,
    path?: string,
    slow = false,
    locale = this.i18n.locale,
  ): void {
    this.stop();
    this.last = { text, path, slow, locale };
    if (this.family.settings().muted || !this.family.settings().voice) return;
    const generation = this.generation;
    this.playing.set(true);
    const done = (failure?: SpeechFailure) => {
      if (generation !== this.generation) return;
      this.playing.set(false);
      this.failure.set(failure ?? null);
    };
    const fallback = () => {
      if (generation === this.generation)
        this.speech.speak(text, locale, done, slow ? 0.65 : 0.8);
    };
    if (path) {
      const audio = new Audio(path);
      this.audio = audio;
      audio.preload = 'auto';
      audio.volume = 1;
      audio.muted = false;
      audio.preservesPitch = true;
      audio.playbackRate = slow ? 0.8 : 1;
      audio.onended = () => done();
      let fellBack = false;
      const onFailure = (error?: unknown) => {
        if (generation !== this.generation || fellBack) return;
        fellBack = true;
        if (error instanceof DOMException && error.name === 'NotAllowedError')
          done('blocked');
        else fallback();
      };
      audio.onerror = () => onFailure();
      void audio.play().catch(onFailure);
    } else fallback();
  }
  playSuccess(): void {
    this.tone(660);
  }
  playRetry(): void {
    this.playInstruction(this.i18n.t('game.retry'));
  }
  private tone(frequency: number): void {
    if (
      this.family.settings().muted ||
      !this.family.settings().effects ||
      !('AudioContext' in window)
    )
      return;
    try {
      this.context ??= new AudioContext();
      void this.context.resume();
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        frequency * 1.5,
        this.context.currentTime + 0.15,
      );
      gain.gain.setValueAtTime(0.07, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.context.currentTime + 0.35,
      );
      oscillator.start();
      oscillator.stop(this.context.currentTime + 0.35);
    } catch {
      /* Effects are optional on devices without an available audio output. */
    }
  }
  pause(): void {
    this.audio?.pause();
    this.speech.pause();
    this.playing.set(false);
  }
  stop(): void {
    this.generation++;
    this.failure.set(null);
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
      this.audio.src = '';
      this.audio = undefined;
    }
    this.speech.stop();
    this.playing.set(false);
  }
}
