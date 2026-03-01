import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   FORGE — Complete Workout Tracker
   Product: Dashboard · Log (Strength/Cardio/Sport/Flex) · History
            Exercise Library · Progress & PRs
   Storage: window.storage (persistent across sessions)
══════════════════════════════════════════════════════════════════ */

// ─── EXERCISE DATABASE ────────────────────────────────────────────
const EXERCISES = {
  Chest: [
    {id:'bench',name:'Bench Press',eq:'Barbell'},{id:'incline',name:'Incline Bench Press',eq:'Barbell'},
    {id:'decline',name:'Decline Bench Press',eq:'Barbell'},{id:'dbfly',name:'Dumbbell Flyes',eq:'Dumbbell'},
    {id:'cfly',name:'Cable Crossover',eq:'Cable'},{id:'pushup',name:'Push-ups',eq:'Bodyweight'},
    {id:'cdips',name:'Chest Dips',eq:'Bodyweight'},{id:'pecdeck',name:'Pec Deck Machine',eq:'Machine'},
    {id:'incdb',name:'Incline DB Press',eq:'Dumbbell'},{id:'lowcfly',name:'Low Cable Fly',eq:'Cable'},
  ],
  Back: [
    {id:'deadlift',name:'Deadlift',eq:'Barbell'},{id:'brow',name:'Barbell Row',eq:'Barbell'},
    {id:'pullup',name:'Pull-ups',eq:'Bodyweight'},{id:'chinup',name:'Chin-ups',eq:'Bodyweight'},
    {id:'latpd',name:'Lat Pulldown',eq:'Cable'},{id:'srow',name:'Seated Cable Row',eq:'Cable'},
    {id:'trow',name:'T-Bar Row',eq:'Machine'},{id:'fp',name:'Face Pulls',eq:'Cable'},
    {id:'sarow',name:'Single-Arm DB Row',eq:'Dumbbell'},{id:'rack',name:'Rack Pulls',eq:'Barbell'},
    {id:'goodm',name:'Good Mornings',eq:'Barbell'},
  ],
  Shoulders: [
    {id:'ohp',name:'Overhead Press',eq:'Barbell'},{id:'dbohp',name:'DB Shoulder Press',eq:'Dumbbell'},
    {id:'latrise',name:'Lateral Raises',eq:'Dumbbell'},{id:'frontrise',name:'Front Raises',eq:'Dumbbell'},
    {id:'rdf',name:'Rear Delt Flyes',eq:'Dumbbell'},{id:'ap',name:'Arnold Press',eq:'Dumbbell'},
    {id:'upr',name:'Upright Row',eq:'Barbell'},{id:'shrug',name:'Shrugs',eq:'Barbell'},
    {id:'mshpress',name:'Machine Shoulder Press',eq:'Machine'},
  ],
  Biceps: [
    {id:'bbc',name:'Barbell Curl',eq:'Barbell'},{id:'dbc',name:'Dumbbell Curl',eq:'Dumbbell'},
    {id:'hc',name:'Hammer Curl',eq:'Dumbbell'},{id:'preacher',name:'Preacher Curl',eq:'Machine'},
    {id:'cbc',name:'Cable Curl',eq:'Cable'},{id:'conc',name:'Concentration Curl',eq:'Dumbbell'},
    {id:'s21',name:'21s',eq:'Barbell'},{id:'incbc',name:'Incline DB Curl',eq:'Dumbbell'},
    {id:'spidercurl',name:'Spider Curl',eq:'Dumbbell'},
  ],
  Triceps: [
    {id:'tdips',name:'Tricep Dips',eq:'Bodyweight'},{id:'skull',name:'Skull Crushers',eq:'Barbell'},
    {id:'cpd',name:'Cable Pushdown',eq:'Cable'},{id:'cgb',name:'Close-Grip Bench',eq:'Barbell'},
    {id:'ohtri',name:'Overhead Tricep Ext',eq:'Dumbbell'},{id:'kick',name:'Kickbacks',eq:'Dumbbell'},
    {id:'ropepd',name:'Rope Pushdown',eq:'Cable'},{id:'cbtri',name:'Cable Overhead Ext',eq:'Cable'},
  ],
  Legs: [
    {id:'squat',name:'Barbell Squat',eq:'Barbell'},{id:'legpress',name:'Leg Press',eq:'Machine'},
    {id:'rdl',name:'Romanian Deadlift',eq:'Barbell'},{id:'legcurl',name:'Leg Curl',eq:'Machine'},
    {id:'legext',name:'Leg Extension',eq:'Machine'},{id:'calfraise',name:'Standing Calf Raises',eq:'Machine'},
    {id:'lunge',name:'Lunges',eq:'Bodyweight'},{id:'hacksq',name:'Hack Squat',eq:'Machine'},
    {id:'bss',name:'Bulgarian Split Squat',eq:'Dumbbell'},{id:'gobblet',name:'Goblet Squat',eq:'Dumbbell'},
    {id:'sumodl',name:'Sumo Deadlift',eq:'Barbell'},{id:'scalfraise',name:'Seated Calf Raises',eq:'Machine'},
    {id:'boxjump',name:'Box Jumps',eq:'Bodyweight'},{id:'steup',name:'Step-Ups',eq:'Dumbbell'},
  ],
  Core: [
    {id:'crunch',name:'Crunches',eq:'Bodyweight'},{id:'plank',name:'Plank',eq:'Bodyweight'},
    {id:'rustwist',name:'Russian Twists',eq:'Bodyweight'},{id:'hlr',name:'Hanging Leg Raises',eq:'Bodyweight'},
    {id:'ccrunch',name:'Cable Crunches',eq:'Cable'},{id:'abwheel',name:'Ab Wheel Rollout',eq:'Equipment'},
    {id:'mtclimb',name:'Mountain Climbers',eq:'Bodyweight'},{id:'vup',name:'V-Ups',eq:'Bodyweight'},
    {id:'sideplank',name:'Side Plank',eq:'Bodyweight'},{id:'flutter',name:'Flutter Kicks',eq:'Bodyweight'},
    {id:'drflg',name:'Dragon Flag',eq:'Bodyweight'},{id:'windmill',name:'Windmill',eq:'Kettlebell'},
  ],
  Glutes: [
    {id:'hipthrust',name:'Hip Thrust',eq:'Barbell'},{id:'gbridge',name:'Glute Bridge',eq:'Bodyweight'},
    {id:'ckb',name:'Cable Kickback',eq:'Cable'},{id:'clam',name:'Clamshell',eq:'Bodyweight'},
    {id:'slrdl',name:'Single-Leg RDL',eq:'Dumbbell'},{id:'donkey',name:'Donkey Kicks',eq:'Bodyweight'},
  ],
  'Full Body': [
    {id:'thruster',name:'Thruster',eq:'Barbell'},{id:'pclean',name:'Power Clean',eq:'Barbell'},
    {id:'snatch',name:'Snatch',eq:'Barbell'},{id:'kbswing',name:'Kettlebell Swing',eq:'Kettlebell'},
    {id:'tgu',name:'Turkish Get-Up',eq:'Kettlebell'},{id:'burpee',name:'Burpees',eq:'Bodyweight'},
    {id:'manmaker',name:'Man Makers',eq:'Dumbbell'},{id:'cleanpress',name:'Clean & Press',eq:'Barbell'},
    {id:'kbclean',name:'Kettlebell Clean',eq:'Kettlebell'},
  ],
};

const CARDIO_LIST = [
  {id:'running',name:'Running',icon:'🏃',hasDistance:true,unit:'km'},
  {id:'cycling',name:'Cycling',icon:'🚴',hasDistance:true,unit:'km'},
  {id:'swimming',name:'Swimming',icon:'🏊',hasDistance:true,unit:'m'},
  {id:'rowing',name:'Rowing',icon:'🚣',hasDistance:true,unit:'m'},
  {id:'elliptical',name:'Elliptical',icon:'🔄',hasDistance:false,unit:null},
  {id:'jumprope',name:'Jump Rope',icon:'⭕',hasDistance:false,unit:null},
  {id:'stairclimb',name:'Stair Climber',icon:'🪜',hasDistance:false,unit:null},
  {id:'walking',name:'Walking',icon:'🚶',hasDistance:true,unit:'km'},
  {id:'treadmill',name:'Treadmill',icon:'🏃',hasDistance:true,unit:'km'},
  {id:'spinclass',name:'Spin Class',icon:'🚴',hasDistance:false,unit:null},
  {id:'zumba',name:'Dance / Zumba',icon:'💃',hasDistance:false,unit:null},
  {id:'cbox',name:'Cardio Boxing',icon:'🥊',hasDistance:false,unit:null},
  {id:'hiit',name:'HIIT',icon:'⚡',hasDistance:false,unit:null},
  {id:'crossfit',name:'CrossFit',icon:'🔥',hasDistance:false,unit:null},
  {id:'aerobics',name:'Aerobics',icon:'🤸',hasDistance:false,unit:null},
];

