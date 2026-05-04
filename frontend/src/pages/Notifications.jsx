import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to mark as read.');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await axiosInstance.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete notification.');
    }
  };

  const typeStyles = {
    Booked: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
    Rescheduled: 'bg-yellow-100 text-yellow-700',
    StatusUpdate: 'bg-blue-100 text-blue-700',
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-gray-600">Loading notifications...</div>;
  }

  if (error) {
    return <div className="max-w-5xl mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">MediTrack</p>
        <h1 className="text-3xl font-bold text-[#166cb7] mt-2">My Notifications</h1>
        <p className="text-gray-600 mt-2">
          Updates about your appointments — bookings, reschedules, cancellations, and status changes.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md border border-sky-100 p-8 text-center text-gray-600">
          You have no notifications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-2xl shadow-md border p-5 transition ${
                n.isRead ? 'border-sky-100 opacity-75' : 'border-[#ff449e]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        typeStyles[n.type] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {n.type}
                    </span>
                    {!n.isRead && (
                      <span className="text-xs font-semibold text-[#ff449e]">• New</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{n.message}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-sm bg-[#166cb7] text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="text-sm bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;