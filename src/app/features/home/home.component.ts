import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { ContentService } from '../../core/content/content.service';
import { FamilyService } from '../../core/storage/family.service';
import { ProgressService } from '../../core/progress/progress.service';
import { CategoryCardComponent } from '../../shared/category-card.component';
@Component({ imports: [RouterLink, CategoryCardComponent], templateUrl: './home.component.html', styleUrl: './home.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class HomeComponent {
  readonly i = inject(I18nService); readonly content = inject(ContentService); readonly family = inject(FamilyService); readonly progress = inject(ProgressService);
  get goalPercent(): number { return Math.min(100, this.progress.todayMinutes() / this.family.settings().dailyGoal * 100); }
}
