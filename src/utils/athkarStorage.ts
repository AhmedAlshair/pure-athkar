const STORAGE_KEY = 'pure-athkar';
export const AUTO_RESET_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

export type ThemeMode = 'light' | 'dark';
export type FontSizeLevel = -2 | -1 | 0 | 1 | 2;

interface StorageData {
  counts?: Record<string, number>;
  theme?: ThemeMode;
  fontSize?: FontSizeLevel;
  lastUpdated?: number;
}

const isBrowser = typeof window !== 'undefined';

function readStorage(): StorageData {
  if (!isBrowser) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StorageData;
  } catch (e) {
    console.error('Error reading pure-athkar from localStorage:', e);
    return {};
  }
}

function writeStorage(data: StorageData): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving pure-athkar to localStorage:', e);
  }
}

function updateStorage(updater: (data: StorageData) => StorageData): void {
  writeStorage(updater(readStorage()));
}

// Expiration Management
export function getLastUpdated(): number | null {
  const data = readStorage();
  return data.lastUpdated ?? null;
}

export function checkAndResetExpired(): boolean {
  if (!isBrowser) return false;
  const lastUpdated = getLastUpdated();
  if (!lastUpdated) return false;

  if (Date.now() - lastUpdated >= AUTO_RESET_DURATION_MS) {
    resetAllCounts();
    return true;
  }
  return false;
}

// Check expiration on tab visibility change or window focus
if (isBrowser) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkAndResetExpired();
    }
  });

  window.addEventListener('focus', () => {
    checkAndResetExpired();
  });
}

// Counts Management
export function getAllCounts(): Record<string, number> {
  if (checkAndResetExpired()) {
    return {};
  }
  return readStorage().counts ?? {};
}

export function getCount(id: string): number {
  if (!id) return 0;
  const counts = getAllCounts();
  return counts[id] ?? 0;
}

export function setCount(id: string, count: number): void {
  if (!id || !isBrowser) return;
  updateStorage((data) => {
    const counts = { ...(data.counts ?? {}) };
    if (count <= 0) {
      delete counts[id];
      if (Object.keys(counts).length === 0) {
        const { counts: _, lastUpdated: __, ...rest } = data;
        return rest;
      }
      return { ...data, counts };
    } else {
      counts[id] = count;
      return { ...data, counts, lastUpdated: Date.now() };
    }
  });

  window.dispatchEvent(
    new CustomEvent('athkar:count-change', {
      detail: { id, count: Math.max(0, count) },
    }),
  );
}

export function resetCount(id: string): void {
  setCount(id, 0);
}

export function resetAllCounts(): void {
  if (!isBrowser) return;
  updateStorage((data) => {
    const { counts, lastUpdated, ...rest } = data;
    return rest;
  });

  window.dispatchEvent(new CustomEvent('athkar:reset-all'));
}

export function onCountChange(
  callback: (detail: { id: string; count: number }) => void,
): () => void {
  if (!isBrowser) return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ id: string; count: number }>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      window.dispatchEvent(new CustomEvent('athkar:reset-all'));
    }
  };

  window.addEventListener('athkar:count-change', handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener('athkar:count-change', handler);
    window.removeEventListener('storage', storageHandler);
  };
}

export function onResetAll(callback: () => void): () => void {
  if (!isBrowser) return () => {};

  const handler = () => callback();
  window.addEventListener('athkar:reset-all', handler);

  return () => {
    window.removeEventListener('athkar:reset-all', handler);
  };
}

// Theme Management
export function getStoredTheme(): ThemeMode {
  const data = readStorage();
  if (data.theme === 'light' || data.theme === 'dark') return data.theme;
  if (
    isBrowser &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme: ThemeMode): void {
  if (!isBrowser) return;
  updateStorage((data) => ({ ...data, theme }));
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(
    new CustomEvent('athkar:theme-change', { detail: { theme } }),
  );
}

export function onThemeChange(
  callback: (theme: ThemeMode) => void,
): () => void {
  if (!isBrowser) return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
    if (customEvent.detail?.theme) {
      callback(customEvent.detail.theme);
    }
  };

  window.addEventListener('athkar:theme-change', handler);
  return () => {
    window.removeEventListener('athkar:theme-change', handler);
  };
}

// Font Size Management
export function getStoredFontSize(): FontSizeLevel {
  const data = readStorage();
  if (
    data.fontSize !== undefined &&
    [-2, -1, 0, 1, 2].includes(data.fontSize)
  ) {
    return data.fontSize;
  }
  return 0;
}

export function setFontSize(level: FontSizeLevel): void {
  if (!isBrowser) return;
  const clamped = Math.max(-2, Math.min(2, level)) as FontSizeLevel;
  updateStorage((data) => ({ ...data, fontSize: clamped }));
  document.documentElement.setAttribute('data-font-size', String(clamped));
  window.dispatchEvent(
    new CustomEvent('athkar:font-size-change', { detail: { level: clamped } }),
  );
}

export function onFontSizeChange(
  callback: (level: FontSizeLevel) => void,
): () => void {
  if (!isBrowser) return () => {};

  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ level: FontSizeLevel }>;
    if (customEvent.detail?.level !== undefined) {
      callback(customEvent.detail.level);
    }
  };

  window.addEventListener('athkar:font-size-change', handler);
  return () => {
    window.removeEventListener('athkar:font-size-change', handler);
  };
}
