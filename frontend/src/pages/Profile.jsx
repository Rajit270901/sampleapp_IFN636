import { useState, useEffect } from 'react'; // hooks for form state and loading profile data https://www.w3schools.com/react/react_hooks.asp
import { useAuth } from '../context/AuthContext'; // gets current user and login update function
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls

const Profile = () => { // profile page component https://www.w3schools.com/react/react_components.asp
  const { user, login } = useAuth(); // using auth context values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  }); // stores profile form values https://www.w3schools.com/react/react_usestate.asp
  const [loading, setLoading] = useState(true); // controls loading screen
  const [saving, setSaving] = useState(false); // controls update button loading
  const [error, setError] = useState(''); // stores error message
  const [message, setMessage] = useState(''); // stores success message

  useEffect(() => { // runs once when profile page opens https://www.w3schools.com/react/react_useeffect.asp
    const fetchProfile = async () => { // async because api request takes time https://www.w3schools.com/js/js_async.asp
      try { // catches api errors https://www.w3schools.com/js/js_errors.asp
        setLoading(true);
        setError('');
        const response = await axiosInstance.get('/api/auth/profile');

        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          address: response.data.address || '',
          role: response.data.role || '',
        });
      } catch (error) {
        setError(error?.response?.data?.message || 'Failed to fetch profile.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
      } finally {
        setLoading(false); // stops loading whether request works or fails https://www.w3schools.com/js/js_errors.asp
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => { // runs whenever user edits a field https://www.w3schools.com/react/react_events.asp
    setFormData((prev) => ({
      ...prev, // keeps other form fields unchanged https://www.w3schools.com/react/react_es6_spread.asp
      [e.target.name]: e.target.value, // updates field based on input name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stops form refresh https://www.w3schools.com/jsref/event_preventdefault.asp
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await axiosInstance.put('/api/auth/profile', {
        name: formData.name,
        email: formData.email,
        address: formData.address,
      }); // sends updated profile fields to backend

      setMessage('Profile updated successfully.');

      if (user) {
        login({
          ...user,
          name: response.data.name,
          email: response.data.email,
          address: response.data.address,
          role: response.data.role,
        }); // updates saved auth user after profile change
      }
    } catch (error) {
      setError(error?.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">My Profile</h1>
        <p className="text-gray-600 mt-2">
          Update your personal account details and keep your information current.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
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
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={formData.role}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
          >
            {saving ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile; // exporting page so router can use it https://www.w3schools.com/react/react_es6_modules.asp