// pages/Schedule.jsx
// Session booking aur upcoming/past sessions ki list

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarClock, Check, X, Clock } from 'lucide-react';
import Layout from '../components/Layout';
import { useToast } from '../context/ToastContext';
import { createSession, getMySessions, updateSessionStatus, deleteSession, getMatches } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusStyles = {
  pending: 'bg-amber/10 text-amberdark',
  confirmed: 'bg-teal/10 text-tealdark',
  completed: 'bg-ink/10 text-flip',
  cancelled: 'bg-red-50 text-red-600',
};

export default function Schedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    partnerId: location.state?.partnerId || '',
    skill: '',
    date: '',
    time: '',
    mode: 'online',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sessRes, matchRes] = await Promise.all([getMySessions(), getMatches()]);
        setSessions(sessRes.data.sessions);
        setMatches(matchRes.data.matches);
      } catch (err) {
        console.error('Schedule load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.partnerId || !form.skill || !form.date || !form.time) {
      setFormError('Saari fields bharo.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createSession(form);
      setSessions([res.data.session, ...sessions]);
      setForm({ partnerId: '', skill: '', date: '', time: '', mode: 'online' });
      toast('Session booked successfully!', 'success');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Booking fail hui.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateSessionStatus(id, status);
      setSessions(sessions.map(s => s.id === id ? { ...s, status } : s));
      toast(`Session ${status}!`, 'success');
    } catch {
      toast('Status update failed.', 'error');
    }
  };

  const handleCancel = async (id) => {
    try {
      await deleteSession(id);
      setSessions(sessions.filter(s => s.id !== id));
      toast('Session cancelled.', 'info');
    } catch {
      toast('Could not cancel session.', 'error');
    }
  };

  // Selected partner ke saath kya skills swap ho sakti hain - dropdown ke liye
  const selectedMatch = matches.find(m => m.user.id === form.partnerId);
  const possibleSkills = selectedMatch ? [...selectedMatch.iCanTeachThem, ...selectedMatch.theyCanTeachMe] : [];

  return (
    <Layout>
      <header className="mb-8">

  <p className="text-xs font-mono tracking-[0.25em] text-flip-muted mb-2">
    SESSION MANAGEMENT
  </p>

  <div className="flex items-center justify-between flex-wrap gap-4">

    <div>

      <h1 className="font-display text-4xl font-bold text-flip">
        Schedule Sessions 📅
      </h1>

      <p className="text-sm text-flip-muted mt-2">
        Book, manage and track your upcoming learning sessions.
      </p>

    </div>

    <div className="glass-card rounded-xl px-5 py-3">

      <p className="text-xs text-flip-muted">
        Total Sessions
      </p>

      <h2 className="text-3xl font-bold text-cyan-400">
        {sessions.length}
      </h2>

    </div>

  </div>

</header>

      <div className="grid grid-cols-3 gap-6">
        {/* Booking form */}
        <div className="col-span-1 glass-card rounded-card p-6 h-fit border border-cyan-500/20 shadow-xl">
          <div className="mb-6">

  <p className="text-xs font-mono tracking-[0.25em] text-flip-muted mb-2">
    NEW SESSION
  </p>

  <h2 className="font-display text-2xl font-bold text-flip flex items-center gap-3">

    <CalendarClock
      size={24}
      className="text-cyan-400"
    />

    Book a Session

  </h2>

  <p className="text-sm text-flip-muted mt-2">
    Schedule a new learning session with your matched partner.
  </p>

</div>

          {formError && (
            <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs">
              {formError}
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-flip-muted mb-1">PARTNER</label>
              <select
                value={form.partnerId}
                onChange={(e) => setForm({ ...form, partnerId: e.target.value, skill: '' })}
                className="w-full px-4 py-3 rounded-xl border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              >
                <option value="">Select a match</option>
                {matches.map(m => (
                  <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-flip-muted mb-1">SKILL</label>
              <select
                value={form.skill}
                onChange={(e) => setForm({ ...form, skill: e.target.value })}
                disabled={!form.partnerId}
                className="w-full px-4 py-3 rounded-xl border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all disabled:bg-black/5 dark:bg-white/5"
              >
                <option value="">Select skill</option>
                {possibleSkills.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-mono text-flip-muted mb-1">DATE</label>
                <input
                  type="date" value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-flip-muted mb-1">TIME</label>
                <input
                  type="time" value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-flip-muted mb-1">MODE</label>
              <div className="flex gap-2">
                {['online', 'offline'].map(m => (
                  <button
                    key={m} type="button"
                    onClick={() => setForm({ ...form, mode: m })}
                    className={`flex-1 text-xs py-2 rounded-md border capitalize ${
                      form.mode === m ? 'bg-ink text-paper border-ink' : 'border-line dark:border-dline text-flip-muted'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.96 }}
  type="submit"
  disabled={submitting}
  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
>

  {submitting ? "Booking Session..." : "🚀 Book Session"}

</motion.button>
          </form>
        </div>

        {/* Sessions list */}
        <div className="col-span-2 space-y-3">
          {loading ? (
            <div>{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-card mb-3" />)}</div>
          ) : sessions.length === 0 ? (
            <div className="glass-card rounded-card p-12 text-center border border-cyan-500/20">

  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 flex items-center justify-center">

    <Clock
      size={42}
      className="text-cyan-400"
    />

  </div>

  <h2 className="text-2xl font-bold text-flip mb-3">
    No Sessions Yet
  </h2>

  <p className="text-flip-muted max-w-sm mx-auto leading-7">
    You haven't booked any learning sessions yet.
    Schedule your first session and start exchanging skills with other students.
  </p>

</div>
          ) : (
            sessions.map((s) => {
              const isOwner = s.userId === user.id;
              const partnerName = isOwner ? s.partnerName : s.userName;
              return (
                <div key={s.id} className="glass-card rounded-card p-6 border border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
                  <div>
                    <p className="font-display text-xl font-bold text-flip">{s.skill} — with {partnerName}</p>
                    <p className="text-xs text-flip-muted mt-1">{s.date} at {s.time} · {s.mode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-1 rounded-full capitalize ${statusStyles[s.status]}`}>
                      {s.status}
                    </span>
                    {s.status === 'pending' && !isOwner && (
                      <button onClick={() => handleStatusChange(s.id, 'confirmed')} className="p-1.5 rounded-md hover:bg-teal/10 text-tealdark" aria-label="Confirm session">
                        <Check size={15} />
                      </button>
                    )}
                    {s.status !== 'cancelled' && s.status !== 'completed' && (
                      <button onClick={() => handleCancel(s.id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-500" aria-label="Cancel session">
                        <X size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
