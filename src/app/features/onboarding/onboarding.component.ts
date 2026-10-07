import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { FamilyService } from '../../core/storage/family.service';
import { ParentGateService } from '../../core/platform/parent-gate.service';
@Component({ imports: [ReactiveFormsModule], templateUrl: './onboarding.component.html', styleUrl: './onboarding.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class OnboardingComponent {
  readonly i = inject(I18nService); readonly family = inject(FamilyService); private readonly router = inject(Router); private readonly gate = inject(ParentGateService);
  readonly step = signal(this.family.active() ? 1 : 0); readonly busy = signal(false); readonly error = signal(false);
  readonly avatars = ['🐻','🐰','🐼','🦊','🐯','🐨']; readonly ages = ['2–3','4–5','5–6'] as const;
  readonly form = new FormGroup({ nickname: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(20), Validators.pattern(/\S/)] }), avatar: new FormControl('🐻', { nonNullable: true }), ageGroup: new FormControl<'2–3'|'4–5'|'5–6'>('2–3', { nonNullable: true }), language: new FormControl('en', { nonNullable: true }) });
  next(): void { if (this.step() === 1 && this.form.invalid) { this.form.markAllAsTouched(); return; } this.step.update(n => n + 1); }
  async chooseLanguage(id: string): Promise<void> { try { await this.i.use(id); this.form.controls.language.setValue(id); } catch { this.error.set(true); } }
  async finish(): Promise<void> {
    if (this.form.invalid || this.busy()) return;
    if (this.family.profiles().length && !this.gate.unlocked) { await this.router.navigateByUrl('/parent/gate'); return; }
    this.busy.set(true);
    const value = this.form.getRawValue();
    await this.family.create({ nickname: value.nickname, avatar: value.avatar, ageGroup: value.ageGroup, preferredLanguage: value.language, difficulty: value.ageGroup === '2–3' ? 'easy' : value.ageGroup === '4–5' ? 'normal' : 'advanced' });
    this.gate.lock(); await this.router.navigateByUrl('/');
  }
}
