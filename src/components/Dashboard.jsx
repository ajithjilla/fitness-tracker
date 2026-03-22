import { WORKOUT_TYPES } from '../data/constants';
import { todayStr } from '../utils/helpers';
import MiniCard from './MiniCard';

export default function Dashboard({ workouts, onStart }) {
  const now = new Date();
  const td = todayStr();

  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = d.toLocaleDateString('en-CA');
    if (workouts.some((w) => w.date === ds)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      d.setDate(d.getDate() - 1);
    } else break;
  }

  const thisWeek = (() => {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return workouts.filter((w) => new Date(w.date + 'T12:00:00') >= start);
  })();

  const todayWk = workouts.filter((w) => w.date === td);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const weekBars = days.map((lbl, i) => {
    const dd = new Date(now);
    dd.setDate(now.getDate() - now.getDay() + i);
    const ds = dd.toLocaleDateString('en-CA');
    const cnt = workouts.filter((w) => w.date === ds).length;
    return { lbl, cnt, isToday: ds === td };
  });
  const maxCnt = Math.max(1, ...weekBars.map((b) => b.cnt));

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="logo">FORGE</div>
          <div style={{ fontSize: 12, color: 'var(--dim)', marginTop: 1 }}>
            {now.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 10,
              color: 'var(--dim)',
              textTransform: 'uppercase',
              letterSpacing: 0.7,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Streak
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              justifyContent: 'flex-end',
            }}
          >
            <span style={{ fontSize: 22 }}>🔥</span>
            <span
              className="mono"
              style={{ fontSize: 26, color: 'var(--org)', fontWeight: 500 }}
            >
              {streak}
            </span>
          </div>
        </div>
      </div>

      <div className="page">
        <div
          className="su1"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            { l: 'Today', v: todayWk.length, s: 'sessions' },
            { l: 'This Week', v: thisWeek.length, s: 'workouts' },
            { l: 'All Time', v: workouts.length, s: 'sessions' },
          ].map(({ l, v, s }) => (
            <div key={l} className="card p14">
              <div className="stat-lbl">{l}</div>
              <div className="stat-val">{v}</div>
              <div className="stat-sub">{s}</div>
            </div>
          ))}
        </div>

        <div className="su2 card p16 mb14">
          <div className="row mb14" style={{ justifyContent: 'space-between' }}>
            <div className="bebas" style={{ fontSize: 18, letterSpacing: 1 }}>
              This Week
            </div>
            <div style={{ fontSize: 12, color: 'var(--dim)' }}>
              {thisWeek.length} sessions
            </div>
          </div>
          <div className="week-chart">
            {weekBars.map(({ lbl, cnt, isToday }) => (
              <div key={lbl} className="wc-col">
                <div
                  className="wc-bar"
                  style={{
                    height: `${Math.max(3, (cnt / maxCnt) * 58)}px`,
                    background:
                      cnt > 0
                        ? isToday
                          ? 'var(--lime)'
                          : 'rgba(186,255,41,.35)'
                        : 'var(--c3)',
                  }}
                />
                <div
                  className="wc-lbl"
                  style={{ color: isToday ? 'var(--lime)' : 'var(--dim)' }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="su3 mb16">
          <div
            className="bebas mb12"
            style={{ fontSize: 20, letterSpacing: 1 }}
          >
            Start Workout
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {WORKOUT_TYPES.map((wt) => (
              <button
                key={wt.id}
                className="wt-btn"
                onClick={onStart}
                style={{ border: `1.5px solid ${wt.color}33` }}
              >
                <span className="wt-icon">{wt.icon}</span>
                <span className="wt-lbl" style={{ color: 'var(--w)' }}>
                  {wt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="su4">
          <div
            className="bebas mb12"
            style={{ fontSize: 20, letterSpacing: 1 }}
          >
            Recent Workouts
          </div>
          {workouts.length === 0 ? (
            <div className="empty">
              <span className="empty-ico">💪</span>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 4,
                }}
              >
                No workouts yet
              </div>
              <div style={{ fontSize: 13 }}>
                Tap <b style={{ color: 'var(--lime)' }}>+</b> to start your first
                session
              </div>
            </div>
          ) : (
            workouts.slice(0, 5).map((w) => <MiniCard key={w.id} w={w} />)
          )}
        </div>
      </div>
    </div>
  );
}
