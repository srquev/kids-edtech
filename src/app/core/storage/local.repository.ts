import { Injectable, signal } from '@angular/core';
import { LocalState, Progress } from '../models';

export const emptyProgress = (): Progress => ({
  concepts: {},
  activities: [],
  stars: 0,
  dailySeconds: {},
});
export const initialState = (): LocalState => ({
  version: 1,
  profiles: [],
  activeProfileId: null,
  settings: {
    voice: true,
    effects: true,
    muted: false,
    haptics: false,
    dailyGoal: 5,
  },
  progress: {},
});
export abstract class StorageAdapter {
  abstract read(): Promise<LocalState | undefined>;
  abstract write(state: LocalState): Promise<void>;
}

@Injectable({ providedIn: 'root' })
export class IndexedDbAdapter extends StorageAdapter {
  private database?: Promise<IDBDatabase>;
  private open(): Promise<IDBDatabase> {
    this.database ??= new Promise((resolve, reject) => {
      const request = indexedDB.open('tinysteps', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Storage blocked'));
    });
    return this.database;
  }
  async read(): Promise<LocalState | undefined> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const request = db
        .transaction('state')
        .objectStore('state')
        .get('family');
      request.onsuccess = () =>
        resolve(request.result as LocalState | undefined);
      request.onerror = () => reject(request.error);
    });
  }
  async write(state: LocalState): Promise<void> {
    const db = await this.open();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('state', 'readwrite');
      transaction.objectStore('state').put(state, 'family');
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }
}

/** One transaction snapshots a family, so profile switches cannot detach progress from its owner.
 * Consumers only see this boundary; cloud/native storage can implement StorageAdapter later. */
@Injectable({ providedIn: 'root' })
export class LocalRepository {
  readonly state = signal<LocalState>(initialState());
  readonly unavailable = signal(false);
  private compatible = true;
  private writes: Promise<void> = Promise.resolve();
  constructor(private readonly adapter: StorageAdapter) {}
  async load(): Promise<void> {
    try {
      const data = await this.adapter.read();
      if (
        data?.version === 1 &&
        Array.isArray(data.profiles) &&
        data.progress &&
        data.settings
      )
        this.state.set(data);
      else if (data) {
        this.compatible = false;
        this.unavailable.set(true);
      }
    } catch {
      this.unavailable.set(true);
    }
  }
  update(change: (state: LocalState) => LocalState): Promise<void> {
    if (!this.compatible) return Promise.resolve();
    const next = change(this.state());
    this.state.set(next);
    // Serialize snapshots; a slow older write must never overwrite a newer answer.
    this.writes = this.writes
      .then(() => this.adapter.write(next))
      .then(() => this.unavailable.set(false))
      .catch(() => this.unavailable.set(true));
    return this.writes;
  }
}
