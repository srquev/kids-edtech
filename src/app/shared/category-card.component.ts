import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../core/models';
import { I18nService } from '../core/i18n/i18n.service';
@Component({ selector: 'app-category-card', imports: [RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `
<a class="category-card" [class]="'category-card ' + category().theme" [routerLink]="['/learn', category().id]">
  <span class="card-art"><img [src]="category().illustration" alt="" loading="lazy" width="190" height="130" /></span>
  <span class="category-copy"><strong>{{i.t(category().titleKey)}}</strong><span>{{i.t(category().descriptionKey)}}</span></span>
  <span class="card-arrow" aria-hidden="true">↗</span>
</a>`, styles: [`.category-card{position:relative;display:flex;flex-direction:column;min-height:235px;border-radius:24px;padding:18px 22px 22px;transition:transform .2s,box-shadow .2s;overflow:hidden;border:1px solid #44345208}.category-card:hover{transform:translateY(-4px);box-shadow:0 12px 26px #4030460a}.card-art{height:140px;display:grid;place-items:center}.card-art img{width:190px;max-width:100%;height:130px;object-fit:contain;transition:transform .3s}.category-card:hover img{transform:rotate(-3deg) scale(1.04)}.category-copy{display:grid;gap:5px;padding-inline-end:20px}.category-copy strong{font-size:1.3rem;font-weight:800;letter-spacing:-.5px}.category-copy>span{font-size:.76rem;color:var(--muted);line-height:1.45}.card-arrow{position:absolute;bottom:24px;inset-inline-end:18px;background:#ffffffa8;border-radius:50%;height:30px;width:30px;display:grid;place-items:center;font-size:1.25rem}@media(max-width:540px){.category-card{min-height:204px;padding:12px 16px 18px}.card-art{height:122px}.card-art img{height:110px}.category-copy strong{font-size:1.15rem}.category-copy>span{font-size:.72rem}.card-arrow{display:none}}`] })
export class CategoryCardComponent { readonly category = input.required<Category>(); readonly i = inject(I18nService); }
