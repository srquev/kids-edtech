import { computed, inject, Injectable } from '@angular/core';
import { ConceptProgress, LearningItem, Mastery } from '../models';
import { FamilyService } from '../storage/family.service';
import { emptyProgress } from '../storage/local.repository';

export const MASTERY_RULES = {
  successes: 3,
  sessions: 3,
  accuracy: 0.7,
  revisionDays: 7,
  practiceRatio: 0.7,
};
export function mastery(concept?: ConceptProgress): Mastery {
  if (!concept) return 'new';
  if (
    concept.successes >= MASTERY_RULES.successes &&
    concept.sessions.length >= MASTERY_RULES.sessions &&
    concept.successes / Math.max(concept.attempts, 1) >= MASTERY_RULES.accuracy
  )
    return 'mastered';
  return concept.successes >= 2 ? 'practicing' : 'learning';
}
export function dayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function practiceItems(
  items: LearningItem[],
  concepts: Record<string, ConceptProgress>,
  count: number,
  now = Date.now(),
): LearningItem[] {
  const known = items
    .filter((item) => concepts[`${item.category}:${item.id}`])
    .sort((a, b) => {
      const priority = (item: LearningItem) => {
        const c = concepts[`${item.category}:${item.id}`];
        return (
          c.successes / Math.max(c.attempts, 1) -
          Math.min(
            1,
            (now - Date.parse(c.lastPracticed)) /
              (MASTERY_RULES.revisionDays * 86400000),
          )
        );
      };
      return priority(a) - priority(b);
    });
  const fresh = items.filter(
    (item) => !concepts[`${item.category}:${item.id}`],
  );
  const selected = [
    ...known.slice(0, Math.round(count * MASTERY_RULES.practiceRatio)),
    ...fresh.slice(0, Math.ceil(count * (1 - MASTERY_RULES.practiceRatio))),
  ];
  return [...selected, ...items.filter((i) => !selected.includes(i))].slice(
    0,
    count,
  );
}
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly family = inject(FamilyService);
  readonly data = this.family.progress;
  readonly concepts = computed(() => Object.values(this.data().concepts));
  readonly mastered = computed(() =>
    this.concepts().filter((c) => mastery(c) === 'mastered'),
  );
  readonly todayMinutes = computed(() =>
    Math.floor((this.data().dailySeconds[dayKey()] ?? 0) / 60),
  );
  readonly goalReached = computed(
    () => this.todayMinutes() >= this.family.settings().dailyGoal,
  );
  readonly accuracy = computed(() => {
    const total = this.concepts().reduce((n, c) => n + c.successes, 0);
    return total
      ? Math.round(
          (this.concepts().reduce((n, c) => n + c.firstTry, 0) / total) * 100,
        )
      : 0;
  });
  record(
    item: LearningItem,
    kind: string,
    attempts: number,
    sessionId: string,
    stars = 1,
  ): void {
    const profileId = this.family.active()?.id;
    if (!profileId) return;
    const date = new Date().toISOString();
    void this.family.repository.update((state) => {
      const progress = state.progress[profileId] ?? emptyProgress();
      const key = `${item.category}:${item.id}`;
      const prior = progress.concepts[key];
      // Lessons build familiarity; only independently answered activities establish mastery.
      const assessed = kind !== 'lesson';
      const concept: ConceptProgress = {
        id: item.id,
        category: item.category,
        attempts: (prior?.attempts ?? 0) + (assessed ? attempts : 0),
        successes: (prior?.successes ?? 0) + (assessed ? 1 : 0),
        firstTry: (prior?.firstTry ?? 0) + (assessed && attempts === 1 ? 1 : 0),
        sessions: assessed
          ? [...new Set([...(prior?.sessions ?? []), sessionId])].slice(-30)
          : (prior?.sessions ?? []),
        lastPracticed: date,
      };
      const activity = {
        id: crypto.randomUUID(),
        conceptId: item.id,
        category: item.category,
        kind,
        correct: true,
        attempts,
        stars,
        date,
        sessionId,
      };
      return {
        ...state,
        progress: {
          ...state.progress,
          [profileId]: {
            ...progress,
            concepts: { ...progress.concepts, [key]: concept },
            stars: progress.stars + stars,
            activities: [activity, ...progress.activities].slice(0, 500),
          },
        },
      };
    });
  }
  addSeconds(seconds: number): void {
    const id = this.family.active()?.id;
    if (!id || seconds <= 0) return;
    void this.family.repository.update((s) => {
      const p = s.progress[id] ?? emptyProgress();
      const key = dayKey();
      return {
        ...s,
        progress: {
          ...s.progress,
          [id]: {
            ...p,
            dailySeconds: {
              ...p.dailySeconds,
              [key]: (p.dailySeconds[key] ?? 0) + seconds,
            },
          },
        },
      };
    });
  }
}
