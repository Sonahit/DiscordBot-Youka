import { Queueable } from "../contracts/Queueable";
import { Music } from "src/types/Music";

export class BaseQueue<T> implements Queueable<T>, Iterable<T> {
  queue: T[] = [];
  lastPop: T | undefined = undefined;

  exists(item: T): boolean {
    return Boolean(this.queue.indexOf(item));
  }

  toArray(): T[] {
    return this.queue;
  }

  clean(): void {
    this.queue = [];
  }

  getIterator(): IteratorYouka<T, any, undefined> {
    return this[Symbol.iterator]();
  }

  [Symbol.iterator](): IteratorYouka<T, any, undefined> {
    let current = 0;
    const self = this;
    return {
      next() {
        if (current < self.size()) {
          return {
            done: false,
            value: self.queue[current++],
          };
        }
        return {
          done: true,
          value: null,
        };
      },
      hasNext() {
        return !!self.queue[current + 1];
      },
    };
  }

  remove(item: T): boolean {
    this.queue = this.queue.filter((el) => item !== el);
    return true;
  }

  push(item: T): number {
    return this.queue.push(item);
  }

  pop(): T | undefined {
    this.lastPop = this.queue.pop();
    return this.lastPop;
  }

  empty(): boolean {
    return this.queue.length <= 0;
  }

  lastItem(): T | undefined {
    return this.queue[this.queue.length - 1] || undefined;
  }

  size(): number {
    return this.queue.length;
  }
}
