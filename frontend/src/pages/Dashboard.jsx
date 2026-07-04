// pages/Dashboard.jsx
// Home/overview page - glass widgets, animated stats, rank, match score chart

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import {
  Repeat2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  Edit3,
  Search,
} from 'lucide-react';
import Layout from '../components/Layout';
import SkillTag from '../components/SkillTag';
import AnimatedCounter from '../components/AnimatedCounter';
import ProgressRing from '../components/ProgressRing';
import RankBadge from '../components/RankBadge';
import { SkeletonCard, SkeletonRow } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { getMatches, getMySessions } from '../services/api';
import { calculateScore, getRank, calculateProfileCompletion } from '../utils/ranking';
import { staggerContainer, cardEntrance } from '../utils/animations';

export default function Dashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [matchRes, sessionRes] = await Promise.all([getMatches(), getMySessions()]);
        setMatches(matchRes.data.matches);
        setSessions(sessionRes.data.sessions);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingSessions = sessions.filter(s => s.status !== 'completed' && s.status !== 'cancelled');
  const score = calculateScore(user, sessions);
  const rank = getRank(score);
  const completion = calculateProfileCompletion(user);
  // ===== DASHBOARD HERO DATA =====

const currentHour = new Date().getHours();

const greeting =
  currentHour < 12
    ? "Good Morning ☀️"
    : currentHour < 17
    ? "Good Afternoon 🌤️"
    : "Good Evening 🌙";

const quotes = [
  "Knowledge grows when it is shared.",
  "Teach one skill today.",
  "Small progress every day leads to big success.",
  "Learning never stops.",
  "Share. Learn. Grow."
];

const todayQuote =
  quotes[new Date().getDate() % quotes.length];

  const chartData = matches.slice(0, 5).map(m => ({
    name: m.user.name.split(' ')[0],
    score: m.matchScore,
    perfect: m.isPerfectMatch,
  }));

  const pieData = [
    { name: 'Teach', value: user?.skillsOffered?.length || 0, color: '#E8893E' },
    { name: 'Want', value: user?.skillsWanted?.length || 0, color: '#2F8F7F' },
  ];
  const hasSkillData = pieData.some(d => d.value > 0);

if (matches.length > 0) {
  console.log(matches[0].user);
}

  return (
    <Layout>
      <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: .45 }}
  className="glass-card rounded-card p-8 mb-8 relative overflow-hidden"
>

<div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-teal/10 blur-3xl"></div>

<div className="grid lg:grid-cols-2 gap-8 relative z-10">

<div>

<p className="text-tealdark font-semibold mb-2">

{greeting}

</p>

<h1 className="font-display text-5xl font-bold text-flip">

Welcome back,

<br/>

{user?.name?.split(" ")[0]} 👋

</h1>

<p className="mt-4 text-flip-muted max-w-xl leading-7">

Keep learning, keep teaching and build your professional
network through SkillSwap.

</p>

<div className="flex flex-wrap gap-3 mt-8">

<Link
to="/profile"
className="px-5 py-3 rounded-xl bg-tealdark text-white flex items-center gap-2 hover:scale-105 transition"
>

<Edit3 size={18}/>

Edit Profile

</Link>

<Link
to="/matches"
className="px-5 py-3 rounded-xl border border-line flex items-center gap-2 hover:bg-white/5 transition"
>

<Search size={18}/>

Find Matches

</Link>

<Link
to="/schedule"
className="px-5 py-3 rounded-xl border border-line flex items-center gap-2 hover:bg-white/5 transition"
>

<Calendar size={18}/>

Schedule

</Link>

</div>

<div className="glass rounded-xl p-4 mt-8">

<p className="text-xs text-flip-muted uppercase">

Today's Motivation

</p>

<p className="mt-2 italic text-flip">

"{todayQuote}"

</p>

</div>

</div>

<div className="grid gap-4">

<div className="glass rounded-xl p-5 flex items-center justify-between">

<div>

<p className="text-xs text-flip-muted">

Current Rank

</p>

<div className="mt-2">

<RankBadge rank={rank} size="lg"/>

</div>

</div>

<ProgressRing
percent={completion}
size={80}
stroke={7}
color="#2F8F7F"
/>

</div>

<div className="grid grid-cols-2 gap-4">

<div className="glass rounded-xl p-4">

<div className="flex items-center gap-2">

<Target className="text-amber"/>

<p className="text-sm font-semibold">

Today's Goal

</p>

</div>

<p className="text-xs mt-3 text-flip-muted">

Complete Profile

</p>

</div>

