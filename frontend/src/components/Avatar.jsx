// Avatar.jsx — initials-on-color avatar (no images needed)
// Generates a deterministic color from a name string so the same
// person always gets the same color, but different doctors look different.

const COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-green-100', text: 'text-green-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
];

const getInitials = (name) => {
  if (!name) return '?';
  // "Dr. Sarah Lee" → "SL"
  // "Dr Sarah Lee" → "SL"
  // "Sarah Lee"    → "SL"
  // "Sarah"        → "S"
  const cleaned = name.replace(/^Dr\.?\s+/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name) => {
  if (!name) return COLORS[0];
  // Simple hash: sum char codes, mod by color count
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};

const Avatar = ({ name, size = 'md' }) => {
  const initials = getInitials(name);
  const color = getColorFromName(name);

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color.bg} ${color.text} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
};

export default Avatar;