const SPORT_LIST = [
  {id:'basketball',name:'Basketball',icon:'🏀'},
  {id:'soccer',name:'Football / Soccer',icon:'⚽'},
  {id:'cricket',name:'Cricket',icon:'🏏'},
  {id:'tennis',name:'Tennis',icon:'🎾'},
  {id:'badminton',name:'Badminton',icon:'🏸'},
  {id:'volleyball',name:'Volleyball',icon:'🏐'},
  {id:'tabletennis',name:'Table Tennis',icon:'🏓'},
  {id:'squash',name:'Squash',icon:'🎾'},
  {id:'rugby',name:'Rugby',icon:'🏉'},
  {id:'baseball',name:'Baseball',icon:'⚾'},
  {id:'hockey',name:'Hockey',icon:'🏒'},
  {id:'golf',name:'Golf',icon:'⛳'},
  {id:'kabaddi',name:'Kabaddi',icon:'🤼'},
  {id:'khokho',name:'Kho-Kho',icon:'🏃'},
  {id:'athletics',name:'Athletics / Track',icon:'🏟️'},
];

const FLEX_LIST = [
  {id:'yoga',name:'Yoga',icon:'🧘'},
  {id:'pilates',name:'Pilates',icon:'🤸'},
  {id:'stretching',name:'Stretching',icon:'🧍'},
  {id:'foamroll',name:'Foam Rolling',icon:'🔄'},
  {id:'mobility',name:'Mobility Work',icon:'🦵'},
  {id:'meditation',name:'Meditation',icon:'🧠'},
];

const MUSCLE_CLR = {
  Chest:'#FF6B6B',Back:'#4ECDC4',Shoulders:'#FFD93D',Biceps:'#6BCB77',
  Triceps:'#FF9A3C',Legs:'#9B5DE5',Core:'#F15BB5',Glutes:'#00BBF9','Full Body':'#00F5D4',
};
const MUSCLES = Object.keys(EXERCISES);

const WORKOUT_TYPES = [
  {id:'strength',label:'Strength',icon:'🏋️',color:'#BAFF29'},
  {id:'cardio',label:'Cardio',icon:'🏃',color:'#FF6B6B'},
  {id:'sport',label:'Sports',icon:'⚽',color:'#4ECDC4'},
  {id:'flexibility',label:'Flex',icon:'🧘',color:'#FFD93D'},
];

// ─── STORAGE ──────────────────────────────────────────────────────
const WK_KEY = 'forge_workouts_v2';
const store = {
  load: async k => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : []; } catch { return []; } },
  save: async (k,v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch {} },
};

// ─── HELPERS ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2)+Date.now().toString(36);
const todayStr = () => new Date().toLocaleDateString('en-CA');
const fmtDate = d => { try { return new Date(d+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}); } catch { return d; }};
const fmtDur = m => { if(!m) return '0m'; const h=Math.floor(m/60),min=m%60; return h>0?`${h}h${min>0?' '+min+'m':''}`:min+'m'; };
const pad2 = n => String(n).padStart(2,'0');
const calcVol = exs => exs.reduce((t,ex)=>t+ex.sets.reduce((s,set)=>s+((parseFloat(set.weight)||0)*(parseInt(set.reps)||0)),0),0);
const calcDone = exs => exs.reduce((t,ex)=>t+ex.sets.filter(s=>s.done).length,0);

