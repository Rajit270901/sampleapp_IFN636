import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

function Slots() {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctor');

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSlotId, setBookingSlotId] = useState('');

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/slots/available');

      const filteredSlots = doctorId
        ? res.data.filter((slot) => slot.doctor?._id === doctorId)
        : res.data;

      setSlots(filteredSlots);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load available slots.');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleBook = async (slot) => {
    try {
      setBookingError('');
      setBookingMessage('');
      setBookingSlotId(slot._id);

      await axiosInstance.post('/api/appointments', {
        doctor: slot.doctor._id,
        slot: slot._id,
      });

      setBookingMessage('Appointment booked successfully.');
      await fetchSlots();
    } catch (err) {
      setBookingError(err?.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingSlotId('');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-600">Loading available slots...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">
          {doctorId ? 'Selected Doctor Slots' : 'Available Appointment Slots'}
        </h1>
        <p className="text-gray-600 mt-2">
          {doctorId
            ? 'Showing available slots for the selected doctor.'
            : 'Select a suitable date and time to book your medical appointment.'}
        </p>
      </div>

      {bookingMessage && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {bookingMessage}
        </div>
      )}

      {bookingError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {bookingError}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {slots.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-8 text-center text-gray-600">
          No available slots found for this doctor.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white rounded-2xl shadow-md border border-sky-100 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#166cb7]">{slot.doctor?.name || 'Doctor'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {slot.doctor?.specialization || 'Specialization not available'}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  Available
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><span className="font-semibold">Date:</span> {slot.date}</p>
                <p><span className="font-semibold">Start Time:</span> {slot.startTime}</p>
                <p><span className="font-semibold">End Time:</span> {slot.endTime}</p>
                <p><span className="font-semibold">Doctor Email:</span> {slot.doctor?.email}</p>
              </div>

              <button
                onClick={() => handleBook(slot)}
                disabled={bookingSlotId === slot._id}
                className="mt-6 w-full rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
              >
                {bookingSlotId === slot._id ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Slots;