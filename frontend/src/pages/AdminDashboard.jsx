import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const actions = [
    {
      title: 'Manage Doctors',
      description: 'Create, update, and delete doctor records.',
      link: '/admin/doctors',
    },
    {
      title: 'Manage Slots',
      description: 'Create, update, and delete appointment slots.',
      link: '/admin/slots',
    },
    {
      title: 'Manage Appointments',
      description: 'View all appointments and update appointment status.',
      link: '/admin/appointments',
    },
    {
      title: 'My Profile',
      description: 'Review your account details and profile information.',
      link: '/profile',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-gradient-to-r from-[#166cb7] to-sky-400 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm uppercase tracking-wider opacity-90">Admin Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Welcome, {user?.name || 'Admin'}
        </h1>
        <p className="mt-3 text-sm md:text-base max-w-2xl text-sky-50">
          Manage doctors, appointment slots, and all patient bookings from the MediTrack admin portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h2 className="text-xl font-bold text-[#166cb7] mb-3">{action.title}</h2>
            <p className="text-gray-600 text-sm leading-6">{action.description}</p>
            <span className="inline-block mt-5 text-[#ff449e] font-semibold">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-sky-100 p-6">
          <h3 className="text-xl font-bold text-[#166cb7] mb-4">Admin Responsibilities</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold">1. Maintain Doctor Records</p>
              <p className="text-sm text-gray-600">Add new doctors, update existing doctor information, and remove outdated records.</p>
            </div>
            <div>
              <p className="font-semibold">2. Control Appointment Availability</p>
              <p className="text-sm text-gray-600">Create and manage appointment slots to keep booking availability up to date.</p>
            </div>
            <div>
              <p className="font-semibold">3. Supervise Appointments</p>
              <p className="text-sm text-gray-600">View all patient bookings and update appointment status such as Completed.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-6">
          <h3 className="text-xl font-bold text-[#166cb7] mb-4">Admin Summary</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{user?.name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold text-gray-800 break-all">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-semibold text-gray-800 capitalize">{user?.role || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-semibold text-gray-800">{user?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;