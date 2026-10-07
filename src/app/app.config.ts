import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import {
  IndexedDbAdapter,
  LocalRepository,
  StorageAdapter,
} from './core/storage/local.repository';
import { FamilyService } from './core/storage/family.service';
import { I18nService } from './core/i18n/i18n.service';
import { ContentService } from './core/content/content.service';
import {
  BrowserSpeechAdapter,
  SpeechAdapter,
} from './core/audio/audio.service';
import { AppErrorHandler } from './core/platform/platform.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: StorageAdapter, useExisting: IndexedDbAdapter },
    { provide: SpeechAdapter, useExisting: BrowserSpeechAdapter },
    { provide: ErrorHandler, useExisting: AppErrorHandler },
    provideAppInitializer(() => {
      const repository = inject(LocalRepository);
      const family = inject(FamilyService);
      const i18n = inject(I18nService);
      const content = inject(ContentService);
      return repository
        .load()
        .then(() =>
          Promise.all([
            i18n.init(family.active()?.preferredLanguage ?? 'en'),
            content.init(),
          ]),
        );
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:3000',
    }),
  ],
};
