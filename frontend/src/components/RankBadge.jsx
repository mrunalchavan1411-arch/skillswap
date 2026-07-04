// components/RankBadge.jsx
// Bronze/Silver/Gold/Platinum/Diamond badge - profile aur dashboard pe dikhega

import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RankBadge({ rank, size = 'md' }) {
  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-4 py-2 gap-2',
  };
  const iconSizes = { sm: 11, md: 14, lg: 16 };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full font-mono font-medium ${sizes[size]}`}
      style={{ color: rank.color, backgroundColor: rank.bg }}
    >
      <Award size={iconSizes[size]} strokeWidth={2.4} />
      {rank.name}
    </motion.span>
  );
}
