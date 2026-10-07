import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FamilyService } from '../storage/family.service';
@Injectable({ providedIn: 'root' })
export class ParentGateService {
  private expires = 0;
  private factors: [number, number] = [7, 8];
  challenge(): [number, number] { this.factors = [6 + Math.floor(Math.random() * 7), 6 + Math.floor(Math.random() * 7)]; return this.factors; }
  answer(value: number): boolean { if (value !== this.factors[0] * this.factors[1]) return false; this.expires = Date.now() + 5 * 60_000; return true; }
  get unlocked(): boolean { return Date.now() < this.expires; }
  lock(): void { this.expires = 0; }
}
export const parentGuard: CanActivateFn = () => inject(ParentGateService).unlocked || inject(Router).createUrlTree(['/parent/gate']);
export const profileGuard: CanActivateFn = () => !!inject(FamilyService).active() || inject(Router).createUrlTree(['/welcome']);
