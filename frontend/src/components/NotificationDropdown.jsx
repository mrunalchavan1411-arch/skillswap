// components/NotificationDropdown.jsx
// Bell icon dropdown - pending session requests aur recent messages dikhata hai
// Existing APIs (sessions, conversations) se hi data derive karta hai - koi naya backend route nahi chahiye

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CalendarClock, MessageCircle, Check } from 'lucide-react';
import { getMySessions, getConversations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { dropdownAnim } from '../utils/animations';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [sessRes, convRes] = await Promise.all([getMySessions(), getConversations()]);

        const pendingRequests = sessRes.data.sessions
          .filter(s => s.status === 'pending' && s.partnerId === user.id)
          .map(s => ({
            id: `sess-${s.id}`,
            type: 'session',
            title: `${s.userName} requested a session`,
            subtitle: `${s.skill} · ${s.date} at ${s.time}`,
            time: s.createdAt,
          }));

        const recentMessages = convRes.data.conversations
          .slice(0, 5)
          .map(c => ({
            id: `msg-${c.partnerId}`,
            type: 'message',
            title: `${c.partnerName}`,
            subtitle: c.lastMessage,
            time: c.lastTimestamp,
            partnerId: c.partnerId,
            partnerName: c.partnerName,
          }));

        const all = [...pendingRequests, ...recentMessages]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 8);

        setItems(all);
      } catch (err) {
        console.error('Notifications load error:', err);
      }
    }
    load();
    const interval = setInterval(load, 15000); // har 15 sec me refresh
    return () => clearInterval(interval);
  }, [user.id]);

  // Outside click pe dropdown band karna
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleItemClick = (item) => {
    setOpen(false);
    if (item.type === 'session') navigate('/schedule');
    if (item.type === 'message') navigate('/chat', { state: { partnerId: item.partnerId, partnerName: item.partnerName } });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={19} className="text-flip" strokeWidth={2} />
        {items.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...dropdownAnim}
            className="absolute right-0 mt-2 w-80 glass-card rounded-card shadow-glass overflow-hidden z-50"
          >
            <div className="px-4 py-3 hairline border-b-0">
              <p className="font-display font-semibold text-flip text-sm">Notifications</p>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-sm text-flip-muted text-center py-8">You're all caught up 🎉</p>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="w-full text-left px-4 py-3 flex gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-line/40 dark:border-dline/40 last:border-0"
                  >
                    <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      item.type === 'session' ? 'bg-amber/15 text-amberdark' : 'bg-teal/15 text-tealdark'
                    }`}>
                      {item.type === 'session' ? <CalendarClock size={14} /> : <MessageCircle size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-flip truncate">{item.title}</p>
                      <p className="text-xs text-flip-muted truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {items.some(i => i.type === 'session') && (
              <button
                onClick={() => { setOpen(false); navigate('/schedule'); }}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-tealdark font-medium py-2.5 hover:bg-teal/5 transition-colors"
              >
                <Check size={13} /> Review session requests
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
