import { inject, Injectable, signal } from '@angular/core';
import { LearningItem } from '../models';
import { I18nService } from '../i18n/i18n.service';
import { FamilyService } from '../storage/family.service';

export abstract class SpeechAdapter { abstract speak(text: string, locale: string, done: () => void): void; abstract stop(): void; abstract pause(): void; }
@Injectable({ providedIn: 'root' })
export class BrowserSpeechAdapter extends SpeechAdapter {
  speak(text: string, locale: string, done: () => void): void {
    if (!('speechSynthesis' in window)) { done(); return; }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = locale; speech.rate = 0.82; speech.pitch = 1.08;
    const voice = speechSynthesis.getVoices().find(v => v.lang === locale) ?? speechSynthesis.getVoices().find(v => v.lang.startsWith(locale.split('-')[0]));
    if (voice) speech.voice = voice;
    speech.onend = done; speech.onerror = done;
    speechSynthesis.speak(speech);
  }
  stop(): void { if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  pause(): void { if ('speechSynthesis' in window) speechSynthesis.pause(); }
}
@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly family = inject(FamilyService);
  private readonly i18n = inject(I18nService);
  private readonly speech = inject(SpeechAdapter);
  readonly playing = signal(false);
  private audio?: HTMLAudioElement;
  private context?: AudioContext;
  private last?: { text: string; path?: string };
  private generation = 0;
  playPronunciation(item: LearningItem): void { this.play(item.name, item.audioAvailable ? item.audio : undefined); }
  playInstruction(text: string): void { this.play(text); }
  replay(): void { if (this.last) this.play(this.last.text, this.last.path); }
  private play(text: string, path?: string): void {
    this.stop(); this.last = { text, path };
    if (this.family.settings().muted || !this.family.settings().voice) return;
    const generation = this.generation;
    this.playing.set(true);
    const done = () => { if (generation === this.generation) this.playing.set(false); };
    const fallback = () => { if (generation === this.generation) this.speech.speak(text, this.i18n.locale, done); };
    if (path) {
      const audio = new Audio(path); this.audio = audio;
      audio.onended = done;
      void audio.play().catch(fallback);
    } else fallback();
  }
  playSuccess(): void { this.tone(660); }
  playRetry(): void { this.playInstruction(this.i18n.t('game.retry')); }
  private tone(frequency: number): void {
    if (this.family.settings().muted || !this.family.settings().effects || !('AudioContext' in window)) return;
    try {
      this.context ??= new AudioContext();
      void this.context.resume();
      const oscillator = this.context.createOscillator(); const gain = this.context.createGain();
      oscillator.connect(gain); gain.connect(this.context.destination);
      oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.context.currentTime + .15);
      gain.gain.setValueAtTime(.07, this.context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, this.context.currentTime + .35);
      oscillator.start(); oscillator.stop(this.context.currentTime + .35);
    } catch { /* Effects are optional on devices without an available audio output. */ }
  }
  pause(): void { this.audio?.pause(); this.speech.pause(); this.playing.set(false); }
  stop(): void { this.generation++; if (this.audio) { this.audio.pause(); this.audio.src = ''; this.audio = undefined; } this.speech.stop(); this.playing.set(false); }
}
