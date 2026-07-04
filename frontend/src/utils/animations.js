// utils/animations.js
// Shared Framer Motion variants - poori app me consistent premium feel ke liye

// Staggered card entrance (dashboard, explore, matches)
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export const cardEntrance = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Simple fade up (header, sections)
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] },
});

// Scale pop (badges, pills)
export const scalePop = {
  initial: { opacity: 0, scale: 0.88 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
};

// Card hover - consistent across all cards
export const cardHover = {
  whileHover: { y: -4, boxShadow: '0 16px 48px rgba(27,42,78,0.13)' },
  transition: { duration: 0.22, ease: 'easeOut' },
};

// Button press feedback
export const buttonTap = { whileTap: { scale: 0.96 } };

// Dropdown panel
export const dropdownAnim = {
  initial:  { opacity: 0, y: -10, scale: 0.97 },
  animate:  { opacity: 1, y: 0,   scale: 1 },
  exit:     { opacity: 0, y: -10, scale: 0.97 },
  transition: { duration: 0.15, ease: 'easeOut' },
};
