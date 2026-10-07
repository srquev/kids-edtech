import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { ContentService } from '../../core/content/content.service';
import { FamilyService } from '../../core/storage/family.service';
import {
  ProgressService,
  practiceItems,
} from '../../core/progress/progress.service';
import { AudioService } from '../../core/audio/audio.service';
import {
  AnalyticsService,
  HapticAdapter,
} from '../../core/platform/platform.service';
import {
  createMemory,
  createSession,
  evaluate,
  GAMES,
  MemoryCard,
} from '../../core/game-engine/game-engine';
import { GameKind, GameSession, LearningItem } from '../../core/models';
import { ItemArtComponent } from '../../shared/art.component';
@Component({
  imports: [RouterLink, ItemArtComponent],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnDestroy {
  readonly i = inject(I18nService);
  readonly content = inject(ContentService);
  readonly family = inject(FamilyService);
  readonly progress = inject(ProgressService);
  readonly audio = inject(AudioService);
  private readonly haptic = inject(HapticAdapter);
  private readonly analytics = inject(AnalyticsService);
  private readonly route = inject(ActivatedRoute);
  readonly games = GAMES;
  readonly kind = this.route.snapshot.paramMap.get('kind') as GameKind | null;
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly session = signal<GameSession | null>(null);
  readonly index = signal(0);
  readonly attempts = signal(0);
  readonly feedback = signal<'correct' | 'retry' | null>(null);
  readonly selected = signal('');
  readonly stars = signal(0);
  readonly finished = signal(false);
  readonly current = computed(() => this.session()?.questions[this.index()]);
  readonly cards = signal<MemoryCard[]>([]);
  readonly flipped = signal<string[]>([]);
  readonly matched = signal<string[]>([]);
  readonly locked = signal(false);
  readonly pairAttempts = new Map<string, number>();
  readonly prompt = computed(() => {
    const q = this.current();
    return this.i.t(
      this.kind === 'count'
        ? 'game.countPrompt'
        : this.kind === 'match'
          ? 'game.matchPrompt'
          : this.kind === 'memory'
            ? 'game.memoryPrompt'
            : 'game.findPrompt',
      { name: q?.target.name ?? '' },
    );
  });
  readonly knownGame =
    !this.kind || GAMES.some((game) => game.id === this.kind);
  private timer?: ReturnType<typeof setTimeout>;
  private disposed = false;
  constructor() {
    if (this.kind && this.knownGame) void this.start();
  }
  async start(): Promise<void> {
    if (!this.kind) return;
    clearTimeout(this.timer);
    this.loading.set(true);
    this.failed.set(false);
    this.index.set(0);
    this.stars.set(0);
    this.finished.set(false);
    this.feedback.set(null);
    this.attempts.set(0);
    this.selected.set('');
    this.flipped.set([]);
    this.matched.set([]);
    this.locked.set(false);
    this.pairAttempts.clear();
    this.audio.stop();
    try {
      const params = this.route.snapshot.queryParamMap;
      const category =
        this.kind === 'count'
          ? 'numbers'
          : (params.get('category') ?? 'animals');
      let pool = await this.content.load(category, this.i.language());
      let targets: LearningItem[] | undefined;
      if (params.has('practice') && this.kind === 'find-it') {
        const packs = await Promise.all(
          this.content
            .categories()
            .map((c) => this.content.load(c.id, this.i.language())),
        );
        pool = packs.flat();
        targets = practiceItems(pool, this.progress.data().concepts, 5);
      } else if (params.get('target')) {
        const target = pool.find((item) => item.id === params.get('target'));
        if (target)
          targets = [
            target,
            ...pool.filter((item) => item !== target).slice(0, 4),
          ];
      }
      if (this.disposed) return;
      const difficulty = this.family.active()?.difficulty ?? 'easy';
      this.session.set(createSession(this.kind, pool, difficulty, targets));
      if (this.kind === 'memory')
        this.cards.set(createMemory(pool, difficulty));
      this.analytics.track('game_started');
      this.audio.playInstruction(this.prompt());
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
  answer(id: string): void {
    const q = this.current();
    if (!q || this.feedback() === 'correct') return;
    const result = evaluate(q, id, this.attempts());
    this.attempts.set(result.attempts);
    this.selected.set(id);
    if (result.correct) {
      this.feedback.set('correct');
      this.stars.update((n) => n + 1);
      this.audio.playSuccess();
      this.haptic.success();
      this.analytics.track('answer_correct');
      this.audio.playInstruction(this.i.t('game.correct'));
      this.progress.record(
        q.target,
        this.kind ?? 'find-it',
        result.attempts,
        this.session()?.id ?? '',
        1,
      );
    } else {
      this.feedback.set('retry');
      this.audio.playRetry();
      this.analytics.track('answer_retry');
    }
  }
  next(): void {
    if (this.index() + 1 >= (this.session()?.questions.length ?? 0)) {
      this.finish();
      return;
    }
    this.index.update((n) => n + 1);
    this.attempts.set(0);
    this.selected.set('');
    this.feedback.set(null);
    this.audio.playInstruction(this.prompt());
  }
  flip(card: MemoryCard): void {
    if (
      this.locked() ||
      this.matched().includes(card.item.id) ||
      this.flipped().includes(card.id)
    )
      return;
    this.audio.playPronunciation(card.item);
    const flipped = [...this.flipped(), card.id];
    this.flipped.set(flipped);
    this.feedback.set(null);
    if (flipped.length < 2) return;
    const first = this.cards().find((c) => c.id === flipped[0]);
    if (!first) return;
    this.pairAttempts.set(
      first.item.id,
      (this.pairAttempts.get(first.item.id) ?? 0) + 1,
    );
    if (first.item.id === card.item.id) {
      this.matched.update((ids) => [...ids, card.item.id]);
      this.flipped.set([]);
      this.stars.update((n) => n + 1);
      this.feedback.set('correct');
      this.audio.playSuccess();
      this.haptic.success();
      this.progress.record(
        card.item,
        'memory',
        this.pairAttempts.get(first.item.id) ?? 1,
        this.session()?.id ?? '',
        1,
      );
      if (this.matched().length * 2 === this.cards().length) this.finish();
    } else {
      this.pairAttempts.set(
        card.item.id,
        (this.pairAttempts.get(card.item.id) ?? 0) + 1,
      );
      this.locked.set(true);
      this.feedback.set('retry');
      this.timer = setTimeout(() => {
        this.flipped.set([]);
        this.locked.set(false);
      }, 1200);
    }
  }
  private finish(): void {
    this.finished.set(true);
    this.audio.playInstruction(this.i.t('game.finish'));
    this.analytics.track('game_completed');
  }
  visible(card: MemoryCard): boolean {
    return (
      this.flipped().includes(card.id) || this.matched().includes(card.item.id)
    );
  }
  ngOnDestroy(): void {
    this.disposed = true;
    clearTimeout(this.timer);
    this.audio.stop();
  }
}
