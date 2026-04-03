import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

function Slots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axiosInstance.get('/slots');
        setSlots(res.data);
      } catch (err) {
        setError('Failed to load slots');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  if (loading) return <p className="p-4">Loading slots...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Slots</h1>
      {slots.length === 0 ? (
        <p>No slots found.</p>
      ) : (
        <ul className="space-y-3">
          {slots.map((slot) => (
            <li key={slot._id} className="border rounded p-3">
              <p><strong>Doctor ID:</strong> {slot.doctor}</p>
              <p><strong>Date:</strong> {slot.date}</p>
              <p><strong>Time:</strong> {slot.time}</p>
              <p><strong>Status:</strong> {slot.isBooked ? 'Booked' : 'Available'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Slots;