import { useState } from 'react';
import { CARDIO_LIST, SPORT_LIST, FLEX_LIST } from '../data/activities';

export default function NonStrengthWorkout({
  workout,
  elapsed,
  timerFmt,
  onFinish,
  onDiscard,
}) {
  const [selActivity, setSelActivity] = useState(null);
  const [form, setForm] = useState({
    distance: '',
    calories: '',
    heartRate: '',
    score: '',
    rounds: '',
    notes: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const lists = { cardio: CARDIO_LIST, sport: SPORT_LIST, flexibility: FLEX_LIST };
  const list = lists[workout.type] || [];
  const clrMap = { cardio: '#FF6B6B', sport: '#4ECDC4', flexibility: '#FFD93D' };
  const clr = clrMap[workout.type] || 'var(--lime)';
  const upd = (f) => setForm((p) => ({ ...p, ...f }));

  const handleFinish = () => {
    onFinish({
      ...workout,
      duration: Math.round(elapsed / 60),
      activityName: selActivity?.name || workout.name,
      activityIcon: selActivity?.icon || '',
      distance: form.distance ? parseFloat(form.distance) : null,
      unit: selActivity?.unit || null,
      calories: form.calories ? parseInt(form.calories) : null,
      heartRate: form.heartRate ? parseInt(form.heartRate) : null,
      score: form.score || null,
      rounds: form.rounds || null,
      notes: form.notes,
    });
  };

  return (
    <div>
      <div className="aw-hdr">
        <button className="btn btn-danger btn-sm" onClick={onDiscard}>
          ✕ Discard
        </button>
        <div style={{ textAlign: 'center' }}>
          <div className="aw-timer" style={{ color: clr }}>
            {timerFmt}
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 1 }}>{workout.name}</div>
        </div>
        <button
          className="btn btn-sm"
          style={{ background: clr, color: '#000', fontWeight: 700 }}
          onClick={() => setShowConfirm(true)}
        >
          Finish ✓
        </button>
      </div>

      <div className="page" style={{ paddingTop: 16 }}>
        {!selActivity ? (
          <div className="fi">
            <div className="bebas mb12" style={{ fontSize: 20, letterSpacing: 1 }}>
              Select{' '}
              {workout.type === 'cardio'
                ? 'Cardio Activity'
                : workout.type === 'sport'
                  ? 'Sport / Game'
                  : 'Activity'}
            </div>
            <div className="activity-grid">
              {list.map((item) => (
                <button
                  key={item.id}
                  className="activity-btn"
                  onClick={() => setSelActivity(item)}
                  style={{ borderColor: `${clr}33` }}
                >
                  <span style={{ fontSize: 30 }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--w)',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="si">
            <div className="card p16 mb14">
              <div className="row mb14">
                <span style={{ fontSize: 36 }}>{selActivity.icon}</span>
                <div className="flex1">
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{selActivity.name}</div>
                  <button
                    style={{
                      fontSize: 12,
                      color: clr,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: 3,
                    }}
                    onClick={() => setSelActivity(null)}
                  >
                    ↩ Change
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 22, color: clr }}>
                    {timerFmt}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--dim)' }}>elapsed</div>
                </div>
              </div>

              <div className="div" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {selActivity.hasDistance && (
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--dim)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.7,
                        marginBottom: 7,
                      }}
                    >
                      Distance ({selActivity.unit})
                    </div>
                    <input
                      className="inp inp-num"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.distance}
                      onChange={(e) => upd({ distance: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--dim)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.7,
                      marginBottom: 7,
                    }}
                  >
                    Calories
                  </div>
                  <input
                    className="inp inp-num"
                    type="number"
                    placeholder="0"
                    value={form.calories}
                    onChange={(e) => upd({ calories: e.target.value })}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--dim)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.7,
                      marginBottom: 7,
                    }}
                  >
                    Avg HR (bpm)
                  </div>
                  <input
                    className="inp inp-num"
                    type="number"
                    placeholder="0"
                    value={form.heartRate}
                    onChange={(e) => upd({ heartRate: e.target.value })}
                  />
                </div>
                {workout.type === 'sport' && (
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--dim)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.7,
                        marginBottom: 7,
                      }}
                    >
                      Score
                    </div>
                    <input
                      className="inp"
                      placeholder="e.g. 3-1"
                      value={form.score}
                      onChange={(e) => upd({ score: e.target.value })}
                    />
                  </div>
                )}
                {workout.type === 'cardio' && (
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--dim)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.7,
                        marginBottom: 7,
                      }}
                    >
                      Rounds
                    </div>
                    <input
                      className="inp inp-num"
                      type="number"
                      placeholder="0"
                      value={form.rounds}
                      onChange={(e) => upd({ rounds: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </div>

            <textarea
              className="inp mb16"
              rows={3}
              placeholder="Session notes..."
              value={form.notes}
              onChange={(e) => upd({ notes: e.target.value })}
            />

            <button
              className="btn btn-fw btn-lg"
              style={{ background: clr, color: '#000', fontWeight: 700 }}
              onClick={() => setShowConfirm(true)}
            >
              Finish & Save Session
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="overlay" onClick={() => setShowConfirm(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="bebas mb8" style={{ fontSize: 26, letterSpacing: 1 }}>
              Finish Workout?
            </div>
            <div style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 20 }}>
              {selActivity?.icon} {selActivity?.name || workout.name} · ⏱ {timerFmt}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-fw" onClick={() => setShowConfirm(false)}>
                Keep Going
              </button>
              <button
                className="btn btn-fw btn-lg"
                style={{ background: clr, color: '#000', fontWeight: 700 }}
                onClick={handleFinish}
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
