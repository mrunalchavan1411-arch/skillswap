// pages/Matches.jsx
// Saare possible matches dikhata hai, score ke hisaab se sorted
// Yahi se user request bhej sakta hai (chat / schedule)

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Repeat2, MessageCircle, CalendarPlus } from 'lucide-react';
import Layout from '../components/Layout';
import SkillTag from '../components/SkillTag';
import { SkeletonCard } from '../components/Skeleton';
import { getMatches } from '../services/api';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getMatches();
        setMatches(res.data.matches);
      } catch (err) {
        console.error('Matches load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <header className="mb-8">
        <p className="text-xs font-mono text-flip-muted mb-1">EXCHANGE BOARD</p>
        <h1 className="font-display text-3xl font-semibold text-flip">Your matches</h1>
        <p className="text-sm text-flip-muted mt-2">Ranked by how well your skills swap with theirs.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="glass-card rounded-card p-10 text-center">
          <Repeat2 size={32} className="mx-auto text-flip-muted mb-3" />
          <p className="text-flip font-medium mb-1">No matches found yet</p>
          <p className="text-sm text-flip-muted">Add more skills to your profile to widen your matches.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {matches.map((m, i) => (
            <motion.div
              key={m.user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="glass-card rounded-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-display font-semibold text-flip">{m.user.name}</p>
                {m.isPerfectMatch && (
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-teal/10 text-tealdark">PERFECT MATCH</span>
                )}
              </div>

              <div className="space-y-2.5 mb-4">
                <div>
                  <p className="text-[11px] font-mono text-tealdark mb-1.5">THEY TEACH YOU</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.theyCanTeachMe.length > 0
                      ? m.theyCanTeachMe.map(s => <SkillTag key={s} label={s} type="want" />)
                      : <span className="text-xs text-flip-muted">No direct match</span>}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-mono text-amberdark mb-1.5">YOU TEACH THEM</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.iCanTeachThem.length > 0
                      ? m.iCanTeachThem.map(s => <SkillTag key={s} label={s} type="offer" />)
                      : <span className="text-xs text-flip-muted">No direct match</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 hairline pt-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/chat', { state: { partnerId: m.user.id, partnerName: m.user.name } })}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-md border border-line dark:border-dline text-flip hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <MessageCircle size={14} /> Message
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/schedule', { state: { partnerId: m.user.id, partnerName: m.user.name } })}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-md bg-grad-amber-teal text-white hover:opacity-90 transition-opacity"
                >
                  <CalendarPlus size={14} /> Schedule
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