// ─── CSS ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  :root{--lime:#BAFF29;--bg:#080808;--c1:#101010;--c2:#181818;--c3:#222;--bd:#1E1E1E;--bd2:#2A2A2A;
    --w:#F0F0F0;--dim:#5A5A5A;--dim2:#3A3A3A;--red:#FF4545;--blue:#5B9EFF;--org:#FF9500;--grn:#30D158;
    --r:12px;--rl:18px;}
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  html{scroll-behavior:smooth;}
  body{background:var(--bg);color:var(--w);font-family:'DM Sans',sans-serif;overscroll-behavior:none;}
  input,button,select,textarea{font-family:'DM Sans',sans-serif;}
  ::-webkit-scrollbar{width:0;height:0;}
  @keyframes su{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  @keyframes si{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes pop{0%{transform:scale(.92)}60%{transform:scale(1.05)}100%{transform:scale(1)}}
  .su{animation:su .3s ease both}.su1{animation:su .3s .06s ease both}.su2{animation:su .3s .12s ease both}
  .su3{animation:su .3s .18s ease both}.su4{animation:su .3s .24s ease both}
  .fi{animation:fi .2s ease both}.si{animation:si .22s ease both}
  
  .app{max-width:430px;margin:0 auto;min-height:100vh;padding-bottom:88px;}
  .page{padding:0 16px;}
  
  .topbar{padding:20px 16px 10px;display:flex;align-items:center;justify-content:space-between;}
  .logo{font-family:'Bebas Neue';font-size:38px;letter-spacing:3px;color:var(--lime);line-height:1;
    text-shadow:0 0 30px rgba(186,255,41,.35);}
  .bebas{font-family:'Bebas Neue';letter-spacing:1px;}
  .mono{font-family:'DM Mono',monospace;}
  
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;
    background:rgba(6,6,6,.97);backdrop-filter:blur(28px);border-top:1px solid var(--bd);
    padding:10px 0 26px;display:flex;justify-content:space-around;align-items:center;z-index:100;}
  .bni{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:6px 14px;
    border:none;background:none;border-radius:10px;transition:all .14s;}
  .bni .ico{font-size:22px;transition:transform .14s;}
  .bni .lbl{font-size:9px;letter-spacing:.7px;text-transform:uppercase;font-weight:700;color:var(--dim);transition:color .14s;}
  .bni.on .lbl{color:var(--lime);}
  .bni.on .ico{transform:scale(1.2);}
  .bnav-add{width:56px;height:56px;border-radius:50%;background:var(--lime);display:flex;align-items:center;
    justify-content:center;cursor:pointer;font-size:30px;line-height:1;border:none;color:#000;font-weight:700;
    box-shadow:0 0 28px rgba(186,255,41,.4),0 0 60px rgba(186,255,41,.15);transition:all .18s;}
  .bnav-add:active{transform:scale(.92);}
  
  .card{background:var(--c1);border:1px solid var(--bd);border-radius:var(--rl);}
  .card2{background:var(--c2);border:1px solid var(--bd2);border-radius:var(--r);}
  .p14{padding:14px;}.p16{padding:16px;}.p18{padding:18px;}
  .mb8{margin-bottom:8px;}.mb12{margin-bottom:12px;}.mb14{margin-bottom:14px;}.mb16{margin-bottom:16px;}
  .mt8{margin-top:8px;}.mt12{margin-top:12px;}.mt16{margin-top:16px;}
  .gap8{display:flex;flex-direction:column;gap:8px;}
  .gap12{display:flex;flex-direction:column;gap:12px;}
  .row{display:flex;align-items:center;gap:10px;}
  .flex1{flex:1;}
  .div{height:1px;background:var(--bd);margin:12px 0;}
  
  .stat-lbl{font-size:9px;text-transform:uppercase;letter-spacing:.9px;color:var(--dim);font-weight:700;margin-bottom:3px;}
  .stat-val{font-family:'DM Mono',monospace;font-size:26px;font-weight:500;line-height:1.1;}
  .stat-sub{font-size:11px;color:var(--dim);margin-top:2px;}
  
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font-weight:700;font-size:14px;
    cursor:pointer;border:none;border-radius:var(--r);transition:all .14s;padding:11px 18px;letter-spacing:.2px;}
  .btn-lime{background:var(--lime);color:#000;}
  .btn-lime:active{filter:brightness(.88);}
  .btn-dark{background:var(--c2);border:1px solid var(--bd2);color:var(--w);}
  .btn-dark:hover{border-color:rgba(186,255,41,.4);}
  .btn-ghost{background:transparent;border:1px solid var(--bd2);color:var(--dim);}
  .btn-ghost:hover{color:var(--w);border-color:var(--bd);}
  .btn-danger{background:rgba(255,69,69,.1);border:1px solid rgba(255,69,69,.2);color:var(--red);}
  .btn-sm{padding:7px 12px;font-size:12px;border-radius:9px;}
  .btn-lg{padding:14px;font-size:16px;border-radius:14px;}
  .btn-fw{width:100%;}
  
  .inp{width:100%;padding:10px 14px;background:var(--c2);border:1px solid var(--bd2);border-radius:var(--r);
    color:var(--w);font-size:14px;outline:none;transition:border-color .14s;}
  .inp::placeholder{color:var(--dim);}
  .inp:focus{border-color:rgba(186,255,41,.6);}
  .inp-num{font-family:'DM Mono',monospace;text-align:center;font-size:16px;padding:9px 6px;}
  textarea.inp{resize:none;}
  
  .scroll-x{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
  .scroll-x::-webkit-scrollbar{display:none;}
  .pill{padding:7px 14px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid;
    transition:all .12s;white-space:nowrap;flex-shrink:0;background:transparent;}
  
  .wt-btn{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;
    padding:20px 8px;background:var(--c2);border:1.5px solid var(--bd2);border-radius:var(--rl);cursor:pointer;
    transition:all .15s;text-align:center;}
  .wt-btn:active{transform:scale(.96);}
  .wt-btn.sel{background:rgba(186,255,41,.06);}
  .wt-icon{font-size:34px;}
  .wt-lbl{font-family:'Bebas Neue';font-size:15px;letter-spacing:.8px;}
  
  .ex-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--c2);
    border:1px solid var(--bd2);border-radius:var(--r);cursor:pointer;transition:all .12s;margin-bottom:6px;}
  .ex-row:hover{border-color:rgba(186,255,41,.4);}
  .ex-row.added{border-color:rgba(186,255,41,.5);background:rgba(186,255,41,.04);}
  .eq-badge{font-size:10px;padding:2px 8px;border-radius:5px;background:var(--c3);color:var(--dim);font-weight:600;}
  
  .set-grid{display:grid;grid-template-columns:28px 1fr 1fr 36px;gap:7px;align-items:center;margin-bottom:7px;}
  .set-num{font-family:'Bebas Neue';font-size:20px;color:var(--dim);text-align:center;line-height:1;}
  .set-num.done{color:var(--lime);}
  .set-check{width:34px;height:34px;border-radius:9px;border:1.5px solid var(--bd2);background:none;cursor:pointer;
    display:flex;align-items:center;justify-content:center;transition:all .14s;font-size:16px;color:transparent;}
  .set-check.done{background:var(--lime);border-color:var(--lime);color:#000;animation:pop .25s ease;}
  
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:200;display:flex;align-items:flex-end;animation:fi .18s ease;}
  .sheet{background:var(--c1);border-radius:24px 24px 0 0;border-top:1px solid var(--bd2);width:100%;
    max-height:82vh;overflow-y:auto;padding:8px 16px 44px;animation:si .22s ease;}
  .sheet-handle{width:38px;height:4px;background:var(--bd2);border-radius:2px;margin:10px auto 18px;}
  
  .aw-hdr{background:rgba(8,8,8,.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--bd);
    padding:12px 16px;position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .aw-timer{font-family:'DM Mono',monospace;font-size:24px;color:var(--lime);font-weight:500;letter-spacing:1px;}
  
  .hist-row{padding:14px 16px;background:var(--c1);border:1px solid var(--bd);border-radius:var(--rl);
    margin-bottom:10px;cursor:pointer;transition:border-color .14s;}
  .hist-row:hover{border-color:var(--bd2);}
  .hist-row.open{border-color:rgba(186,255,41,.4);}
  
  .pbar{height:5px;background:var(--c3);border-radius:3px;overflow:hidden;}
  .pbar-f{height:100%;border-radius:3px;transition:width .5s ease;}
  
  .week-chart{display:flex;align-items:flex-end;gap:6px;height:72px;}
  .wc-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;}
  .wc-bar{width:100%;border-radius:4px 4px 0 0;min-height:3px;transition:height .4s ease;}
  .wc-lbl{font-size:9px;color:var(--dim);font-weight:700;text-transform:uppercase;}
  
  .muscle-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px;}
  .muscle-card{padding:14px 10px;background:var(--c2);border:1px solid var(--bd2);border-radius:var(--r);
    text-align:center;cursor:pointer;transition:all .15s;}
  .muscle-card:hover{transform:translateY(-2px);}
  .muscle-card.active{border-color:rgba(186,255,41,.5);background:rgba(186,255,41,.04);}
  
  .pr-badge{display:inline-flex;align-items:center;gap:3px;background:rgba(186,255,41,.1);
    border:1px solid rgba(186,255,41,.25);border-radius:6px;padding:2px 8px;font-size:11px;color:var(--lime);font-weight:700;}
  .empty{text-align:center;padding:52px 20px;color:var(--dim);}
  .empty-ico{font-size:52px;margin-bottom:12px;opacity:.35;display:block;}
  
  .activity-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;}
  .activity-btn{display:flex;flex-direction:column;align-items:center;gap:7px;padding:16px 8px;
    background:var(--c2);border:1.5px solid var(--bd2);border-radius:var(--rl);cursor:pointer;
    transition:all .14s;font-family:'DM Sans';}
  .activity-btn:hover{transform:translateY(-2px);}
  .activity-btn:active{transform:scale(.96);}
  .activity-btn.sel{border-color:rgba(186,255,41,.6);background:rgba(186,255,41,.05);}
  
  .notif{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:var(--lime);color:#000;
    font-weight:700;font-size:13px;padding:10px 20px;border-radius:30px;z-index:999;animation:si .3s ease;
    white-space:nowrap;box-shadow:0 4px 20px rgba(186,255,41,.4);}
