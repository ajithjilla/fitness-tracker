import { useState } from 'react';
import { WORKOUT_TYPES } from '../data/constants';
import { MUSCLE_CLR } from '../data/constants';
import { fmtDate, fmtDur } from '../utils/helpers';

export default function History({ workouts, setWorkouts }) {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('all');
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = filter === 'all' ? workouts : workouts.filter((w) => w.type === filter);

  return (
    <div>
      <div className="topbar">
        <div className="bebas" style={{ fontSize: 28, letterSpacing: 2 }}>
          History
        </div>
        <div style={{ fontSize: 12, color: 'var(--dim)' }}>{workouts.length} workouts</div>
      </div>
      <div className="page">
        <div className="scroll-x mb14">
          {[
            ['all', 'All 🗂'],
            ...WORKOUT_TYPES.map((t) => [t.id, `${t.icon} ${t.label}`]),
          ].map(([id, lbl]) => (
            <button
              key={id}
              className="pill"
              onClick={() => setFilter(id)}
              style={{
                background: filter === id ? 'var(--lime)' : 'transparent',
                borderColor: filter === id ? 'var(--lime)' : 'var(--bd2)',
                color: filter === id ? '#000' : 'var(--dim)',
              }}
            >
              {lbl}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <span className="empty-ico">📋</span>
            <div style={{ fontWeight: 700 }}>No workouts here</div>
          </div>
        ) : (
          filtered.map((w) => {
            const wt = WORKOUT_TYPES.find((t) => t.id === w.type) || WORKOUT_TYPES[0];
            const isOpen = open === w.id;
            return (
              <div key={w.id} className={`hist-row ${isOpen ? 'open' : ''}`}>
                <div
                  className="row"
                  onClick={() => setOpen((o) => (o === w.id ? null : w.id))}
                  style={{ cursor: 'pointer' }}
                >
                  <span style={{ fontSize: 22 }}>{wt.icon}</span>
                  <div className="flex1">
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{w.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 1 }}>
                      {fmtDate(w.date)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {w.duration && (
                      <div
                        className="mono"
                        style={{ fontSize: 14, fontWeight: 500, color: 'var(--lime)' }}
                      >
                        {fmtDur(w.duration)}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 9,
                        color: 'var(--dim)',
                        marginTop: 2,
                        letterSpacing: 0.5,
                      }}
                    >
                      {isOpen ? '▲ LESS' : '▼ MORE'}
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div
                    className="si"
                    style={{
                      borderTop: '1px solid var(--bd)',
                      paddingTop: 12,
                      marginTop: 10,
                    }}
                  >
                    {w.type === 'strength' && w.exercises?.length > 0 && (
                      <>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: 'var(--dim)' }}>
                            Volume:{' '}
                            <b style={{ color: 'var(--w)' }}>
                              {(w.volume || 0).toLocaleString()} kg
                            </b>
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--dim)' }}>
                            Sets: <b style={{ color: 'var(--w)' }}>{w.totalSets || 0} done</b>
                          </span>
                        </div>
                        {w.exercises.map((ex) => (
                          <div key={ex.id} style={{ marginBottom: 10 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 5,
                              }}
                            >
                              <div
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  background: MUSCLE_CLR[ex.muscle] || 'var(--dim)',
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ fontWeight: 700, fontSize: 13 }}>{ex.name}</span>
                              <span className="eq-badge">{ex.eq}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {ex.sets.map((s, si) => (
                                <div
                                  key={s.id}
                                  style={{
                                    fontSize: 11,
                                    padding: '3px 9px',
                                    borderRadius: 6,
                                    background: s.done ? 'rgba(186,255,41,.12)' : 'var(--c3)',
                                    color: s.done ? 'var(--lime)' : 'var(--dim)',
                                    border: `1px solid ${
                                      s.done ? 'rgba(186,255,41,.3)' : 'var(--bd2)'
                                    }`,
                                  }}
                                >
                                  {si + 1}: {s.weight || '—'}kg × {s.reps || '—'}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {w.type !== 'strength' && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                        {w.activityName && (
                          <span style={{ fontSize: 13 }}>
                            {w.activityIcon} {w.activityName}
                          </span>
                        )}
                        {w.distance && (
                          <span style={{ fontSize: 13, color: 'var(--dim)' }}>
                            📏 {w.distance} {w.unit}
                          </span>
                        )}
                        {w.calories && (
                          <span style={{ fontSize: 13, color: 'var(--dim)' }}>
                            🔥 {w.calories} kcal
                          </span>
                        )}
                        {w.heartRate && (
                          <span style={{ fontSize: 13, color: 'var(--dim)' }}>
                            ❤️ {w.heartRate} bpm avg
                          </span>
                        )}
                        {w.score && (
                          <span style={{ fontSize: 13, color: 'var(--dim)' }}>
                            🏆 Score: {w.score}
                          </span>
                        )}
                      </div>
                    )}

                    {w.notes && (
                      <div
                        style={{
                          fontSize: 12,
                          color: 'var(--dim)',
                          fontStyle: 'italic',
                          padding: '8px 12px',
                          background: 'var(--c2)',
                          borderRadius: 'var(--r)',
                          marginBottom: 10,
                        }}
                      >
                        &quot;{w.notes}&quot;
                      </div>
                    )}

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDel(w.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {confirmDel && (
        <div className="overlay" onClick={() => setConfirmDel(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="bebas mb8" style={{ fontSize: 24 }}>
              Delete Workout?
            </div>
            <div style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 20 }}>
              This cannot be undone.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-fw" onClick={() => setConfirmDel(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-fw"
                onClick={() => {
                  setWorkouts((ws) => ws.filter((x) => x.id !== confirmDel));
                  setOpen(null);
                  setConfirmDel(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
