// utils/ranking.js
// Simple ranking system - skills count + completed sessions ke basis pe rank decide hota hai
// Yeh purely frontend calculation hai (backend se mile data ko process karta hai)

export const RANKS = [
  { name: 'Bronze',   min: 0,  color: '#A1683F', bg: 'rgba(161,104,63,0.12)' },
  { name: 'Silver',   min: 4,  color: '#8A8FA3', bg: 'rgba(138,143,163,0.14)' },
  { name: 'Gold',     min: 9,  color: '#C99A2E', bg: 'rgba(201,154,46,0.14)' },
  { name: 'Platinum', min: 15, color: '#3FA8A0', bg: 'rgba(63,168,160,0.14)' },
  { name: 'Diamond',  min: 24, color: '#4F8FE8', bg: 'rgba(79,143,232,0.14)' },
];

// Score = (skills offered + skills wanted) * 2 + (completed sessions * 3)
export function calculateScore(user, sessions = []) {
  const skillCount = (user?.skillsOffered?.length || 0) + (user?.skillsWanted?.length || 0);
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  return skillCount * 2 + completedSessions * 3;
}

export function getRank(score) {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (score >= r.min) current = r;
  }
  return current;
}

export function getNextRank(score) {
  const idx = RANKS.findIndex(r => r.name === getRank(score).name);
  return RANKS[idx + 1] || null;
}

// Profile completion percentage - bio, location, skills, profile pic basis pe
export function calculateProfileCompletion(user) {
  const checks = [
    !!user?.bio,
    !!user?.location,
    (user?.skillsOffered?.length || 0) > 0,
    (user?.skillsWanted?.length || 0) > 0,
    (user?.skillsOffered?.length || 0) >= 2,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
