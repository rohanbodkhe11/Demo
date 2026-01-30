// Lightweight offline queue stored in localStorage for failed API writes.
// Keeps a per-key FIFO queue and attempts to sync when online.

type QueueItem = any;

const readQueue = (key: string): QueueItem[] => {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(key) || '[]';
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('[offline-queue] read error', err);
    return [];
  }
};

const writeQueue = (key: string, items: QueueItem[]) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.error('[offline-queue] write error', err);
  }
};

export const enqueuePending = (key: string, payload: QueueItem) => {
  try {
    if (typeof window === 'undefined') return;
    const q = readQueue(key);
    q.push({ payload, ts: Date.now() });
    writeQueue(key, q);
    console.log(`[offline-queue] enqueued ${key} (items=${q.length})`);
  } catch (err) {
    console.error('[offline-queue] enqueue error', err);
  }
};

// Try to flush items for a given queue to a server endpoint.
export const processQueue = async (key: string, endpoint: string, optionsFactory?: (payload: any) => RequestInit) => {
  try {
    if (typeof window === 'undefined') return;
    if (!navigator.onLine) return;
    const q = readQueue(key);
    if (!q.length) return;

    const remaining: typeof q = [];
    for (const item of q) {
      try {
        const opts = optionsFactory ? optionsFactory(item.payload) : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item.payload) };
        const res = await fetch(endpoint, opts);
        if (!res.ok) {
          // keep item for later retry
          remaining.push(item);
          console.warn(`[offline-queue] ${key} item failed to send, will retry later`);
        } else {
          console.log(`[offline-queue] ${key} item synced`);
        }
      } catch (err) {
        console.error('[offline-queue] network error while processing queue', err);
        remaining.push(item);
      }
    }

    writeQueue(key, remaining);
  } catch (err) {
    console.error('[offline-queue] processQueue error', err);
  }
};

export const processAllQueues = async () => {
  if (typeof window === 'undefined') return;
  if (!navigator.onLine) return;
  // Try users first, then attendance, then students
  await processQueue('pendingUsers', '/api/users');
  await processQueue('pendingAttendance', '/api/attendance', (payload) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }));
  await processQueue('pendingStudents', '/api/students');
};

export default {
  enqueuePending,
  processQueue,
  processAllQueues,
};
