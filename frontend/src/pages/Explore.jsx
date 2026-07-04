// pages/Explore.jsx
// Discover page - saare users browse/search/filter kar sakte hain

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, CalendarPlus, UserCircle, Compass } from 'lucide-react';
import Layout from '../components/Layout';
import SkillTag from '../components/SkillTag';
import Avatar from '../components/Avatar';
import { SkeletonCard } from '../components/Skeleton';
import { getAllUsers } from '../services/api';

export default function Explore() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | teaches | wants

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllUsers();
        setUsers(res.data.users);
      } catch (err) {
        console.error('Explore load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Trending skills - sabse zyada offer hone wali skills nikalte hain (chips ke liye)
  const trendingSkills = useMemo(() => {
    const count = {};
    users.forEach(u => u.skillsOffered?.forEach(s => { count[s] = (count[s] || 0) + 1; }));
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([skill]) => skill);
  }, [users]);

  const filtered = users.filter(u => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const inOffered = u.skillsOffered?.some(s => s.toLowerCase().includes(q));
    const inWanted = u.skillsWanted?.some(s => s.toLowerCase().includes(q));
    const inName = u.name.toLowerCase().includes(q);
    const inLocation = u.location?.toLowerCase().includes(q);
    if (filter === 'teaches') return inOffered;
    if (filter === 'wants') return inWanted;
    return inOffered || inWanted || inName || inLocation;
  });

  return (
    <Layout>
      <header className="mb-7">
        <p className="text-xs font-mono text-flip-muted mb-1">DISCOVER</p>
        <h1 className="font-display text-3xl font-semibold text-flip flex items-center gap-2">
          <Compass className="text-amber" size={28} /> Explore students
        </h1>
        <p className="text-sm text-flip-muted mt-2">Search by name, skill, or location.</p>
      </header>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="glass-card rounded-card p-6 mb-6"
  style={{
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
}}
>
  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-flip-muted">
        COMMUNITY
      </p>

      <h2 className="font-display text-3xl font-bold text-flip mt-2">
        Find Your Perfect Learning Partner 🚀
      </h2>

      <p className="text-sm text-flip-muted mt-2">
        Explore students, discover new skills and start learning together.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-4">

      <div className="text-center">
        <h3 className="text-3xl font-bold text-cyan-400">
          {users.length}
        </h3>
        <p className="text-xs text-flip-muted">
          Students
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-3xl font-bold text-amber-400">
          {trendingSkills.length}
        </h3>
        <p className="text-xs text-flip-muted">
          Skills
        </p>
      </div>

      <div className="text-center">
        <h3 className="text-3xl font-bold text-green-400">
          {filtered.length}
        </h3>
        <p className="text-xs text-flip-muted">
          Results
        </p>
      </div>

    </div>

  </div>
</motion.div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-flip-muted" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 'Guitar', 'Riya', 'Excel'..."
          className="w-full pl-11 pr-4 py-3 rounded-card glass-card text-flip placeholder:text-flip-muted/70 focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { id: 'all', label: 'Everyone' },
          { id: 'teaches', label: 'Can teach me' },
          { id: 'wants', label: 'Wants to learn' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === f.id
                ? 'bg-ink text-paper border-ink dark:bg-teal dark:border-teal'
                : 'border-line dark:border-dline text-flip-muted hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Trending skills */}
      {trendingSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-7">
          <span className="text-[11px] font-mono text-flip-muted">TRENDING:</span>
          {trendingSkills.map(s => (
            <button key={s} onClick={() => setQuery(s)}>
              <SkillTag label={s} type="offer" />
            </button>
          ))}
        </div>
      )}

      {/* Results grid */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-card p-10 text-center">
          <UserCircle size={32} className="mx-auto text-flip-muted mb-3" />
          <p className="text-flip font-medium mb-1">No students found</p>
          <p className="text-sm text-flip-muted">Try a different search term.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((u, i) => (
              <motion.div
                key={u.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-card p-5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">



  <Avatar user={u} size="md" />

  <div className="min-w-0">
    <p className="font-semibold text-flip truncate">
      {u.name}
    </p>

    {u.location && (
      <p className="text-xs text-flip-muted truncate">
        📍 {u.location}
      </p>
    )}
  </div>
</div>

<div className="px-2 py-1 rounded-full bg-green-500/10">
<div className="mt-2 text-center">
  <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
    ✔ Verified Student
  </span>
</div>
  <span className="text-[11px] text-green-400">
    ● Online
  </span>
</div>
                </div>

                {u.bio && <p className="text-xs text-flip-muted mb-3 line-clamp-2">{u.bio}</p>}

                <div className="flex items-center justify-between mb-4">

  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
      style={{
        width: `${70 + (u.skillsOffered?.length || 0) * 5}%`
      }}
    />
  </div>

  <span className="ml-3 text-xs font-semibold text-cyan-400 whitespace-nowrap">
    {Math.min(95, 70 + (u.skillsOffered?.length || 0) * 5)}% Match
  </span>

</div>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {u.skillsOffered?.slice(0, 3).map(s => <SkillTag key={s} label={s} type="offer" />)}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {u.skillsWanted?.slice(0, 3).map(s => <SkillTag key={s} label={s} type="want" />)}
                  </div>
                </div>

                <div className="flex gap-2 hairline pt-3">
                  <button
                    onClick={() => navigate('/chat', { state: { partnerId: u.id, partnerName: u.name } })}
                    classNameclassName="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:scale-105 transition-all duration-300"
                  >
                    <MessageCircle size={13} /> Message
                  </button>
                  <button
                    onClick={() => navigate('/schedule', { state: { partnerId: u.id, partnerName: u.name } })}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/20"
                  >
                    <CalendarPlus size={13} /> Schedule
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Layout>
  );
}
