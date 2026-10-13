import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { LearningItem } from '../core/models';
@Component({
  selector: 'app-item-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item().image && failedImage() !== item().image) {
      @if (item().imageGrid; as grid) {
        <span class="image-tile" aria-hidden="true">
          <img
            [src]="item().image"
            alt=""
            loading="lazy"
            draggable="false"
            [style.width.%]="grid.columns * 100"
            [style.height.%]="grid.rows * 100"
            [style.left.%]="-(grid.index % grid.columns) * 100"
            [style.top.%]="-row(grid.index, grid.columns) * 100"
            (error)="failedImage.set(item().image)"
          />
        </span>
      } @else {
        <img
          [src]="item().image"
          alt=""
          loading="lazy"
          draggable="false"
          (error)="failedImage.set(item().image)"
        />
      }
    } @else if (item().color) {
      <span class="swatch" [style.background-color]="item().color"
        ><span class="shine"></span
      ></span>
    } @else {
      <span
        class="symbol"
        [class.glyph]="
          item().category === 'alphabet' ||
          item().category === 'numbers' ||
          item().category === 'shapes'
        "
        >{{ item().emoji }}</span
      >
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        min-height: 0;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .image-tile {
        display: block;
        position: relative;
        overflow: hidden;
        height: 100%;
        max-width: 100%;
        aspect-ratio: 1;
        border-radius: 18%;
        background: #fffefa;
      }
      .image-tile img {
        position: absolute;
        max-width: none;
        object-fit: fill;
      }
      .symbol {
        font-size: inherit;
        line-height: 1.15;
        filter: drop-shadow(0 5px 1px #30223c0b);
      }
      .glyph {
        font-family: ui-rounded, 'Arial Rounded MT Bold', sans-serif;
        font-weight: 800;
        color: var(--plum);
      }
      .swatch {
        display: block;
        width: 1em;
        height: 1em;
        border-radius: 35% 45% 38% 42%;
        border: 2px solid #31234316;
        position: relative;
        transform: rotate(-8deg);
      }
      .shine {
        position: absolute;
        width: 25%;
        height: 13%;
        border-radius: 100%;
        background: #ffffff70;
        top: 18%;
        left: 17%;
        transform: rotate(-25deg);
      }
    `,
  ],
})
export class ItemArtComponent {
  readonly item = input.required<LearningItem>();
  readonly failedImage = signal<string | undefined>(undefined);
  row(index: number, columns: number): number {
    return Math.floor(index / columns);
  }
}
