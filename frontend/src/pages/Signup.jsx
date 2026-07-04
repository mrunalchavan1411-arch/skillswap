// pages/Signup.jsx
// Signup page - basic info + skills offered/wanted set karna yahi se shuru hota hai

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Repeat2, ArrowRight, Plus } from 'lucide-react';
import { signupApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SkillTag from '../components/SkillTag';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [offerInput, setOfferInput] = useState('');
  const [wantInput, setWantInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const addSkill = (type) => {
    if (type === 'offer' && offerInput.trim()) {
      if (!skillsOffered.includes(offerInput.trim())) {
        setSkillsOffered([...skillsOffered, offerInput.trim()]);
      }
      setOfferInput('');
    }
    if (type === 'want' && wantInput.trim()) {
      if (!skillsWanted.includes(wantInput.trim())) {
        setSkillsWanted([...skillsWanted, wantInput.trim()]);
      }
      setWantInput('');
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(type);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (skillsOffered.length === 0 || skillsWanted.length === 0) {
      setError('Kam se kam 1 skill offer karo aur 1 skill chahiye wo bharo.');
      return;
    }

    setLoading(true);
    try {
      const res = await signupApi({ name, email, password, skillsOffered, skillsWanted });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup me kuch gadbad hui. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-1/2 bg-ink text-paper flex-col justify-between px-14 py-12">
        <div className="flex items-center gap-2">
          <Repeat2 className="text-amber" size={28} strokeWidth={2.4} />
          <span className="font-display font-semibold text-xl">SkillSwap</span>
        </div>

        <div>
          <h1 className="font-display text-4xl leading-tight mb-4">
            Every student<br />has something to trade.
          </h1>
          <p className="text-paper/60 max-w-md leading-relaxed mb-8">
            List the skills you already have, and the ones you want next.
            We'll find the classmate on the other side of the trade.
          </p>
          <div className="flex gap-3 text-sm">
            <span className="skill-tag border-amber/50 text-amber">Photoshop</span>
            <span className="text-paper/30 self-center">⇄</span>
            <span className="skill-tag border-teal/50 text-teal">Guitar</span>
          </div>
        </div>

        <p className="text-xs text-paper/40 font-mono">College Resource Sharing Web App</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-paper px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Repeat2 className="text-amberdark" size={26} />
            <span className="font-display font-semibold text-xl text-ink">SkillSwap</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink mb-1">Create your account</h2>
          <p className="text-sm text-muted mb-6">Takes less than a minute.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">FULL NAME</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Riya Sharma"
                className="w-full px-4 py-2.5 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">EMAIL</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2.5 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">PASSWORD</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full px-4 py-2.5 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>

            {/* Skills offered */}
            <div>
              <label className="block text-xs font-mono text-amberdark mb-1.5">I CAN TEACH</label>
              <div className="flex gap-2">
                <input
                  type="text" value={offerInput}
                  onChange={(e) => setOfferInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'offer')}
                  placeholder="e.g. Excel, Photoshop"
                  className="flex-1 px-4 py-2 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber text-sm"
                />
                <button type="button" onClick={() => addSkill('offer')} className="px-3 rounded-md border border-amberdark/40 text-amberdark hover:bg-amber/10">
                  <Plus size={16} />
                </button>
              </div>
              {skillsOffered.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsOffered.map((s) => (
                    <SkillTag key={s} label={s} type="offer" onRemove={() => setSkillsOffered(skillsOffered.filter(x => x !== s))} />
                  ))}
                </div>
              )}
            </div>

            {/* Skills wanted */}
            <div>
              <label className="block text-xs font-mono text-tealdark mb-1.5">I WANT TO LEARN</label>
              <div className="flex gap-2">
                <input
                  type="text" value={wantInput}
                  onChange={(e) => setWantInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'want')}
                  placeholder="e.g. Guitar, Spanish"
                  className="flex-1 px-4 py-2 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal text-sm"
                />
                <button type="button" onClick={() => addSkill('want')} className="px-3 rounded-md border border-tealdark/40 text-tealdark hover:bg-teal/10">
                  <Plus size={16} />
                </button>
              </div>
              {skillsWanted.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillsWanted.map((s) => (
                    <SkillTag key={s} label={s} type="want" onRemove={() => setSkillsWanted(skillsWanted.filter(x => x !== s))} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper font-medium py-2.5 rounded-md hover:bg-inklight transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-tealdark font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
