import { inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Language } from '../models';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  readonly language = signal('en');
  readonly languages = signal<Language[]>([]);
  private readonly messages = signal<Record<string, string>>({});
  private readonly cache = new Map<string, Record<string, string>>();
  private request = 0;
  async init(language = 'en'): Promise<void> {
    const response = await fetch('/assets/i18n/languages.json');
    if (!response.ok) throw new Error('Language catalog unavailable');
    this.languages.set(await response.json() as Language[]);
    await this.use(language);
  }
  async use(id: string): Promise<void> {
    const language = this.languages().find(l => l.id === id) ?? this.languages()[0];
    if (!language) return;
    const request = ++this.request;
    let messages = this.cache.get(language.id);
    if (!messages) {
      const response = await fetch(`/assets/i18n/${language.id}.json`);
      if (!response.ok) throw new Error('Translations unavailable');
      messages = await response.json() as Record<string, string>;
      this.cache.set(language.id, messages);
    }
    if (request !== this.request) return;
    this.messages.set(messages);
    this.language.set(language.id);
    this.document.documentElement.lang = language.id;
    this.document.documentElement.dir = language.dir;
  }
  t(key: string, params: Record<string, string | number> = {}): string {
    let message = this.messages()[key] ?? key;
    for (const [name, value] of Object.entries(params)) message = message.replaceAll(`{${name}}`, String(value));
    return message;
  }
  get locale(): string { return this.languages().find(l => l.id === this.language())?.locale ?? 'en-IN'; }
}
