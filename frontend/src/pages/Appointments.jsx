import { useEffect, useState } from 'react'; // hooks for state and loading data https://www.w3schools.com/react/react_hooks.asp
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls

function Appointments() { // patient appointments page component https://www.w3schools.com/react/react_components.asp
  const [appointments, setAppointments] = useState([]); // stores user appointments https://www.w3schools.com/react/react_usestate.asp
  const [availableSlots, setAvailableSlots] = useState([]); // stores slots user can reschedule to
  const [loading, setLoading] = useState(true); // controls first loading screen
  const [error, setError] = useState(''); // stores error messages
  const [message, setMessage] = useState(''); // stores success messages
  const [actionLoading, setActionLoading] = useState(''); // stores appointment id while cancel or reschedule is running
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(''); // stores which appointment has reschedule form open
  const [selectedSlotId, setSelectedSlotId] = useState(''); // stores selected new slot id

  const fetchAppointments = async () => { // async because api request takes time https://www.w3schools.com/js/js_async.asp
    try { // catches api errors https://www.w3schools.com/js/js_errors.asp
      const res = await axiosInstance.get('/api/appointments/my');
      setAppointments(res.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load appointments.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const res = await axiosInstance.get('/api/slots/available');
      setAvailableSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { // runs once when page loads https://www.w3schools.com/react/react_useeffect.asp
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchAppointments(), fetchAvailableSlots()]); // loads appointments and slots together https://www.w3schools.com/js/js_promise.asp
      } finally {
        setLoading(false); // stops loading even if something fails https://www.w3schools.com/js/js_errors.asp
      }
    };

    loadData();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      setActionLoading(appointmentId);
      setMessage('');
      setError('');

      await axiosInstance.put(`/api/appointments/${appointmentId}/cancel`); // template string adds appointment id in url https://www.w3schools.com/js/js_string_templates.asp
      setMessage('Appointment cancelled successfully.');
      await Promise.all([fetchAppointments(), fetchAvailableSlots()]); // refreshes both lists after cancel
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setActionLoading('');
    }
  };

  const handleReschedule = async (appointmentId) => {
    if (!selectedSlotId) {
      setError('Please select a new slot before rescheduling.');
      return;
    }

    try {
      setActionLoading(appointmentId);
      setMessage('');
      setError('');

      await axiosInstance.put(`/api/appointments/${appointmentId}/reschedule`, {
        newSlotId: selectedSlotId,
      });

      setMessage('Appointment rescheduled successfully.');
      setRescheduleAppointmentId('');
      setSelectedSlotId('');
      await Promise.all([fetchAppointments(), fetchAvailableSlots()]); // reloads updated appointment and slot data
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reschedule appointment.');
    } finally {
      setActionLoading('');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-600">Loading appointments...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">My Appointments</h1>
        <p className="text-gray-600 mt-2">
          Track your bookings, cancel appointments, or reschedule to another available slot.
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

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-8 text-center text-gray-600">
          No appointments found.
        </div>
      ) : (
        <div className="space-y-6">
          {appointments.map((appointment) => ( // maps each appointment into a card https://www.w3schools.com/react/react_lists.asp
            <div
              key={appointment._id}
              className="bg-white rounded-2xl shadow-md border border-sky-100 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#166cb7]">
                    {appointment.doctor?.name || 'Doctor'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {appointment.doctor?.specialization || 'Specialization not available'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Doctor Email:</span> {appointment.doctor?.email}
                    </p>
                    <p>
                      <span className="font-semibold">Doctor Phone:</span> {appointment.doctor?.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {appointment.slot?.date}
                    </p>
                    <p>
                      <span className="font-semibold">Start Time:</span> {appointment.slot?.startTime}
                    </p>
                    <p>
                      <span className="font-semibold">End Time:</span> {appointment.slot?.endTime}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{' '}
                      <span
                        className={`font-semibold ${
                          appointment.status === 'Cancelled'
                            ? 'text-red-600'
                            : appointment.status === 'Completed'
                            ? 'text-green-700'
                            : appointment.status === 'Rescheduled'
                            ? 'text-[#ff449e]'
                            : 'text-[#609139]'
                        }`} // status colour changes based on appointment status
                      >
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                </div>

                {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                  <div className="w-full lg:w-80 space-y-3">
                    <button
                      onClick={() =>
                        setRescheduleAppointmentId(
                          rescheduleAppointmentId === appointment._id ? '' : appointment._id
                        )
                      } // opens or closes reschedule section for this appointment
                      className="w-full rounded-xl border border-[#166cb7] text-[#166cb7] py-3 font-semibold hover:bg-sky-50 transition"
                    >
                      {rescheduleAppointmentId === appointment._id ? 'Close Reschedule' : 'Reschedule'}
                    </button>

                    <button
                      onClick={() => handleCancel(appointment._id)} // cancels this appointment https://www.w3schools.com/react/react_events.asp
                      disabled={actionLoading === appointment._id}
                      className="w-full rounded-xl bg-red-500 text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
                    >
                      {actionLoading === appointment._id ? 'Processing...' : 'Cancel Appointment'}
                    </button>
                  </div>
                )}
              </div>

              {rescheduleAppointmentId === appointment._id && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-[#166cb7] mb-3">Select a New Slot</h3>

                  <select
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)} // stores selected slot id when dropdown changes
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                  >
                    <option value="">Choose an available slot</option>
                    {availableSlots.map((slot) => ( // lists all available slots in dropdown
                      <option key={slot._id} value={slot._id}>
                        {slot.doctor?.name} | {slot.date} | {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleReschedule(appointment._id)}
                    disabled={actionLoading === appointment._id}
                    className="mt-4 rounded-xl bg-[#609139] text-white px-6 py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
                  >
                    {actionLoading === appointment._id ? 'Updating...' : 'Confirm Reschedule'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments; // exporting page so router can use it https://www.w3schools.com/react/react_es6_modules.asp