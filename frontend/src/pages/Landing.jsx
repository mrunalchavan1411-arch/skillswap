// pages/Landing.jsx
// Public landing page - first impression. Animated hero + how it works + CTA.

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Repeat2, MessageCircle, CalendarClock, Sparkles, ArrowRight, UserPlus, Search, Handshake } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'List your skills', desc: 'Add what you can teach and what you want to learn.' },
  { icon: Search, title: 'Get matched', desc: 'Our algorithm finds classmates whose skills complete yours.' },
  { icon: Handshake, title: 'Swap & grow', desc: 'Chat, schedule a session, and trade knowledge — no money involved.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' } }),
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-paper overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 lg:px-16 py-6">
        <div className="flex items-center gap-2">
          <Repeat2 className="text-amberdark" size={26} strokeWidth={2.4} />
          <span className="font-display font-semibold text-lg text-ink">SkillSwap</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-ink hover:text-tealdark transition-colors">
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-md hover:bg-inklight transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 lg:px-16 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-tealdark bg-teal/10 px-3 py-1.5 rounded-full mb-5">
            <Sparkles size={12} /> College Resource Sharing Web App
          </span>
          <h1 className="font-display text-5xl lg:text-6xl font-semibold text-ink leading-[1.05] mb-6">
            Trade skills,<br />not money.
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-md mb-8">
            Every student knows something worth teaching. List it, find a classmate
            who has what you want, and swap — Photoshop for guitar, Excel for Spanish,
            your call.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center gap-2 bg-ink text-paper font-medium px-6 py-3 rounded-md hover:bg-inklight transition-colors"
            >
              Start swapping <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} className="text-ink font-medium px-2 py-3 hover:text-tealdark transition-colors">
              I have an account
            </button>
          </div>
        </motion.div>

        {/* Animated swap illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative h-80 lg:h-96"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-white rounded-card border border-line shadow-lg p-5 w-56 absolute -left-2 top-6 rotate-[-4deg]"
            >
              <p className="text-[10px] font-mono text-amberdark mb-2">YOU TEACH</p>
              <p className="font-display font-semibold text-ink mb-3">Photoshop</p>
              <span className="skill-tag border-amberdark/40 text-amberdark">Design</span>
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="z-10 bg-amber text-white rounded-full p-4 shadow-lg"
            >
              <Repeat2 size={28} strokeWidth={2.4} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="bg-white rounded-card border border-line shadow-lg p-5 w-56 absolute -right-2 bottom-6 rotate-[4deg]"
            >
              <p className="text-[10px] font-mono text-tealdark mb-2">YOU LEARN</p>
              <p className="font-display font-semibold text-ink mb-3">Guitar</p>
              <span className="skill-tag border-tealdark/40 text-tealdark">Music</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-8 lg:px-16 py-20 bg-ink">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-xs font-mono text-amber mb-2 text-center"
          >
            HOW IT WORKS
          </motion.p>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-display text-3xl font-semibold text-paper text-center mb-12"
          >
            Three steps to your first swap
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="bg-white/5 border border-white/10 rounded-card p-6"
              >
                <s.icon className="text-amber mb-4" size={28} strokeWidth={2} />
                <p className="font-display font-semibold text-paper mb-2">{s.title}</p>
                <p className="text-sm text-paper/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="px-8 lg:px-16 py-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Sparkles className="text-amberdark mb-3" size={24} />
            <p className="font-display font-semibold text-ink mb-1">Smart matching</p>
            <p className="text-sm text-muted">Ranked by how well your skills complement theirs — two-way matches surface first.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
            <MessageCircle className="text-tealdark mb-3" size={24} />
            <p className="font-display font-semibold text-ink mb-1">Live chat</p>
            <p className="text-sm text-muted">Message your match instantly and work out the details in real time.</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}>
            <CalendarClock className="text-ink mb-3" size={24} />
            <p className="font-display font-semibold text-ink mb-1">Easy scheduling</p>
            <p className="text-sm text-muted">Book a session, track its status, and keep your swaps organized.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-8 lg:px-16 py-16 text-center border-t border-line">
        <h3 className="font-display text-2xl font-semibold text-ink mb-5">Ready to make your first trade?</h3>
        <button
          onClick={() => navigate('/signup')}
          className="inline-flex items-center gap-2 bg-ink text-paper font-medium px-6 py-3 rounded-md hover:bg-inklight transition-colors"
        >
          Create your account <ArrowRight size={16} />
        </button>
        <p className="text-xs text-muted font-mono mt-8">College Resource Sharing Web App — Final Year Project</p>
      </section>
    </div>
  );
}