<div className="glass rounded-xl p-4">

<div className="flex items-center gap-2">

<Clock className="text-tealdark"/>

<p className="text-sm font-semibold">

Sessions

</p>

</div>

<p className="text-3xl font-bold mt-2">

{upcomingSessions.length}

</p>

</div>

</div>

</div>

</div>

</motion.section>
      {/* Stats row */}
<motion.div
  variants={cardEntrance}
  whileHover={{ y: -6, scale: 1.02 }}
  transition={{ duration: .25 }}
  className="glass-card rounded-card p-5 relative overflow-hidden"
>

<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber to-orange-400"/>

<div className="flex justify-between items-center mb-5">

<div>

<p className="text-xs uppercase tracking-widest text-flip-muted">

Skills You Teach

</p>

<h2 className="font-display text-4xl font-bold text-amberdark mt-2">

<AnimatedCounter
value={user?.skillsOffered?.length || 0}
/>

</h2>

</div>

<div className="w-14 h-14 rounded-2xl bg-amber/10 flex items-center justify-center">

<Award
size={28}
className="text-amberdark"
/>

</div>

</div>

<div className="flex justify-between items-center">

<span className="text-xs text-green-500 font-medium">

↑ Active

</span>

<span className="text-xs text-flip-muted">

Updated Today

</span>

</div>

</motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="col-span-2 glass-card rounded-card p-5">
          <p className="text-xs font-mono text-flip-muted mb-3">TOP MATCH SCORES</p>
          {chartData.length === 0 ? (
            <p className="text-sm text-flip-muted py-12 text-center">Add skills to see your match scores here.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#8A8474' }} axisLine={{ stroke: '#D8D2C4' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8A8474' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(47,143,127,0.08)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #D8D2C4', fontSize: 12 }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.perfect ? '#2F8F7F' : '#E8893E'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="glass-card rounded-card p-5">
          <p className="text-xs font-mono text-flip-muted mb-3">SKILL BALANCE</p>
          {!hasSkillData ? (
            <p className="text-sm text-flip-muted py-12 text-center">No skills yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={38} outerRadius={58} paddingAngle={3}>
                  {pieData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #D8D2C4', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex justify-center gap-4 mt-1">
            <span className="text-[11px] font-mono text-amberdark">● Teach</span>
            <span className="text-[11px] font-mono text-tealdark">● Want</span>
          </div>
        </motion.div>
      </div>

{/* Weekly Progress + Activity */}

<div className="grid lg:grid-cols-3 gap-5 mb-8">

  {/* Weekly Progress */}

  <motion.div
    variants={cardEntrance}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -5 }}
    className="glass-card rounded-card p-6"
  >

    <div className="flex items-center justify-between">

      <h2 className="font-display text-lg font-semibold">
        Weekly Progress
      </h2>

      <TrendingUp className="text-tealdark" size={22} />

    </div>

    <div className="mt-6 space-y-5">

      <div>

        <div className="flex justify-between text-sm mb-2">

          <span>Profile Completion</span>

          <span>{completion}%</span>

        </div>

        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

          <motion.div
            initial={{ width:0 }}
            animate={{ width:`${completion}%` }}
            transition={{ duration:1 }}
            className="h-full bg-gradient-to-r from-teal to-cyan-400"
          />

        </div>

      </div>

      <div>

        <div className="flex justify-between text-sm mb-2">

          <span>Skill Growth</span>

          <span>
            {user?.skillsOffered?.length || 0}/10
          </span>

        </div>

        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">

          <motion.div
            initial={{ width:0 }}
            animate={{
              width:`${((user?.skillsOffered?.length||0)*10)}%`
            }}
            transition={{ duration:1 }}
            className="h-full bg-gradient-to-r from-amber to-orange-400"
          />

        </div>

      </div>

    </div>

  </motion.div>





  {/* Activity Feed */}

  <motion.div
    variants={cardEntrance}
    initial="hidden"
    animate="visible"
    whileHover={{ y:-5 }}
    className="glass-card rounded-card p-6 lg:col-span-2"
  >

<h2 className="font-display text-lg font-semibold mb-5">

Recent Activity

</h2>

<div className="space-y-5">

<div className="flex items-start gap-4">

<div className="w-3 h-3 rounded-full bg-teal mt-2"/>

<div>

<p className="font-medium">

Logged into SkillSwap

</p>

<p className="text-xs text-flip-muted">

Today

</p>

</div>

</div>

<div className="flex items-start gap-4">

<div className="w-3 h-3 rounded-full bg-amber mt-2"/>

<div>

<p className="font-medium">

Profile viewed

</p>

<p className="text-xs text-flip-muted">

Yesterday

</p>

</div>

</div>

<div className="flex items-start gap-4">

<div className="w-3 h-3 rounded-full bg-purple-500 mt-2"/>

<div>

<p className="font-medium">

New Match Recommendation

</p>

<p className="text-xs text-flip-muted">

2 days ago

</p>

</div>

</div>

<div className="flex items-start gap-4">

<div className="w-3 h-3 rounded-full bg-green-500 mt-2"/>

<div>

<p className="font-medium">

Keep adding skills to improve matching

</p>

<p className="text-xs text-flip-muted">

AI Suggestion

</p>

</div>

</div>

</div>

</motion.div>

</div>

{/* Quick Actions + Weekly Goal */}

<div className="grid lg:grid-cols-3 gap-5 mb-8">

  {/* Quick Actions */}

  <motion.div
    variants={cardEntrance}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -5 }}
    className="glass-card rounded-card p-6"
  >

    <h2 className="font-display text-xl font-semibold mb-5">
      Quick Actions
    </h2>

    <div className="space-y-3">

      <Link
        to="/profile"
        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-teal/10 transition"
      >
        <span>Edit Profile</span>
        <ArrowRight size={18}/>
      </Link>

      <Link
        to="/explore"
        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-teal/10 transition"
      >
        <span>Explore Users</span>
        <ArrowRight size={18}/>
      </Link>

      <Link
        to="/schedule"
        className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-teal/10 transition"
      >
        <span>Schedule Session</span>
        <ArrowRight size={18}/>
      </Link>

    </div>

  </motion.div>

  {/* Weekly Goal */}

  <motion.div
    variants={cardEntrance}
    initial="hidden"
    animate="visible"
    whileHover={{ y: -5 }}
    className="glass-card rounded-card p-6 lg:col-span-2"
  >

    <div className="flex items-center justify-between">

      <h2 className="font-display text-xl font-semibold">
        Weekly Goal
      </h2>

      <Target className="text-amberdark"/>
    </div>

    <p className="mt-3 text-flip-muted">
      Complete your profile and add more skills to improve your match quality.
    </p>

    <div className="mt-6">

      <div className="flex justify-between mb-2 text-sm">
        <span>Goal Progress</span>
        <span>{completion}%</span>
      </div>

      <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 1 }}
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400"
        />

      </div>

    </div>

    <div className="grid grid-cols-3 gap-4 mt-8">

      <div className="text-center">
        <p className="text-3xl font-bold text-amberdark">
          {user?.skillsOffered?.length || 0}
        </p>
        <p className="text-xs text-flip-muted mt-1">
          Skills
        </p>
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-tealdark">
          {matches.length}
        </p>
        <p className="text-xs text-flip-muted mt-1">
          Matches
        </p>
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold">
          {upcomingSessions.length}
        </p>
        <p className="text-xs text-flip-muted mt-1">
          Sessions
        </p>
      </div>

    </div>

  </motion.div>

