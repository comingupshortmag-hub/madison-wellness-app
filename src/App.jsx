import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

/*
 * Madison's Wellness App
 * 
 * For best experience, add to home screen on mobile.
 * 
 * If embedding in HTML, include this meta tag:
 * <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
 * <meta name="apple-mobile-web-app-capable" content="yes">
 * <meta name="apple-mobile-web-app-status-bar-style" content="default">
 * <meta name="theme-color" content="#FFFFFF">
 */

// Gentle, encouraging prompts for the nourish check-in
const nourishPrompts = [
  "What's something that made your body feel good today?",
  "How did you take care of yourself today?",
  "What's one kind thing you did for yourself?",
  "What moment today made you smile?",
  "What's something you're grateful your body let you do today?",
  "How did you show yourself love today?",
  "What's one thing that nourished you — body or soul?",
  "What made you feel strong today?",
  "What's something gentle you did for yourself?",
  "How did you honor what your body needed today?"
];

// Body gratitude prompts
const bodyGratitudePrompts = [
  "What did your body do for you this week that you're grateful for?",
  "How did your body show up for you recently?",
  "What's something your body allowed you to experience this week?",
  "What's one way your body took care of you lately?",
  "What movement or sensation reminded you your body is on your side?",
  "How did your body help you connect with someone you love?",
  "What's something your body healed from or adapted to recently?",
  "What did your hands, arms, or legs help you accomplish?",
  "What's a small thing your body does automatically that you're thankful for?",
  "How did your body carry you through a hard moment?"
];

// Daily affirmations to choose from
const affirmationOptions = [
  "I am more than a number on a scale.",
  "My body deserves nourishment and care.",
  "I am getting stronger every day.",
  "I trust my body's signals.",
  "I am worthy of taking up space.",
  "Food is fuel and joy, not the enemy.",
  "I am healing, even when it doesn't feel like it.",
  "My worth is not measured by what I eat.",
  "I choose progress over perfection.",
  "I am proud of how far I've come.",
  "I deserve to feel good in my body.",
  "Recovery is not linear, and that's okay.",
  "I am learning to be kind to myself.",
  "My body is my home, and I will treat it gently.",
  "I release the need to control everything.",
  "I am allowed to enjoy food without guilt.",
  "Strength looks different every day.",
  "I honor my hunger and my fullness.",
  "I am becoming the person I want to be.",
  "Today I choose compassion over criticism.",
  "My muscles are growing and so am I.",
  "I let go of what no longer serves me.",
  "I am resilient and brave.",
  "Nourishing myself is an act of self-love.",
  "I celebrate small victories.",
  "I am patient with my journey.",
  "My body is capable of amazing things.",
  "I deserve rest and recovery.",
  "I am not defined by my past struggles.",
  "Today, I will be gentle with myself."
];

// Positive nutrition facts focused on whole foods and nutrients
const nutritionFacts = [
  { food: "Sweet potatoes", fact: "are packed with vitamin A and support your immune system", emoji: "🍠" },
  { food: "Salmon", fact: "is rich in omega-3s which support brain health and mood", emoji: "🐟" },
  { food: "Spinach", fact: "is loaded with iron and helps your muscles recover", emoji: "🥬" },
  { food: "Blueberries", fact: "are full of antioxidants that protect your cells", emoji: "🫐" },
  { food: "Avocados", fact: "contain healthy fats that help your body absorb vitamins", emoji: "🥑" },
  { food: "Eggs", fact: "provide complete protein with all essential amino acids", emoji: "🥚" },
  { food: "Almonds", fact: "are a great source of vitamin E and magnesium", emoji: "🌰" },
  { food: "Greek yogurt", fact: "supports gut health with probiotics and protein", emoji: "🥛" },
  { food: "Bananas", fact: "are rich in potassium which helps your muscles function", emoji: "🍌" },
  { food: "Quinoa", fact: "is a complete protein and fuels sustained energy", emoji: "🌾" },
  { food: "Dark chocolate", fact: "contains antioxidants and can boost your mood", emoji: "🍫" },
  { food: "Oranges", fact: "are bursting with vitamin C for immune support", emoji: "🍊" },
  { food: "Chickpeas", fact: "provide fiber and plant protein to keep you satisfied", emoji: "🫘" },
  { food: "Broccoli", fact: "is packed with vitamins C and K for bone health", emoji: "🥦" },
  { food: "Oats", fact: "give you steady energy and support heart health", emoji: "🥣" }
];

// Grounding exercise steps
const groundingExercise = {
  title: "5-4-3-2-1 Grounding",
  intro: "Take a slow breath. Let's come back to the present moment together.",
  steps: [
    { count: 5, sense: "SEE", prompt: "Name 5 things you can see right now.", icon: "👁️" },
    { count: 4, sense: "TOUCH", prompt: "Notice 4 things you can physically feel.", icon: "✋" },
    { count: 3, sense: "HEAR", prompt: "Listen for 3 sounds around you.", icon: "👂" },
    { count: 2, sense: "SMELL", prompt: "Identify 2 things you can smell.", icon: "👃" },
    { count: 1, sense: "TASTE", prompt: "Notice 1 thing you can taste.", icon: "👅" }
  ],
  outro: "You're here. You're safe. You're doing great. 💚"
};

// Mood options with soft, non-judgmental language
const moodOptions = [
  { value: 5, label: "Bright", color: "#8FBC8F", icon: "☀️" },
  { value: 4, label: "Calm", color: "#98D1A3", icon: "🌤️" },
  { value: 3, label: "Okay", color: "#B8C9B8", icon: "☁️" },
  { value: 2, label: "Low", color: "#C4B7D1", icon: "🌧️" },
  { value: 1, label: "Struggling", color: "#D1B8C9", icon: "🌫️" }
];

