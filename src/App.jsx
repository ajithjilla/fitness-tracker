/* ══════════════════════════════════════════════════════════════════
   FORGE — Complete Workout Tracker
   Product: Dashboard · Log (Strength/Cardio/Sport/Flex) · History
            Exercise Library · Progress & PRs
   Storage: window.storage (persistent across sessions)
══════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react';
import { store, WK_KEY } from './utils/storage';
import Dashboard from './components/Dashboard';
import History from './components/History';
import ExerciseLib from './components/ExerciseLib';
import Progress from './components/Progress';
import BottomNav from './components/BottomNav';
import WorkoutStarter from './components/WorkoutStarter';
import ActiveWorkout from './components/ActiveWorkout';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [workouts, setWorkouts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showStarter, setShowStarter] = useState(false);

  useEffect(() => {
    (async () => {
      const w = await store.load(WK_KEY);
      setWorkouts(Array.isArray(w) ? w : []);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) store.save(WK_KEY, workouts);
  }, [workouts, loaded]);

  const finishWorkout = useCallback((workout) => {
    setWorkouts((prev) => [workout, ...prev]);
    setActiveWorkout(null);
    setShowStarter(false);
    setScreen('history');
  }, []);

  const discardWorkout = useCallback(() => {
    setActiveWorkout(null);
    setShowStarter(false);
  }, []);

  if (!loaded) {
    return (
      <div
        style={{
          background: '#080808',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: 'Bebas Neue',
            fontSize: 52,
            letterSpacing: 5,
            color: '#BAFF29',
            textShadow: '0 0 40px rgba(186,255,41,.4)',
          }}
        >
          FORGE
        </div>
        <div
          style={{
            fontSize: 11,
            color: '#3A3A3A',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Loading your gym...
        </div>
      </div>
    );
  }

  if (activeWorkout) {
    return (
      <div className="app">
        <ActiveWorkout
          workout={activeWorkout}
          setWorkout={setActiveWorkout}
          onFinish={finishWorkout}
          onDiscard={discardWorkout}
        />
      </div>
    );
  }

  if (showStarter) {
    return (
      <div className="app">
        <WorkoutStarter
          onStart={(wk) => {
            setActiveWorkout(wk);
            setShowStarter(false);
          }}
          onBack={() => setShowStarter(false)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen === 'home' && <Dashboard workouts={workouts} onStart={() => setShowStarter(true)} />}
      {screen === 'history' && (
        <History workouts={workouts} setWorkouts={setWorkouts} />
      )}
      {screen === 'exercises' && <ExerciseLib />}
      {screen === 'progress' && <Progress workouts={workouts} />}
      <BottomNav
        screen={screen}
        setScreen={setScreen}
        onAdd={() => setShowStarter(true)}
      />
    </div>
  );
}
