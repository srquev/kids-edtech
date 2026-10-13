import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nService } from '../../core/i18n/i18n.service';
import { ContentService } from '../../core/content/content.service';
import { AudioService } from '../../core/audio/audio.service';
import { ProgressService } from '../../core/progress/progress.service';
import { LearningItem } from '../../core/models';
import { CategoryCardComponent } from '../../shared/category-card.component';
import { ItemArtComponent } from '../../shared/art.component';
@Component({
  imports: [RouterLink, CategoryCardComponent, ItemArtComponent],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent {
  readonly i = inject(I18nService);
  readonly content = inject(ContentService);
  readonly audio = inject(AudioService);
  readonly progress = inject(ProgressService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly lessonPanel =
    viewChild<ElementRef<HTMLElement>>('lessonPanel');
  readonly categoryId = signal('');
  readonly itemId = signal('');
  readonly items = signal<LearningItem[]>([]);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly selected = computed(() =>
    this.items().find((item) => item.id === this.itemId()),
  );
  readonly index = computed(() =>
    this.items().findIndex((item) => item.id === this.itemId()),
  );
  readonly nextItem = computed(() =>
    this.index() >= 0 ? this.items()[this.index() + 1] : undefined,
  );
  readonly previousItem = computed(() => this.items()[this.index() - 1]);
  readonly exploredCount = computed(
    () => this.items().filter((item) => this.explored(item)).length,
  );
  readonly resumeItem = computed(
    () => this.items().find((item) => !this.explored(item)) ?? this.items()[0],
  );
  readonly finished = signal(false);
  private readonly sessionId = crypto.randomUUID();
  private readonly visited = new Set<string>();
  private request = 0;
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.request++;
      this.audio.stop();
    });
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.categoryId.set(params.get('category') ?? '');
      this.itemId.set(params.get('item') ?? '');
      this.finished.set(false);
      void this.load();
    });
  }
  navigate(direction: -1 | 1): void {
    const item = direction === -1 ? this.previousItem() : this.nextItem();
    if (item) void this.router.navigate(['/learn', this.categoryId(), item.id]);
  }
  finish(): void {
    this.audio.stop();
    this.finished.set(true);
    this.revealLesson(this.request);
  }
  private revealLesson(request: number): void {
    afterNextRender(
      () => {
        if (request !== this.request || this.destroyRef.destroyed) return;
        const panel = this.lessonPanel()?.nativeElement;
        panel?.focus({ preventScroll: true });
        panel?.scrollIntoView({ block: 'start', behavior: 'instant' });
      },
      { injector: this.injector },
    );
  }
  async load(): Promise<void> {
    const request = ++this.request;
    this.audio.stop();
    this.items.set([]);
    this.failed.set(false);
    if (!this.categoryId()) {
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    try {
      const items = await this.content.load(
        this.categoryId(),
        this.i.language(),
      );
      if (request !== this.request) return;
      this.items.set(items);
      const selected = this.selected();
      if (selected) {
        this.audio.playPronunciation(selected);
        const key = `${selected.category}:${selected.id}`;
        if (!this.visited.has(key)) {
          this.visited.add(key);
          this.progress.record(selected, 'lesson', 0, this.sessionId, 0);
        }
      }
    } catch {
      if (request === this.request) this.failed.set(true);
    } finally {
      if (request === this.request) {
        this.loading.set(false);
        if (this.selected()) this.revealLesson(request);
      }
    }
  }
  explored(item: LearningItem): boolean {
    return !!this.progress.data().concepts[`${item.category}:${item.id}`];
  }
}
