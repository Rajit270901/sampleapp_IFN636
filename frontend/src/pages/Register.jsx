import { useState } from 'react'; // useState stores form data loading and messages https://www.w3schools.com/react/react_usestate.asp
import { useNavigate, Link } from 'react-router-dom'; // navigate redirects and Link changes page without refresh
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls
import PasswordInput from '../components/PasswordInput'; // reusable password input with show hide option

const Register = () => { // register page component https://www.w3schools.com/react/react_components.asp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  }); // stores all register form values
  const [loading, setLoading] = useState(false); // controls register button loading
  const [error, setError] = useState(''); // stores error message
  const [success, setSuccess] = useState(''); // stores success message
  const navigate = useNavigate(); // used to redirect user after registration

  const handleChange = (e) => { // runs whenever an input changes https://www.w3schools.com/react/react_events.asp
    setFormData((prev) => ({
      ...prev, // keeps other form fields unchanged https://www.w3schools.com/react/react_es6_spread.asp
      [e.target.name]: e.target.value, // updates field using input name
    }));
  };

  const handleSubmit = async (e) => { // async because register api call takes time https://www.w3schools.com/js/js_async.asp
    e.preventDefault(); // stops form from refreshing the page https://www.w3schools.com/jsref/event_preventdefault.asp
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try { // catches register errors https://www.w3schools.com/js/js_errors.asp
      setLoading(true);

      await axiosInstance.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      }); // sends new user details to backend

      setSuccess('Registration successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // sends user to login after short delay
      }, 1200); // waits 1.2 seconds before redirect https://www.w3schools.com/jsref/met_win_settimeout.asp
    } catch (error) {
      setError(error?.response?.data?.message || 'Registration failed. Please try again.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
    } finally {
      setLoading(false); // stops loading whether request works or fails https://www.w3schools.com/js/js_errors.asp
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-sky-50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-sky-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">
            <span className="text-[#166cb7]">MED</span>
            <span className="text-[#ff449e]">ITR</span>
            <span className="text-[#609139]">ACK</span>
          </h1>
          <p className="text-gray-600 mt-3 text-sm">Create your patient account to manage appointments easily</p>
        </div>

        <h2 className="text-2xl font-bold text-[#166cb7] text-center mb-6">Create Account</h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ff449e] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; // exporting register page so router can use it https://www.w3schools.com/react/react_es6_modules.asp