function persisted<T>(key: string, initial: T) {
  let value = initial;
  
  // Load from localStorage on browser
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        value = JSON.parse(stored);
      } catch {
        value = initial;
      }
    }
  }
  
  let subscribers: ((value: T) => void)[] = [];
  
  return {
    subscribe(fn: (value: T) => void) {
      subscribers.push(fn);
      fn(value);
      return () => subscribers = subscribers.filter(s => s !== fn);
    },
    set(newValue: T) {
      value = newValue;
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
      subscribers.forEach(fn => fn(value));
    },
    get: () => value
  };
}

export const currentWallpaper = persisted<string>('selected-wallpaper', '');