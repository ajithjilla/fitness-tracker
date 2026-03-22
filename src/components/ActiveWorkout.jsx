import { useState, useEffect } from 'react';
import { EXERCISES } from '../data/exercises';
import { MUSCLE_CLR, MUSCLES, WORKOUT_TYPES } from '../data/constants';
import { uid, pad2, calcVol, calcDone } from '../utils/helpers';
import NonStrengthWorkout from './NonStrengthWorkout';

export default function ActiveWorkout({ workout, setWorkout, onFinish, onDiscard }) {
  const [elapsed, setElapsed] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [selMuscle, setSelMuscle] = useState('Chest');
  const [exSearch, setExSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [notif, setNotif] = useState('');

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const timerFmt = `${pad2(Math.floor(elapsed / 60))}:${pad2(elapsed % 60)}`;

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(''), 2000);
  };

  const addExercise = (ex, muscle) => {
    if (workout.exercises.find((e) => e.id === ex.id)) {
      showNotif('Already added!');
      return;
    }
    setWorkout((w) => ({
      ...w,
      exercises: [
        ...w.exercises,
        {
          id: ex.id,
          name: ex.name,
          muscle,
          eq: ex.eq,
          sets: [{ id: uid(), weight: '', reps: '', done: false }],
        },
      ],
    }));
    showNotif(`${ex.name} added ✓`);
    setShowPicker(false);
  };

  const addSet = (exId) =>
    setWorkout((w) => ({
      ...w,
      exercises: w.exercises.map((e) =>
        e.id === exId
          ? {
              ...e,
              sets: [
                ...e.sets,
                {
                  id: uid(),
                  weight: e.sets.at(-1)?.weight || '',
                  reps: e.sets.at(-1)?.reps || '',
                  done: false,
                },
              ],
            }
          : e
      ),
    }));
  const removeSet = (exId, setId) =>
    setWorkout((w) => ({
      ...w,
      exercises: w.exercises.map((e) =>
        e.id === exId ? { ...e, sets: e.sets.filter((s) => s.id !== setId) } : e
      ),
    }));
  const updateSet = (exId, setId, field, val) =>
    setWorkout((w) => ({
      ...w,
      exercises: w.exercises.map((e) =>
        e.id === exId
          ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, [field]: val } : s)) }
          : e
      ),
    }));
  const toggleSet = (exId, setId) =>
    setWorkout((w) => ({
      ...w,
      exercises: w.exercises.map((e) =>
        e.id === exId
          ? { ...e, sets: e.sets.map((s) => (s.id === setId ? { ...s, done: !s.done } : s)) }
          : e
      ),
    }));
  const removeEx = (exId) =>
    setWorkout((w) => ({ ...w, exercises: w.exercises.filter((e) => e.id !== exId) }));

  const handleFinish = () => {
    onFinish({
      ...workout,
      duration: Math.round(elapsed / 60),
      volume: calcVol(workout.exercises),
      totalSets: calcDone(workout.exercises),
      notes,
    });
  };

  const pickerExercises = exSearch
    ? MUSCLES.flatMap((m) =>
        (EXERCISES[m] || [])
          .filter((e) => e.name.toLowerCase().includes(exSearch.toLowerCase()))
          .map((e) => ({ ...e, muscle: m }))
      )
    : (EXERCISES[selMuscle] || []).map((e) => ({ ...e, muscle: selMuscle }));

  const isNonStrength = workout.type !== 'strength';
  if (isNonStrength) {
    return (
      <NonStrengthWorkout
        workout={workout}
        elapsed={elapsed}
        timerFmt={timerFmt}
        onFinish={onFinish}
        onDiscard={onDiscard}
      />
    );
  }

  return (
    <div>
      {notif && <div className="notif">{notif}</div>}

      <div className="aw-hdr">
        <button className="btn btn-danger btn-sm" onClick={onDiscard}>
          ✕ Discard
        </button>
        <div style={{ textAlign: 'center' }}>
          <div className="aw-timer">{timerFmt}</div>
          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 1, letterSpacing: 0.3 }}>
            {workout.name}
          </div>
        </div>
        <button className="btn btn-lime btn-sm" onClick={() => setShowConfirm(true)}>
          Finish ✓
        </button>
      </div>

      <div className="page" style={{ paddingTop: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { l: 'Exercises', v: workout.exercises.length },
            { l: 'Sets Done', v: calcDone(workout.exercises) },
            { l: 'Volume kg', v: calcVol(workout.exercises).toLocaleString() },
          ].map(({ l, v }) => (
            <div key={l} className="card p14" style={{ textAlign: 'center' }}>
              <div className="stat-lbl">{l}</div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 500 }}>
                {v}
              </div>
            </div>
          ))}
        </div>

        {workout.exercises.length === 0 && (
          <div className="empty" style={{ paddingTop: 32 }}>
            <span className="empty-ico">🏋️</span>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No exercises yet</div>
            <div style={{ fontSize: 13 }}>Tap &quot;Add Exercise&quot; to get started</div>
          </div>
        )}

        {workout.exercises.map((ex) => (
          <div key={ex.id} className="card p16 mb12">
            <div className="row mb12">
              <div className="flex1">
                <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span
                    className="eq-badge"
                    style={{ background: `${MUSCLE_CLR[ex.muscle]}22`, color: MUSCLE_CLR[ex.muscle] }}
                  >
                    {ex.muscle}
                  </span>
                  <span className="eq-badge">{ex.eq}</span>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ padding: '5px 9px', borderRadius: 8, fontSize: 14 }}
                onClick={() => removeEx(ex.id)}
              >
                ✕
              </button>
            </div>

            <div className="set-grid" style={{ marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 9,
                  color: 'var(--dim)',
                  textAlign: 'center',
                  fontWeight: 700,
                  letterSpacing: 0.7,
                }}
              >
                SET
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: 'var(--dim)',
                  textAlign: 'center',
                  fontWeight: 700,
                  letterSpacing: 0.7,
                }}
              >
                KG
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: 'var(--dim)',
                  textAlign: 'center',
                  fontWeight: 700,
                  letterSpacing: 0.7,
                }}
              >
                REPS
              </div>
              <div />
            </div>

            {ex.sets.map((set, si) => (
              <div key={set.id} className="set-grid">
                <div className={`set-num ${set.done ? 'done' : ''}`}>{si + 1}</div>
                <input
                  className="inp inp-num"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="—"
                  value={set.weight}
                  onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                />
                <input
                  className="inp inp-num"
                  type="number"
                  min="0"
                  placeholder="—"
                  value={set.reps}
                  onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                />
                <button
                  className={`set-check ${set.done ? 'done' : ''}`}
                  onClick={() => toggleSet(ex.id, set.id)}
                >
                  ✓
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn btn-dark btn-sm flex1" onClick={() => addSet(ex.id)}>
                + Add Set
              </button>
              {ex.sets.length > 1 && (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => removeSet(ex.id, ex.sets.at(-1).id)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          className="btn btn-lime btn-fw btn-lg mb12"
          style={{ marginTop: 4 }}
          onClick={() => {
            setExSearch('');
            setShowPicker(true);
          }}
        >
          + Add Exercise
        </button>

        <textarea
          className="inp mb16"
          rows={3}
          placeholder="Session notes (optional)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {showPicker && (
        <div className="overlay" onClick={() => setShowPicker(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="bebas mb12" style={{ fontSize: 24, letterSpacing: 1 }}>
              Add Exercise
            </div>
            <input
              className="inp mb12"
              placeholder="Search all exercises..."
              value={exSearch}
              onChange={(e) => setExSearch(e.target.value)}
            />
            {!exSearch && (
              <div className="scroll-x mb12">
                {MUSCLES.map((m) => (
                  <button
                    key={m}
                    className="pill"
                    onClick={() => setSelMuscle(m)}
                    style={{
                      background: selMuscle === m ? MUSCLE_CLR[m] : 'transparent',
                      borderColor: MUSCLE_CLR[m],
                      color: selMuscle === m ? '#000' : MUSCLE_CLR[m],
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
            <div>
              {pickerExercises.map((ex) => {
                const added = workout.exercises.some((e) => e.id === ex.id);
                return (
                  <div
                    key={ex.id + (ex.muscle || '')}
                    className={`ex-row ${added ? 'added' : ''}`}
                    onClick={() => !added && addExercise(ex, ex.muscle || selMuscle)}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{ex.name}</div>
                      {exSearch && (
                        <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2 }}>
                          {ex.muscle}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className="eq-badge">{ex.eq}</span>
                      <span style={{ fontSize: 16, color: added ? 'var(--lime)' : 'var(--dim)' }}>
                        {added ? '✓' : '+'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="overlay" onClick={() => setShowConfirm(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="bebas mb8" style={{ fontSize: 26, letterSpacing: 1 }}>
              Finish Workout?
            </div>
            <div style={{ fontSize: 13, color: 'var(--dim)', marginBottom: 20, lineHeight: 1.6 }}>
              ⏱ {timerFmt} · 💪 {workout.exercises.length} exercises · ✓{' '}
              {calcDone(workout.exercises)} sets done
              <br />
              📦 Total volume:{' '}
              <b style={{ color: 'var(--w)' }}>
                {calcVol(workout.exercises).toLocaleString()} kg
              </b>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-fw" onClick={() => setShowConfirm(false)}>
                Keep Going
              </button>
              <button className="btn btn-lime btn-fw btn-lg" onClick={handleFinish}>
                💾 Save Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
