import { useState } from 'react'; // useState stores form values loading and errors https://www.w3schools.com/react/react_usestate.asp
import { useAuth } from '../context/AuthContext'; // gets login function from auth context
import { useNavigate, Link } from 'react-router-dom'; // navigate redirects and Link moves pages without refresh
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls
import PasswordInput from '../components/PasswordInput'; // reusable password field with show hide option

const Login = () => { // login page component https://www.w3schools.com/react/react_components.asp
  const [formData, setFormData] = useState({ email: '', password: '' }); // stores email and password typed by user
  const [loading, setLoading] = useState(false); // used to disable button while login is running
  const [error, setError] = useState(''); // stores login error message
  const { login } = useAuth();
  const navigate = useNavigate(); // used to send user to correct page after login

  const handleChange = (e) => { // runs whenever input value changes https://www.w3schools.com/react/react_events.asp
    setFormData((prev) => ({
      ...prev, // keeps old form values https://www.w3schools.com/react/react_es6_spread.asp
      [e.target.name]: e.target.value, // updates the field that matches input name
    }));
  };

  const handleSubmit = async (e) => { // async because login api call takes time https://www.w3schools.com/js/js_async.asp
    e.preventDefault(); // stops form from refreshing the page https://www.w3schools.com/jsref/event_preventdefault.asp
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    try { // catches login errors https://www.w3schools.com/js/js_errors.asp
      setLoading(true);
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data); // saves logged in user data in auth context

      if (response.data.role === 'admin') {
        navigate('/admin'); // admin goes to admin dashboard
      } else {
        navigate('/dashboard'); // patient goes to normal dashboard
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Login failed. Please try again.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
    } finally {
      setLoading(false); // stops loading whether login works or fails https://www.w3schools.com/js/js_errors.asp
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-sky-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-sky-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">
            <span className="text-[#166cb7]">MED</span>
            <span className="text-[#ff449e]">ITR</span>
            <span className="text-[#609139]">ACK</span>
          </h1>
          <p className="text-gray-600 mt-3 text-sm">Welcome back to your medical appointment portal</p>
        </div>

        <h2 className="text-2xl font-bold text-[#166cb7] text-center mb-6">Login</h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-[#ff449e] font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login; // exporting login page so router can use it https://www.w3schools.com/react/react_es6_modules.asp