import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  parentGuard,
  ParentGateService,
  profileGuard,
} from './core/platform/parent-gate.service';
import { FamilyService } from './core/storage/family.service';
export const routes: Routes = [
  {
    path: 'welcome',
    canActivate: [
      () =>
        !inject(FamilyService).profiles().length ||
        inject(ParentGateService).unlocked ||
        inject(Router).createUrlTree(['/parent/gate']),
    ],
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then(
        (m) => m.OnboardingComponent,
      ),
  },
  {
    path: '',
    canActivate: [profileGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'learn',
        loadComponent: () =>
          import('./features/learn/learn.component').then(
            (m) => m.LearnComponent,
          ),
      },
      {
        path: 'learn/:category',
        loadComponent: () =>
          import('./features/learn/learn.component').then(
            (m) => m.LearnComponent,
          ),
      },
      {
        path: 'learn/:category/:item',
        loadComponent: () =>
          import('./features/learn/learn.component').then(
            (m) => m.LearnComponent,
          ),
      },
      {
        path: 'play',
        loadComponent: () =>
          import('./features/games/games.component').then(
            (m) => m.GamesComponent,
          ),
      },
      {
        path: 'play/:kind',
        loadComponent: () =>
          import('./features/games/games.component').then(
            (m) => m.GamesComponent,
          ),
      },
      {
        path: 'trace',
        loadComponent: () =>
          import('./features/tracing/tracing.component').then(
            (m) => m.TracingComponent,
          ),
      },
      {
        path: 'rewards',
        loadComponent: () =>
          import('./features/rewards/rewards.component').then(
            (m) => m.RewardsComponent,
          ),
      },
      {
        path: 'parent/gate',
        loadComponent: () =>
          import('./features/parent/gate.component').then(
            (m) => m.GateComponent,
          ),
      },
      ...['', 'progress', 'profiles', 'settings'].map((path) => ({
        path: 'parent' + (path ? '/' + path : ''),
        canActivate: [parentGuard],
        data: { tab: !path || path === 'progress' ? 'overview' : path },
        loadComponent: () =>
          import('./features/parent/parent.component').then(
            (m) => m.ParentComponent,
          ),
      })),
      { path: '**', redirectTo: '' },
    ],
  },
];
