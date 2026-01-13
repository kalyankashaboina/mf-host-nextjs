// app/utils/statusStore.ts
export type MfeStatus = 'idle' | 'loading' | 'online' | 'offline';
type Listener = (statuses: Record<string, MfeStatus>) => void;

class StatusStore {
  private statuses: Record<string, MfeStatus> = {};
  private listeners = new Set<Listener>();

  update(scope: string, status: MfeStatus) {
    this.statuses[scope] = status;
    this.listeners.forEach(l => l({ ...this.statuses }));
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener({ ...this.statuses });
    return () => { this.listeners.delete(listener); }; 
  }
}
export const mfeStatusStore = new StatusStore();