import type { CropperEvent } from "../types";

type Handler = (payload?: unknown) => void;

/** Minimal typed event emitter — no dependencies, works anywhere. */
export class Emitter {
  private listeners = new Map<CropperEvent, Set<Handler>>();

  on(event: CropperEvent, handler: Handler): () => void {
    const set = this.listeners.get(event) ?? new Set<Handler>();
    set.add(handler);
    this.listeners.set(event, set);
    return () => this.off(event, handler);
  }

  off(event: CropperEvent, handler: Handler): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: CropperEvent, payload?: unknown): void {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }

  clear(): void {
    this.listeners.clear();
  }
}
