import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="p-4 bg-blue-600 text-white flex gap-4">
      <Link to="/">Doctors</Link>
      <Link to="/doctors">Doctors</Link>
      <Link to="/slots">Slots</Link>
      <Link to="/appointments">Appointments</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
}

export default Navbar;
