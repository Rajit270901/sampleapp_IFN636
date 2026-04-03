import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get('/doctors');
        setDoctors(res.data);
      } catch (err) {
        setError('Failed to load doctors');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <p className="p-4">Loading doctors...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Doctors</h1>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul className="space-y-3">
          {doctors.map((doctor) => (
            <li key={doctor._id} className="border rounded p-3">
              <p><strong>Name:</strong> {doctor.name}</p>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Doctors;