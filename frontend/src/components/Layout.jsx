// components/Layout.jsx
// Common layout - Sidebar + Topbar + content area. Saare logged-in pages isko use karte hain.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Moon,
  Search,
  Bell,
  Sparkles,
  Command
} from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import PageTransition from './PageTransition';
import Avatar from './Avatar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex bg-paper dark:bg-dbg min-h-screen transition-colors duration-300">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="flex-1 min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 76 : 240 }}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-40 glass backdrop-blur-xl border-b border-white/10">

  <div className="flex items-center justify-between px-8 py-4">

    {/* Search */}

    <div className="hidden lg:flex items-center gap-3 w-[420px]">

      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-flip-muted"
        />

        <input
          placeholder="Search skills, users..."
          className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-teal transition"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] px-2 py-1 rounded-lg bg-white/5 text-flip-muted flex items-center gap-1">

          <Command size={12}/>

          K

        </div>

      </div>

    </div>

    {/* Right */}

    <div className="flex items-center gap-3">

      <button
        className="w-11 h-11 rounded-xl glass hover:scale-105 transition"
      >

        <Sparkles
          size={18}
          className="mx-auto text-amber"
        />

      </button>

      <button
        onClick={toggleTheme}
        className="w-11 h-11 rounded-xl glass hover:scale-105 transition"
      >

        {
          isDark
          ?

          <Sun
            size={18}
            className="mx-auto text-amber"
          />

          :

          <Moon
            size={18}
            className="mx-auto"
          />

        }

      </button>

      <div className="relative">

        <NotificationDropdown/>

      </div>

      <Link
        to="/profile"
        className="flex items-center gap-3 pl-2"
      >

        <Avatar
          user={user}
          size="sm"
          className="ring-2 ring-teal/40"
        />

        <div className="hidden lg:block">

          <p className="font-semibold text-sm">

            {user?.name}

          </p>

          <p className="text-xs text-flip-muted">

            SkillSwap Member

          </p>

        </div>

      </Link>

    </div>

  </div>

</header>

        <main className="px-10 py-10 max-w-[1700px] mx-auto">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
