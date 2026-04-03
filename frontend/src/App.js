import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Doctors from './pages/Doctors';
import Slots from './pages/Slots';
import Appointments from './pages/Appointments';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Router>
  );
}

export default App;
