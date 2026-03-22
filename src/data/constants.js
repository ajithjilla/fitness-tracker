/* FORGE — Constants: muscle colors, muscle groups, workout types, key lifts for PR tracking */

import { EXERCISES } from './exercises.js';

export const MUSCLE_CLR = {
  Chest: '#FF6B6B',
  Back: '#4ECDC4',
  Shoulders: '#FFD93D',
  Biceps: '#6BCB77',
  Triceps: '#FF9A3C',
  Legs: '#9B5DE5',
  Core: '#F15BB5',
  Glutes: '#00BBF9',
  'Full Body': '#00F5D4',
};

export const MUSCLES = Object.keys(EXERCISES);

export const WORKOUT_TYPES = [
  { id: 'strength', label: 'Strength', icon: '🏋️', color: '#BAFF29' },
  { id: 'cardio', label: 'Cardio', icon: '🏃', color: '#FF6B6B' },
  { id: 'sport', label: 'Sports', icon: '⚽', color: '#4ECDC4' },
  { id: 'flexibility', label: 'Flex', icon: '🧘', color: '#FFD93D' },
];

/** Key lifts for PR tracking — ids match EXERCISES */
export const KEY_LIFTS = [
  { id: 'bench', name: 'Bench Press', icon: '🏋️' },
  { id: 'deadlift', name: 'Deadlift', icon: '💀' },
  { id: 'squat', name: 'Squat', icon: '🦵' },
  { id: 'ohp', name: 'OHP', icon: '💪' },
  { id: 'bbc', name: 'Barbell Curl', icon: '💪' },
  { id: 'brow', name: 'Barbell Row', icon: '🔄' },
];
