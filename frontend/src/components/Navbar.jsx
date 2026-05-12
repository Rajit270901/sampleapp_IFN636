import { Link, useNavigate, useLocation } from 'react-router-dom'; // router tools for links navigation and current page
import { useEffect, useState } from 'react'; // react hooks for state and side effects https://www.w3schools.com/react/react_hooks.asp
import { useAuth } from '../context/AuthContext'; // gets current logged in user from auth context
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls

// small svg bell icon used for notifications
const BellIcon = ({ className }) => ( // component receives className as prop https://www.w3schools.com/react/react_props.asp
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
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
    />
  </svg>
);

function Navbar() { // navbar component https://www.w3schools.com/react/react_components.asp
  const { user, logout, isAuthenticated } = useAuth(); // taking auth values from context
  const navigate = useNavigate(); // used to redirect user after logout
  const location = useLocation(); // used to check current page
  const [unreadCount, setUnreadCount] = useState(0); // stores unread notification count https://www.w3schools.com/react/react_usestate.asp

  // checks if the nav link matches current page
  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `transition ${
      isActive(path)
        ? 'text-[#166cb7] font-semibold'
        : 'text-gray-600 hover:text-[#166cb7]'
    }`; // template string changes class based on active page https://www.w3schools.com/js/js_string_templates.asp

  // checks unread notifications every 30 seconds for patient users
  useEffect(() => { // runs after render and when auth/user changes https://www.w3schools.com/react/react_useeffect.asp
    if (!isAuthenticated || user?.role !== 'patient') return; // optional chaining avoids error if user is missing https://www.w3schools.com/js/js_2020.asp

    const fetchUnread = async () => { // async because api call takes time https://www.w3schools.com/js/js_async.asp
      try { // catches api errors so navbar does not crash https://www.w3schools.com/js/js_errors.asp
        const res = await axiosInstance.get('/api/notifications/unread-count');
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        // ignore this because notification count is not critical
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // runs fetchUnread every 30 seconds https://www.w3schools.com/jsref/met_win_setinterval.asp
    return () => clearInterval(interval); // cleans interval when component updates/unmounts https://www.w3schools.com/jsref/met_win_clearinterval.asp
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    navigate('/login'); // sends user back to login page
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={user?.role === 'admin' ? '/admin' : '/dashboard'} // sends admin and patient to different home pages
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-[#166cb7]">MED</span>
            <span className="text-[#ff449e]">ITR</span>
            <span className="text-[#609139]">ACK</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          {!isAuthenticated && (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link to="/register" className={linkClass('/register')}>Register</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'patient' && (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/doctors" className={linkClass('/doctors')}>Doctors</Link>
              <Link to="/slots" className={linkClass('/slots')}>Slots</Link>
              <Link to="/appointments" className={linkClass('/appointments')}>My Appointments</Link>
              <Link to="/profile" className={linkClass('/profile')}>Profile</Link>

              {/* notification link shows badge only when unread count is more than 0 */}
              <Link
                to="/notifications"
                className={`relative flex items-center gap-1.5 ${linkClass('/notifications')}`}
              >
                <BellIcon className="w-5 h-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#ff449e] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/admin" className={linkClass('/admin')}>Admin Dashboard</Link>
              <Link to="/admin/doctors" className={linkClass('/admin/doctors')}>Manage Doctors</Link>
              <Link to="/admin/slots" className={linkClass('/admin/slots')}>Manage Slots</Link>
              <Link to="/admin/appointments" className={linkClass('/admin/appointments')}>Appointments</Link>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-[#609139] text-white px-4 py-2 rounded-lg hover:opacity-90 transition font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; // exporting navbar so it can be used in app https://www.w3schools.com/react/react_es6_modules.asp