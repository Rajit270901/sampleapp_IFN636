import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Link } from 'react-router-dom';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get('/api/doctors');
        setDoctors(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-gray-600">Loading doctors...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">Available Doctors</h1>
        <p className="text-gray-600 mt-2">
          Browse doctors, check their specializations, and continue to available slots for booking.
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-8 text-center text-gray-600">
          No doctors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#166cb7]">{doctor.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{doctor.specialization}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    doctor.isAvailable
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {doctor.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Email:</span> {doctor.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {doctor.phone}
                </p>
              </div>

              <div className="mt-6">
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