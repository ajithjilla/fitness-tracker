import { useState, useEffect } from 'react';
import { WORKOUT_TYPES, KEY_LIFTS } from '../data/constants';
import { store } from '../utils/storage';
import { uid, todayStr, fmtDate, fmtDur } from '../utils/helpers';

export default function Progress({ workouts }) {
  const [bwInput, setBwInput] = useState('');
  const [bwLog, setBwLog] = useState([]);
  const [bwLoaded, setBwLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await store.load('forge_bw_v2');
      setBwLog(Array.isArray(d) ? d : []);
      setBwLoaded(true);
    })();
  }, []);

  const saveBW = async (log) => {
    await store.save('forge_bw_v2', log);
  };

  const addBW = () => {
    if (!bwInput) return;
    const entry = { date: todayStr(), weight: parseFloat(bwInput), id: uid() };
    const next = [entry, ...bwLog].slice(0, 60);
    setBwLog(next);
    saveBW(next);
    setBwInput('');
  };

  const getPR = (exId) => {
    let pr = null;
    workouts
      .filter((w) => w.type === 'strength')
      .forEach((w) => {
        (w.exercises || [])
          .filter((e) => e.id === exId)
          .forEach((ex) => {
            ex.sets.forEach((s) => {
              const w2 = parseFloat(s.weight) || 0;
              if (w2 > 0 && (!pr || w2 > pr.weight)) {
                pr = { weight: w2, reps: parseInt(s.reps) || 0, date: w.date };
              }
            });
          });
      });
    return pr;
  };

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = workouts.filter(
    (w) => new Date(w.date + 'T12:00:00') >= monthStart
  );
  const strengthMonth = thisMonth.filter((w) => w.type === 'strength');
  const cardioMonth = thisMonth.filter((w) => w.type === 'cardio');
  const sportMonth = thisMonth.filter((w) => w.type === 'sport');

  const totalVol = strengthMonth.reduce((t, w) => t + (w.volume || 0), 0);
  const totalCardioTime = cardioMonth.reduce((t, w) => t + (w.duration || 0), 0);

  const volTrend = workouts
    .filter((w) => w.type === 'strength')
    .slice(0, 8)
    .reverse();
  const maxVol = Math.max(1, ...volTrend.map((w) => w.volume || 0));

  return (
    <div>
      <div className="topbar">
        <div className="bebas" style={{ fontSize: 28, letterSpacing: 2 }}>
          Progress
        </div>
        <div style={{ fontSize: 12, color: 'var(--dim)' }}>
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
      <div className="page">
        <div className="su1 card p16 mb14">
          <div className="bebas mb14" style={{ fontSize: 18, letterSpacing: 1 }}>
            📅 This Month
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {[
              { l: 'Total Sessions', v: thisMonth.length, clr: 'var(--lime)' },
              {
                l: 'Total Volume',
                v: totalVol > 0 ? `${(totalVol / 1000).toFixed(1)}t` : '—',
                clr: 'var(--blue)',
              },
              {
                l: 'Cardio Time',
                v: totalCardioTime > 0 ? fmtDur(totalCardioTime) : '—',
                clr: '#FF6B6B',
              },
              { l: 'Sports Games', v: sportMonth.length, clr: '#4ECDC4' },
            ].map(({ l, v, clr }) => (
              <div
                key={l}
                className="card2"
                style={{
                  padding: 12,
                  textAlign: 'center',
                  border: `1px solid ${clr}22`,
                }}
              >
                <div className="stat-lbl">{l}</div>
                <div
                  className="mono"
                  style={{ fontSize: 22, fontWeight: 500, color: clr, marginTop: 3 }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          {WORKOUT_TYPES.map((wt) => {
            const cnt = workouts.filter((w) => w.type === wt.id).length;
            const pct = workouts.length > 0 ? (cnt / workouts.length) * 100 : 0;
            return (
              <div key={wt.id} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    marginBottom: 4,
                  }}
                >
                  <span>
                    {wt.icon} {wt.label}
                  </span>
                  <span style={{ color: 'var(--dim)' }}>
                    {cnt} sessions ({Math.round(pct)}%)
                  </span>
                </div>
                <div className="pbar">
                  <div
                    className="pbar-f"
                    style={{ width: `${pct}%`, background: wt.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {volTrend.length > 0 && (
          <div className="su2 card p16 mb14">
            <div className="bebas mb14" style={{ fontSize: 18, letterSpacing: 1 }}>
              📈 Volume Trend
            </div>
            <div className="week-chart" style={{ height: 80 }}>
              {volTrend.map((w) => (
                <div key={w.id} className="wc-col">
                  <div
                    className="wc-bar"
                    style={{
                      height: `${Math.max(4, ((w.volume || 0) / maxVol) * 68)}px`,
                      background: `rgba(186,255,41,${0.25 + ((w.volume || 0) / maxVol) * 0.75})`,
                    }}
                  />
                  <div className="wc-lbl" style={{ fontSize: 8 }}>
                    {w.date.slice(5)}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: 'var(--dim)',
                textAlign: 'right',
              }}
            >
              Last {volTrend.length} strength sessions
            </div>
          </div>
        )}

        <div className="su3 card p16 mb14">
          <div className="bebas mb14" style={{ fontSize: 18, letterSpacing: 1 }}>
            🏆 Personal Records
          </div>
          {KEY_LIFTS.map((lift) => {
            const pr = getPR(lift.id);
            return (
              <div
                key={lift.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '11px 0',
                  borderBottom: '1px solid var(--bd)',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {lift.icon} {lift.name}
                </div>
                {pr ? (
                  <div style={{ textAlign: 'right' }}>
                    <span className="pr-badge">
                      🏆 {pr.weight}kg × {pr.reps} reps
                    </span>
                    <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 3 }}>
                      {fmtDate(pr.date)}
                    </div>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--dim)' }}>No data yet</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="su4 card p16 mb14">
          <div className="bebas mb14" style={{ fontSize: 18, letterSpacing: 1 }}>
            ⚖️ Body Weight
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              className="inp inp-num flex1"
              type="number"
              step="0.1"
              placeholder="e.g. 75.5"
              value={bwInput}
              onChange={(e) => setBwInput(e.target.value)}
              style={{ textAlign: 'left', paddingLeft: 14 }}
            />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--dim)',
                fontSize: 13,
                minWidth: 24,
              }}
            >
              kg
            </span>
            <button
              className="btn btn-lime btn-sm"
              onClick={addBW}
              style={{ flexShrink: 0 }}
            >
              Log
            </button>
          </div>
          {bwLog.length > 0 ? (
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {bwLog.slice(0, 15).map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '7px 0',
                    borderBottom: '1px solid var(--bd)',
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: 'var(--dim)' }}>{fmtDate(entry.date)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {i > 0 && bwLog[i - 1] && (
                      <span
                        style={{
                          fontSize: 11,
                          color:
                            entry.weight < bwLog[i - 1].weight
                              ? 'var(--grn)'
                              : entry.weight > bwLog[i - 1].weight
                                ? 'var(--red)'
                                : 'var(--dim)',
                        }}
                      >
                        {entry.weight < bwLog[i - 1].weight
                          ? '↓'
                          : entry.weight > bwLog[i - 1].weight
                            ? '↑'
                            : '→'}{' '}
                        {Math.abs(entry.weight - bwLog[i - 1].weight).toFixed(1)}
                      </span>
                    )}
                    <span className="mono" style={{ fontWeight: 500 }}>
                      {entry.weight}{' '}
                      <span style={{ color: 'var(--dim)', fontSize: 11 }}>kg</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '20px 0',
                color: 'var(--dim)',
                fontSize: 13,
              }}
            >
              Log your weight to track changes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
