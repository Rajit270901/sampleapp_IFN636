import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

// ─── Inline SVG icons for action cards ─────────────────────
const DoctorIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
  </svg>
);
const CalendarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
  </svg>
);
const ClipboardIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
  </svg>
);
const BellIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
  </svg>
);
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.6" stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
  </svg>
);

const PatientDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, unread: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [apps, unread] = await Promise.all([
          axiosInstance.get('/api/appointments/my'),
          axiosInstance.get('/api/notifications/unread-count'),
        ]);
        setStats({
          appointments: Array.isArray(apps.data) ? apps.data.length : 0,
          unread: unread.data?.count || 0,
        });
      } catch (err) {
        // silent fail — stats are nice-to-have
      }
    };
    fetchStats();
  }, []);

  const actions = [
    {
      title: 'View Doctors',
      description: 'Browse available doctors and their specializations.',
      link: '/doctors',
      Icon: DoctorIcon,
      color: 'text-[#166cb7]',
      bg: 'bg-sky-50',
    },
    {
      title: 'Available Slots',
      description: 'Check open appointment slots and book a consultation.',
      link: '/slots',
      Icon: CalendarIcon,
      color: 'text-[#609139]',
      bg: 'bg-green-50',
    },
    {
      title: 'My Appointments',
      description: 'View, reschedule or cancel your booked appointments.',
      link: '/appointments',
      Icon: ClipboardIcon,
      color: 'text-[#ff449e]',
      bg: 'bg-pink-50',
    },
    {
      title: 'Notifications',
      description: 'See updates about your bookings, reschedules and status changes.',
      link: '/notifications',
      Icon: BellIcon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'My Profile',
      description: 'Manage your personal details and account information.',
      link: '/profile',
      Icon: UserIcon,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ─── Hero with image background ──────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/patient-hero.jpg')" }}
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#166cb7]/95 via-[#166cb7]/80 to-[#166cb7]/40" />

        {/* Content */}
        <div className="relative px-8 py-12 text-white">
          <p className="text-sm uppercase tracking-wider opacity-90 font-medium">Patient Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="mt-3 text-sm md:text-base max-w-2xl text-sky-50">
            Manage your appointments, explore available doctors and keep your profile up to date — all in one platform.
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <p className="text-xs uppercase tracking-wide opacity-80">Appointments</p>
              <p className="text-2xl font-bold mt-1">{stats.appointments}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
              <p className="text-xs uppercase tracking-wide opacity-80">Unread Notifications</p>
              <p className="text-2xl font-bold mt-1">{stats.unread}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Action cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">
        {actions.map((action) => {
          const { Icon } = action;
          return (
            <Link
              key={action.title}
              to={action.link}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-2">{action.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
              <span className={`inline-block mt-4 text-sm font-semibold ${action.color} group-hover:translate-x-1 transition-transform`}>
                Open →
              </span>
            </Link>
          );
        })}
      </div>

      {/* ─── Bottom info section ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-[#166cb7] mb-5">How to use MediTrack</h3>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-[#166cb7] flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-gray-900">Explore Doctors</p>
                <p className="text-sm text-gray-600 mt-1">Check available doctors and their medical specializations.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-[#609139] flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-gray-900">Select a Slot</p>
                <p className="text-sm text-gray-600 mt-1">Choose a suitable date and time from the available appointment slots.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-100 text-[#ff449e] flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-gray-900">Manage Appointments</p>
                <p className="text-sm text-gray-600 mt-1">Track your bookings, reschedule if needed or cancel appointments easily.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-[#166cb7] mb-5">Account Summary</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Name</p>
              <p className="font-semibold text-gray-900 mt-1">{user?.name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Email</p>
              <p className="font-semibold text-gray-900 break-all mt-1">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Role</p>
              <p className="font-semibold text-gray-900 capitalize mt-1">{user?.role || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Address</p>
              <p className="font-semibold text-gray-900 mt-1">{user?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;