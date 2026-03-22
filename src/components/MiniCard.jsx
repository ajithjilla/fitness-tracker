import { WORKOUT_TYPES } from '../data/constants.js';
import { fmtDate, fmtDur } from '../utils/helpers.js';

export default function MiniCard({ w }) {
  const wt = WORKOUT_TYPES.find((t) => t.id === w.type) || WORKOUT_TYPES[0];
  return (
    <div className="hist-row">
      <div className="row">
        <span style={{ fontSize: 22 }}>{wt.icon}</span>
        <div className="flex1">
          <div style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 1 }}>
            {fmtDate(w.date)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {w.duration && (
            <div
              style={{
                fontFamily: 'DM Mono',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--lime)',
              }}
            >
              {fmtDur(w.duration)}
            </div>
          )}
          {w.type === 'strength' && w.exercises?.length > 0 && (
            <div
              style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2 }}
            >
              {w.exercises.length} exercises
            </div>
          )}
        </div>
      </div>
      {w.type === 'strength' && w.exercises?.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 5,
            flexWrap: 'wrap',
            marginTop: 8,
          }}
        >
          {w.exercises.slice(0, 4).map((ex) => (
            <span key={ex.id} className="eq-badge">
              {ex.name}
            </span>
          ))}
          {w.exercises.length > 4 && (
            <span className="eq-badge">+{w.exercises.length - 4}</span>
          )}
        </div>
      )}
      {(w.distance || w.calories) && (
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          {w.distance && (
            <span style={{ fontSize: 12, color: 'var(--dim)' }}>
              📏 {w.distance}
              {w.unit}
            </span>
          )}
          {w.calories && (
            <span style={{ fontSize: 12, color: 'var(--dim)' }}>
              🔥 {w.calories} kcal
            </span>
          )}
        </div>
      )}
    </div>
  );
}
