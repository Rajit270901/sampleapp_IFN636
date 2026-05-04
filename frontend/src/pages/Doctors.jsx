import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import Avatar from '../components/Avatar';

// ─── Search icon SVG ───────────────────────────────────────
const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.8"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search filters
  const [specialization, setSpecialization] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      // If no filters, hit the basic /api/doctors endpoint
      // Otherwise hit /api/doctors/search (uses our SearchService + Adapter pattern)
      const hasFilters = specialization || availableOnly;
      const url = hasFilters ? '/api/doctors/search' : '/api/doctors';
      const params = hasFilters
        ? { specialization: specialization || undefined, availableOnly: availableOnly || undefined }
        : {};
      const res = await axiosInstance.get(url, { params });
      setDoctors(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleClear = () => {
    setSpecialization('');
    setAvailableOnly(false);
    // Re-fetch with cleared filters on next tick
    setTimeout(fetchDoctors, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">Available Doctors</h1>
        <p className="text-gray-600 mt-2">
          Browse doctors, check their specializations, and continue to available slots for booking.
        </p>
      </div>

      {/* ─── Search bar (uses Adapter-pattern endpoint) ─────────── */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex flex-col md:flex-row md:items-end gap-4"
      >
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2 font-medium">
            Specialization
          </label>
          <div className="relative">
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Cardiology, Pediatrics..."
              className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
            />
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 md:pb-3">
          <input
            type="checkbox"
            id="availableOnly"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-[#166cb7] focus:ring-[#166cb7]"
          />
          <label htmlFor="availableOnly" className="text-sm text-gray-700">
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

      {/* ─── Results ─────────────────────────────────────────────── */}
      {loading && (
        <div className="text-gray-600">Loading doctors...</div>
      )}
      {error && !loading && (
        <div className="text-red-600">{error}</div>
      )}

      {!loading && !error && doctors.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-600">
          No doctors found{specialization || availableOnly ? ' matching your filters.' : '.'}
        </div>
      )}

      {!loading && !error && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <Avatar name={doctor.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 truncate">{doctor.name}</h2>
                      <p className="text-sm text-[#166cb7] font-medium mt-0.5">{doctor.specialization}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        doctor.isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {doctor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-14 flex-shrink-0">Email</span>
                  <span className="break-all">{doctor.email}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-14 flex-shrink-0">Phone</span>
                  <span>{doctor.phone}</span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  to={`/slots?doctor=${doctor._id}`}
                  className="inline-block w-full text-center rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition"
                >
                  View Slots
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Doctors;