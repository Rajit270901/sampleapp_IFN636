import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // router tools for page navigation https://www.w3schools.com/react/react_router.asp
import { useAuth } from './context/AuthContext'; // gets login state and user role from auth context
import Navbar from './components/Navbar'; // navbar shown on all pages

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Doctors from './pages/Doctors';
import Slots from './pages/Slots';
import Appointments from './pages/Appointments';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageDoctors from './pages/ManageDoctors';
import ManageSlots from './pages/ManageSlots';
import AdminAppointments from './pages/AdminAppointments';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children, allowedRoles }) { // wrapper used to protect private pages https://www.w3schools.com/react/react_props.asp
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // sends logged out users to login
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) { // checks if user role is allowed for this page https://www.w3schools.com/jsref/jsref_includes_array.asp
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

function HomeRedirect() { // sends user to the correct starting page
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
}

function App() { // main app component https://www.w3schools.com/react/react_components.asp
  return (
    <Router>
      <div className="min-h-screen bg-sky-50">
        <Navbar />
        <Routes> {/* contains all route definitions */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slots"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Slots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageSlots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // exports app so react can render it https://www.w3schools.com/react/react_es6_modules.asp