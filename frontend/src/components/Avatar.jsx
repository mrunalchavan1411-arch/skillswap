// components/Avatar.jsx
// Reusable avatar - uploaded photo ya initials fallback
// Poori app me consistent look ke liye use hota hai

const BACKEND = 'http://localhost:5000';

export default function Avatar({ user, size = 'md', className = '' }) {
  const sizes = {
    xs:  'w-7 h-7 text-xs',
    sm:  'w-9 h-9 text-sm',
    md:  'w-11 h-11 text-sm',
    lg:  'w-16 h-16 text-xl',
    xl:  'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-3xl',
  };
  const sizeClass = sizes[size] || sizes.md;
  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';
  const src = user?.avatar ? `${BACKEND}${user.avatar}` : null;

  return (
    <div className={`${sizeClass} rounded-full shrink-0 overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={user?.name || 'User'}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        className="w-full h-full bg-grad-amber-teal flex items-center justify-center text-white font-display font-semibold"
        style={{ display: src ? 'none' : 'flex' }}
      >
        {initial}
      </div>
    </div>
  );
}
