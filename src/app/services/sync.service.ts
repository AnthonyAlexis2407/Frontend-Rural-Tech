import { Injectable, signal, inject, effect } from '@angular/core';
import { IndexedDbService, SyncAction } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly db = inject(IndexedDbService);

  // Network connectivity signal
  readonly isOnline = signal<boolean>(navigator.onLine);

  // Sync state signals
  readonly isSyncing = signal<boolean>(false);
  readonly syncQueue = signal<SyncAction[]>([]);
  readonly lastSyncTime = signal<string>(localStorage.getItem('rt_last_sync') || 'Nunca');
  
  // Storage signals (as shown in mockup: 1.2GB / 5.0GB)
  readonly usedSpace = signal<number>(1.2); // in GB
  readonly maxSpace = signal<number>(5.0);  // in GB

  constructor() {
    this.initNetworkListeners();
    this.loadQueue();

    // Automatically sync when status transitions to online
    effect(() => {
      if (this.isOnline()) {
        this.syncNow();
      }
    });
  }

  private initNetworkListeners(): void {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }

  /**
   * Reads pending sync actions from IndexedDB
   */
  async loadQueue(): Promise<void> {
    const queue = await this.db.getSyncQueue();
    this.syncQueue.set(queue);
  }

  /**
   * Processes the sync queue immediately if online
   */
  async syncNow(): Promise<void> {
    if (!this.isOnline() || this.isSyncing() || this.syncQueue().length === 0) {
      return;
    }

    this.isSyncing.set(true);
    const queue = this.syncQueue();

    try {
      // Simulate sending each action to the server with a slight delay
      for (const item of queue) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulating HTTP roundtrip
        if (item.id !== undefined) {
          await this.db.deleteSyncAction(item.id);
        }
      }
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const lastSyncStr = `Hoy a las ${timeStr}`;
      localStorage.setItem('rt_last_sync', lastSyncStr);
      this.lastSyncTime.set(lastSyncStr);
      
    } catch (error) {
      console.error('Error durante la sincronización:', error);
    } finally {
      this.isSyncing.set(false);
      await this.loadQueue();
    }
  }

  /**
   * Simulated method to free up storage space (as shown in neobrutalist need space popup)
   */
  async clearCache(): Promise<void> {
    // Keep it simple: simulate reducing storage from 1.2GB to 0.4GB
    this.isSyncing.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.db.clear('courses');
    // Clear list of downloaded files
    await this.db.clear('downloads');
    this.usedSpace.set(0.4);
    this.isSyncing.set(false);
  }
}