// Energy options
const energyOptions = [
  { value: 5, label: "Energized", color: "#8FBC8F", icon: "⚡" },
  { value: 4, label: "Good", color: "#98D1A3", icon: "✨" },
  { value: 3, label: "Steady", color: "#B8C9B8", icon: "〰️" },
  { value: 2, label: "Tired", color: "#C4B7D1", icon: "🌙" },
  { value: 1, label: "Exhausted", color: "#D1B8C9", icon: "💤" }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [todayMood, setTodayMood] = useState(null);
  const [todayEnergy, setTodayEnergy] = useState(null);
  const [nourishEntry, setNourishEntry] = useState('');
  const [strengthEntry, setStrengthEntry] = useState({ exercise: '', notes: '', feelingStrong: false });
  const [history, setHistory] = useState([]);
  const [todayPrompt] = useState(nourishPrompts[Math.floor(Math.random() * nourishPrompts.length)]);
  const [todayNutrition] = useState(nutritionFacts[Math.floor(Math.random() * nutritionFacts.length)]);
  const [savedToday, setSavedToday] = useState({ mood: false, nourish: false, strength: false, affirmation: false, bodyGratitude: false });
  const [showSaveConfirm, setShowSaveConfirm] = useState('');
  
  // New feature states
  const [affirmationMode, setAffirmationMode] = useState(null); // 'choose' or 'write'
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [selectedAffirmation, setSelectedAffirmation] = useState(null);
  const [affirmationSpoken, setAffirmationSpoken] = useState(false);
  const [todayAffirmations] = useState(() => {
    // Get 5 random affirmations for today
    const shuffled = [...affirmationOptions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });
  const [affirmationHistory, setAffirmationHistory] = useState([]);
  
  const [recoveryWins, setRecoveryWins] = useState([]);
  const [newRecoveryWin, setNewRecoveryWin] = useState('');
  
  const [safeFoods, setSafeFoods] = useState([]);
  const [newSafeFood, setNewSafeFood] = useState({ name: '', note: '' });
  
  const [bodyGratitudeEntry, setBodyGratitudeEntry] = useState('');
  const [bodyGratitudeHistory, setBodyGratitudeHistory] = useState([]);
  const [todayBodyPrompt] = useState(bodyGratitudePrompts[Math.floor(Math.random() * bodyGratitudePrompts.length)]);
  
  const [therapistNotes, setTherapistNotes] = useState([]);
  const [newTherapistNote, setNewTherapistNote] = useState('');
  
  const [groundingStep, setGroundingStep] = useState(-1); // -1 = not started, 0-4 = steps, 5 = complete

  // Load data from Supabase
  useEffect(() => {
    // Fix for iOS Safari and Chrome viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      if (CSS.supports && !CSS.supports('padding-bottom', 'env(safe-area-inset-bottom)')) {
        document.documentElement.style.setProperty('--sab', '0px');
        document.documentElement.style.setProperty('--sat', '0px');
      }
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });
    document.body.style.overscrollBehavior = 'none';

    // Load all data from Supabase
    const loadData = async () => {
      try {
        // Get user (Madison)
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .single();
        
        if (userError) throw userError;
        setUserId(userData.id);

        const today = new Date().toISOString().split('T')[0];

        // Load check-ins (last 14 days)
        const { data: checkins } = await supabase
          .from('checkins')
          .select('*')
          .eq('user_id', userData.id)
          .order('date', { ascending: false })
          .limit(14);
        
        if (checkins) {
          const formattedHistory = checkins.map(c => ({
            date: c.date,
            mood: c.mood,
            energy: c.energy,
            nourish: c.nourish,
            strength: c.strength_exercise ? {
              exercise: c.strength_exercise,
              notes: c.strength_notes,
              feelingStrong: c.feeling_strong
            } : null
          }));
          setHistory(formattedHistory);

          // Check if already saved today
          const todayCheckin = checkins.find(c => c.date === today);
          if (todayCheckin) {
            if (todayCheckin.mood) {
              setTodayMood(todayCheckin.mood);
              setTodayEnergy(todayCheckin.energy);
              setSavedToday(prev => ({ ...prev, mood: true }));
            }
            if (todayCheckin.nourish) {
              setNourishEntry(todayCheckin.nourish);
              setSavedToday(prev => ({ ...prev, nourish: true }));
            }
            if (todayCheckin.strength_exercise) {
              setStrengthEntry({
                exercise: todayCheckin.strength_exercise,
                notes: todayCheckin.strength_notes || '',
                feelingStrong: todayCheckin.feeling_strong
              });
              setSavedToday(prev => ({ ...prev, strength: true }));
            }
          }
        }

        // Load affirmations
        const { data: affirmations } = await supabase
          .from('affirmations')
          .select('*')
          .eq('user_id', userData.id)
          .order('date', { ascending: false })
          .limit(10);
        
        if (affirmations) {
          setAffirmationHistory(affirmations.map(a => ({ date: a.date, text: a.text })));
          const todayAff = affirmations.find(a => a.date === today);
          if (todayAff) {
            setSavedToday(prev => ({ ...prev, affirmation: true }));
          }
        }

        // Load recovery wins
        const { data: wins } = await supabase
          .from('recovery_wins')
          .select('*')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false });
        
        if (wins) {
          setRecoveryWins(wins.map(w => ({ id: w.id, text: w.text, date: w.created_at })));
        }

        // Load safe foods
        const { data: foods } = await supabase
          .from('safe_foods')
          .select('*')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false });
        
        if (foods) {
          setSafeFoods(foods.map(f => ({ id: f.id, name: f.name, note: f.note })));
        }

        // Load body gratitude
        const { data: gratitude } = await supabase
          .from('body_gratitude')
          .select('*')
          .eq('user_id', userData.id)
          .order('date', { ascending: false })
          .limit(10);
        
        if (gratitude) {
          setBodyGratitudeHistory(gratitude.map(g => ({ date: g.date, text: g.text })));
          const todayGrat = gratitude.find(g => g.date === today);
          if (todayGrat) {
            setBodyGratitudeEntry(todayGrat.text);
            setSavedToday(prev => ({ ...prev, bodyGratitude: true }));
          }
        }

        // Load therapist notes
        const { data: notes } = await supabase
          .from('therapist_notes')
          .select('*')
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false });
        
        if (notes) {
          setTherapistNotes(notes.map(n => ({ id: n.id, text: n.text, date: n.created_at })));
        }

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const saveEntry = async (type) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      let updateData = { user_id: userId, date: today };
      
      if (type === 'mood') {
        updateData.mood = todayMood;
        updateData.energy = todayEnergy;
      } else if (type === 'nourish') {
        updateData.nourish = nourishEntry;
      } else if (type === 'strength') {
        updateData.strength_exercise = strengthEntry.exercise;
        updateData.strength_notes = strengthEntry.notes;
        updateData.feeling_strong = strengthEntry.feelingStrong;
      }

      const { error } = await supabase
        .from('checkins')
        .upsert(updateData, { onConflict: 'user_id,date' });
      
      if (error) throw error;

      // Update local state
      const existingIndex = history.findIndex(h => h.date === today);
      let newEntry = existingIndex >= 0 ? { ...history[existingIndex] } : { date: today };
      
      if (type === 'mood') {
        newEntry.mood = todayMood;
        newEntry.energy = todayEnergy;
      } else if (type === 'nourish') {
        newEntry.nourish = nourishEntry;
      } else if (type === 'strength') {
        newEntry.strength = { ...strengthEntry };
      }

      if (existingIndex >= 0) {
        const newHistory = [...history];
        newHistory[existingIndex] = newEntry;
        setHistory(newHistory);
      } else {
        setHistory([newEntry, ...history]);
      }

      setSavedToday({ ...savedToday, [type]: true });
      setShowSaveConfirm(type);
      setTimeout(() => setShowSaveConfirm(''), 2000);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const saveAffirmation = async () => {
    const text = affirmationMode === 'write' ? customAffirmation : selectedAffirmation;
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { error } = await supabase
        .from('affirmations')
        .insert({ user_id: userId, date: today, text });
      
      if (error) throw error;

      setAffirmationHistory([{ date: today, text }, ...affirmationHistory]);
      setSavedToday({ ...savedToday, affirmation: true });
      setShowSaveConfirm('affirmation');
      setTimeout(() => setShowSaveConfirm(''), 2000);
    } catch (error) {
      console.error('Error saving affirmation:', error);
    }
  };

  const addRecoveryWin = async () => {
    if (!newRecoveryWin.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('recovery_wins')
        .insert({ user_id: userId, text: newRecoveryWin })
        .select()
        .single();
      
      if (error) throw error;

      setRecoveryWins([{ id: data.id, text: data.text, date: data.created_at }, ...recoveryWins]);
      setNewRecoveryWin('');
      setShowSaveConfirm('recovery');
      setTimeout(() => setShowSaveConfirm(''), 2000);
    } catch (error) {
      console.error('Error saving recovery win:', error);
    }
  };

  const addSafeFood = async () => {
    if (!newSafeFood.name.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('safe_foods')
        .insert({ user_id: userId, name: newSafeFood.name, note: newSafeFood.note })
        .select()
        .single();
      
      if (error) throw error;

      setSafeFoods([{ id: data.id, name: data.name, note: data.note }, ...safeFoods]);
      setNewSafeFood({ name: '', note: '' });
      setShowSaveConfirm('safefood');
      setTimeout(() => setShowSaveConfirm(''), 2000);
    } catch (error) {
      console.error('Error saving safe food:', error);
    }
  };

  const saveBodyGratitude = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { error } = await supabase
        .from('body_gratitude')
        .insert({ user_id: userId, date: today, text: bodyGratitudeEntry });
      
      if (error) throw error;

      setBodyGratitudeHistory([{ date: today, text: bodyGratitudeEntry }, ...bodyGratitudeHistory]);
      setSavedToday({ ...savedToday, bodyGratitude: true });
      setShowSaveConfirm('bodyGratitude');
      setTimeout(() => setShowSaveConfirm(''), 2000);
    } catch (error) {
      console.error('Error saving body gratitude:', error);
    }
  };

  const addTherapistNote = async () => {
    if (!newTherapistNote.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('therapist_notes')
        .insert({ user_id: userId, text: newTherapistNote })
        .select()
        .single();
      
      if (error) throw error;

      setTherapistNotes([{ id: data.id, text: data.text, date: data.created_at }, ...therapistNotes]);
      setNewTherapistNote('');
      setShowSaveConfirm('therapist');
      setTimeout(() => setShowSaveConfirm(''), 2000);
    } catch (error) {
      console.error('Error saving therapist note:', error);
    }
  };

  const clearTherapistNotes = async () => {
    try {
      const { error } = await supabase
        .from('therapist_notes')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      setTherapistNotes([]);
    } catch (error) {
      console.error('Error clearing notes:', error);
    }
  };

  const getWeekData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = history.find(h => h.date === dateStr);
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        mood: dayData?.mood || null,
        energy: dayData?.energy || null
      });
    }
    return last7Days;
  };

  const getCheckInCount = () => {
    return history.filter(h => h.mood || h.nourish || h.strength).length;
  };

  const getStrengthWins = () => {
    return history.filter(h => h.strength?.feelingStrong).length;
  };

  // Mini line chart component
  const MiniChart = ({ data, dataKey, color }) => {
    const validData = data.filter(d => d[dataKey] !== null);
    if (validData.length < 2) return <div style={styles.chartEmpty}>Keep checking in to see your trends ✨</div>;
    
    const max = 5;
    const min = 1;
    const height = 60;
    const width = Math.min(320, window.innerWidth - 72);
    const padding = 10;
    
    const points = data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = d[dataKey] !== null 
        ? height - padding - ((d[dataKey] - min) / (max - min)) * (height - 2 * padding)
        : null;
      return { x, y, value: d[dataKey] };
    }).filter(p => p.y !== null);

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', margin: '0 auto' }}>
        {[1, 2, 3, 4, 5].map(v => {
          const y = height - padding - ((v - min) / (max - min)) * (height - 2 * padding);
          return <line key={v} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#E8E8E8" strokeWidth="1" />;
        })}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
        ))}
      </svg>
    );
  };

  // Full progress chart
  const ProgressChart = ({ data, showMood = true, showEnergy = true }) => {
    const validData = data.filter(d => d.mood !== null || d.energy !== null);
    if (validData.length < 2) {
      return (
        <div style={styles.chartEmptyLarge}>
          <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</span>
          <p>Your journey is just beginning</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Check in a few more times to see your trends here</p>
        </div>
      );
    }

    const max = 5;
    const min = 1;
    const height = 180;
    const width = Math.min(360, window.innerWidth - 72);
    const padding = 25;

    const createPath = (dataKey) => {
      const points = data.map((d, i) => {
        const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
        const y = d[dataKey] !== null 
          ? height - padding - ((d[dataKey] - min) / (max - min)) * (height - 2 * padding)
          : null;
        return { x, y, value: d[dataKey], day: d.day };
      });
      
      const validPoints = points.filter(p => p.y !== null);
      const pathD = validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      
      return { points, validPoints, pathD };
    };

    const moodPath = showMood ? createPath('mood') : null;
    const energyPath = showEnergy ? createPath('energy') : null;

    return (
      <div>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8FBC8F" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8FBC8F" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {[1, 2, 3, 4, 5].map(v => {
            const y = height - padding - ((v - min) / (max - min)) * (height - 2 * padding);
            return (
              <g key={v}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#E8E8E8" strokeWidth="1" />
                <text x={padding - 8} y={y + 4} fontSize="10" fill="#999" textAnchor="end">
                  {v === 5 ? '☀️' : v === 3 ? '☁️' : v === 1 ? '🌧️' : ''}
                </text>
              </g>
            );
          })}
          
          {data.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
            return (
              <text key={i} x={x} y={height - 5} fontSize="10" fill="#999" textAnchor="middle">
                {d.day}
              </text>
            );
          })}

          {showEnergy && energyPath && (
            <>
              <path d={energyPath.pathD} fill="none" stroke="#C4B7D1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5" />
              {energyPath.validPoints.map((p, i) => (
                <circle key={`e-${i}`} cx={p.x} cy={p.y} r="4" fill="#C4B7D1" />
              ))}
            </>
          )}
          
          {showMood && moodPath && (
            <>
              <path d={moodPath.pathD} fill="none" stroke="#8FBC8F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {moodPath.validPoints.map((p, i) => (
                <circle key={`m-${i}`} cx={p.x} cy={p.y} r="5" fill="#8FBC8F" stroke="white" strokeWidth="2" />
              ))}
            </>
          )}
        </svg>
        
        <div style={styles.chartLegend}>
          {showMood && <span><span style={{ ...styles.legendDot, background: '#8FBC8F' }}></span> Mood</span>}
          {showEnergy && <span><span style={{ ...styles.legendDot, background: 'transparent', border: '2px dashed #C4B7D1' }}></span> Energy</span>}
        </div>
      </div>
    );
  };

  // Daily progress pie chart component
  const DailyProgressChart = () => {
    const tasks = [
      { id: 'mood', label: 'Mood', icon: '🌤️', done: savedToday.mood, color: '#8FBC8F' },
      { id: 'nourish', label: 'Reflect', icon: '🌱', done: savedToday.nourish, color: '#98D1A3' },
      { id: 'strength', label: 'Strength', icon: '💪', done: savedToday.strength, color: '#B8C9B8' },
      { id: 'affirmation', label: 'Affirm', icon: '💜', done: savedToday.affirmation, color: '#C4B7D1' }
    ];
    
    const completedCount = tasks.filter(t => t.done).length;
    const totalTasks = tasks.length;
    const percentage = (completedCount / totalTasks) * 100;
    
    // SVG pie chart calculations
    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div style={styles.dailyProgressCard}>
        <div style={styles.dailyProgressContent}>
          <div style={styles.pieChartContainer}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#E8E8E8"
                strokeWidth={strokeWidth}
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ 
                  transition: 'stroke-dashoffset 0.5s ease',
                  WebkitTransition: 'stroke-dashoffset 0.5s ease'
                }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8FBC8F" />
                  <stop offset="100%" stopColor="#C4B7D1" />
                </linearGradient>
              </defs>
            </svg>
            <div style={styles.pieChartCenter}>
              {completedCount === totalTasks ? (
                <span style={styles.pieChartComplete}>✨</span>
              ) : (
                <>
                  <span style={styles.pieChartNumber}>{completedCount}</span>
                  <span style={styles.pieChartOf}>of {totalTasks}</span>
                </>
              )}
            </div>
          </div>
          
          <div style={styles.dailyTasksList}>
            <h3 style={styles.dailyProgressTitle}>Today's self-care</h3>
            {tasks.map(task => (
              <div key={task.id} style={styles.dailyTaskItem}>
                <span style={{
                  ...styles.dailyTaskCheck,
                  ...(task.done ? styles.dailyTaskCheckDone : {})
                }}>
                  {task.done ? '✓' : task.icon}
                </span>
                <span style={{
                  ...styles.dailyTaskLabel,
                  ...(task.done ? styles.dailyTaskLabelDone : {})
                }}>
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {completedCount === totalTasks && (
          <div style={styles.allCompleteMessage}>
            You showed up for yourself today! 💚
          </div>
        )}
      </div>
    );
  };

  const renderHome = () => (
    <div style={styles.page}>
      <div style={styles.greeting}>
        <h1 style={styles.greetingText}>Hi Madison 🌿</h1>
        <p style={styles.greetingSubtext}>How are you showing up for yourself today?</p>
      </div>

      {/* Daily progress pie chart */}
      <DailyProgressChart />

      {/* Week at a glance */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Your week at a glance</h3>
        <MiniChart data={getWeekData()} dataKey="mood" color="#8FBC8F" />
        <div style={styles.weekDays}>
          {getWeekData().map((d, i) => (
            <div key={i} style={styles.weekDay}>
              <span style={styles.weekDayLabel}>{d.day}</span>
              <span style={styles.weekDayDot(d.mood)}>{d.mood ? moodOptions.find(m => m.value === d.mood)?.icon : '·'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition compass */}
      <div style={styles.cardAccent}>
        <div style={styles.nutritionHeader}>
          <span style={styles.nutritionEmoji}>{todayNutrition.emoji}</span>
          <h3 style={styles.cardTitleDark}>Today's nourishment note</h3>
        </div>
        <p style={styles.nutritionFact}>
          <strong>{todayNutrition.food}</strong> {todayNutrition.fact}
        </p>
      </div>

      {/* Quick stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{getCheckInCount()}</span>
          <span style={styles.statLabel}>check-ins</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{getStrengthWins()}</span>
          <span style={styles.statLabel}>strength wins</span>
        </div>
      </div>

      {/* Quick access buttons */}
      <div style={styles.quickAccess}>
        <button onClick={() => { setActiveTab('more'); setActiveSubTab('grounding'); }} style={styles.quickButton}>
          <span>🫧</span> Need a reset?
        </button>
        <button onClick={() => { setActiveTab('more'); setActiveSubTab('affirmation'); }} style={styles.quickButton}>
          <span>💜</span> Daily affirmation
        </button>
      </div>
    </div>
  );

  const renderMoodTracker = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>How are you feeling?</h2>
      <p style={styles.pageSubtitle}>There's no right answer — just check in with yourself</p>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Mood</h3>
        <div style={styles.optionGrid}>
          {moodOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTodayMood(option.value)}
              style={{
                ...styles.optionButton,
                ...(todayMood === option.value ? { ...styles.optionButtonActive, borderColor: option.color, background: `${option.color}20` } : {})
              }}
            >
              <span style={styles.optionIcon}>{option.icon}</span>
              <span style={styles.optionLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Energy</h3>
        <div style={styles.optionGrid}>
          {energyOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTodayEnergy(option.value)}
              style={{
                ...styles.optionButton,
                ...(todayEnergy === option.value ? { ...styles.optionButtonActive, borderColor: option.color, background: `${option.color}20` } : {})
              }}
            >
              <span style={styles.optionIcon}>{option.icon}</span>
              <span style={styles.optionLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {(todayMood && todayEnergy) && (
        <button 
          onClick={() => saveEntry('mood')} 
          style={styles.saveButton}
          disabled={savedToday.mood}
        >
          {savedToday.mood ? '✓ Saved' : 'Save check-in'}
        </button>
      )}

      {showSaveConfirm === 'mood' && (
        <div style={styles.saveConfirm}>Saved! Thanks for checking in 💚</div>
      )}
    </div>
  );

  const renderNourish = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Daily reflection</h2>
      <p style={styles.pageSubtitle}>A moment to appreciate yourself</p>

      <div style={styles.card}>
        <p style={styles.prompt}>{todayPrompt}</p>
        <textarea
          value={nourishEntry}
          onChange={(e) => setNourishEntry(e.target.value)}
          placeholder="Write whatever feels true..."
          style={styles.textarea}
          rows={5}
        />
        
        {nourishEntry.length > 0 && (
          <button 
            onClick={() => saveEntry('nourish')} 
            style={styles.saveButton}
            disabled={savedToday.nourish}
          >
            {savedToday.nourish ? '✓ Saved' : 'Save reflection'}
          </button>
        )}

        {showSaveConfirm === 'nourish' && (
          <div style={styles.saveConfirm}>Beautiful reflection 🌸</div>
        )}
      </div>

      {history.filter(h => h.nourish).length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Past reflections</h3>
          {history.filter(h => h.nourish).slice(-3).reverse().map((entry, i) => (
            <div key={i} style={styles.pastEntry}>
              <span style={styles.pastDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <p style={styles.pastText}>{entry.nourish}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStrength = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Strength journal</h2>
      <p style={styles.pageSubtitle}>Celebrate what your body can do</p>

      <div style={styles.card}>
        <label style={styles.inputLabel}>What did you work on today?</label>
        <input
          type="text"
          value={strengthEntry.exercise}
          onChange={(e) => setStrengthEntry({ ...strengthEntry, exercise: e.target.value })}
          placeholder="e.g., Squats, Deadlifts, Upper body..."
          style={styles.input}
        />

        <label style={styles.inputLabel}>How did it feel?</label>
        <textarea
          value={strengthEntry.notes}
          onChange={(e) => setStrengthEntry({ ...strengthEntry, notes: e.target.value })}
          placeholder="New PR? Felt easier than last time? Just showed up?"
          style={styles.textarea}
          rows={3}
        />

        <button
          onClick={() => setStrengthEntry({ ...strengthEntry, feelingStrong: !strengthEntry.feelingStrong })}
          style={{
            ...styles.feelingButton,
            ...(strengthEntry.feelingStrong ? styles.feelingButtonActive : {})
          }}
        >
          💪 I felt strong today
        </button>

        {strengthEntry.exercise && (
          <button 
            onClick={() => saveEntry('strength')} 
            style={styles.saveButton}
            disabled={savedToday.strength}
          >
            {savedToday.strength ? '✓ Saved' : 'Log workout'}
          </button>
        )}

        {showSaveConfirm === 'strength' && (
          <div style={styles.saveConfirm}>Great work showing up! 💪</div>
        )}
      </div>

      {history.filter(h => h.strength).length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Recent strength wins</h3>
          {history.filter(h => h.strength).slice(-5).reverse().map((entry, i) => (
            <div key={i} style={styles.strengthEntry}>
              <div style={styles.strengthHeader}>
                <span style={styles.strengthExercise}>{entry.strength.exercise}</span>
                {entry.strength.feelingStrong && <span>💪</span>}
              </div>
              <span style={styles.pastDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              {entry.strength.notes && <p style={styles.strengthNotes}>{entry.strength.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Your journey</h2>
      <p style={styles.pageSubtitle}>Look how far you've come</p>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Mood & energy this week</h3>
        <ProgressChart data={getWeekData()} showMood={true} showEnergy={true} />
      </div>

      <div style={styles.statsRowLarge}>
        <div style={styles.statCardLarge}>
          <span style={styles.statEmoji}>📝</span>
          <span style={styles.statNumberLarge}>{getCheckInCount()}</span>
          <span style={styles.statLabelLarge}>times you've checked in</span>
        </div>
        <div style={styles.statCardLarge}>
          <span style={styles.statEmoji}>💪</span>
          <span style={styles.statNumberLarge}>{getStrengthWins()}</span>
          <span style={styles.statLabelLarge}>days you felt strong</span>
        </div>
        <div style={styles.statCardLarge}>
          <span style={styles.statEmoji}>✨</span>
          <span style={styles.statNumberLarge}>{history.filter(h => h.nourish).length}</span>
          <span style={styles.statLabelLarge}>reflections written</span>
        </div>
        <div style={styles.statCardLarge}>
          <span style={styles.statEmoji}>🏆</span>
          <span style={styles.statNumberLarge}>{recoveryWins.length}</span>
          <span style={styles.statLabelLarge}>recovery wins celebrated</span>
        </div>
      </div>

      <div style={styles.encouragement}>
        <p>Every check-in is an act of self-care.</p>
        <p style={styles.encouragementSmall}>You're doing beautifully, Madison. 🌿</p>
      </div>
    </div>
  );

  const renderAffirmation = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Daily affirmation</h2>
      <p style={styles.pageSubtitle}>Speak kindness to yourself</p>

      {!savedToday.affirmation ? (
        <div style={styles.card}>
          {!affirmationMode ? (
            <>
              <p style={styles.affirmationIntro}>How would you like to affirm yourself today?</p>
              <div style={styles.affirmationChoices}>
                <button onClick={() => setAffirmationMode('choose')} style={styles.affirmationChoiceBtn}>
                  <span>🎯</span> Choose one for me
                </button>
                <button onClick={() => setAffirmationMode('write')} style={styles.affirmationChoiceBtn}>
                  <span>✍️</span> I'll write my own
                </button>
              </div>
            </>
          ) : affirmationMode === 'choose' ? (
            <>
              <p style={styles.affirmationIntro}>Pick the one that resonates most:</p>
              <div style={styles.affirmationList}>
                {todayAffirmations.map((aff, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAffirmation(aff)}
                    style={{
                      ...styles.affirmationOption,
                      ...(selectedAffirmation === aff ? styles.affirmationOptionSelected : {})
                    }}
                  >
                    {aff}
                  </button>
                ))}
              </div>
              {selectedAffirmation && !affirmationSpoken && (
                <div style={styles.speakPrompt}>
                  <p style={styles.speakPromptText}>🗣️ Now say it out loud to yourself:</p>
                  <p style={styles.speakPromptAffirmation}>"{selectedAffirmation}"</p>
                  <button onClick={() => setAffirmationSpoken(true)} style={styles.saveButton}>
                    I said it out loud ✓
                  </button>
                </div>
              )}
              {affirmationSpoken && (
                <button onClick={saveAffirmation} style={styles.saveButton}>
                  Save today's affirmation
                </button>
              )}
              <button onClick={() => { setAffirmationMode(null); setSelectedAffirmation(null); setAffirmationSpoken(false); }} style={styles.backLink}>
                ← Go back
              </button>
            </>
          ) : (
            <>
              <p style={styles.affirmationIntro}>Write something kind and true about yourself:</p>
              <textarea
                value={customAffirmation}
                onChange={(e) => setCustomAffirmation(e.target.value)}
                placeholder="I am..."
                style={styles.textarea}
                rows={3}
              />
              {customAffirmation.length > 0 && !affirmationSpoken && (
                <div style={styles.speakPrompt}>
                  <p style={styles.speakPromptText}>🗣️ Now say it out loud to yourself:</p>
                  <p style={styles.speakPromptAffirmation}>"{customAffirmation}"</p>
                  <button onClick={() => setAffirmationSpoken(true)} style={styles.saveButton}>
                    I said it out loud ✓
                  </button>
                </div>
              )}
              {affirmationSpoken && (
                <button onClick={saveAffirmation} style={styles.saveButton}>
                  Save today's affirmation
                </button>
              )}
              <button onClick={() => { setAffirmationMode(null); setCustomAffirmation(''); setAffirmationSpoken(false); }} style={styles.backLink}>
                ← Go back
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={styles.cardAccent}>
          <p style={styles.affirmationComplete}>✓ You affirmed yourself today!</p>
          <p style={styles.todayAffirmation}>"{affirmationHistory[affirmationHistory.length - 1]?.text}"</p>
        </div>
      )}

      {showSaveConfirm === 'affirmation' && (
        <div style={styles.saveConfirm}>Beautiful! Keep speaking kindness to yourself 💜</div>
      )}

      {affirmationHistory.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Past affirmations</h3>
          {affirmationHistory.slice(-5).reverse().map((entry, i) => (
            <div key={i} style={styles.pastEntry}>
              <span style={styles.pastDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <p style={styles.pastText}>"{entry.text}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRecoveryWins = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Recovery wins</h2>
      <p style={styles.pageSubtitle}>Every victory matters, no matter how small</p>

      <div style={styles.card}>
        <label style={styles.inputLabel}>Celebrate a win today:</label>
        <textarea
          value={newRecoveryWin}
          onChange={(e) => setNewRecoveryWin(e.target.value)}
          placeholder="e.g., Ate lunch without overthinking, enjoyed dessert guilt-free, listened to my hunger..."
          style={styles.textarea}
          rows={3}
        />
        {newRecoveryWin.length > 0 && (
          <button onClick={addRecoveryWin} style={styles.saveButton}>
            Add win 🏆
          </button>
        )}
        {showSaveConfirm === 'recovery' && (
          <div style={styles.saveConfirm}>That's huge! So proud of you 🎉</div>
        )}
      </div>

      {recoveryWins.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your wins ({recoveryWins.length} total)</h3>
          {recoveryWins.slice().reverse().map((win, i) => (
            <div key={win.id} style={styles.recoveryWinItem}>
              <span style={styles.recoveryWinIcon}>🏆</span>
              <div>
                <p style={styles.recoveryWinText}>{win.text}</p>
                <span style={styles.pastDate}>{new Date(win.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSafeFoods = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Safe foods</h2>
      <p style={styles.pageSubtitle}>Foods that feel good to you — a growing collection</p>

      <div style={styles.card}>
        <label style={styles.inputLabel}>Add a food you feel good about:</label>
        <input
          type="text"
          value={newSafeFood.name}
          onChange={(e) => setNewSafeFood({ ...newSafeFood, name: e.target.value })}
          placeholder="Food name..."
          style={styles.input}
        />
        <label style={styles.inputLabel}>Why do you like it? (optional)</label>
        <textarea
          value={newSafeFood.note}
          onChange={(e) => setNewSafeFood({ ...newSafeFood, note: e.target.value })}
          placeholder="Makes me feel energized, tastes like comfort, easy to prepare..."
          style={styles.textarea}
          rows={2}
        />
        {newSafeFood.name.length > 0 && (
          <button onClick={addSafeFood} style={styles.saveButton}>
            Add to collection 🌱
          </button>
        )}
        {showSaveConfirm === 'safefood' && (
          <div style={styles.saveConfirm}>Added! Your collection is growing 🌿</div>
        )}
      </div>

      {safeFoods.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Your safe foods</h3>
          <div style={styles.safeFoodGrid}>
            {safeFoods.map((food) => (
              <div key={food.id} style={styles.safeFoodCard}>
                <span style={styles.safeFoodName}>{food.name}</span>
                {food.note && <span style={styles.safeFoodNote}>{food.note}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBodyGratitude = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>Body gratitude</h2>
      <p style={styles.pageSubtitle}>Appreciate what your body does for you</p>

      <div style={styles.card}>
        <p style={styles.prompt}>{todayBodyPrompt}</p>
        <textarea
          value={bodyGratitudeEntry}
          onChange={(e) => setBodyGratitudeEntry(e.target.value)}
          placeholder="My body helped me..."
          style={styles.textarea}
          rows={4}
        />
        {bodyGratitudeEntry.length > 0 && (
          <button 
            onClick={saveBodyGratitude} 
            style={styles.saveButton}
            disabled={savedToday.bodyGratitude}
          >
            {savedToday.bodyGratitude ? '✓ Saved' : 'Save gratitude'}
          </button>
        )}
        {showSaveConfirm === 'bodyGratitude' && (
          <div style={styles.saveConfirm}>Your body is amazing 💚</div>
        )}
      </div>

      {bodyGratitudeHistory.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Past gratitudes</h3>
          {bodyGratitudeHistory.slice(-5).reverse().map((entry, i) => (
            <div key={i} style={styles.pastEntry}>
              <span style={styles.pastDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <p style={styles.pastText}>{entry.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGrounding = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>🫧 Reset</h2>
      
      {groundingStep === -1 ? (
        <div style={styles.groundingIntro}>
          <p style={styles.groundingIntroText}>{groundingExercise.intro}</p>
          <p style={styles.groundingIntroSubtext}>This takes about 2 minutes.</p>
          <button onClick={() => setGroundingStep(0)} style={styles.groundingStartBtn}>
            Begin grounding exercise
          </button>
        </div>
      ) : groundingStep < 5 ? (
        <div style={styles.groundingStep}>
          <div style={styles.groundingStepIcon}>{groundingExercise.steps[groundingStep].icon}</div>
          <div style={styles.groundingStepCount}>{groundingExercise.steps[groundingStep].count}</div>
          <div style={styles.groundingStepSense}>{groundingExercise.steps[groundingStep].sense}</div>
          <p style={styles.groundingStepPrompt}>{groundingExercise.steps[groundingStep].prompt}</p>
          <div style={styles.groundingProgress}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                ...styles.groundingProgressDot,
                background: i <= groundingStep ? '#8FBC8F' : '#E2E8F0'
              }} />
            ))}
          </div>
          <button onClick={() => setGroundingStep(groundingStep + 1)} style={styles.groundingNextBtn}>
            {groundingStep < 4 ? 'Next →' : 'Finish'}
          </button>
        </div>
      ) : (
        <div style={styles.groundingComplete}>
          <div style={styles.groundingCompleteIcon}>💚</div>
          <p style={styles.groundingCompleteText}>{groundingExercise.outro}</p>
          <button onClick={() => setGroundingStep(-1)} style={styles.groundingRestartBtn}>
            Do it again
          </button>
          <button onClick={() => setActiveSubTab(null)} style={styles.backLink}>
            ← Back to menu
          </button>
        </div>
      )}
    </div>
  );

  const renderTherapistNotes = () => (
    <div style={styles.page}>
      <h2 style={styles.pageTitle}>For my therapist</h2>
      <p style={styles.pageSubtitle}>Things to bring up at your next session</p>

      <div style={styles.card}>
        <label style={styles.inputLabel}>Add a note:</label>
        <textarea
          value={newTherapistNote}
          onChange={(e) => setNewTherapistNote(e.target.value)}
          placeholder="Something I want to talk about, a question, a breakthrough, a struggle..."
          style={styles.textarea}
          rows={3}
        />
        {newTherapistNote.length > 0 && (
          <button onClick={addTherapistNote} style={styles.saveButton}>
            Add note 📝
          </button>
        )}
        {showSaveConfirm === 'therapist' && (
          <div style={styles.saveConfirm}>Noted! You're doing great work 💜</div>
        )}
      </div>

      {therapistNotes.length > 0 && (
        <div style={styles.card}>
          <div style={styles.therapistHeader}>
            <h3 style={styles.cardTitle}>Notes for next session</h3>
            <button onClick={clearTherapistNotes} style={styles.clearButton}>
              Clear all
            </button>
          </div>
          {therapistNotes.map((note) => (
            <div key={note.id} style={styles.therapistNote}>
              <span style={styles.therapistNoteIcon}>•</span>
              <p style={styles.therapistNoteText}>{note.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMore = () => {
    if (activeSubTab === 'affirmation') return renderAffirmation();
    if (activeSubTab === 'recovery') return renderRecoveryWins();
    if (activeSubTab === 'safefoods') return renderSafeFoods();
    if (activeSubTab === 'bodygratitude') return renderBodyGratitude();
    if (activeSubTab === 'grounding') return renderGrounding();
    if (activeSubTab === 'therapist') return renderTherapistNotes();

    return (
      <div style={styles.page}>
        <h2 style={styles.pageTitle}>More tools</h2>
        <p style={styles.pageSubtitle}>Extra support when you need it</p>

        <div style={styles.moreGrid}>
          <button onClick={() => setActiveSubTab('affirmation')} style={styles.moreCard}>
            <span style={styles.moreCardIcon}>💜</span>
            <span style={styles.moreCardTitle}>Daily affirmation</span>
            <span style={styles.moreCardDesc}>Speak kindness to yourself</span>
          </button>

          <button onClick={() => setActiveSubTab('recovery')} style={styles.moreCard}>
            <span style={styles.moreCardIcon}>🏆</span>
            <span style={styles.moreCardTitle}>Recovery wins</span>
            <span style={styles.moreCardDesc}>Celebrate your victories</span>
          </button>

          <button onClick={() => setActiveSubTab('safefoods')} style={styles.moreCard}>
            <span style={styles.moreCardIcon}>🥑</span>
            <span style={styles.moreCardTitle}>Safe foods</span>
            <span style={styles.moreCardDesc}>Foods that feel good</span>
          </button>

          <button onClick={() => setActiveSubTab('bodygratitude')} style={styles.moreCard}>
            <span style={styles.moreCardIcon}>🙏</span>
            <span style={styles.moreCardTitle}>Body gratitude</span>
            <span style={styles.moreCardDesc}>Thank your body</span>
          </button>

          <button onClick={() => setActiveSubTab('grounding')} style={styles.moreCard}>
            <span style={styles.moreCardIcon}>🫧</span>
            <span style={styles.moreCardTitle}>Reset</span>
            <span style={styles.moreCardDesc}>Grounding exercise</span>
          </button>

          <button onClick={() => setActiveSubTab('therapist')} style={styles.moreCard}>
            <span style={styles.moreCardIcon}>📝</span>
            <span style={styles.moreCardTitle}>Therapist notes</span>
            <span style={styles.moreCardDesc}>Prep for sessions</span>
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <span style={styles.loadingEmoji}>🌿</span>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'mood' && renderMoodTracker()}
        {activeTab === 'nourish' && renderNourish()}
        {activeTab === 'strength' && renderStrength()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'more' && renderMore()}
      </div>

      <nav style={styles.nav}>
        {[
          { id: 'home', icon: '🏠', label: 'Home' },
          { id: 'mood', icon: '🌤️', label: 'Mood' },
          { id: 'nourish', icon: '🌱', label: 'Reflect' },
          { id: 'strength', icon: '💪', label: 'Strength' },
          { id: 'progress', icon: '📈', label: 'Progress' },
          { id: 'more', icon: '✨', label: 'More' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setActiveSubTab(null); }}
            style={{
              ...styles.navButton,
              ...(activeTab === tab.id ? styles.navButtonActive : {})
            }}
          >
            <span style={styles.navIcon}>{tab.icon}</span>
            <span style={styles.navLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Nunito', 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    background: '#FFFFFF',
    minHeight: '100vh',
    minHeight: '-webkit-fill-available',
    color: '#4A5568',
    paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  },
  content: {
    maxWidth: '100%',
    width: '100%',
    margin: '0 auto',
    padding: '16px',
    paddingTop: 'max(16px, env(safe-area-inset-top, 0px))',
    boxSizing: 'border-box'
  },
  page: {
    animation: 'fadeIn 0.3s ease'
  },
  greeting: {
    textAlign: 'center',
    padding: '30px 0 20px'
  },
  greetingText: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#2D3748',
    margin: 0
  },
  greetingSubtext: {
    fontSize: '1rem',
    color: '#718096',
    marginTop: '8px'
  },
  card: {
    background: '#FAFAFA',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #E8E8E8'
  },
  cardAccent: {
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#718096',
    marginTop: 0,
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardTitleDark: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#4A5568',
    margin: 0
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: '4px',
    textAlign: 'center'
  },
  pageSubtitle: {
    fontSize: '0.95rem',
    color: '#718096',
    marginBottom: '24px',
    textAlign: 'center'
  },
  nutritionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  },
  nutritionEmoji: {
    fontSize: '1.5rem'
  },
  nutritionFact: {
    fontSize: '1rem',
    lineHeight: '1.5',
    color: '#4A5568',
    margin: 0
  },
  statsRow: {
    display: 'flex',
    display: '-webkit-flex',
    gap: '12px',
    marginBottom: '16px'
  },
  statCard: {
    flex: 1,
    background: '#FAFAFA',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    border: '1px solid #E8E8E8'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#8FBC8F'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#718096'
  },
  statsRowLarge: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  statCardLarge: {
    background: '#FAFAFA',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: '1px solid #E8E8E8'
  },
  statEmoji: {
    fontSize: '1.5rem'
  },
  statNumberLarge: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#8FBC8F',
    minWidth: '30px'
  },
  statLabelLarge: {
    fontSize: '0.95rem',
    color: '#718096'
  },
  weekDays: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '16px'
  },
  weekDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  weekDayLabel: {
    fontSize: '0.7rem',
    color: '#A0AEC0'
  },
  weekDayDot: (mood) => ({
    fontSize: mood ? '1rem' : '1.2rem',
    color: mood ? 'inherit' : '#E2E8F0'
  }),
  quickAccess: {
    display: 'flex',
    display: '-webkit-flex',
    gap: '12px'
  },
  quickButton: {
    flex: 1,
    padding: '16px 12px',
    background: 'white',
    border: '1px solid #E8E8E8',
    borderRadius: '12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#4A5568',
    transition: 'all 0.2s ease',
    minHeight: '52px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  optionGrid: {
    display: 'flex',
    display: '-webkit-flex',
    flexWrap: 'wrap',
    WebkitFlexWrap: 'wrap',
    gap: '10px'
  },
  optionButton: {
    flex: '1 1 45%',
    WebkitFlex: '1 1 45%',
    padding: '16px 12px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    display: '-webkit-flex',
    flexDirection: 'column',
    WebkitFlexDirection: 'column',
    alignItems: 'center',
    WebkitAlignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    WebkitTransition: 'all 0.2s ease',
    minHeight: '70px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  optionButtonActive: {
    borderWidth: '2px'
  },
  optionIcon: {
    fontSize: '1.3rem'
  },
  optionLabel: {
    fontSize: '0.85rem',
    color: '#4A5568'
  },
  prompt: {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    color: '#4A5568',
    marginBottom: '16px',
    lineHeight: '1.5'
  },
  textarea: {
    width: '100%',
    padding: '16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    backgroundColor: 'white',
    color: '#4A5568',
    lineHeight: '1.5'
  },
  input: {
    width: '100%',
    padding: '16px',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: '16px',
    outline: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    backgroundColor: 'white',
    color: '#4A5568',
    lineHeight: '1.5'
  },
  inputLabel: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: '8px'
  },
  saveButton: {
    width: '100%',
    padding: '16px',
    background: '#8FBC8F',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
    transition: 'background 0.2s ease',
    WebkitTransition: 'background 0.2s ease',
    minHeight: '52px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none'
  },
  saveConfirm: {
    textAlign: 'center',
    color: '#8FBC8F',
    fontSize: '0.95rem',
    marginTop: '12px',
    fontWeight: '500'
  },
  feelingButton: {
    width: '100%',
    padding: '16px',
    background: 'white',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s ease',
    minHeight: '52px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  feelingButtonActive: {
    borderColor: '#8FBC8F',
    background: '#E8F5E9'
  },
  pastEntry: {
    padding: '12px 0',
    borderBottom: '1px solid #E8E8E8'
  },
  pastDate: {
    fontSize: '0.8rem',
    color: '#A0AEC0',
    display: 'block',
    marginBottom: '4px'
  },
  pastText: {
    fontSize: '0.95rem',
    color: '#4A5568',
    margin: 0,
    lineHeight: '1.4'
  },
  strengthEntry: {
    padding: '12px 0',
    borderBottom: '1px solid #E8E8E8'
  },
  strengthHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  strengthExercise: {
    fontWeight: '600',
    color: '#2D3748'
  },
  strengthNotes: {
    fontSize: '0.9rem',
    color: '#718096',
    margin: '4px 0 0',
    lineHeight: '1.4'
  },
  chartEmpty: {
    textAlign: 'center',
    color: '#A0AEC0',
    fontSize: '0.9rem',
    padding: '20px 0'
  },
  chartEmptyLarge: {
    textAlign: 'center',
    color: '#718096',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '12px',
    fontSize: '0.85rem',
    color: '#718096'
  },
  legendDot: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '6px',
    verticalAlign: 'middle'
  },
  encouragement: {
    textAlign: 'center',
    padding: '24px 20px',
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    borderRadius: '16px',
    color: '#4A5568',
    fontSize: '1.05rem',
    lineHeight: '1.6'
  },
  encouragementSmall: {
    fontSize: '0.9rem',
    marginTop: '8px',
    opacity: 0.8
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'white',
    borderTop: '1px solid #E8E8E8',
    display: 'flex',
    WebkitBoxPack: 'justify',
    justifyContent: 'space-around',
    padding: '8px 0',
    paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
    zIndex: 100,
    WebkitBackdropFilter: 'blur(10px)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  navButton: {
    background: 'none',
    border: 'none',
    padding: '10px 10px',
    cursor: 'pointer',
    display: 'flex',
    display: '-webkit-flex',
    flexDirection: 'column',
    WebkitFlexDirection: 'column',
    alignItems: 'center',
    WebkitAlignItems: 'center',
    gap: '4px',
    opacity: 0.5,
    transition: 'opacity 0.2s ease',
    WebkitTransition: 'opacity 0.2s ease',
    minWidth: '52px',
    WebkitTapHighlightColor: 'transparent',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none'
  },
  navButtonActive: {
    opacity: 1
  },
  navIcon: {
    fontSize: '1.2rem'
  },
  navLabel: {
    fontSize: '0.65rem',
    color: '#4A5568'
  },
  // Affirmation styles
  affirmationIntro: {
    fontSize: '1rem',
    color: '#4A5568',
    marginBottom: '16px',
    textAlign: 'center'
  },
  affirmationChoices: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  affirmationChoiceBtn: {
    padding: '18px',
    background: 'white',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    minHeight: '56px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  affirmationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '16px'
  },
  affirmationOption: {
    padding: '16px',
    background: 'white',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    color: '#4A5568',
    minHeight: '52px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  affirmationOptionSelected: {
    borderColor: '#C4B7D1',
    background: '#F3E5F5'
  },
  speakPrompt: {
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '16px',
    textAlign: 'center'
  },
  speakPromptText: {
    fontSize: '0.95rem',
    color: '#4A5568',
    margin: '0 0 12px 0'
  },
  speakPromptAffirmation: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2D3748',
    fontStyle: 'italic',
    margin: '0 0 16px 0',
    lineHeight: '1.4'
  },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#718096',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginTop: '16px',
    display: 'block',
    width: '100%',
    textAlign: 'center'
  },
  affirmationComplete: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'center',
    margin: '0 0 12px 0'
  },
  todayAffirmation: {
    fontSize: '1rem',
    fontStyle: 'italic',
    color: '#4A5568',
    textAlign: 'center',
    margin: 0
  },
  // Recovery wins
  recoveryWinItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #E8E8E8'
  },
  recoveryWinIcon: {
    fontSize: '1.2rem'
  },
  recoveryWinText: {
    fontSize: '0.95rem',
    color: '#4A5568',
    margin: 0,
    lineHeight: '1.4'
  },
  // Safe foods
  safeFoodGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  safeFoodCard: {
    background: 'white',
    border: '1px solid #E8E8E8',
    borderRadius: '10px',
    padding: '12px 16px'
  },
  safeFoodName: {
    display: 'block',
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: '4px'
  },
  safeFoodNote: {
    fontSize: '0.85rem',
    color: '#718096'
  },
  // Grounding
  groundingIntro: {
    background: '#FAFAFA',
    borderRadius: '16px',
    padding: '30px 20px',
    textAlign: 'center',
    border: '1px solid #E8E8E8'
  },
  groundingIntroText: {
    fontSize: '1.1rem',
    color: '#4A5568',
    lineHeight: '1.5',
    margin: '0 0 8px 0'
  },
  groundingIntroSubtext: {
    fontSize: '0.9rem',
    color: '#A0AEC0',
    margin: '0 0 24px 0'
  },
  groundingStartBtn: {
    padding: '16px 28px',
    background: '#8FBC8F',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '52px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  groundingStep: {
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center'
  },
  groundingStepIcon: {
    fontSize: '3rem',
    marginBottom: '16px'
  },
  groundingStepCount: {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#8FBC8F',
    lineHeight: 1
  },
  groundingStepSense: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: '12px',
    letterSpacing: '2px'
  },
  groundingStepPrompt: {
    fontSize: '1.1rem',
    color: '#4A5568',
    marginBottom: '24px',
    lineHeight: '1.4'
  },
  groundingProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px'
  },
  groundingProgressDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background 0.3s ease'
  },
  groundingNextBtn: {
    padding: '16px 40px',
    background: '#8FBC8F',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '52px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  groundingComplete: {
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center'
  },
  groundingCompleteIcon: {
    fontSize: '3rem',
    marginBottom: '16px'
  },
  groundingCompleteText: {
    fontSize: '1.2rem',
    color: '#4A5568',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  groundingRestartBtn: {
    padding: '12px 24px',
    background: 'white',
    color: '#4A5568',
    border: '2px solid #E2E8F0',
    borderRadius: '12px',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginBottom: '12px'
  },
  // Therapist notes
  therapistHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clearButton: {
    background: 'none',
    border: 'none',
    color: '#A0AEC0',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  therapistNote: {
    display: 'flex',
    gap: '12px',
    padding: '10px 0'
  },
  therapistNoteIcon: {
    color: '#C4B7D1',
    fontWeight: '700'
  },
  therapistNoteText: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#4A5568',
    lineHeight: '1.4'
  },
  // More menu
  moreGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  moreCard: {
    background: '#FAFAFA',
    border: '1px solid #E8E8E8',
    borderRadius: '16px',
    padding: '20px 16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    minHeight: '110px',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  moreCardIcon: {
    fontSize: '1.8rem'
  },
  moreCardTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2D3748'
  },
  moreCardDesc: {
    fontSize: '0.8rem',
    color: '#718096'
  },
  // Daily progress chart styles
  dailyProgressCard: {
    background: '#FAFAFA',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid #E8E8E8'
  },
  dailyProgressContent: {
    display: 'flex',
    display: '-webkit-flex',
    alignItems: 'center',
    WebkitAlignItems: 'center',
    gap: '20px'
  },
  pieChartContainer: {
    position: 'relative',
    flexShrink: 0,
    WebkitFlexShrink: 0
  },
  pieChartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    WebkitTransform: 'translate(-50%, -50%)',
    textAlign: 'center',
    display: 'flex',
    display: '-webkit-flex',
    flexDirection: 'column',
    WebkitFlexDirection: 'column',
    alignItems: 'center',
    WebkitAlignItems: 'center'
  },
  pieChartNumber: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#8FBC8F',
    lineHeight: 1
  },
  pieChartOf: {
    fontSize: '0.75rem',
    color: '#A0AEC0',
    marginTop: '2px'
  },
  pieChartComplete: {
    fontSize: '2rem'
  },
  dailyTasksList: {
    flex: 1,
    WebkitFlex: 1
  },
  dailyProgressTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#718096',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dailyTaskItem: {
    display: 'flex',
    display: '-webkit-flex',
    alignItems: 'center',
    WebkitAlignItems: 'center',
    gap: '10px',
    padding: '6px 0'
  },
  dailyTaskCheck: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#E8E8E8',
    display: 'flex',
    display: '-webkit-flex',
    alignItems: 'center',
    WebkitAlignItems: 'center',
    justifyContent: 'center',
    WebkitJustifyContent: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    WebkitTransition: 'all 0.3s ease'
  },
  dailyTaskCheckDone: {
    background: 'linear-gradient(135deg, #8FBC8F 0%, #98D1A3 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #8FBC8F 0%, #98D1A3 100%)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600'
  },
  dailyTaskLabel: {
    fontSize: '0.95rem',
    color: '#4A5568',
    transition: 'all 0.3s ease',
    WebkitTransition: 'all 0.3s ease'
  },
  dailyTaskLabelDone: {
    color: '#8FBC8F',
    fontWeight: '500'
  },
  allCompleteMessage: {
    marginTop: '16px',
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    backgroundImage: '-webkit-linear-gradient(135deg, #E8F5E9 0%, #F3E5F5 100%)',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '0.95rem',
    color: '#4A5568',
    fontWeight: '500'
  },
  // Loading screen styles
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FFFFFF'
  },
  loadingContent: {
    textAlign: 'center'
  },
  loadingEmoji: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '16px',
    animation: 'pulse 2s ease-in-out infinite'
  },
  loadingText: {
    fontSize: '1rem',
    color: '#8FBC8F',
    fontFamily: "'Nunito', sans-serif"
  }
};

export default App;
