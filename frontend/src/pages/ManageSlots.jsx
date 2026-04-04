import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const initialForm = {
  doctor: '',
  date: '',
  startTime: '',
  endTime: '',
  isBooked: false,
};

function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingSlotId, setEditingSlotId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [slotsRes, doctorsRes] = await Promise.all([
        axiosInstance.get('/api/slots'),
        axiosInstance.get('/api/doctors'),
      ]);
      setSlots(slotsRes.data);
      setDoctors(doctorsRes.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load slot data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingSlotId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setSubmitLoading(true);

      if (editingSlotId) {
        await axiosInstance.put(`/api/slots/${editingSlotId}`, formData);
        setMessage('Slot updated successfully.');
      } else {
        await axiosInstance.post('/api/slots', formData);
        setMessage('Slot created successfully.');
      }

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save slot.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (slot) => {
    setEditingSlotId(slot._id);
    setFormData({
      doctor: slot.doctor?._id || '',
      date: slot.date || '',
      startTime: slot.startTime || '',
      endTime: slot.endTime || '',
      isBooked: !!slot.isBooked,
    });
    setMessage('');
    setError('');
  };

  const handleDelete = async (slotId) => {
    try {
      setActionLoading(slotId);
      setError('');
      setMessage('');

      await axiosInstance.delete(`/api/slots/${slotId}`);
      setMessage('Slot deleted successfully.');
      await fetchData();

      if (editingSlotId === slotId) {
        resetForm();
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete slot.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">Manage Slots</h1>
        <p className="text-gray-600 mt-2">
          Create new appointment slots and manage existing slot availability.
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-2xl shadow-md border border-sky-100 p-6">
          <h2 className="text-xl font-bold text-[#166cb7] mb-4">
            {editingSlotId ? 'Edit Slot' : 'Add Slot'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="e.g. 30 March 2026"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="e.g. 10:30 AM"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isBooked"
                checked={formData.isBooked}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Slot is booked
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
              >
                {submitLoading
                  ? 'Saving...'
                  : editingSlotId
                  ? 'Update Slot'
                  : 'Add Slot'}
              </button>

              {editingSlotId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-md border border-sky-100 p-6">
          <h2 className="text-xl font-bold text-[#166cb7] mb-4">Slot Records</h2>

          {loading ? (
            <p className="text-gray-600">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-gray-600">No slots found.</p>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className="border border-gray-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#166cb7]">
                      {slot.doctor?.name || 'Doctor'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {slot.doctor?.specialization || 'Specialization not available'}
                    </p>

                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold">Date:</span> {slot.date}</p>
                      <p><span className="font-semibold">Start:</span> {slot.startTime}</p>
                      <p><span className="font-semibold">End:</span> {slot.endTime}</p>
                      <p>
                        <span className="font-semibold">Status:</span>{' '}
                        <span className={slot.isBooked ? 'text-red-600 font-semibold' : 'text-green-700 font-semibold'}>
                          {slot.isBooked ? 'Booked' : 'Available'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(slot)}
                      className="rounded-xl border border-[#166cb7] text-[#166cb7] px-4 py-2 font-semibold hover:bg-sky-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slot._id)}
                      disabled={actionLoading === slot._id}
                      className="rounded-xl bg-red-500 text-white px-4 py-2 font-semibold hover:opacity-90 disabled:opacity-70"
                    >
                      {actionLoading === slot._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageSlots;