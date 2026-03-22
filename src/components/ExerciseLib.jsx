import { useState } from 'react';
import { EXERCISES } from '../data/exercises';
import { MUSCLE_CLR, MUSCLES } from '../data/constants';

export default function ExerciseLib() {
  const [selMuscle, setSelMuscle] = useState(null);
  const [search, setSearch] = useState('');

  const allEx = MUSCLES.flatMap((m) =>
    (EXERCISES[m] || []).map((e) => ({ ...e, muscle: m }))
  );
  const displayed = search
    ? allEx.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.muscle.toLowerCase().includes(search.toLowerCase()) ||
          e.eq.toLowerCase().includes(search.toLowerCase())
      )
    : selMuscle
      ? (EXERCISES[selMuscle] || []).map((e) => ({ ...e, muscle: selMuscle }))
      : null;

  return (
    <div>
      <div className="topbar">
        <div className="bebas" style={{ fontSize: 28, letterSpacing: 2 }}>
          Exercises
        </div>
        <div style={{ fontSize: 12, color: 'var(--dim)' }}>{allEx.length} exercises</div>
      </div>
      <div className="page">
        <input
          className="inp mb14"
          placeholder="🔍 Search exercises, muscles, equipment..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelMuscle(null);
          }}
        />

        {!search && !selMuscle && (
          <div className="fi">
            <div className="bebas mb12" style={{ fontSize: 18, letterSpacing: 1 }}>
              Muscle Groups
            </div>
            <div className="muscle-grid">
              {MUSCLES.map((m) => (
                <div
                  key={m}
                  className="muscle-card"
                  onClick={() => setSelMuscle(m)}
                  style={{ border: `1px solid ${MUSCLE_CLR[m]}44` }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: MUSCLE_CLR[m],
                      margin: '0 auto 8px',
                    }}
                  />
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{m}</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 3 }}>
                    {(EXERCISES[m] || []).length} exercises
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selMuscle && !search && (
          <div className="row mb14">
            <button className="btn btn-ghost btn-sm" onClick={() => setSelMuscle(null)}>
              ← All Groups
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: MUSCLE_CLR[selMuscle],
                }}
              />
              <div className="bebas" style={{ fontSize: 20, letterSpacing: 1 }}>
                {selMuscle}
              </div>
            </div>
          </div>
        )}

        {displayed && (
          <div className="fi">
            {displayed.length === 0 ? (
              <div className="empty">
                <span className="empty-ico">🔍</span>
                <div>
                  No results for &quot;{search}&quot;
                </div>
              </div>
            ) : (
              displayed.map((ex) => (
                <div
                  key={ex.id + (ex.muscle || '')}
                  className="ex-row"
                  style={{ cursor: 'default' }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                    {(search || !selMuscle) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: MUSCLE_CLR[ex.muscle],
                          }}
                        />
                        <span style={{ fontSize: 11, color: 'var(--dim)' }}>{ex.muscle}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className="eq-badge" style={{ fontSize: 11, padding: '3px 9px' }}>
                      {ex.eq}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
