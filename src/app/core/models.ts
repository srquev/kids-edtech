export interface Language {
  id: string;
  label: string;
  locale: string;
  dir: 'ltr' | 'rtl';
}
export interface Category {
  id: string;
  symbol: string;
  theme: string;
  titleKey: string;
  descriptionKey: string;
  illustration: string;
  pack: string;
}
export interface LearningItem {
  id: string;
  category: string;
  name: string;
  shortDescription: string;
  emoji: string;
  image?: string;
  color?: string;
  audio?: string;
  audioAvailable: boolean;
  difficulty: number;
  tags: string[];
  enabled: boolean;
}
export interface ContentPack {
  version: number;
  language: string;
  category: string;
  items: LearningItem[];
}
export type Difficulty = 'easy' | 'normal' | 'advanced';
export interface ChildProfile {
  id: string;
  nickname: string;
  avatar: string;
  ageGroup: '2–3' | '4–5' | '5–6';
  preferredLanguage: string;
  difficulty: Difficulty;
  createdAt: string;
}
export interface Settings {
  voice: boolean;
  effects: boolean;
  muted: boolean;
  haptics: boolean;
  dailyGoal: number;
}
export type Mastery = 'new' | 'learning' | 'practicing' | 'mastered';
export interface ConceptProgress {
  id: string;
  category: string;
  attempts: number;
  successes: number;
  firstTry: number;
  sessions: string[];
  lastPracticed: string;
}
export interface Activity {
  id: string;
  conceptId: string;
  category: string;
  kind: string;
  correct: boolean;
  attempts: number;
  stars: number;
  date: string;
  sessionId: string;
}
export interface Progress {
  concepts: Record<string, ConceptProgress>;
  activities: Activity[];
  stars: number;
  dailySeconds: Record<string, number>;
}
export interface LocalState {
  version: 1;
  profiles: ChildProfile[];
  activeProfileId: string | null;
  settings: Settings;
  progress: Record<string, Progress>;
}
export type GameKind = 'find-it' | 'match' | 'count' | 'memory';
export interface GameDefinition {
  id: GameKind;
  icon: string;
  theme: string;
}
export interface GameOption {
  id: string;
  label: string;
  item?: LearningItem;
}
export interface GameQuestion {
  id: string;
  kind: GameKind;
  target: LearningItem;
  options: GameOption[];
  answerId: string;
  count?: number;
}
export interface GameResult {
  correct: boolean;
  attempts: number;
  stars: number;
}
export interface GameProgress {
  current: number;
  total: number;
  stars: number;
}
export interface GameSession {
  id: string;
  kind: GameKind;
  questions: GameQuestion[];
}
