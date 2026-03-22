/* FORGE — Helper utilities */

export const uid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export const todayStr = () => new Date().toLocaleDateString('en-CA');

export const fmtDate = (d) => {
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return d;
  }
};

export const fmtDur = (m) => {
  if (!m) return '0m';
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h${min > 0 ? ' ' + min + 'm' : ''}` : min + 'm';
};

export const pad2 = (n) => String(n).padStart(2, '0');

export const calcVol = (exs) =>
  exs.reduce(
    (t, ex) =>
      t +
      ex.sets.reduce(
        (s, set) =>
          s + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0),
        0
      ),
    0
  );

export const calcDone = (exs) =>
  exs.reduce((t, ex) => t + ex.sets.filter((s) => s.done).length, 0);
