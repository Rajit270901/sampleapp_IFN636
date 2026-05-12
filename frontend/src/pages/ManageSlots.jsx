import { useEffect, useState } from 'react'; // hooks for state and loading data https://www.w3schools.com/react/react_hooks.asp
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls

const initialForm = {
  doctor: '',
  date: '',
  startTime: '',
  endTime: '',
  isBooked: false,
};

function ManageSlots() { // admin page for slot crud https://www.w3schools.com/react/react_components.asp
  const [slots, setSlots] = useState([]); // stores slot list https://www.w3schools.com/react/react_usestate.asp
  const [doctors, setDoctors] = useState([]); // stores doctors for dropdown
  const [formData, setFormData] = useState(initialForm); // stores add edit form values
  const [editingSlotId, setEditingSlotId] = useState(''); // stores slot id when editing
  const [loading, setLoading] = useState(true); // loading for slot records
  const [submitLoading, setSubmitLoading] = useState(false); // loading for add update button
  const [actionLoading, setActionLoading] = useState(''); // stores slot id while delete is running
  const [error, setError] = useState(''); // stores error message
  const [message, setMessage] = useState(''); // stores success message

  const fetchData = async () => { // async because api calls take time https://www.w3schools.com/js/js_async.asp
    try { // catches api errors https://www.w3schools.com/js/js_errors.asp
      setLoading(true);
      const [slotsRes, doctorsRes] = await Promise.all([
        axiosInstance.get('/api/slots'),
        axiosInstance.get('/api/doctors'),
      ]); // loads slots and doctors together https://www.w3schools.com/js/js_promise.asp
      setSlots(slotsRes.data);
      setDoctors(doctorsRes.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load slot data.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
    } finally {
      setLoading(false); // stops loading whether request works or fails https://www.w3schools.com/js/js_errors.asp
    }
  };

  useEffect(() => { // runs once when page loads https://www.w3schools.com/react/react_useeffect.asp
    fetchData();
  }, []);

  const handleChange = (e) => { // runs when any form input changes https://www.w3schools.com/react/react_events.asp
    const { name, value, type, checked } = e.target; // gets input values from event https://www.w3schools.com/js/js_destructuring.asp
    setFormData((prev) => ({
      ...prev, // keeps previous form values https://www.w3schools.com/react/react_es6_spread.asp
      [name]: type === 'checkbox' ? checked : value, // checkbox uses checked but other inputs use value
    }));
  };

  const resetForm = () => {
    setFormData(initialForm); // clears form back to default values
    setEditingSlotId(''); // exits edit mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stops form from refreshing page https://www.w3schools.com/jsref/event_preventdefault.asp
    setError('');
    setMessage('');

    try {
      setSubmitLoading(true);

      if (editingSlotId) {
        await axiosInstance.put(`/api/slots/${editingSlotId}`, formData); // updates existing slot using id https://www.w3schools.com/js/js_string_templates.asp
        setMessage('Slot updated successfully.');
      } else {
        await axiosInstance.post('/api/slots', formData); // creates new slot
        setMessage('Slot created successfully.');
      }

      resetForm();
      await fetchData(); // reloads slots and doctors after saving
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save slot.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (slot) => {
    setEditingSlotId(slot._id); // puts form into edit mode
    setFormData({
      doctor: slot.doctor?._id || '', // optional chaining avoids error if doctor is missing https://www.w3schools.com/js/js_2020.asp
      date: slot.date || '',
      startTime: slot.startTime || '',
      endTime: slot.endTime || '',
      isBooked: !!slot.isBooked, // converts value into true or false
    });
    setMessage('');
    setError('');
  };

  const handleDelete = async (slotId) => {
    try {
      setActionLoading(slotId);
      setError('');
      setMessage('');

      await axiosInstance.delete(`/api/slots/${slotId}`); // deletes selected slot
      setMessage('Slot deleted successfully.');
      await fetchData();

      if (editingSlotId === slotId) {
        resetForm(); // clears form if deleted slot was being edited
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
                {doctors.map((doctor) => ( // shows each doctor in dropdown https://www.w3schools.com/react/react_lists.asp
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
              {slots.map((slot) => ( // shows each slot as one record card
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

export default ManageSlots; // exporting page so router can use it https://www.w3schools.com/react/react_es6_modules.asp