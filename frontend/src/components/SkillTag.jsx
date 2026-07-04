// components/SkillTag.jsx
// Signature visual element of the app - stamped paper-label style tag
// type "offer" = amber color (jo sikha sakta hai), type "want" = teal color (jo sikhna hai)

export default function SkillTag({ label, type = 'offer', onRemove }) {
  const colorClass = type === 'offer' ? 'text-amberdark border-amberdark/40 bg-amber/10' : 'text-tealdark border-tealdark/40 bg-teal/10';

  return (
    <span className={`skill-tag ${colorClass}`}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 hover:opacity-60"
          aria-label={`Remove ${label}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
