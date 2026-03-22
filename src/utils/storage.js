/* FORGE — Storage (window.storage persistent across sessions) */

export const WK_KEY = 'forge_workouts_v2';

export const store = {
  load: async (k) => {
    try {
      const r = await window.storage.get(k);
      return r ? JSON.parse(r.value) : [];
    } catch {
      return [];
    }
  },
  save: async (k, v) => {
    try {
      await window.storage.set(k, JSON.stringify(v));
    } catch {}
  },
};
