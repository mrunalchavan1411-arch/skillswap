// components/ProgressRing.jsx
// Circular progress indicator - profile completion % jaise metrics dikhane ke liye

import { motion } from 'framer-motion';

export default function ProgressRing({ percent = 0, size = 88, stroke = 8, color = '#2F8F7F', label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display font-semibold text-flip" style={{ fontSize: size * 0.24 }}>{percent}%</span>
        {label && <span className="text-flip-muted text-[10px] font-mono">{label}</span>}
      </div>
    </div>
  );
}
