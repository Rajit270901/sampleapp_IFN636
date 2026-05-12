import { useEffect, useState } from 'react'; // hooks for state and loading data https://www.w3schools.com/react/react_hooks.asp
import axiosInstance from '../axiosConfig'; // custom axios setup for api calls

const initialForm = {
  name: '',
  specialization: '',
  email: '',
  phone: '',
  isAvailable: true,
};

function ManageDoctors() { // admin page for doctor crud https://www.w3schools.com/react/react_components.asp
  const [doctors, setDoctors] = useState([]); // stores doctor list https://www.w3schools.com/react/react_usestate.asp
  const [formData, setFormData] = useState(initialForm); // stores add edit form values
  const [editingDoctorId, setEditingDoctorId] = useState(''); // stores doctor id when editing
  const [loading, setLoading] = useState(true); // loading for doctor records
  const [submitLoading, setSubmitLoading] = useState(false); // loading for add update button
  const [actionLoading, setActionLoading] = useState(''); // stores doctor id while delete is running
  const [error, setError] = useState(''); // stores error message
  const [message, setMessage] = useState(''); // stores success message

  const fetchDoctors = async () => { // async because api request takes time https://www.w3schools.com/js/js_async.asp
    try { // catches api errors https://www.w3schools.com/js/js_errors.asp
      setLoading(true);
      const res = await axiosInstance.get('/api/doctors');
      setDoctors(res.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load doctors.'); // optional chaining avoids crash if response is missing https://www.w3schools.com/js/js_2020.asp
    } finally {
      setLoading(false); // stops loading whether request works or fails https://www.w3schools.com/js/js_errors.asp
    }
  };

  useEffect(() => { // runs once when page loads https://www.w3schools.com/react/react_useeffect.asp
    fetchDoctors();
  }, []);

  const handleChange = (e) => { // runs when any form input changes https://www.w3schools.com/react/react_events.asp
    const { name, value, type, checked } = e.target; // gets input details from event https://www.w3schools.com/js/js_destructuring.asp
    setFormData((prev) => ({
      ...prev, // keeps previous form values https://www.w3schools.com/react/react_es6_spread.asp
      [name]: type === 'checkbox' ? checked : value, // checkbox uses checked but text inputs use value
    }));
  };

  const resetForm = () => {
    setFormData(initialForm); // clears form back to default values
    setEditingDoctorId(''); // exits edit mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stops form refresh https://www.w3schools.com/jsref/event_preventdefault.asp
    setError('');
    setMessage('');

    try {
      setSubmitLoading(true);

      if (editingDoctorId) {
        await axiosInstance.put(`/api/doctors/${editingDoctorId}`, formData); // updates existing doctor using id https://www.w3schools.com/js/js_string_templates.asp
        setMessage('Doctor updated successfully.');
      } else {
        await axiosInstance.post('/api/doctors', formData); // creates new doctor
        setMessage('Doctor created successfully.');
      }

      resetForm();
      await fetchDoctors(); // reloads doctor list after save
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save doctor.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctorId(doctor._id); // puts form into edit mode
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      isAvailable: !!doctor.isAvailable, // converts value into true or false
    });
    setMessage('');
    setError('');
  };

  const handleDelete = async (doctorId) => {
    try {
      setActionLoading(doctorId);
      setError('');
      setMessage('');

      await axiosInstance.delete(`/api/doctors/${doctorId}`); // deletes selected doctor
      setMessage('Doctor deleted successfully.');
      await fetchDoctors();

      if (editingDoctorId === doctorId) {
        resetForm(); // clears form if deleted doctor was being edited
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete doctor.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">Manage Doctors</h1>
        <p className="text-gray-600 mt-2">
          Add new doctors, edit doctor details, and remove records when needed.
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
            {editingDoctorId ? 'Edit Doctor' : 'Add Doctor'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter doctor name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Enter specialization"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter doctor email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#166cb7]"
                required
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="h-4 w-4"
              />
              Doctor is currently available
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 rounded-xl bg-[#609139] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-70"
              >
                {submitLoading
                  ? 'Saving...'
                  : editingDoctorId
                  ? 'Update Doctor'
                  : 'Add Doctor'}
              </button>

              {editingDoctorId && (
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
          <h2 className="text-xl font-bold text-[#166cb7] mb-4">Doctor Records</h2>

          {loading ? (
            <p className="text-gray-600">Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <p className="text-gray-600">No doctors found.</p>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => ( // shows each doctor as one record card https://www.w3schools.com/react/react_lists.asp
                <div
                  key={doctor._id}
                  className="border border-gray-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-[#166cb7]">{doctor.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{doctor.specialization}</p>

                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold">Email:</span> {doctor.email}</p>
                      <p><span className="font-semibold">Phone:</span> {doctor.phone}</p>
                      <p>
                        <span className="font-semibold">Availability:</span>{' '}
                        <span className={doctor.isAvailable ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}>
                          {doctor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="rounded-xl border border-[#166cb7] text-[#166cb7] px-4 py-2 font-semibold hover:bg-sky-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      disabled={actionLoading === doctor._id}
                      className="rounded-xl bg-red-500 text-white px-4 py-2 font-semibold hover:opacity-90 disabled:opacity-70"
                    >
                      {actionLoading === doctor._id ? 'Deleting...' : 'Delete'}
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

export default ManageDoctors; // exporting page so router can use it https://www.w3schools.com/react/react_es6_modules.asp