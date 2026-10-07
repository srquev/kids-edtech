import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LearningItem } from '../core/models';
@Component({
  selector: 'app-item-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item().image) {
      <img [src]="item().image" alt="" loading="lazy" draggable="false" />
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
        min-height: 1em;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
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
}
