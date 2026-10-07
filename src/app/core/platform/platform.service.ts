import { ErrorHandler, inject, Injectable, isDevMode, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { FamilyService } from '../storage/family.service';

@Injectable({ providedIn: 'root' })
export class AppErrorHandler implements ErrorHandler {
  readonly failed = signal(false);
  handleError(error: unknown): void { this.failed.set(true); if (isDevMode()) console.error(error); }
}
@Injectable({ providedIn: 'root' })
export class HapticAdapter {
  private readonly family = inject(FamilyService);
  success(): void { if (this.family.settings().haptics && 'vibrate' in navigator) navigator.vibrate(35); }
}
export type AnalyticsEvent = 'lesson_started' | 'lesson_completed' | 'game_started' | 'game_completed' | 'answer_correct' | 'answer_retry' | 'parent_dashboard_opened';
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // Intentionally no network, identifiers, or persistent behavioral event stream.
  track(_event: AnalyticsEvent): void { /* Future opt-in implementation belongs at this boundary. */ }
}
@Injectable({ providedIn: 'root' })
export class UpdateService {
  readonly available = signal(false);
  readonly offlineReady = signal(false);
  readonly offline = signal(!navigator.onLine);
  private readonly updates = inject(SwUpdate);
  constructor() {
    window.addEventListener('online', () => this.offline.set(false));
    window.addEventListener('offline', () => this.offline.set(true));
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(event => { if (event.type === 'VERSION_READY') this.available.set(true); if (event.type === 'VERSION_DETECTED') this.offlineReady.set(false); });
      if ('serviceWorker' in navigator) void navigator.serviceWorker.ready.then(() => this.offlineReady.set(true));
    }
  }
  reload(): void { location.reload(); }
}
