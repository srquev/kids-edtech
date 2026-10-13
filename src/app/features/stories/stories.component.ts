import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nService } from '../../core/i18n/i18n.service';
import { AudioService } from '../../core/audio/audio.service';
import { LearningItem } from '../../core/models';
import { ItemArtComponent } from '../../shared/art.component';
import { Story, StoryLanguage, StoryService } from './story.service';
@Component({
  imports: [RouterLink, ItemArtComponent],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoriesComponent {
  readonly i = inject(I18nService);
  readonly audio = inject(AudioService);
  private readonly service = inject(StoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly reader = viewChild<ElementRef<HTMLElement>>('reader');
  readonly language = signal<StoryLanguage>(
    this.i.language() === 'hi' ? 'hi' : 'en',
  );
  readonly stories = signal<Story[]>([]);
  readonly messages = signal<
    Partial<Record<StoryLanguage, Record<string, string>>>
  >({});
  readonly storyId = signal('');
  readonly pageIndex = signal(0);
  readonly ended = signal(false);
  readonly answer = signal('');
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly selected = computed(() =>
    this.stories().find((story) => story.id === this.storyId()),
  );
  readonly page = computed(() => this.selected()?.pages[this.pageIndex()]);
  readonly copy = computed(() => this.selected()?.[this.language()]);
  private request = 0;
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.audio.stop();
      this.storyId.set(params.get('story') ?? '');
      this.pageIndex.set(0);
      this.ended.set(false);
      this.answer.set('');
      this.reveal();
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const language = params.get('lang');
      this.audio.stop();
      this.language.set(
        language === 'hi' || language === 'en'
          ? language
          : this.i.language() === 'hi'
            ? 'hi'
            : 'en',
      );
    });
    this.destroyRef.onDestroy(() => {
      this.request++;
      this.audio.stop();
    });
    void this.load();
  }
  async load(): Promise<void> {
    const request = ++this.request;
    this.loading.set(true);
    this.failed.set(false);
    try {
      const content = await this.service.load();
      if (request !== this.request) return;
      this.stories.set(content.stories);
      this.messages.set(content.messages);
    } catch {
      if (request === this.request) this.failed.set(true);
    } finally {
      if (request === this.request) {
        this.loading.set(false);
        this.reveal();
      }
    }
  }
  t(key: string, params: Record<string, string | number> = {}): string {
    let text = this.messages()[this.language()]?.[key] ?? this.i.t(key);
    for (const [name, value] of Object.entries(params))
      text = text.replaceAll(`{${name}}`, String(value));
    return text;
  }
  setLanguage(language: StoryLanguage): void {
    if (language === this.language()) return;
    this.audio.stop();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { lang: language },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  art(index: number): LearningItem {
    return {
      id: 'story-art',
      category: 'animals',
      name: '',
      shortDescription: '',
      emoji: '✦',
      image: '/assets/images/animals-realistic.jpg',
      imageGrid: { columns: 4, rows: 4, index },
      audioAvailable: false,
      enabled: true,
      difficulty: 1,
      tags: [],
    };
  }
  read(slow = false): void {
    const page = this.page()?.[this.language()];
    if (page)
      this.audio.playNarration(
        page.text,
        page.audio,
        this.language() === 'hi' ? 'hi-IN' : 'en-US',
        slow,
      );
  }
  readQuestion(): void {
    const copy = this.copy();
    if (copy)
      this.audio.playNarration(
        `${copy.question} ${copy.options.map((option) => option.text + '.').join(' ')}`,
        copy.questionAudio,
        this.language() === 'hi' ? 'hi-IN' : 'en-US',
      );
  }
  move(direction: -1 | 1): void {
    const next = this.pageIndex() + direction;
    if (next < 0 || next >= (this.selected()?.pages.length ?? 0)) return;
    this.audio.stop();
    this.pageIndex.set(next);
    this.reveal();
  }
  finish(): void {
    this.audio.stop();
    this.ended.set(true);
    this.reveal();
  }
  restart(): void {
    this.audio.stop();
    this.pageIndex.set(0);
    this.ended.set(false);
    this.answer.set('');
    this.reveal();
  }
  choose(id: string): void {
    if (this.answer() === this.selected()?.answerId) return;
    this.answer.set(id);
  }
  private reveal(): void {
    afterNextRender(
      () => {
        if (this.destroyRef.destroyed) return;
        const reader = this.reader()?.nativeElement;
        reader?.focus({ preventScroll: true });
        reader?.scrollIntoView({ block: 'start', behavior: 'instant' });
      },
      { injector: this.injector },
    );
  }
}
