import {
  Difficulty,
  GameDefinition,
  GameKind,
  GameQuestion,
  GameResult,
  GameSession,
  LearningItem,
} from '../models';
export const GAMES: GameDefinition[] = [
  { id: 'find-it', icon: '⌕', theme: 'lavender' },
  { id: 'match', icon: '↔', theme: 'mint' },
  { id: 'count', icon: '123', theme: 'peach' },
  { id: 'memory', icon: '✿', theme: 'pink' },
];
export function shuffle<T>(values: readonly T[], random = Math.random): T[] {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export function choicesFor(difficulty: Difficulty): number {
  return { easy: 2, normal: 3, advanced: 4 }[difficulty];
}
export function question(
  kind: GameKind,
  target: LearningItem,
  pool: LearningItem[],
  difficulty: Difficulty,
  index: number,
): GameQuestion {
  const choices = choicesFor(difficulty);
  if (kind === 'count') {
    const max = difficulty === 'advanced' ? 10 : 5;
    const count = 1 + Math.floor(Math.random() * max);
    const distractors = shuffle(
      Array.from({ length: max }, (_, i) => i + 1).filter((n) => n !== count),
    ).slice(0, choices - 1);
    return {
      id: String(index),
      kind,
      target:
        pool.find(
          (item) => item.category === 'numbers' && item.id === String(count),
        ) ?? target,
      count,
      answerId: String(count),
      options: shuffle([count, ...distractors]).map((n) => ({
        id: String(n),
        label: String(n),
      })),
    };
  }
  const distractors = shuffle(
    pool.filter(
      (item) => item.id !== target.id && item.category === target.category,
    ),
  ).slice(0, choices - 1);
  return {
    id: String(index),
    kind,
    target,
    answerId: target.id,
    options: shuffle([target, ...distractors]).map((item) => ({
      id: item.id,
      label: item.name,
      item,
    })),
  };
}
export function createSession(
  kind: GameKind,
  pool: LearningItem[],
  difficulty: Difficulty,
  targets?: LearningItem[],
): GameSession {
  if (pool.length < 2)
    throw new Error('At least two learning items are required');
  const selected = targets ?? shuffle(pool).slice(0, 5);
  return {
    id: crypto.randomUUID(),
    kind,
    questions: selected.map((item, i) =>
      question(kind, item, pool, difficulty, i),
    ),
  };
}
export function evaluate(
  question: GameQuestion,
  answer: string,
  attempts: number,
): GameResult {
  const correct = question.answerId === answer;
  return { correct, attempts: attempts + 1, stars: correct ? 1 : 0 };
}
export interface MemoryCard {
  id: string;
  item: LearningItem;
}
export function createMemory(
  pool: LearningItem[],
  difficulty: Difficulty,
): MemoryCard[] {
  const pairCount = { easy: 2, normal: 3, advanced: 6 }[difficulty];
  return shuffle(
    shuffle(pool)
      .slice(0, pairCount)
      .flatMap((item) => [
        { id: `${item.id}-a`, item },
        { id: `${item.id}-b`, item },
      ]),
  );
}
