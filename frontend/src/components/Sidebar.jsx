// components/Sidebar.jsx
// Main navigation - collapsible, gradient ink panel

import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Repeat2, MessageCircle, CalendarClock, UserCircle, LogOut, Compass, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/matches', label: 'Matches', icon: Repeat2 },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/chat', label: 'Messages', icon: MessageCircle },
  { to: '/schedule', label: 'Schedule', icon: CalendarClock },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="bg-grad-ink text-paper min-h-screen flex flex-col fixed left-0 top-0 z-40 overflow-hidden"
    >
      {/* Logo / Brand */}
      <div className={`px-5 py-7 flex items-center gap-2 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-amber-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
  <Repeat2 className="text-white" size={20} strokeWidth={2.8} />
</div>
        {!collapsed && <div>
  <h2 className="font-display text-lg font-bold tracking-tight">
    SkillSwap
  </h2>
  <p className="text-[10px] text-paper/60 uppercase tracking-[0.2em]">
    Professional
  </p>
</div> }
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
    collapsed ? 'justify-center' : ''
  } ${
    isActive
      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 border border-teal-400/20 text-white shadow-lg shadow-teal-500/20'
      : 'text-paper/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
  }`
}
          >
            <Icon size={18} strokeWidth={2} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`mx-3 mb-2 flex items-center gap-2 px-3 py-2 rounded-md text-paper/50 hover:text-paper hover:bg-white/5 transition-colors text-xs ${collapsed ? 'justify-center' : ''}`}
      >
        {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /> Collapse</>}
      </button>

      {/* User info + logout */}
      <div className={`px-4 py-5 border-t border-white/10 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {!collapsed ? (
          <>
            <div className="glass rounded-2xl p-3 flex items-center gap-3 mb-3 border border-white/10">
              <Avatar user={user} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-paper/50 truncate font-mono">{user?.email}</p>
                <p className="text-[11px] text-green-400 mt-1">
● Online
</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 py-2 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <LogOut size={14} />
              Log out
            </button>
          </>
        ) : (
          <button onClick={handleLogout} title="Log out" className="text-paper/60 hover:text-amber transition-colors">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
