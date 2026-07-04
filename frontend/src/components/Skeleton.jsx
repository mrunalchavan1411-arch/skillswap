// components/Skeleton.jsx
// Shimmer loading placeholder - data load hote time dikhane ke liye

export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton rounded-md ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-card p-5 space-y-3">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-7 w-16" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <SkeletonBlock className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-3 w-1/3" />
        <SkeletonBlock className="h-2.5 w-1/2" />
      </div>
    </div>
  );
}
