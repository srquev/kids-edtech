import { Injectable, signal } from '@angular/core';
import { Category, ContentPack, LearningItem } from '../models';

export function validatePack(value: unknown, category: string, language: string): ContentPack {
  if (!value || typeof value !== 'object') throw new Error('Invalid pack');
  const pack = value as Partial<ContentPack>;
  if (pack.version !== 1 || pack.category !== category || pack.language !== language || !Array.isArray(pack.items)) throw new Error('Unsupported content pack');
  const ids = new Set<string>();
  for (const item of pack.items) {
    if (!item || typeof item.id !== 'string' || !/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id) || item.category !== category || typeof item.name !== 'string' || !item.name || typeof item.emoji !== 'string' || typeof item.shortDescription !== 'string' || !Number.isInteger(item.difficulty) || typeof item.enabled !== 'boolean' || typeof item.audioAvailable !== 'boolean' || !Array.isArray(item.tags)) throw new Error('Invalid learning item');
    for (const path of [item.image, item.audio]) if (path && !/^\/assets\/[a-zA-Z0-9/_.-]+$/.test(path)) throw new Error('Content assets must be local');
    if (item.color && !/^#[a-fA-F0-9]{6}$/.test(item.color)) throw new Error('Invalid color');
    ids.add(item.id);
  }
  return pack as ContentPack;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly categories = signal<Category[]>([]);
  private readonly packs = new Map<string, Promise<LearningItem[]>>();
  async init(): Promise<void> {
    const response = await fetch('/assets/content/catalog.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json() as { version: number; categories: Category[] };
    if (catalog.version !== 1 || !Array.isArray(catalog.categories)) throw new Error('Invalid catalog');
    this.categories.set(catalog.categories);
  }
  load(category: string, language: string): Promise<LearningItem[]> {
    if (!this.categories().some(c => c.id === category) || !/^[a-z]{2,3}(-[A-Z]{2})?$/.test(language)) return Promise.reject(new Error('Unknown category or language'));
    const key = `${language}/${category}`;
    let request = this.packs.get(key);
    if (!request) {
      request = fetch(`/assets/content/${key}.json`).then(async response => {
        if (!response.ok) throw new Error('Content unavailable');
        return validatePack(await response.json(), category, language).items.filter(item => item.enabled);
      }).catch(error => { this.packs.delete(key); throw error; });
      this.packs.set(key, request);
    }
    return request;
  }
}
