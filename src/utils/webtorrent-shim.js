// Minimal EventEmitter implementation to avoid dependency on 'events' module polyfills
class MinimalEventEmitter {
  constructor() {
    this._events = {};
  }

  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
    return this;
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.removeListener(event, wrapper);
      listener.apply(this, args);
    };
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const listeners = this._events[event];
    if (listeners) {
      listeners.forEach((listener) => listener.apply(this, args));
      return true;
    }
    return false;
  }

  removeListener(event, listener) {
    const listeners = this._events[event];
    if (listeners) {
      this._events[event] = listeners.filter((l) => l !== listener);
    }
    return this;
  }

  // DHT specific methods (no-op)
  destroy() {}
  listen() {}
  addNode() {}
  announce() {}
  lookup() {}
  start() {}
  stop() {}
  setInterval() {}
}

export default class extends MinimalEventEmitter {}
export class Client extends MinimalEventEmitter {}
export class Server extends MinimalEventEmitter {}
