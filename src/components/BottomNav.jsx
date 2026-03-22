export default function BottomNav({ screen, setScreen, onAdd }) {
  return (
    <div className="bnav">
      {[
        { id: 'home', ico: '🏠', lbl: 'Home' },
        { id: 'history', ico: '📋', lbl: 'History' },
      ].map(({ id, ico, lbl }) => (
        <button
          key={id}
          className={`bni ${screen === id ? 'on' : ''}`}
          onClick={() => setScreen(id)}
        >
          <span className="ico">{ico}</span>
          <span className="lbl">{lbl}</span>
        </button>
      ))}
      <button className="bnav-add" onClick={onAdd} title="Start Workout">
        +
      </button>
      {[
        { id: 'exercises', ico: '📚', lbl: 'Library' },
        { id: 'progress', ico: '📊', lbl: 'Progress' },
      ].map(({ id, ico, lbl }) => (
        <button
          key={id}
          className={`bni ${screen === id ? 'on' : ''}`}
          onClick={() => setScreen(id)}
        >
          <span className="ico">{ico}</span>
          <span className="lbl">{lbl}</span>
        </button>
      ))}
    </div>
  );
}
