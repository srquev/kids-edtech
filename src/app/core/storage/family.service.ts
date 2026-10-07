import { computed, inject, Injectable } from '@angular/core';
import { ChildProfile, Settings } from '../models';
import { emptyProgress, LocalRepository } from './local.repository';

@Injectable({ providedIn: 'root' })
export class FamilyService {
  readonly repository = inject(LocalRepository);
  readonly profiles = computed(() => this.repository.state().profiles);
  readonly active = computed(() => this.profiles().find(p => p.id === this.repository.state().activeProfileId) ?? null);
  readonly settings = computed(() => this.repository.state().settings);
  readonly progress = computed(() => this.repository.state().progress[this.active()?.id ?? ''] ?? emptyProgress());
  async create(input: Omit<ChildProfile, 'id' | 'createdAt'>): Promise<void> {
    const profile = { ...input, nickname: input.nickname.trim().slice(0, 20), id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    if (!profile.nickname) return;
    await this.repository.update(s => ({ ...s, profiles: [...s.profiles, profile], activeProfileId: profile.id, progress: { ...s.progress, [profile.id]: emptyProgress() } }));
  }
  async select(id: string): Promise<void> { if (this.profiles().some(p => p.id === id)) await this.repository.update(s => ({ ...s, activeProfileId: id })); }
  async updateProfile(changes: Partial<Pick<ChildProfile, 'preferredLanguage' | 'difficulty' | 'nickname' | 'avatar' | 'ageGroup'>>): Promise<void> {
    const id = this.active()?.id;
    await this.repository.update(s => ({ ...s, profiles: s.profiles.map(p => p.id === id ? { ...p, ...changes } : p) }));
  }
  async updateSettings(changes: Partial<Settings>): Promise<void> { await this.repository.update(s => ({ ...s, settings: { ...s.settings, ...changes } })); }
  async reset(): Promise<void> { const id = this.active()?.id; if (id) await this.repository.update(s => ({ ...s, progress: { ...s.progress, [id]: emptyProgress() } })); }
  async remove(): Promise<void> {
    const id = this.active()?.id;
    if (!id) return;
    await this.repository.update(s => {
      const profiles = s.profiles.filter(p => p.id !== id);
      const progress = { ...s.progress }; delete progress[id];
      return { ...s, profiles, progress, activeProfileId: profiles[0]?.id ?? null };
    });
  }
}
