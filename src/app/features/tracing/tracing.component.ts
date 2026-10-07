import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { AudioService } from '../../core/audio/audio.service';
import { ProgressService } from '../../core/progress/progress.service';
import {
  advanceTrace,
  distance,
  Point,
  TraceDefinition,
} from './tracing-engine';
@Component({
  templateUrl: './tracing.component.html',
  styleUrl: './tracing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracingComponent {
  readonly i = inject(I18nService);
  readonly audio = inject(AudioService);
  readonly progress = inject(ProgressService);
  readonly definitions = signal<TraceDefinition[]>([]);
  readonly active = signal<TraceDefinition | null>(null);
  readonly failed = signal(false);
  readonly loading = signal(true);
  readonly drawing = signal<string[]>([]);
  readonly percentage = signal(0);
  readonly complete = computed(() => this.percentage() === 100);
  readonly startPoint = signal<Point>({ x: 70, y: 230 });
  readonly pen = signal<Point>({ x: 70, y: 230 });
  readonly board = viewChild<ElementRef<SVGSVGElement>>('board');
  private samples: Point[][] = [];
  private positions: number[] = [];
  private activeStroke = -1;
  private strokePoints: Point[] = [];
  private sessionId = crypto.randomUUID();
  private readonly rewarded = new Set<string>();
  private keyboardDrawing = false;
  constructor() {
    void this.load();
  }
  async load(): Promise<void> {
    this.loading.set(true);
    this.failed.set(false);
    try {
      const response = await fetch('/assets/content/tracing.json');
      if (!response.ok) throw new Error('Trace definitions unavailable');
      const data = (await response.json()) as TraceDefinition[];
      this.definitions.set(data);
      this.select(data[0]);
    } catch {
      this.failed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
  label(def: TraceDefinition): string {
    return def.type === 'shape'
      ? this.i.t('trace.shape') + ' · ' + this.shapeLabel(def.id)
      : this.i.t('trace.' + def.type) + ' ' + def.id;
  }
  shapeLabel(id: string): string {
    return this.i.t('shape.' + id);
  }
  select(def: TraceDefinition): void {
    this.active.set(def);
    this.reset();
  }
  reset(): void {
    this.drawing.set([]);
    this.percentage.set(0);
    this.activeStroke = -1;
    this.samples = (this.active()?.paths ?? []).map((d) => {
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      );
      path.setAttribute('d', d);
      const length = path.getTotalLength();
      return Array.from(
        { length: Math.max(2, Math.ceil(length / 6)) },
        (_, i) => {
          const p = path.getPointAtLength(
            (i * length) / (Math.max(2, Math.ceil(length / 6)) - 1),
          );
          return { x: p.x, y: p.y };
        },
      );
    });
    this.positions = this.samples.map(() => 0);
    this.startPoint.set(this.samples[0]?.[0] ?? { x: 70, y: 230 });
    this.pen.set(this.startPoint());
  }
  private point(event: PointerEvent): Point {
    const svg = this.board()?.nativeElement;
    const matrix = svg?.getScreenCTM()?.inverse();
    if (!matrix) return { x: 0, y: 0 };
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix,
    );
    return { x: p.x, y: p.y };
  }
  down(event: PointerEvent): void {
    if (event.button !== 0) return;
    event.preventDefault();
    this.board()?.nativeElement.setPointerCapture(event.pointerId);
    this.begin(this.point(event));
  }
  move(event: PointerEvent): void {
    if (this.activeStroke >= 0) this.draw(this.point(event));
  }
  up(): void {
    this.activeStroke = -1;
    this.strokePoints = [];
  }
  private begin(point: Point): void {
    if (this.complete()) return;
    const index = this.samples.findIndex(
      (samples, n) =>
        this.positions[n] < samples.length &&
        distance(samples[this.positions[n]], point) < 25,
    );
    if (index < 0) return;
    this.activeStroke = index;
    this.strokePoints = [point];
    this.drawing.update((paths) => [...paths, `M${point.x} ${point.y}`]);
    this.draw(point);
  }
  private draw(point: Point): void {
    this.pen.set(point);
    if (this.activeStroke < 0) return;
    const last = this.strokePoints.at(-1) ?? point;
    if (distance(last, point) > 55) return;
    this.strokePoints.push(point);
    this.drawing.update((paths) => [
      ...paths.slice(0, -1),
      paths[paths.length - 1] + ` L${point.x} ${point.y}`,
    ]);
    this.positions[this.activeStroke] = advanceTrace(
      this.samples[this.activeStroke],
      this.positions[this.activeStroke],
      point,
    );
    const total = this.samples.reduce((n, s) => n + s.length, 0);
    const covered = this.positions.reduce((n, p) => n + p, 0);
    this.percentage.set(Math.floor((covered / total) * 100));
    const next = this.samples.findIndex((s, n) => this.positions[n] < s.length);
    if (next >= 0)
      this.startPoint.set(this.samples[next][this.positions[next]]);
    if (this.complete()) {
      this.audio.playSuccess();
      const def = this.active();
      if (def && !this.rewarded.has(def.id)) {
        this.progress.record(
          {
            id: def.id,
            category: 'tracing',
            name: def.id,
            shortDescription: '',
            emoji: def.id,
            difficulty: 1,
            tags: [],
            enabled: true,
            audioAvailable: false,
          },
          'trace',
          1,
          this.sessionId,
          1,
        );
        this.rewarded.add(def.id);
      }
    }
  }
  key(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      if (!this.keyboardDrawing) {
        this.keyboardDrawing = true;
        this.begin(this.pen());
      }
      return;
    }
    const delta: Record<string, Point> = {
      ArrowUp: { x: 0, y: -5 },
      ArrowDown: { x: 0, y: 5 },
      ArrowLeft: { x: -5, y: 0 },
      ArrowRight: { x: 5, y: 0 },
    };
    const d = delta[event.key];
    if (!d) return;
    event.preventDefault();
    const p = {
      x: Math.max(0, Math.min(300, this.pen().x + d.x)),
      y: Math.max(0, Math.min(300, this.pen().y + d.y)),
    };
    this.pen.set(p);
    if (this.keyboardDrawing) this.draw(p);
  }
  keyUp(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.keyboardDrawing = false;
      this.up();
    }
  }
}
