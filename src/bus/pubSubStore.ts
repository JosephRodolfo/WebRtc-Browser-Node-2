import { defineStore } from "pinia";

export interface EventListener<T> {
    (data: T): void;
  }
  

export const usePubSubStore = defineStore('pubSub', {
  state: () => ({
    eventQueue: [] as string[],
    lastEventData: null as any,
    subscribers: new Map<string, Set<EventListener<any>>>(),
  }),
  getters: {
    getEventQueue: (state) => state.eventQueue,
    getLastEventData: (state) => state.lastEventData,
  },
  actions: {
    enqueueEvent(event: string): void {
      this.eventQueue.push(event);
    },
    dequeueEvent(): string | undefined {
      return this.eventQueue.shift();
    },
    clearEventQueue(): void {
      this.eventQueue = [];
    },
    setLastEventData(data: any): void {
      this.lastEventData = data;
    },
    subscribe(event: string, listener: EventListener<any>): () => void {
      if (!this.subscribers.has(event)) {
        this.subscribers.set(event, new Set());
      }
      const eventListeners = this.subscribers.get(event)!;
      eventListeners.add(listener);

      const unsubscribe = () => {
        eventListeners.delete(listener);
        if (eventListeners.size === 0) {
          this.subscribers.delete(event);
        }
      };

      return unsubscribe;
    },
    unsubscribe(event: string, listener: EventListener<any>): void {
      if (this.subscribers.has(event)) {
        const eventListeners = this.subscribers.get(event)!;
        eventListeners.delete(listener);
        if (eventListeners.size === 0) {
          this.subscribers.delete(event);
        }
      }
    },
    publish(event: string, data?: any): void {
      this.enqueueEvent(event);
      this.setLastEventData(data);

      if (this.subscribers.has(event)) {
        const eventListeners = this.subscribers.get(event)!;
        eventListeners.forEach((listener) => {
          listener(data);
        });
      }
    },
  },
});