`;

const injectCSS = () => {
  if (document.getElementById('forge-css')) return;
  const el = document.createElement('style');
  el.id = 'forge-css';
  el.textContent = CSS;
  document.head.appendChild(el);
};

// ─── DASHBOARD ────────────────────────────────────────────────────
const Dashboard = ({ workouts, onStart }) => {
  const now = new Date();
  const td = todayStr();

  // Streak calc
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const ds = d.toLocaleDateString('en-CA');
    if (workouts.some(w => w.date === ds)) { streak++; d.setDate(d.getDate()-1); }
    else if (i === 0) { d.setDate(d.getDate()-1); } // allow today to be empty
    else break;
  }

  const thisWeek = (() => {
    const start = new Date(now); start.setDate(now.getDate()-now.getDay()); start.setHours(0,0,0,0);
    return workouts.filter(w => new Date(w.date+'T12:00:00') >= start);
  })();

  const todayWk = workouts.filter(w => w.date === td);

  const days = ['S','M','T','W','T','F','S'];
  const weekBars = days.map((lbl, i) => {
    const dd = new Date(now); dd.setDate(now.getDate()-now.getDay()+i);
    const ds = dd.toLocaleDateString('en-CA');
    const cnt = workouts.filter(w => w.date === ds).length;
    return { lbl, cnt, isToday: ds === td };
  });
  const maxCnt = Math.max(1, ...weekBars.map(b => b.cnt));

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="logo">FORGE</div>
          <div style={{fontSize:12,color:'var(--dim)',marginTop:1}}>
            {now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10,color:'var(--dim)',textTransform:'uppercase',letterSpacing:.7,fontWeight:700,marginBottom:4}}>Streak</div>
          <div style={{display:'flex',alignItems:'center',gap:5,justifyContent:'flex-end'}}>
            <span style={{fontSize:22}}>🔥</span>
            <span className="mono" style={{fontSize:26,color:'var(--org)',fontWeight:500}}>{streak}</span>
          </div>
        </div>
      </div>

      <div className="page">
        {/* Stats */}
        <div className="su1" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
          {[
            {l:'Today',v:todayWk.length,s:'sessions'},
            {l:'This Week',v:thisWeek.length,s:'workouts'},
            {l:'All Time',v:workouts.length,s:'sessions'},
          ].map(({l,v,s}) => (
            <div key={l} className="card p14">
              <div className="stat-lbl">{l}</div>
              <div className="stat-val">{v}</div>
              <div className="stat-sub">{s}</div>
            </div>
          ))}
        </div>

        {/* Week chart */}
        <div className="su2 card p16 mb14">
          <div className="row mb14" style={{justifyContent:'space-between'}}>
            <div className="bebas" style={{fontSize:18,letterSpacing:1}}>This Week</div>
            <div style={{fontSize:12,color:'var(--dim)'}}>{thisWeek.length} sessions</div>
          </div>
          <div className="week-chart">
            {weekBars.map(({lbl,cnt,isToday}) => (
              <div key={lbl} className="wc-col">
                <div className="wc-bar" style={{
                  height:`${Math.max(3,(cnt/maxCnt)*58)}px`,
                  background: cnt > 0 ? (isToday ? 'var(--lime)' : 'rgba(186,255,41,.35)') : 'var(--c3)',
                }}/>
                <div className="wc-lbl" style={{color:isToday?'var(--lime)':'var(--dim)'}}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start */}
        <div className="su3 mb16">
          <div className="bebas mb12" style={{fontSize:20,letterSpacing:1}}>Start Workout</div>
          <div style={{display:'flex',gap:8}}>
            {WORKOUT_TYPES.map(wt => (
              <button key={wt.id} className="wt-btn" onClick={onStart}
                style={{border:`1.5px solid ${wt.color}33`}}>
                <span className="wt-icon">{wt.icon}</span>
                <span className="wt-lbl" style={{color:'var(--w)'}}>{wt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="su4">
          <div className="bebas mb12" style={{fontSize:20,letterSpacing:1}}>Recent Workouts</div>
          {workouts.length === 0
            ? <div className="empty"><span className="empty-ico">💪</span><div style={{fontWeight:700,fontSize:15,marginBottom:4}}>No workouts yet</div><div style={{fontSize:13}}>Tap <b style={{color:'var(--lime)'}}>+</b> to start your first session</div></div>
            : workouts.slice(0,5).map(w => <MiniCard key={w.id} w={w} />)
          }
        </div>
      </div>
    </div>
  );
};

const MiniCard = ({ w }) => {
  const wt = WORKOUT_TYPES.find(t => t.id === w.type) || WORKOUT_TYPES[0];
  return (
    <div className="hist-row">
      <div className="row">
        <span style={{fontSize:22}}>{wt.icon}</span>
        <div className="flex1">
          <div style={{fontWeight:600,fontSize:14}}>{w.name}</div>
          <div style={{fontSize:11,color:'var(--dim)',marginTop:1}}>{fmtDate(w.date)}</div>
        </div>
        <div style={{textAlign:'right'}}>
          {w.duration && <div style={{fontFamily:'DM Mono',fontSize:14,fontWeight:500,color:'var(--lime)'}}>{fmtDur(w.duration)}</div>}
          {w.type === 'strength' && w.exercises?.length > 0 &&
            <div style={{fontSize:11,color:'var(--dim)',marginTop:2}}>{w.exercises.length} exercises</div>
          }
        </div>
      </div>
      {w.type === 'strength' && w.exercises?.length > 0 && (
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:8}}>
          {w.exercises.slice(0,4).map(ex => <span key={ex.id} className="eq-badge">{ex.name}</span>)}
          {w.exercises.length > 4 && <span className="eq-badge">+{w.exercises.length-4}</span>}
        </div>
      )}
      {(w.distance || w.calories) && (
        <div style={{display:'flex',gap:12,marginTop:8}}>
          {w.distance && <span style={{fontSize:12,color:'var(--dim)'}}>📏 {w.distance}{w.unit}</span>}
          {w.calories && <span style={{fontSize:12,color:'var(--dim)'}}>🔥 {w.calories} kcal</span>}
        </div>
      )}
    </div>
  );
};

// ─── WORKOUT STARTER ──────────────────────────────────────────────
const WorkoutStarter = ({ onStart, onBack }) => {
  const [type, setType] = useState(null);
  const [name, setName] = useState('');

  const handleStart = () => {
    if (!type) return;
    onStart({
      id: uid(), date: todayStr(), startTime: Date.now(),
      type, name: name.trim() || WORKOUT_TYPES.find(t=>t.id===type)?.label+' Workout',
      exercises: [],
    });
  };

  return (
    <div>
      <div className="topbar">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        <div className="bebas" style={{fontSize:22,letterSpacing:1}}>New Workout</div>
        <div style={{width:70}}/>
      </div>
      <div className="page">
        <div className="su1 mb16">
          <div style={{fontSize:10,color:'var(--dim)',letterSpacing:.8,textTransform:'uppercase',fontWeight:700,marginBottom:10}}>Workout Type</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {WORKOUT_TYPES.map(wt => (
              <button key={wt.id} className={`wt-btn ${type===wt.id?'sel':''}`} onClick={()=>setType(wt.id)}
                style={{border:`1.5px solid ${type===wt.id?wt.color:wt.color+'33'}`,minHeight:110}}>
                <span className="wt-icon">{wt.icon}</span>
                <span className="wt-lbl" style={{color:type===wt.id?wt.color:'var(--w)',fontSize:16}}>{wt.label}</span>
                <span style={{fontSize:11,color:'var(--dim)'}}>
                  {wt.id==='strength'?'Weights & reps':wt.id==='cardio'?'Distance & time':wt.id==='sport'?'Games & matches':'Yoga & mobility'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {type && (
          <div className="su2 gap12">
            <div>
              <div style={{fontSize:10,color:'var(--dim)',letterSpacing:.8,textTransform:'uppercase',fontWeight:700,marginBottom:8}}>Session Name (optional)</div>
              <input className="inp" placeholder={WORKOUT_TYPES.find(t=>t.id===type)?.label+' Workout'} value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <button className="btn btn-lime btn-lg btn-fw" onClick={handleStart}>
              Start Session →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ACTIVE WORKOUT (STRENGTH) ────────────────────────────────────
const ActiveWorkout = ({ workout, setWorkout, onFinish, onDiscard }) => {
  const [elapsed, setElapsed] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [selMuscle, setSelMuscle] = useState('Chest');
  const [exSearch, setExSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [notif, setNotif] = useState('');

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s+1), 1000);
    return () => clearInterval(t);
  }, []);

  const timerFmt = `${pad2(Math.floor(elapsed/60))}:${pad2(elapsed%60)}`;

  const showNotif = msg => { setNotif(msg); setTimeout(() => setNotif(''), 2000); };

  const addExercise = (ex, muscle) => {
    if (workout.exercises.find(e => e.id===ex.id)) { showNotif('Already added!'); return; }
    setWorkout(w => ({...w, exercises:[...w.exercises,{id:ex.id,name:ex.name,muscle,eq:ex.eq,sets:[{id:uid(),weight:'',reps:'',done:false}]}]}));
    showNotif(`${ex.name} added ✓`);
    setShowPicker(false);
  };

  const addSet = exId => setWorkout(w => ({...w, exercises:w.exercises.map(e=>e.id===exId?{...e,sets:[...e.sets,{id:uid(),weight:e.sets.at(-1)?.weight||'',reps:e.sets.at(-1)?.reps||'',done:false}]}:e)}));
  const removeSet = (exId,setId) => setWorkout(w => ({...w, exercises:w.exercises.map(e=>e.id===exId?{...e,sets:e.sets.filter(s=>s.id!==setId)}:e)}));
  const updateSet = (exId,setId,field,val) => setWorkout(w => ({...w, exercises:w.exercises.map(e=>e.id===exId?{...e,sets:e.sets.map(s=>s.id===setId?{...s,[field]:val}:s)}:e)}));
  const toggleSet = (exId,setId) => setWorkout(w => ({...w, exercises:w.exercises.map(e=>e.id===exId?{...e,sets:e.sets.map(s=>s.id===setId?{...s,done:!s.done}:s)}:e)}));
  const removeEx = exId => setWorkout(w => ({...w, exercises:w.exercises.filter(e=>e.id!==exId)}));

  const handleFinish = () => {
    onFinish({...workout,duration:Math.round(elapsed/60),volume:calcVol(workout.exercises),totalSets:calcDone(workout.exercises),notes});
  };

  // Exercise picker data
  const pickerExercises = exSearch
    ? MUSCLES.flatMap(m=>(EXERCISES[m]||[]).filter(e=>e.name.toLowerCase().includes(exSearch.toLowerCase())).map(e=>({...e,muscle:m})))
    : (EXERCISES[selMuscle]||[]).map(e=>({...e,muscle:selMuscle}));

  const isNonStrength = workout.type !== 'strength';
  if (isNonStrength) {
    return <NonStrengthWorkout workout={workout} elapsed={elapsed} timerFmt={timerFmt} onFinish={onFinish} onDiscard={onDiscard}/>;
  }

  return (
    <div>
      {notif && <div className="notif">{notif}</div>}

      {/* Sticky Header */}
      <div className="aw-hdr">
        <button className="btn btn-danger btn-sm" onClick={onDiscard}>✕ Discard</button>
        <div style={{textAlign:'center'}}>
          <div className="aw-timer">{timerFmt}</div>
          <div style={{fontSize:10,color:'var(--dim)',marginTop:1,letterSpacing:.3}}>{workout.name}</div>
        </div>
        <button className="btn btn-lime btn-sm" onClick={()=>setShowConfirm(true)}>Finish ✓</button>
      </div>

      <div className="page" style={{paddingTop:14}}>
        {/* Live Stats */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
          {[
            {l:'Exercises',v:workout.exercises.length},
            {l:'Sets Done',v:calcDone(workout.exercises)},
            {l:'Volume kg',v:calcVol(workout.exercises).toLocaleString()},
          ].map(({l,v})=>(
            <div key={l} className="card p14" style={{textAlign:'center'}}>
              <div className="stat-lbl">{l}</div>
              <div className="mono" style={{fontSize:20,fontWeight:500}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Exercise Cards */}
        {workout.exercises.length === 0 && (
          <div className="empty" style={{paddingTop:32}}>
            <span className="empty-ico">🏋️</span>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>No exercises yet</div>
            <div style={{fontSize:13}}>Tap "Add Exercise" to get started</div>
          </div>
        )}

        {workout.exercises.map((ex) => (
          <div key={ex.id} className="card p16 mb12">
            <div className="row mb12">
              <div className="flex1">
                <div style={{fontWeight:700,fontSize:15}}>{ex.name}</div>
                <div style={{display:'flex',gap:6,marginTop:4}}>
                  <span className="eq-badge" style={{background:`${MUSCLE_CLR[ex.muscle]}22`,color:MUSCLE_CLR[ex.muscle]}}>{ex.muscle}</span>
                  <span className="eq-badge">{ex.eq}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{padding:'5px 9px',borderRadius:8,fontSize:14}} onClick={()=>removeEx(ex.id)}>✕</button>
            </div>

            {/* Column headers */}
            <div className="set-grid" style={{marginBottom:4}}>
              <div style={{fontSize:9,color:'var(--dim)',textAlign:'center',fontWeight:700,letterSpacing:.7}}>SET</div>
              <div style={{fontSize:9,color:'var(--dim)',textAlign:'center',fontWeight:700,letterSpacing:.7}}>KG</div>
              <div style={{fontSize:9,color:'var(--dim)',textAlign:'center',fontWeight:700,letterSpacing:.7}}>REPS</div>
              <div/>
            </div>

            {ex.sets.map((set,si)=>(
              <div key={set.id} className="set-grid">
                <div className={`set-num ${set.done?'done':''}`}>{si+1}</div>
                <input className="inp inp-num" type="number" min="0" step="0.5" placeholder="—"
                  value={set.weight} onChange={e=>updateSet(ex.id,set.id,'weight',e.target.value)}/>
                <input className="inp inp-num" type="number" min="0" placeholder="—"
                  value={set.reps} onChange={e=>updateSet(ex.id,set.id,'reps',e.target.value)}/>
                <button className={`set-check ${set.done?'done':''}`} onClick={()=>toggleSet(ex.id,set.id)}>✓</button>
              </div>
            ))}

            <div style={{display:'flex',gap:8,marginTop:8}}>
              <button className="btn btn-dark btn-sm flex1" onClick={()=>addSet(ex.id)}>+ Add Set</button>
              {ex.sets.length > 1 && (
                <button className="btn btn-ghost btn-sm" onClick={()=>removeSet(ex.id,ex.sets.at(-1).id)}>Remove</button>
              )}
            </div>
          </div>
        ))}

        <button className="btn btn-lime btn-fw btn-lg mb12" style={{marginTop:4}} onClick={()=>{setExSearch('');setShowPicker(true);}}>
          + Add Exercise
        </button>

        <textarea className="inp mb16" rows={3} placeholder="Session notes (optional)..." value={notes} onChange={e=>setNotes(e.target.value)}/>
      </div>

      {/* Exercise Picker Sheet */}
      {showPicker && (
        <div className="overlay" onClick={()=>setShowPicker(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="bebas mb12" style={{fontSize:24,letterSpacing:1}}>Add Exercise</div>
            <input className="inp mb12" placeholder="Search all exercises..." value={exSearch}
              onChange={e=>{setExSearch(e.target.value);}}/>
            {!exSearch && (
              <div className="scroll-x mb12">
                {MUSCLES.map(m=>(
                  <button key={m} className="pill" onClick={()=>setSelMuscle(m)}
                    style={{background:selMuscle===m?MUSCLE_CLR[m]:'transparent',borderColor:MUSCLE_CLR[m],
                      color:selMuscle===m?'#000':MUSCLE_CLR[m]}}>
                    {m}
                  </button>
                ))}
              </div>
            )}
            <div>
              {pickerExercises.map(ex=>{
                const added = workout.exercises.some(e=>e.id===ex.id);
                return (
                  <div key={ex.id+(ex.muscle||'')} className={`ex-row ${added?'added':''}`}
                    onClick={()=>!added&&addExercise(ex,ex.muscle||selMuscle)}>
                    <div>
                      <div style={{fontWeight:500,fontSize:14}}>{ex.name}</div>
                      {exSearch && <div style={{fontSize:11,color:'var(--dim)',marginTop:2}}>{ex.muscle}</div>}
                    </div>
                    <div style={{display:'flex',gap:6,alignItems:'center'}}>
                      <span className="eq-badge">{ex.eq}</span>
                      <span style={{fontSize:16,color:added?'var(--lime)':'var(--dim)'}}>{added?'✓':'+'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Finish */}
      {showConfirm && (
        <div className="overlay" onClick={()=>setShowConfirm(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="bebas mb8" style={{fontSize:26,letterSpacing:1}}>Finish Workout?</div>
            <div style={{fontSize:13,color:'var(--dim)',marginBottom:20,lineHeight:1.6}}>
              ⏱ {timerFmt} · 💪 {workout.exercises.length} exercises · ✓ {calcDone(workout.exercises)} sets done<br/>
              📦 Total volume: <b style={{color:'var(--w)'}}>{calcVol(workout.exercises).toLocaleString()} kg</b>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-ghost btn-fw" onClick={()=>setShowConfirm(false)}>Keep Going</button>
              <button className="btn btn-lime btn-fw btn-lg" onClick={handleFinish}>💾 Save Workout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── NON-STRENGTH WORKOUT ─────────────────────────────────────────
const NonStrengthWorkout = ({ workout, elapsed, timerFmt, onFinish, onDiscard }) => {
  const [selActivity, setSelActivity] = useState(null);
  const [form, setForm] = useState({distance:'',calories:'',heartRate:'',score:'',rounds:'',notes:''});
  const [showConfirm, setShowConfirm] = useState(false);

  const lists = {cardio:CARDIO_LIST, sport:SPORT_LIST, flexibility:FLEX_LIST};
  const list = lists[workout.type] || [];
  const clrMap = {cardio:'#FF6B6B',sport:'#4ECDC4',flexibility:'#FFD93D'};
  const clr = clrMap[workout.type] || 'var(--lime)';
  const upd = f => setForm(p=>({...p,...f}));

  const handleFinish = () => {
    onFinish({
      ...workout, duration:Math.round(elapsed/60),
      activityName:selActivity?.name||workout.name, activityIcon:selActivity?.icon||'',
      distance:form.distance?parseFloat(form.distance):null, unit:selActivity?.unit||null,
      calories:form.calories?parseInt(form.calories):null, heartRate:form.heartRate?parseInt(form.heartRate):null,
      score:form.score||null, rounds:form.rounds||null, notes:form.notes,
    });
  };

  return (
    <div>
      <div className="aw-hdr">
        <button className="btn btn-danger btn-sm" onClick={onDiscard}>✕ Discard</button>
        <div style={{textAlign:'center'}}>
          <div className="aw-timer" style={{color:clr}}>{timerFmt}</div>
          <div style={{fontSize:10,color:'var(--dim)',marginTop:1}}>{workout.name}</div>
        </div>
        <button className="btn btn-sm" style={{background:clr,color:'#000',fontWeight:700}} onClick={()=>setShowConfirm(true)}>Finish ✓</button>
      </div>

      <div className="page" style={{paddingTop:16}}>
        {!selActivity ? (
          <div className="fi">
            <div className="bebas mb12" style={{fontSize:20,letterSpacing:1}}>
              Select {workout.type==='cardio'?'Cardio Activity':workout.type==='sport'?'Sport / Game':'Activity'}
            </div>
            <div className="activity-grid">
              {list.map(item=>(
                <button key={item.id} className="activity-btn" onClick={()=>setSelActivity(item)}
                  style={{borderColor:`${clr}33`}}>
                  <span style={{fontSize:30}}>{item.icon}</span>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--w)',textAlign:'center',lineHeight:1.3}}>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="si">
            <div className="card p16 mb14">
              <div className="row mb14">
                <span style={{fontSize:36}}>{selActivity.icon}</span>
                <div className="flex1">
                  <div style={{fontWeight:700,fontSize:17}}>{selActivity.name}</div>
                  <button style={{fontSize:12,color:clr,background:'none',border:'none',cursor:'pointer',padding:0,marginTop:3}}
                    onClick={()=>setSelActivity(null)}>↩ Change</button>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="mono" style={{fontSize:22,color:clr}}>{timerFmt}</div>
                  <div style={{fontSize:10,color:'var(--dim)'}}>elapsed</div>
                </div>
              </div>

              <div className="div"/>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {selActivity.hasDistance && (
                  <div>
                    <div style={{fontSize:10,color:'var(--dim)',fontWeight:700,textTransform:'uppercase',letterSpacing:.7,marginBottom:7}}>Distance ({selActivity.unit})</div>
                    <input className="inp inp-num" type="number" step="0.01" placeholder="0.00" value={form.distance} onChange={e=>upd({distance:e.target.value})}/>
                  </div>
                )}
                <div>
                  <div style={{fontSize:10,color:'var(--dim)',fontWeight:700,textTransform:'uppercase',letterSpacing:.7,marginBottom:7}}>Calories</div>
                  <input className="inp inp-num" type="number" placeholder="0" value={form.calories} onChange={e=>upd({calories:e.target.value})}/>
                </div>
                <div>
                  <div style={{fontSize:10,color:'var(--dim)',fontWeight:700,textTransform:'uppercase',letterSpacing:.7,marginBottom:7}}>Avg HR (bpm)</div>
                  <input className="inp inp-num" type="number" placeholder="0" value={form.heartRate} onChange={e=>upd({heartRate:e.target.value})}/>
                </div>
                {workout.type==='sport' && (
                  <div>
                    <div style={{fontSize:10,color:'var(--dim)',fontWeight:700,textTransform:'uppercase',letterSpacing:.7,marginBottom:7}}>Score</div>
                    <input className="inp" placeholder="e.g. 3-1" value={form.score} onChange={e=>upd({score:e.target.value})}/>
                  </div>
                )}
                {workout.type==='cardio' && workout.type!=='sport' && (
                  <div>
                    <div style={{fontSize:10,color:'var(--dim)',fontWeight:700,textTransform:'uppercase',letterSpacing:.7,marginBottom:7}}>Rounds</div>
                    <input className="inp inp-num" type="number" placeholder="0" value={form.rounds} onChange={e=>upd({rounds:e.target.value})}/>
                  </div>
                )}
              </div>
            </div>

            <textarea className="inp mb16" rows={3} placeholder="Session notes..."
              value={form.notes} onChange={e=>upd({notes:e.target.value})}/>

            <button className="btn btn-fw btn-lg" style={{background:clr,color:'#000',fontWeight:700}}
              onClick={()=>setShowConfirm(true)}>Finish & Save Session</button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="overlay" onClick={()=>setShowConfirm(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="bebas mb8" style={{fontSize:26,letterSpacing:1}}>Finish Workout?</div>
            <div style={{fontSize:13,color:'var(--dim)',marginBottom:20}}>
              {selActivity?.icon} {selActivity?.name||workout.name} · ⏱ {timerFmt}
            </div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-ghost btn-fw" onClick={()=>setShowConfirm(false)}>Keep Going</button>
              <button className="btn btn-fw btn-lg" style={{background:clr,color:'#000',fontWeight:700}} onClick={handleFinish}>💾 Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── HISTORY ──────────────────────────────────────────────────────
const History = ({ workouts, setWorkouts }) => {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('all');
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = filter==='all' ? workouts : workouts.filter(w=>w.type===filter);

  return (
    <div>
      <div className="topbar">
        <div className="bebas" style={{fontSize:28,letterSpacing:2}}>History</div>
        <div style={{fontSize:12,color:'var(--dim)'}}>{workouts.length} workouts</div>
      </div>
      <div className="page">
        <div className="scroll-x mb14">
          {[['all','All 🗂'], ...WORKOUT_TYPES.map(t=>[t.id,`${t.icon} ${t.label}`])].map(([id,lbl])=>(
            <button key={id} className="pill" onClick={()=>setFilter(id)}
              style={{background:filter===id?'var(--lime)':'transparent',borderColor:filter===id?'var(--lime)':'var(--bd2)',color:filter===id?'#000':'var(--dim)'}}>
              {lbl}
            </button>
          ))}
        </div>

        {filtered.length===0
          ? <div className="empty"><span className="empty-ico">📋</span><div style={{fontWeight:700}}>No workouts here</div></div>
          : filtered.map(w=>{
            const wt = WORKOUT_TYPES.find(t=>t.id===w.type)||WORKOUT_TYPES[0];
            const isOpen = open===w.id;
            return (
              <div key={w.id} className={`hist-row ${isOpen?'open':''}`}>
                <div className="row" onClick={()=>setOpen(o=>o===w.id?null:w.id)} style={{cursor:'pointer'}}>
                  <span style={{fontSize:22}}>{wt.icon}</span>
                  <div className="flex1">
                    <div style={{fontWeight:700,fontSize:14}}>{w.name}</div>
                    <div style={{fontSize:11,color:'var(--dim)',marginTop:1}}>{fmtDate(w.date)}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    {w.duration && <div className="mono" style={{fontSize:14,fontWeight:500,color:'var(--lime)'}}>{fmtDur(w.duration)}</div>}
                    <div style={{fontSize:9,color:'var(--dim)',marginTop:2,letterSpacing:.5}}>{isOpen?'▲ LESS':'▼ MORE'}</div>
                  </div>
                </div>

                {isOpen && (
                  <div className="si" style={{borderTop:'1px solid var(--bd)',paddingTop:12,marginTop:10}}>
                    {/* Strength detail */}
                    {w.type==='strength' && w.exercises?.length>0 && (
                      <>
                        <div style={{display:'flex',gap:16,marginBottom:12}}>
                          <span style={{fontSize:12,color:'var(--dim)'}}>Volume: <b style={{color:'var(--w)'}}>{(w.volume||0).toLocaleString()} kg</b></span>
                          <span style={{fontSize:12,color:'var(--dim)'}}>Sets: <b style={{color:'var(--w)'}}>{w.totalSets||0} done</b></span>
                        </div>
                        {w.exercises.map(ex=>(
                          <div key={ex.id} style={{marginBottom:10}}>
                            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                              <div style={{width:7,height:7,borderRadius:'50%',background:MUSCLE_CLR[ex.muscle]||'var(--dim)',flexShrink:0}}/>
                              <span style={{fontWeight:700,fontSize:13}}>{ex.name}</span>
                              <span className="eq-badge">{ex.eq}</span>
                            </div>
                            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                              {ex.sets.map((s,si)=>(
                                <div key={s.id} style={{fontSize:11,padding:'3px 9px',borderRadius:6,
                                  background:s.done?'rgba(186,255,41,.12)':'var(--c3)',
                                  color:s.done?'var(--lime)':'var(--dim)',border:`1px solid ${s.done?'rgba(186,255,41,.3)':'var(--bd2)'}`}}>
                                  {si+1}: {s.weight||'—'}kg × {s.reps||'—'}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Non-strength detail */}
                    {w.type!=='strength' && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:10}}>
                        {w.activityName && <span style={{fontSize:13}}>{w.activityIcon} {w.activityName}</span>}
                        {w.distance && <span style={{fontSize:13,color:'var(--dim)'}}>📏 {w.distance} {w.unit}</span>}
                        {w.calories && <span style={{fontSize:13,color:'var(--dim)'}}>🔥 {w.calories} kcal</span>}
                        {w.heartRate && <span style={{fontSize:13,color:'var(--dim)'}}>❤️ {w.heartRate} bpm avg</span>}
                        {w.score && <span style={{fontSize:13,color:'var(--dim)'}}>🏆 Score: {w.score}</span>}
                      </div>
                    )}

                    {w.notes && <div style={{fontSize:12,color:'var(--dim)',fontStyle:'italic',padding:'8px 12px',background:'var(--c2)',borderRadius:'var(--r)',marginBottom:10}}>"{w.notes}"</div>}

                    <button className="btn btn-danger btn-sm" onClick={()=>setConfirmDel(w.id)}>🗑 Delete</button>
                  </div>
                )}
              </div>
            );
          })
        }
      </div>

      {confirmDel && (
        <div className="overlay" onClick={()=>setConfirmDel(null)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="bebas mb8" style={{fontSize:24}}>Delete Workout?</div>
            <div style={{fontSize:13,color:'var(--dim)',marginBottom:20}}>This cannot be undone.</div>
            <div style={{display:'flex',gap:10}}>
              <button className="btn btn-ghost btn-fw" onClick={()=>setConfirmDel(null)}>Cancel</button>
              <button className="btn btn-danger btn-fw" onClick={()=>{setWorkouts(ws=>ws.filter(x=>x.id!==confirmDel));setOpen(null);setConfirmDel(null);}}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── EXERCISE LIBRARY ─────────────────────────────────────────────
const ExerciseLib = () => {
  const [selMuscle, setSelMuscle] = useState(null);
  const [search, setSearch] = useState('');

  const allEx = MUSCLES.flatMap(m=>(EXERCISES[m]||[]).map(e=>({...e,muscle:m})));
  const displayed = search
    ? allEx.filter(e=>e.name.toLowerCase().includes(search.toLowerCase())||e.muscle.toLowerCase().includes(search.toLowerCase())||e.eq.toLowerCase().includes(search.toLowerCase()))
    : selMuscle ? (EXERCISES[selMuscle]||[]).map(e=>({...e,muscle:selMuscle})) : null;

  return (
    <div>
      <div className="topbar">
        <div className="bebas" style={{fontSize:28,letterSpacing:2}}>Exercises</div>
        <div style={{fontSize:12,color:'var(--dim)'}}>{allEx.length} exercises</div>
      </div>
      <div className="page">
        <input className="inp mb14" placeholder="🔍 Search exercises, muscles, equipment..."
          value={search} onChange={e=>{setSearch(e.target.value);setSelMuscle(null);}}/>

        {!search && !selMuscle && (
          <div className="fi">
            <div className="bebas mb12" style={{fontSize:18,letterSpacing:1}}>Muscle Groups</div>
            <div className="muscle-grid">
              {MUSCLES.map(m=>(
                <div key={m} className="muscle-card" onClick={()=>setSelMuscle(m)}
                  style={{border:`1px solid ${MUSCLE_CLR[m]}44`}}>
                  <div style={{width:12,height:12,borderRadius:'50%',background:MUSCLE_CLR[m],margin:'0 auto 8px'}}/>
                  <div style={{fontSize:12,fontWeight:700}}>{m}</div>
                  <div style={{fontSize:10,color:'var(--dim)',marginTop:3}}>{(EXERCISES[m]||[]).length} exercises</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selMuscle && !search && (
          <div className="row mb14">
            <button className="btn btn-ghost btn-sm" onClick={()=>setSelMuscle(null)}>← All Groups</button>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:10,height:10,borderRadius:'50%',background:MUSCLE_CLR[selMuscle]}}/>
              <div className="bebas" style={{fontSize:20,letterSpacing:1}}>{selMuscle}</div>
            </div>
          </div>
        )}

        {displayed && (
          <div className="fi">
            {displayed.length===0
              ? <div className="empty"><span className="empty-ico">🔍</span><div>No results for "{search}"</div></div>
              : displayed.map(ex=>(
                <div key={ex.id+(ex.muscle||'')} className="ex-row" style={{cursor:'default'}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{ex.name}</div>
                    {(search||!selMuscle) && (
                      <div style={{display:'flex',alignItems:'center',gap:5,marginTop:3}}>
                        <div style={{width:6,height:6,borderRadius:'50%',background:MUSCLE_CLR[ex.muscle]}}/>
                        <span style={{fontSize:11,color:'var(--dim)'}}>{ex.muscle}</span>
                      </div>
                    )}
                  </div>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    <span className="eq-badge" style={{fontSize:11,padding:'3px 9px'}}>{ex.eq}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PROGRESS ─────────────────────────────────────────────────────
const Progress = ({ workouts }) => {
  const [bwInput, setBwInput] = useState('');
  const [bwLog, setBwLog] = useState([]);
  const [bwLoaded, setBwLoaded] = useState(false);

  useEffect(() => {
    (async()=>{ const d=await store.load('forge_bw_v2'); setBwLog(Array.isArray(d)?d:[]); setBwLoaded(true); })();
  },[]);
  const saveBW = async log => { await store.save('forge_bw_v2',log); };

  const addBW = () => {
    if (!bwInput) return;
    const entry = {date:todayStr(),weight:parseFloat(bwInput),id:uid()};
    const next = [entry,...bwLog].slice(0,60);
    setBwLog(next); saveBW(next); setBwInput('');
  };

  // PRs
  const getPR = exId => {
    let pr = null;
    workouts.filter(w=>w.type==='strength').forEach(w=>{
      (w.exercises||[]).filter(e=>e.id===exId).forEach(ex=>{
        ex.sets.forEach(s=>{
          const w2 = parseFloat(s.weight)||0;
          if (w2>0 && (!pr || w2>pr.weight)) pr={weight:w2,reps:parseInt(s.reps)||0,date:w.date};
        });
      });
    });
    return pr;
  };

  const keyLifts = [
    {id:'bench',name:'Bench Press',icon:'🏋️'},
    {id:'deadlift',name:'Deadlift',icon:'💀'},
    {id:'squat',name:'Squat',icon:'🦵'},
    {id:'ohp',name:'OHP',icon:'💪'},
    {id:'barbell_curl',name:'Barbell Curl',icon:'💪'},
    {id:'brow',name:'Barbell Row',icon:'🔄'},
  ];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(),now.getMonth(),1);
  const thisMonth = workouts.filter(w=>new Date(w.date+'T12:00:00')>=monthStart);
  const strengthMonth = thisMonth.filter(w=>w.type==='strength');
  const cardioMonth = thisMonth.filter(w=>w.type==='cardio');
  const sportMonth = thisMonth.filter(w=>w.type==='sport');

  const totalVol = strengthMonth.reduce((t,w)=>t+(w.volume||0),0);
  const totalCardioTime = cardioMonth.reduce((t,w)=>t+(w.duration||0),0);

  // Volume trend (last 8 strength workouts)
  const volTrend = workouts.filter(w=>w.type==='strength').slice(0,8).reverse();
  const maxVol = Math.max(1,...volTrend.map(w=>w.volume||0));

  return (
    <div>
      <div className="topbar">
        <div className="bebas" style={{fontSize:28,letterSpacing:2}}>Progress</div>
        <div style={{fontSize:12,color:'var(--dim)'}}>{now.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</div>
      </div>
      <div className="page">
        {/* This month */}
        <div className="su1 card p16 mb14">
          <div className="bebas mb14" style={{fontSize:18,letterSpacing:1}}>📅 This Month</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            {[
              {l:'Total Sessions',v:thisMonth.length,clr:'var(--lime)'},
              {l:'Total Volume',v:totalVol>0?`${(totalVol/1000).toFixed(1)}t`:'—',clr:'var(--blue)'},
              {l:'Cardio Time',v:totalCardioTime>0?fmtDur(totalCardioTime):'—',clr:'#FF6B6B'},
              {l:'Sports Games',v:sportMonth.length,clr:'#4ECDC4'},
            ].map(({l,v,clr})=>(
              <div key={l} className="card2" style={{padding:12,textAlign:'center',border:`1px solid ${clr}22`}}>
                <div className="stat-lbl">{l}</div>
                <div className="mono" style={{fontSize:22,fontWeight:500,color:clr,marginTop:3}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Type bars */}
          {WORKOUT_TYPES.map(wt=>{
            const cnt = workouts.filter(w=>w.type===wt.id).length;
            const pct = workouts.length>0?(cnt/workouts.length)*100:0;
            return (
              <div key={wt.id} style={{marginBottom:10}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                  <span>{wt.icon} {wt.label}</span>
                  <span style={{color:'var(--dim)'}}>{cnt} sessions ({Math.round(pct)}%)</span>
                </div>
                <div className="pbar"><div className="pbar-f" style={{width:`${pct}%`,background:wt.color}}/></div>
              </div>
            );
          })}
        </div>

        {/* Volume trend */}
        {volTrend.length>0 && (
          <div className="su2 card p16 mb14">
            <div className="bebas mb14" style={{fontSize:18,letterSpacing:1}}>📈 Volume Trend</div>
            <div className="week-chart" style={{height:80}}>
              {volTrend.map((w,i)=>(
                <div key={w.id} className="wc-col">
                  <div className="wc-bar" style={{height:`${Math.max(4,((w.volume||0)/maxVol)*68)}px`,background:`rgba(186,255,41,${0.25+((w.volume||0)/maxVol)*0.75})`}}/>
                  <div className="wc-lbl" style={{fontSize:8}}>{w.date.slice(5)}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8,fontSize:11,color:'var(--dim)',textAlign:'right'}}>Last {volTrend.length} strength sessions</div>
          </div>
        )}

        {/* PRs */}
        <div className="su3 card p16 mb14">
          <div className="bebas mb14" style={{fontSize:18,letterSpacing:1}}>🏆 Personal Records</div>
          {keyLifts.map(lift=>{
            const pr = getPR(lift.id);
            return (
              <div key={lift.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid var(--bd)'}}>
                <div style={{fontSize:14,fontWeight:600}}>{lift.icon} {lift.name}</div>
                {pr
                  ? <div style={{textAlign:'right'}}>
                      <span className="pr-badge">🏆 {pr.weight}kg × {pr.reps} reps</span>
                      <div style={{fontSize:10,color:'var(--dim)',marginTop:3}}>{fmtDate(pr.date)}</div>
                    </div>
                  : <span style={{fontSize:12,color:'var(--dim)'}}>No data yet</span>
                }
              </div>
            );
          })}
        </div>

        {/* Body Weight Tracker */}
        <div className="su4 card p16 mb14">
          <div className="bebas mb14" style={{fontSize:18,letterSpacing:1}}>⚖️ Body Weight</div>
          <div style={{display:'flex',gap:8,marginBottom:14}}>
            <input className="inp inp-num flex1" type="number" step="0.1" placeholder="e.g. 75.5" value={bwInput} onChange={e=>setBwInput(e.target.value)}
              style={{textAlign:'left',paddingLeft:14}}/>
            <span style={{display:'flex',alignItems:'center',color:'var(--dim)',fontSize:13,minWidth:24}}>kg</span>
            <button className="btn btn-lime btn-sm" onClick={addBW} style={{flexShrink:0}}>Log</button>
          </div>
          {bwLog.length>0 ? (
            <div style={{maxHeight:200,overflowY:'auto'}}>
              {bwLog.slice(0,15).map((entry,i)=>(
                <div key={entry.id} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid var(--bd)',fontSize:13}}>
                  <span style={{color:'var(--dim)'}}>{fmtDate(entry.date)}</span>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    {i>0 && bwLog[i-1] && (
                      <span style={{fontSize:11,color:entry.weight<bwLog[i-1].weight?'var(--grn)':entry.weight>bwLog[i-1].weight?'var(--red)':'var(--dim)'}}>
                        {entry.weight<bwLog[i-1].weight?'↓':entry.weight>bwLog[i-1].weight?'↑':'→'} {Math.abs(entry.weight-bwLog[i-1].weight).toFixed(1)}
                      </span>
                    )}
                    <span className="mono" style={{fontWeight:500}}>{entry.weight} <span style={{color:'var(--dim)',fontSize:11}}>kg</span></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'20px 0',color:'var(--dim)',fontSize:13}}>Log your weight to track changes</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── BOTTOM NAV ───────────────────────────────────────────────────
const BottomNav = ({ screen, setScreen, onAdd }) => (
  <div className="bnav">
    {[{id:'home',ico:'🏠',lbl:'Home'},{id:'history',ico:'📋',lbl:'History'}].map(({id,ico,lbl})=>(
      <button key={id} className={`bni ${screen===id?'on':''}`} onClick={()=>setScreen(id)}>
        <span className="ico">{ico}</span>
        <span className="lbl">{lbl}</span>
      </button>
    ))}
    <button className="bnav-add" onClick={onAdd} title="Start Workout">+</button>
    {[{id:'exercises',ico:'📚',lbl:'Library'},{id:'progress',ico:'📊',lbl:'Progress'}].map(({id,ico,lbl})=>(
      <button key={id} className={`bni ${screen===id?'on':''}`} onClick={()=>setScreen(id)}>
        <span className="ico">{ico}</span>
        <span className="lbl">{lbl}</span>
      </button>
    ))}
  </div>
);

// ─── ROOT APP ─────────────────────────────────────────────────────
export default function App() {
  injectCSS();
  const [screen, setScreen] = useState('home');
  const [workouts, setWorkouts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [showStarter, setShowStarter] = useState(false);

  useEffect(() => {
    (async () => {
      const w = await store.load(WK_KEY);
      setWorkouts(Array.isArray(w)?w:[]);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) store.save(WK_KEY, workouts);
  }, [workouts, loaded]);

  const finishWorkout = useCallback((workout) => {
    setWorkouts(prev => [workout, ...prev]);
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
      <div style={{background:'#080808',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
        <div style={{fontFamily:'Bebas Neue',fontSize:52,letterSpacing:5,color:'#BAFF29',textShadow:'0 0 40px rgba(186,255,41,.4)'}}>FORGE</div>
        <div style={{fontSize:11,color:'#3A3A3A',letterSpacing:2,textTransform:'uppercase'}}>Loading your gym...</div>
      </div>
    );
  }

  // Active workout takes full screen
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

  // Workout type selector
  if (showStarter) {
    return (
      <div className="app">
        <WorkoutStarter
          onStart={wk => { setActiveWorkout(wk); setShowStarter(false); }}
          onBack={() => setShowStarter(false)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen==='home'     && <Dashboard workouts={workouts} onStart={()=>setShowStarter(true)}/>}
      {screen==='history'  && <History workouts={workouts} setWorkouts={setWorkouts}/>}
      {screen==='exercises'&& <ExerciseLib/>}
      {screen==='progress' && <Progress workouts={workouts}/>}
      <BottomNav screen={screen} setScreen={setScreen} onAdd={()=>setShowStarter(true)}/>
    </div>
  );
}