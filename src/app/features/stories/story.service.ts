import { Injectable } from '@angular/core';
export type StoryLanguage = 'en' | 'hi';
export interface StoryCopy {
  title: string;
  theme: string;
  question: string;
  questionAudio: string;
  options: { id: string; text: string }[];
}
export interface StoryPage {
  art: number;
  en: { text: string; audio: string };
  hi: { text: string; audio: string };
}
export interface Story {
  id: string;
  art: number;
  answerId: string;
  en: StoryCopy;
  hi: StoryCopy;
  pages: StoryPage[];
}
interface StoryContent {
  stories: Story[];
  messages: Record<StoryLanguage, Record<string, string>>;
}
export function validateStories(value: unknown): Story[] {
  const pack = value as { version?: number; stories?: Story[] } | null;
  if (pack?.version !== 1 || !Array.isArray(pack.stories))
    throw new Error('Invalid stories');
  const ids = new Set<string>();
  const art = (index: number) =>
    Number.isInteger(index) && index >= 0 && index < 16;
  const audio = (path: string, language: string) =>
    typeof path === 'string' &&
    new RegExp(`^/assets/audio/${language}/stories/[a-z0-9-]+\\.m4a$`).test(
      path,
    );
  for (const story of pack.stories) {
    if (
      !story ||
      !/^[a-z0-9-]+$/.test(story.id) ||
      ids.has(story.id) ||
      !art(story.art) ||
      !Array.isArray(story.pages) ||
      !story.pages.length
    )
      throw new Error('Invalid story');
    ids.add(story.id);
    for (const language of ['en', 'hi'] as const) {
      const copy = story[language];
      if (
        !copy?.title ||
        !copy.theme ||
        !copy.question ||
        !audio(copy.questionAudio, language) ||
        !Array.isArray(copy.options) ||
        copy.options.length < 2 ||
        !copy.options.some((option) => option.id === story.answerId) ||
        new Set(copy.options.map((option) => option.id)).size !==
          copy.options.length ||
        copy.options.some((option) => !option.id || !option.text)
      )
        throw new Error('Invalid story translation');
      for (const page of story.pages) {
        if (
          !page ||
          !art(page.art) ||
          !page[language]?.text ||
          !audio(page[language].audio, language)
        )
          throw new Error('Invalid story page');
      }
    }
  }
  return pack.stories;
}
@Injectable({ providedIn: 'root' })
export class StoryService {
  private request?: Promise<StoryContent>;
  load(): Promise<StoryContent> {
    if (!this.request) {
      const json = async (path: string) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error('Stories unavailable');
        return response.json();
      };
      this.request = Promise.all([
        json('/assets/content/stories.json'),
        json('/assets/i18n/en.json'),
        json('/assets/i18n/hi.json'),
      ])
        .then(([pack, en, hi]) => ({
          stories: validateStories(pack),
          messages: { en, hi },
        }))
        .catch((error) => {
          this.request = undefined;
          throw error;
        });
    }
    return this.request;
  }
}
