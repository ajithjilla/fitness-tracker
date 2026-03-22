import { useState } from 'react';
import { WORKOUT_TYPES } from '../data/constants.js';
import { uid, todayStr } from '../utils/helpers.js';

export default function WorkoutStarter({ onStart, onBack }) {
  const [type, setType] = useState(null);
  const [name, setName] = useState('');

  const handleStart = () => {
    if (!type) return;
    onStart({
      id: uid(),
      date: todayStr(),
      startTime: Date.now(),
      type,
      name:
        name.trim() ||
        WORKOUT_TYPES.find((t) => t.id === type)?.label + ' Workout',
      exercises: [],
    });
  };

  return (
    <div>
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Back
        </button>
        <div className="bebas" style={{ fontSize: 22, letterSpacing: 1 }}>
          New Workout
        </div>
        <div style={{ width: 70 }} />
      </div>
      <div className="page">
        <div className="su1 mb16">
          <div
            style={{
              fontSize: 10,
              color: 'var(--dim)',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Workout Type
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
            }}
          >
            {WORKOUT_TYPES.map((wt) => (
              <button
                key={wt.id}
                className={`wt-btn ${type === wt.id ? 'sel' : ''}`}
                onClick={() => setType(wt.id)}
                style={{
                  border: `1.5px solid ${
                    type === wt.id ? wt.color : wt.color + '33'
                  }`,
                  minHeight: 110,
                }}
              >
                <span className="wt-icon">{wt.icon}</span>
                <span
                  className="wt-lbl"
                  style={{
                    color: type === wt.id ? wt.color : 'var(--w)',
                    fontSize: 16,
                  }}
                >
                  {wt.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--dim)' }}>
                  {wt.id === 'strength'
                    ? 'Weights & reps'
                    : wt.id === 'cardio'
                      ? 'Distance & time'
                      : wt.id === 'sport'
                        ? 'Games & matches'
                        : 'Yoga & mobility'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {type && (
          <div className="su2 gap12">
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--dim)',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Session Name (optional)
              </div>
              <input
                className="inp"
                placeholder={
                  WORKOUT_TYPES.find((t) => t.id === type)?.label + ' Workout'
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button
              className="btn btn-lime btn-lg btn-fw"
              onClick={handleStart}
            >
              Start Session →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