</div>  

      {/* Your skills */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="glass-card rounded-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-flip">Your skill ledger</h2>
          <Link to="/profile" className="text-xs text-tealdark hover:underline">Edit profile</Link>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-mono text-amberdark mb-2">YOU TEACH</p>
            <div className="flex flex-wrap gap-2">
              {user?.skillsOffered?.length > 0
                ? user.skillsOffered.map(s => <SkillTag key={s} label={s} type="offer" />)
                : <p className="text-sm text-flip-muted">No skills added yet.</p>}
            </div>
          </div>
          <div className="hairline pt-3">
            <p className="text-xs font-mono text-tealdark mb-2">YOU WANT</p>
            <div className="flex flex-wrap gap-2">
              {user?.skillsWanted?.length > 0
                ? user.skillsWanted.map(s => <SkillTag key={s} label={s} type="want" />)
                : <p className="text-sm text-flip-muted">No skills added yet.</p>}
            </div>
          </div>
        </div>
      </motion.div>

{/* AI Recommendation */}

<motion.div
  variants={cardEntrance}
  initial="hidden"
  animate="visible"
  whileHover={{ y: -5 }}
  className="glass-card rounded-card p-6 mb-8 relative overflow-hidden"
>

<div className="absolute right-0 top-0 w-40 h-40 bg-teal/10 blur-3xl rounded-full"/>

<div className="flex items-center justify-between mb-6">

<div>

<p className="text-xs uppercase tracking-widest text-tealdark">

AI RECOMMENDATION

</p>

<h2 className="font-display text-2xl font-semibold mt-2">

Best Match For You

</h2>

</div>

<Sparkles className="text-amber animate-pulse" size={28}/>

</div>

{
matches.length>0 ? (

<div className="grid lg:grid-cols-[110px,1fr,160px] gap-6 items-center">

<div className="flex justify-center">

<div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">

{matches[0].user.name.charAt(0)}

</div>

</div>

<div>

<h3 className="font-display text-2xl">

{matches[0].user.name}

</h3>

<p className="text-flip-muted mt-2">

Highly compatible based on your skills.

</p>

<div className="flex flex-wrap gap-2 mt-4">

{matches[0].theyCanTeachMe.slice(0,3).map(skill=>(

<span
key={skill}
className="px-3 py-1 rounded-full bg-teal/10 text-tealdark text-sm"
>

{skill}

</span>

))}

</div>

</div>

<div className="text-center">

<div className="text-5xl font-bold text-tealdark">

{matches[0].matchScore}%

</div>

<p className="text-xs mt-2 text-flip-muted">

Compatibility

</p>

<Link
to="/matches"
className="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-tealdark text-white hover:scale-105 transition"
>

View Match

</Link>

</div>

</div>

):(

<div className="text-center py-10">

<Search
size={40}
className="mx-auto text-flip-muted mb-4"
/>

<p className="text-flip-muted">

Complete your profile to receive AI recommendations.

</p>

</div>

)

}

</motion.div>

      {/* Top matches preview */}
      <motion.div variants={cardEntrance} initial="hidden" animate="visible" className="glass-card rounded-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-flip flex items-center gap-2">
            <Sparkles size={18} className="text-amber" />
            Suggested swaps
          </h2>
          <Link to="/matches" className="text-xs text-tealdark hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div>{Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}</div>
        ) : matches.length === 0 ? (
          <p className="text-sm text-flip-muted">No matches yet. Add more skills to find a swap partner.</p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

{matches.slice(0,3).map((m)=>{

const initials = m.user.name
  .split(" ")
  .map(n=>n[0])
  .join("")
  .substring(0,2)
  .toUpperCase();

return(

<motion.div
key={m.user.id}
whileHover={{
  y:-8,
  scale:1.02
}}
transition={{
  duration:.25
}}
className="glass-card rounded-card p-5 relative overflow-hidden border border-white/10"
>

<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-amber-400"/>

<div className="flex items-center justify-between">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white flex items-center justify-center text-lg font-bold shadow-lg">

{initials}

</div>

<div>

<h3 className="font-semibold text-lg">

{m.user.name}

</h3>

<p className="text-xs text-flip-muted">

SkillSwap Member

</p>

</div>

</div>

<div className="text-right">

<div className="text-2xl font-bold text-tealdark">

{m.matchScore}%

</div>

<p className="text-[11px] text-flip-muted">

Match

</p>

</div>

</div>

<div className="mt-6">

<p className="text-xs uppercase tracking-wider text-tealdark mb-2">

Can Teach You

</p>

<div className="flex flex-wrap gap-2">

{m.theyCanTeachMe.length>0?

m.theyCanTeachMe.map(skill=>(

<span
key={skill}
className="px-3 py-1 rounded-full bg-teal/10 text-tealdark text-xs"
>

{skill}

</span>

))

:

<span className="text-xs text-flip-muted">

No Skills

</span>

}

</div>

</div>

<div className="mt-5">

<p className="text-xs uppercase tracking-wider text-amberdark mb-2">

Needs From You

</p>

<div className="flex flex-wrap gap-2">

{m.iCanTeachThem.length>0?

m.iCanTeachThem.map(skill=>(

<span
key={skill}
className="px-3 py-1 rounded-full bg-amber/10 text-amberdark text-xs"
>

{skill}

</span>

))

:

<span className="text-xs text-flip-muted">

No Skills

</span>

}

</div>

</div>

<div className="mt-6 flex gap-3">

<Link
to="/matches"
className="flex-1 rounded-xl bg-tealdark text-white text-sm py-2.5 text-center hover:scale-105 transition"
>

View

</Link>

<button
className="flex-1 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm"
>

Connect

</button>

</div>

{

m.isPerfectMatch && (

<div className="absolute top-4 right-4">

<span className="px-2 py-1 rounded-full text-[10px] bg-green-500/15 text-green-400 font-semibold">

PERFECT

</span>

</div>

)

}

</motion.div>

);

})}

</div>
        )}
      </motion.div>
    </Layout>
  );
}
