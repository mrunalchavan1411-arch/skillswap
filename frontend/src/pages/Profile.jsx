// pages/Profile.jsx
// Premium profile page - avatar upload, cover, rank, completion ring, editable skills

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, MapPin, Mail, TrendingUp, Camera, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import Avatar from '../components/Avatar';
import SkillTag from '../components/SkillTag';
import ProgressRing from '../components/ProgressRing';
import RankBadge from '../components/RankBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateMyProfile, getMySessions, uploadAvatar } from '../services/api';
import { calculateScore, getRank, getNextRank, calculateProfileCompletion } from '../utils/ranking';
import { fadeUp } from '../utils/animations';

export default function Profile() {
  const { user, updateUserInContext } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [bio, setBio]               = useState(user?.bio || '');
  const [location, setLocation]     = useState(user?.location || '');
  const [skillsOffered, setSkillsOffered] = useState(user?.skillsOffered || []);
  const [skillsWanted, setSkillsWanted]   = useState(user?.skillsWanted || []);
  const [offerInput, setOfferInput] = useState('');
  const [wantInput, setWantInput]   = useState('');
  const [saving, setSaving]         = useState(false);
  const [sessions, setSessions]     = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading]   = useState(false);

  useEffect(() => {
    getMySessions().then(r => setSessions(r.data.sessions)).catch(() => {});
  }, []);

  const score      = calculateScore(user, sessions);
  const rank       = getRank(score);
  const nextRank   = getNextRank(score);
  const completion = calculateProfileCompletion(user);
  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  const addSkill = (type) => {
    if (type === 'offer' && offerInput.trim()) {
      if (!skillsOffered.includes(offerInput.trim())) setSkillsOffered([...skillsOffered, offerInput.trim()]);
      setOfferInput('');
    }
    if (type === 'want' && wantInput.trim()) {
      if (!skillsWanted.includes(wantInput.trim())) setSkillsWanted([...skillsWanted, wantInput.trim()]);
      setWantInput('');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await uploadAvatar(formData);
      updateUserInContext(res.data.user);
      setAvatarPreview(null);
      toast('Profile photo updated!', 'success');
    } catch {
      setAvatarPreview(null);
      toast('Photo upload failed. Try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateMyProfile({ bio, location, skillsOffered, skillsWanted });
      updateUserInContext(res.data.user);
      toast('Profile saved!', 'success');
    } catch {
      toast('Could not save profile. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const BACKEND = 'http://localhost:5000';
  const avatarSrc = avatarPreview || (user?.avatar ? `${BACKEND}${user.avatar}` : null);

  return (
    <Layout>
      <motion.header {...fadeUp(0)} className="mb-6">
        <p className="text-xs font-mono text-flip-muted mb-1">YOUR PROFILE</p>
        <h1 className="font-display text-3xl font-semibold text-flip">Edit profile</h1>
      </motion.header>

      {/* Cover + identity card */}
      <motion.div {...fadeUp(0.04)} className="glass-card rounded-card overflow-hidden mb-6">
        {/* Cover */}
        <div className="relative h-64 overflow-hidden rounded-t-card bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-900">
          <div className="absolute inset-0 opacity-25"
          
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />
          <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />

<div
  className="absolute bottom-0 left-10 w-56 h-56 rounded-full bg-amber-400/20 blur-3xl"
  style={{
    animation: "pulse 8s infinite"
  }}
/>
        </div>
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />

<div
  className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl"
  style={{
    animation: "pulse 6s infinite"
  }}
/>

<div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />

        {/* Identity row */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap items-end gap-4 -mt-12 mb-4">
            {/* Avatar with upload overlay */}
            <div className="relative shrink-0 group">
              <div className="w-36 h-36 rounded-full ring-8 ring-white dark:ring-dsurface overflow-hidden bg-grad-amber-teal flex items-center justify-center shadow-2xl shadow-cyan-500/30"className="w-36 h-36 rounded-full ring-8 ring-white dark:ring-dsurface overflow-hidden bg-grad-amber-teal flex items-center justify-center">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-display text-3xl font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <Loader2 size={22} className="text-white animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-amber border-2 border-white dark:border-dsurface flex items-center justify-center shadow-md hover:bg-amberdark transition-colors"
                aria-label="Change profile photo"
              >
                <Camera size={13} className="text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="pb-2 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">

  <h1 className="font-display font-bold text-5xl tracking-tight text-flip">
    {user?.name}
  </h1>

  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30">

    <span className="text-xs font-semibold text-amber-300">
      ✨ Premium Member
    </span>

  </div>

</div>
             <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-flip-muted">
                <span className="flex items-center gap-1"><Mail size={11} />{user?.email}</span>
                <div className="flex flex-wrap gap-2 mt-4">

  <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs">
    🚀 Active Learner
  </span>

  <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs">
    💡 Skill Mentor
  </span>

  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs">
    🔥 Fast Responder
  </span>

</div>
                {location && <span className="flex items-center gap-1"><MapPin size={11} />{location}</span>}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-4 border-t border-white/10 pt-4">
                <RankBadge rank={rank} size="md" />
                {nextRank && (
                  <span className="text-xs text-flip-muted flex items-center gap-1">
                    <TrendingUp size={11} /> {nextRank.min - score} pts to {nextRank.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          {
            delay: 0.08,
            content: (
              <div className="flex items-center gap-4">
                <ProgressRing percent={completion} size={64} stroke={6} color="#2F8F7F" />
                <div>
                  <p className="text-xs font-mono text-flip-muted">PROFILE</p>
                  <p className="text-sm font-semibold text-flip">Completion</p>
                  {completion < 100 && <p className="text-[11px] text-flip-muted mt-0.5">Add bio & location</p>}
                </div>
              </div>
            )
          },
          {
            delay: 0.12,
            content: (
              <>
                <p className="text-xs font-mono text-flip-muted mb-2">CONTRIBUTION SCORE</p>
                <p className="font-display text-3xl font-semibold text-amberdark">{score}</p>
                <p className="text-xs text-flip-muted mt-1">Based on skills & sessions</p>
              </>
            )
          },
          {
            delay: 0.16,
            content: (
              <>
                <p className="text-xs font-mono text-flip-muted mb-2">SESSIONS COMPLETED</p>
                <p className="font-display text-3xl font-semibold text-tealdark">{completedSessions}</p>
                <p className="text-xs text-flip-muted mt-1">of {sessions.length} total</p>
              </>
            )
          },
        ].map(({ delay, content }, i) => (
          <motion.div key={i} {...fadeUp(delay)} className="glass-card rounded-card p-5 hover:-translate-y-1 hover:shadow-lg transition duration-300">
            {content}
          </motion.div>
        ))}
      </div>
<motion.div
  {...fadeUp(0.18)}
  className="glass-card rounded-card p-6 mb-6"
>

  <div className="flex items-center justify-between mb-5">

    <h2 className="font-display text-lg font-semibold">
      Quick Overview
    </h2>

    <RankBadge rank={rank} size="md" />

  </div>

  <div className="grid md:grid-cols-4 gap-4">

    <div className="rounded-xl bg-white/5 p-4">

      <p className="text-xs text-flip-muted">
        Skills Offered
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {skillsOffered.length}
      </h2>

    </div>

    <div className="rounded-xl bg-white/5 p-4">

      <p className="text-xs text-flip-muted">
        Skills Wanted
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {skillsWanted.length}
      </h2>

    </div>

    <div className="rounded-xl bg-white/5 p-4">

      <p className="text-xs text-flip-muted">
        Sessions
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {completedSessions}
      </h2>

    </div>

    <div className="rounded-xl bg-white/5 p-4">

      <p className="text-xs text-flip-muted">
        Contribution
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {score}
      </h2>

    </div>

  </div>

</motion.div>
<motion.div
  {...fadeUp(0.18)}
  className="glass-card rounded-card p-6 mb-6"
>
  <div className="flex items-center justify-between mb-5">
    <h2 className="font-display text-xl font-semibold text-flip">
      🏆 Achievements
    </h2>

    <span className="text-xs text-flip-muted">
      Keep growing your profile
    </span>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-center hover:scale-105 hover:shadow-lg transition-all duration-300">
      <div className="text-4xl mb-3">🥇</div>
      <h3 className="font-semibold text-flip">
        {rank.name}
      </h3>
      <p className="text-xs text-flip-muted mt-1">
        Current Rank
      </p>
    </div>

    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-center hover:scale-105 hover:shadow-lg transition-all duration-300">
      <div className="text-4xl mb-3">📚</div>
      <h3 className="font-semibold text-flip">
        {skillsOffered.length}
      </h3>
      <p className="text-xs text-flip-muted mt-1">
        Skills Shared
      </p>
    </div>

    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-center hover:scale-105 transition">
      <div className="text-4xl mb-3">🎯</div>
      <h3 className="font-semibold text-flip">
        {completedSessions}
      </h3>
      <p className="text-xs text-flip-muted mt-1">
        Sessions Done
      </p>
    </div>

    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5 text-center hover:scale-105 transition">
      <div className="text-4xl mb-3">⭐</div>
      <h3 className="font-semibold text-flip">
        {score}
      </h3>
      <p className="text-xs text-flip-muted mt-1">
        Contribution Score
      </p>
    </div>

  </div>
</motion.div>

      {/* Edit form */}
      <motion.div {...fadeUp(0.2)} className="glass-card rounded-card p-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">

  <div>

    <p className="text-xs uppercase tracking-[0.25em] text-flip-muted mb-1">
      PROFILE SETTINGS
    </p>

    <h2 className="font-display text-2xl font-bold text-flip">
      Personal Information
    </h2>

    <p className="text-sm text-flip-muted mt-1">
      Keep your profile updated to get better skill matches.
    </p>

  </div>

  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-cyan-500/20">

    <span className="text-sm font-semibold text-cyan-300">
      {completion}% Complete
    </span>

  </div>

</div>
        <div className="grid xl:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
<div className="xl:col-span-2 space-y-5">
          <div>
  <label className="block text-xs font-mono text-flip-muted mb-1.5">
    BIO
  </label>

  <textarea
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Tell the community about your experience, interests and the skills you love to teach...."
    rows={3}
    className="w-full px-4 py-2.5 rounded-xl shadow-lg border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 resize-none transition-shadow"
  />

  <p className="text-right text-[11px] text-flip-muted mt-1">
    {bio.length}/250 Characters
  </p>
</div>
          <div>
            <label className="block text-xs font-mono text-flip-muted mb-1.5">LOCATION</label>
            <input
              type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="Pune, Maharashtra"
              className="w-full px-4 py-2.5 rounded-md border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 transition-shadow"
            />
          </div>

          {/* Skills I teach */}
          <div>
            <label className="block text-xs font-mono text-amberdark mb-1.5">SKILLS YOU TEACH</label>
            <div className="flex gap-3 mb-3">
              <input
                type="text" value={offerInput} onChange={(e) => setOfferInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill('offer'); } }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-4 py-2 rounded-xl border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm focus:outline-none focus:ring-2 focus:ring-amber/40"
              />
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => addSkill('offer')} className="px-4 py-2 rounded-xl border border-amberdark/40 text-amberdark hover:bg-amber/10">
                <Plus size={16} />
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[28px]">
              {skillsOffered.length === 0
                ? <p className="text-xs text-flip-muted">No skills added yet.</p>
                : skillsOffered.map(s => (
                  <motion.span key={s} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <SkillTag label={s} type="offer" onRemove={() => setSkillsOffered(skillsOffered.filter(x => x !== s))} />
                  </motion.span>
                ))}
            </div>
          </div>

          {/* Skills I want */}
          <div>
            <label className="block text-xs font-mono text-tealdark mb-1.5">SKILLS YOU WANT</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text" value={wantInput} onChange={(e) => setWantInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill('want'); } }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-4 py-2 rounded-xl border border-line dark:border-dline bg-white/70 dark:bg-dsurface2/70 text-flip text-sm focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => addSkill('want')} className="px-4 py-2 rounded-xl border border-tealdark/40 text-tealdark hover:bg-teal/10">
                <Plus size={16} />
              </motion.button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[28px]">
              {skillsWanted.length === 0
                ? <p className="text-xs text-flip-muted">No skills added yet.</p>
                : skillsWanted.map(s => (
                  <motion.span key={s} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <SkillTag label={s} type="want" onRemove={() => setSkillsWanted(skillsWanted.filter(x => x !== s))} />
                  </motion.span>
                ))}
            </div>
          </div>

          <motion.button
  whileTap={{ scale: 0.97 }}
  onClick={handleSave}
  disabled={saving}
  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-cyan-500/20 disabled:opacity-60"
>
  {saving ? (
    <Loader2 size={15} className="animate-spin" />
  ) : (
    <Save size={15} />
  )}

  {saving ? "Saving..." : "Save Changes"}
</motion.button>
</div>
        </div>
      </motion.div>
    
    </Layout>
  );
}
