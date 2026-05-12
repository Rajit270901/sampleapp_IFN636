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

const getInitials = (name) => { // arrow function for getting initials https://www.w3schools.com/js/js_arrow_function.asp
  if (!name) return '?';
  // removes Dr or Dr. from start then uses first and last name initials
  const cleaned = name.replace(/^Dr\.?\s+/i, '').trim(); // regex used to clean doctor title https://www.w3schools.com/js/js_regexp.asp
  const parts = cleaned.split(/\s+/).filter(Boolean); // split separates words and filter removes empty values https://www.w3schools.com/jsref/jsref_split.asp
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase(); // makes single initial uppercase https://www.w3schools.com/jsref/jsref_touppercase.asp
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getColorFromName = (name) => {
  if (!name) return COLORS[0];
  // basic hash so each name gets a consistent colour
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0); // reduce adds character codes together https://www.w3schools.com/jsref/jsref_reduce.asp
  return COLORS[hash % COLORS.length];
};

const Avatar = ({ name, size = 'md' }) => { // component props with default size https://www.w3schools.com/react/react_props.asp
  const initials = getInitials(name);
  const color = getColorFromName(name);

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${color.bg} ${color.text} rounded-full flex items-center justify-center font-bold flex-shrink-0`} // template string combines classes https://www.w3schools.com/js/js_string_templates.asp
    >
      {initials}
    </div>
  );
};

export default Avatar; // exporting component so it can be used in other files https://www.w3schools.com/react/react_es6_modules.asp