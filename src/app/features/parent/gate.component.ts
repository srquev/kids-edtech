import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { ParentGateService } from '../../core/platform/parent-gate.service';
@Component({ imports: [ReactiveFormsModule, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `
<a class="back-link" routerLink="/">← {{i.t('parent.gateBack')}}</a><section class="gate panel"><span class="gate-icon" aria-hidden="true">♧</span><h1>{{i.t('parent.gateTitle')}}</h1><p>{{i.t('parent.gateText')}}</p><form (submit)="submit($event)"><label class="field"><span class="challenge">{{i.t('parent.challenge',{a:factors[0],b:factors[1]})}}</span><input type="number" inputmode="numeric" autocomplete="off" [formControl]="answer" [attr.aria-label]="i.t('parent.answer')" [attr.aria-invalid]="incorrect()" aria-describedby="gate-error"/></label><div id="gate-error" aria-live="polite">@if(incorrect()){<p class="form-error">{{i.t('parent.incorrect')}}</p>}</div><button class="button wide" type="submit">{{i.t('parent.enter')}} →</button></form></section>
`, styles: [`.gate{max-width:450px;margin:30px auto;padding:35px;text-align:center}.gate-icon{font-size:3.4rem;color:var(--plum);display:block;margin-bottom:20px}.gate h1{font-size:1.85rem}.gate>p{font-size:.9rem;color:var(--muted);margin:15px 0 28px}.gate .challenge{font-size:1.6rem;margin-bottom:10px}.gate input{text-align:center;font-size:1.4rem}.gate .form-error{margin-bottom:18px}`] })
export class GateComponent {
  readonly i = inject(I18nService); private readonly gate = inject(ParentGateService); private readonly router = inject(Router);
  readonly factors = this.gate.challenge(); readonly answer = new FormControl<number|null>(null, Validators.required); readonly incorrect = signal(false);
  submit(event: Event): void { event.preventDefault(); if (this.answer.valid && this.gate.answer(this.answer.value ?? -1)) void this.router.navigateByUrl('/parent'); else this.incorrect.set(true); }
}
