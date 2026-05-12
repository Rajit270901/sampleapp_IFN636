import { useState } from 'react'; // useState stores whether password is visible or hidden https://www.w3schools.com/react/react_usestate.asp

// eye icon shown when password is hidden
const EyeIcon = ({ className }) => ( // receives className as prop https://www.w3schools.com/react/react_props.asp
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

// eye slash icon shown when password is visible
const EyeSlashIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

const PasswordInput = ({ name, value, onChange, placeholder = 'Enter your password' }) => { // reusable password input component with default placeholder https://www.w3schools.com/react/react_props.asp
  const [show, setShow] = useState(false); // false means password is hidden at first

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'} // changes input type based on show value
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)} // toggles password visibility https://www.w3schools.com/react/react_events.asp
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#166cb7] transition p-1"
        aria-label={show ? 'Hide password' : 'Show password'} // label changes for accessibility
        tabIndex={-1}
      >
        {show ? (
          <EyeSlashIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput; // exporting component so other pages can use it https://www.w3schools.com/react/react_es6_modules.asp