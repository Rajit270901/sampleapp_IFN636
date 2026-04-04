import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-2xl font-bold">
            <span className="text-[#166cb7]">MED</span>
            <span className="text-[#ff449e]">ITR</span>
            <span className="text-[#609139]">ACK</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-gray-700 hover:text-[#166cb7]">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-[#166cb7]">Register</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'patient' && (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-[#166cb7]">Dashboard</Link>
              <Link to="/doctors" className="text-gray-700 hover:text-[#166cb7]">Doctors</Link>
              <Link to="/slots" className="text-gray-700 hover:text-[#166cb7]">Slots</Link>
              <Link to="/appointments" className="text-gray-700 hover:text-[#166cb7]">My Appointments</Link>
              <Link to="/profile" className="text-gray-700 hover:text-[#166cb7]">Profile</Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/admin" className="text-gray-700 hover:text-[#166cb7]">Admin Dashboard</Link>
              <Link to="/admin/doctors" className="text-gray-700 hover:text-[#166cb7]">Manage Doctors</Link>
              <Link to="/admin/slots" className="text-gray-700 hover:text-[#166cb7]">Manage Slots</Link>
              <Link to="/admin/appointments" className="text-gray-700 hover:text-[#166cb7]">Appointments</Link>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-[#609139] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;