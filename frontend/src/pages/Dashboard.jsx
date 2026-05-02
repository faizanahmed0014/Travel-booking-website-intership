import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BookingCard from '../components/BookingCard';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { api, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/user');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setToast({ message: error.response?.data?.message || 'Could not load bookings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setToast({ message: 'Booking cancelled successfully', type: 'success' });
      await loadBookings();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Could not cancel booking', type: 'error' });
    }
  };

  const now = new Date();
  const confirmedBookings = bookings.filter((booking) => booking.status === 'confirmed' && new Date(booking.bookedDate) >= now);
  const pastBookings = bookings.filter((booking) => booking.status === 'confirmed' && new Date(booking.bookedDate) < now);
  const pendingBookings = bookings.filter((booking) => booking.status === 'pending');
  const cancelledBookings = bookings.filter((booking) => booking.status === 'cancelled');

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Toast message={toast.message} type={toast.type} />
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Booking History</h1>
        <p className="mt-2 text-slate-600">Review your hotel and flight reservations, including past and cancelled bookings.</p>
      </div>
      {loading ? <Spinner /> : (
        bookings.length ? (
          <div className="space-y-10">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 shadow-soft">
              You have <span className="font-semibold text-slate-900">{bookings.length}</span> booking{bookings.length !== 1 ? 's' : ''} in your history.
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Upcoming confirmed bookings</h2>
                  <p className="mt-1 text-sm text-slate-500">Your active reservations that are still ahead.</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{confirmedBookings.length}</span>
              </div>
              {confirmedBookings.length ? (
                <div className="space-y-5">
                  {confirmedBookings.map((booking) => <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} />)}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No upcoming confirmed bookings.</div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Past bookings</h2>
                  <p className="mt-1 text-sm text-slate-500">Trips that have already occurred.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{pastBookings.length}</span>
              </div>
              {pastBookings.length ? (
                <div className="space-y-5">
                  {pastBookings.map((booking) => <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} />)}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No past bookings yet.</div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Pending bookings</h2>
                  <p className="mt-1 text-sm text-slate-500">Bookings awaiting confirmation or payment.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{pendingBookings.length}</span>
              </div>
              {pendingBookings.length ? (
                <div className="space-y-5">
                  {pendingBookings.map((booking) => <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} />)}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No pending bookings.</div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Cancelled bookings</h2>
                  <p className="mt-1 text-sm text-slate-500">Bookings you have cancelled.</p>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">{cancelledBookings.length}</span>
              </div>
              {cancelledBookings.length ? (
                <div className="space-y-5">
                  {cancelledBookings.map((booking) => <BookingCard key={booking._id} booking={booking} onCancel={cancelBooking} />)}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No cancelled bookings.</div>
              )}
            </section>
          </div>
        ) : (
          <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-soft">No bookings yet. Start exploring hotels and flights to book your next trip.</div>
        )
      )}
    </main>
  );
};

export default Dashboard;
