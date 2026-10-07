import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nService } from './core/i18n/i18n.service';
import { FamilyService } from './core/storage/family.service';
import { AudioService } from './core/audio/audio.service';
import {
  AppErrorHandler,
  UpdateService,
} from './core/platform/platform.service';
import { ProgressService } from './core/progress/progress.service';
import { ParentGateService } from './core/platform/parent-gate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnDestroy {
  readonly i = inject(I18nService);
  readonly family = inject(FamilyService);
  readonly audio = inject(AudioService);
  readonly updates = inject(UpdateService);
  readonly errors = inject(AppErrorHandler);
  readonly progress = inject(ProgressService);
  private readonly router = inject(Router);
  private readonly gate = inject(ParentGateService);
  readonly path = signal(this.router.url);
  readonly welcome = computed(() => this.path().startsWith('/welcome'));
  readonly nav = [
    { route: '/', key: 'nav.home', icon: 'home' },
    { route: '/learn', key: 'nav.learn', icon: 'book' },
    { route: '/play', key: 'nav.play', icon: 'play' },
    { route: '/trace', key: 'nav.trace', icon: 'pencil' },
    { route: '/rewards', key: 'nav.rewards', icon: 'star' },
  ];
  private lastActive = Date.now();
  private readonly activity = () => {
    this.lastActive = Date.now();
  };
  private readonly timer = window.setInterval(() => {
    const learning = /^\/(learn\/|play\/|trace)/.test(this.path());
    if (learning && !document.hidden && Date.now() - this.lastActive < 60_000)
      this.progress.addSeconds(10);
  }, 10_000);
  constructor() {
    window.addEventListener('pointerdown', this.activity);
    window.addEventListener('keydown', this.activity);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.path.set(event.urlAfterRedirects);
        this.audio.stop();
        this.lastActive = Date.now();
        if (
          !event.urlAfterRedirects.startsWith('/parent') &&
          !event.urlAfterRedirects.startsWith('/welcome')
        )
          this.gate.lock();
        window.scrollTo({ top: 0 });
        requestAnimationFrame(() =>
          document
            .querySelector<HTMLElement>('#main-content')
            ?.focus({ preventScroll: true }),
        );
      });
  }
  toggleAudio(): void {
    this.audio.stop();
    void this.family.updateSettings({ muted: !this.family.settings().muted });
  }
  ngOnDestroy(): void {
    clearInterval(this.timer);
    window.removeEventListener('pointerdown', this.activity);
    window.removeEventListener('keydown', this.activity);
  }
}
