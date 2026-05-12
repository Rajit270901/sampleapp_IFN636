import { useEffect, useState, useCallback } from 'react'; // hooks for state loading and memoised fetch function https://www.w3schools.com/react/react_hooks.asp
import { useSearchParams } from 'react-router-dom'; // reads query params from url
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls
import Avatar from '../components/Avatar'; // avatar component for doctor initials

// search icon used in filter button
const SearchIcon = ({ className }) => ( // receives className as prop https://www.w3schools.com/react/react_props.asp
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
  </svg>
);

// calendar icon used beside date inputs
const CalendarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
  </svg>
);

function Slots() { // slots page component https://www.w3schools.com/react/react_components.asp
  const [searchParams] = useSearchParams();
  const doctorIdFromUrl = searchParams.get('doctor'); // gets doctor id from url query param

  const [slots, setSlots] = useState([]); // stores slot list https://www.w3schools.com/react/react_usestate.asp
  const [loading, setLoading] = useState(true); // controls loading text
  const [error, setError] = useState(''); // stores slot loading error
  const [bookingMessage, setBookingMessage] = useState(''); // stores booking success message
  const [bookingError, setBookingError] = useState(''); // stores booking error message
  const [bookingSlotId, setBookingSlotId] = useState(''); // stores slot id while booking is running

  // search filter values
  const [fromDate, setFromDate] = useState(''); // stores from date filter
  const [toDate, setToDate] = useState(''); // stores to date filter
  const [availableOnly, setAvailableOnly] = useState(true); // default true because users normally want free slots

  const fetchSlots = useCallback(async () => { // keeps function stable for useEffect dependencies https://www.w3schools.com/react/react_usecallback.asp
    setLoading(true);
    setError('');
    try { // catches api errors https://www.w3schools.com/js/js_errors.asp
      const hasDateFilter = fromDate || toDate;
      // search endpoint is used when doctor or date filters are active
      // otherwise normal slots endpoint is enough
      const useSearch = hasDateFilter || doctorIdFromUrl;
      let res;

      if (useSearch) {
        res = await axiosInstance.get('/api/slots/search', {
          params: {
            doctorId: doctorIdFromUrl || undefined,
            from: fromDate || undefined,
            to: toDate || undefined,
            availableOnly: availableOnly || undefined,
          },
        });
      } else if (availableOnly) {
        res = await axiosInstance.get('/api/slots/available');
      } else {
        res = await axiosInstance.get('/api/slots');
      }

      setSlots(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load available slots.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
    } finally {
      setLoading(false); // stops loading whether request works or fails https://www.w3schools.com/js/js_errors.asp
    }
  }, [doctorIdFromUrl, fromDate, toDate, availableOnly]);

  useEffect(() => { // runs when fetchSlots changes https://www.w3schools.com/react/react_useeffect.asp
    fetchSlots();
  }, [fetchSlots]);

  const handleSearch = (e) => {
    e.preventDefault(); // stops form refresh https://www.w3schools.com/jsref/event_preventdefault.asp
    fetchSlots();
  };

  const handleClear = () => {
    setFromDate('');
    setToDate('');
    setAvailableOnly(true);
    // useEffect runs again after these filter values change
  };

  const handleBook = async (slot) => { // books selected slot
    try { // catches booking errors
      setBookingError('');
      setBookingMessage('');
      setBookingSlotId(slot._id);

      await axiosInstance.post('/api/appointments', {
        doctor: slot.doctor._id,
        slot: slot._id,
      });

      setBookingMessage('Appointment booked successfully.');
      await fetchSlots(); // reloads slots so booked slot updates
    } catch (err) {
      setBookingError(err?.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setBookingSlotId('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">
          {doctorIdFromUrl ? 'Selected Doctor Slots' : 'Available Appointment Slots'}
        </h1>
        <p className="text-gray-600 mt-2">
          {doctorIdFromUrl
            ? 'Showing slots for the selected doctor. Use filters to narrow by date.'
            : 'Browse open appointment slots and book a consultation. Filter by date to find what suits you.'}
        </p>
      </div>

      {/* filter bar for date and availability */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex flex-col md:flex-row md:items-end gap-4"
      >
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
            From date
          </label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)} // updates from date when user selects date https://www.w3schools.com/react/react_events.asp
              className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
            <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
            To date
          </label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)} // updates to date when user selects date
              className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
            <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:pb-3">
          <input
            type="checkbox"
            id="availableSlotsOnly"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)} // stores checkbox true or false
            className="w-4 h-4 rounded border-gray-300 text-[#166cb7] focus:ring-[#166cb7]"
          />
          <label htmlFor="availableSlotsOnly" className="text-sm text-gray-700 whitespace-nowrap">
            Available only
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-xl bg-[#166cb7] text-white px-5 py-3 font-semibold hover:opacity-90 transition flex items-center gap-2"
          >
            <SearchIcon className="w-4 h-4" />
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl bg-gray-100 text-gray-700 px-5 py-3 font-semibold hover:bg-gray-200 transition"
          >
            Clear
          </button>
        </div>
      </form>

      {/* messages shown after booking or loading error */}
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

      {/* results section */}
      {loading && <div className="text-gray-600">Loading slots...</div>}

      {!loading && slots.length === 0 && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-600">
          No slots found{fromDate || toDate ? ' for the selected date range.' : '.'}
        </div>
      )}

      {!loading && slots.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slots.map((slot) => ( // creates one slot card for each slot https://www.w3schools.com/react/react_lists.asp
            <div
              key={slot._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <Avatar name={slot.doctor?.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 truncate">
                        {slot.doctor?.name || 'Doctor'}
                      </h2>
                      <p className="text-sm text-[#166cb7] font-medium mt-0.5">
                        {slot.doctor?.specialization || 'Specialization not available'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        slot.isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                      }`} // badge colour changes based on booking status
                    >
                      {slot.isBooked ? 'Booked' : 'Available'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Date</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{slot.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Time</p>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {slot.startTime} — {slot.endTime}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Doctor email</p>
                  <p className="font-semibold text-gray-900 break-all mt-0.5 text-xs">
                    {slot.doctor?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleBook(slot)} // books this slot https://www.w3schools.com/react/react_events.asp
                disabled={bookingSlotId === slot._id || slot.isBooked}
                className="mt-5 w-full rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {slot.isBooked
                  ? 'Already Booked'
                  : bookingSlotId === slot._id
                  ? 'Booking...'
                  : 'Book Appointment'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Slots; // exporting page so router can use it https://www.w3schools.com/react/react_es6_modules.asp