import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const statusOptions = ['Booked', 'Rescheduled', 'Cancelled', 'Completed'];

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/appointments');
      setAppointments(res.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setActionLoading(appointmentId);
      setError('');
      setMessage('');

      await axiosInstance.put(`/api/appointments/${appointmentId}/status`, { status });
      setMessage('Appointment status updated successfully.');
      await fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update appointment status.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">Manage Appointments</h1>
        <p className="text-gray-600 mt-2">
          View all booked appointments and update their current status.
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

      {loading ? (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-8 text-gray-600">
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-8 text-gray-600">
          No appointments found.
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-2xl shadow-md border border-sky-100 p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-[#166cb7] mb-3">Patient Details</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Name:</span> {appointment.patient?.name}</p>
                    <p><span className="font-semibold">Email:</span> {appointment.patient?.email}</p>
                    <p><span className="font-semibold">Role:</span> {appointment.patient?.role}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#166cb7] mb-3">Doctor & Slot</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Doctor:</span> {appointment.doctor?.name}</p>
                    <p><span className="font-semibold">Specialization:</span> {appointment.doctor?.specialization}</p>
                    <p><span className="font-semibold">Date:</span> {appointment.slot?.date}</p>
                    <p><span className="font-semibold">Start:</span> {appointment.slot?.startTime}</p>
                    <p><span className="font-semibold">End:</span> {appointment.slot?.endTime}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#166cb7] mb-3">Status Control</h2>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Current Status:</span>{' '}
                      <span
                        className={`font-semibold ${
                          appointment.status === 'Cancelled'
                            ? 'text-red-600'
                            : appointment.status === 'Completed'
                            ? 'text-green-700'
                            : appointment.status === 'Rescheduled'
                            ? 'text-[#ff449e]'
                            : 'text-[#609139]'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </p>

                    <select
                      defaultValue={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                      disabled={actionLoading === appointment._id}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {actionLoading === appointment._id && (
                      <p className="text-sm text-gray-500">Updating status...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminAppointments;