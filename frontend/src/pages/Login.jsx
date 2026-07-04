// pages/Login.jsx
// Login page - split screen design: left side branding, right side form

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Repeat2, ArrowRight } from 'lucide-react';
import { loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginApi({ email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login me kuch gadbad hui. Try again.');
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
            Teach what you know.<br />Learn what you don't.
          </h1>
          <p className="text-paper/60 max-w-md leading-relaxed">
            A campus exchange where every skill is currency. List what you can teach,
            find who can teach you back, and swap — no money involved.
          </p>
        </div>

        <p className="text-xs text-paper/40 font-mono">College Resource Sharing Web App</p>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-paper px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Repeat2 className="text-amberdark" size={26} />
            <span className="font-display font-semibold text-xl text-ink">SkillSwap</span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h2>
          <p className="text-sm text-muted mb-8">Log in to continue your skill exchange.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-2.5 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-md border border-line bg-white text-charcoal placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper font-medium py-2.5 rounded-md hover:bg-inklight transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Logging in...' : 'Log in'}
              {!loading && <ArrowRight size={16} />}
            </motion.button>
          </form>

          <p className="text-sm text-muted text-center mt-7">
            New here?{' '}
            <Link to="/signup" className="text-tealdark font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
