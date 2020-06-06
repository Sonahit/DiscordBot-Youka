export interface Queueable<T> {
  queue: T[];
  lastPop: T | undefined;

  push(item: T): number;
  pop(): T | undefined;
  exists(item: T): boolean;
  remove(item: T): boolean;
  empty(): boolean;
  lastItem(): T | undefined;
  size(): number;
}
