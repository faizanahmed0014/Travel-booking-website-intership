import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/Spinner';
import Toast from '../components/Toast';

const EntityDetail = ({ entityType }) => {
  const { type: routeType, id } = useParams();
  const type = entityType || routeType;
  const { api, user } = useAuth();
  const navigate = useNavigate();
  const [entity, setEntity] = useState(null);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [roomsCount, setRoomsCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const loadEntity = async () => {
      try {
        if (!type) throw new Error('Entity type is required');
        const endpoint = type === 'hotel' ? 'hotels' : 'flights';
        const response = await api.get(`/${endpoint}/${id}`);
        setEntity(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadEntity();
  }, [api, id, type]);

  const handleBooking = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
        await api.post('/bookings', {
        entityId: id,
        entityType: type === 'hotel' ? 'Hotel' : 'Flight',
        bookedDate: date,
        guestsCount: guests,
        roomsCount: type === 'hotel' ? roomsCount : undefined,
      });
      setToast({ message: 'Booking confirmed successfully', type: 'success' });
      setDate('');
      setGuests(1);
      setRoomsCount(1);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Unable to complete booking', type: 'error' });
    }
  };

  if (loading) return <Spinner />;
  if (!entity) return <div className="mx-auto max-w-5xl px-4 py-10 text-center text-slate-700">Entity not found.</div>;

  const isCancelled = type === 'flight' && entity?.status === 'Cancelled';
  const isDelayed = type === 'flight' && entity?.status === 'Delayed';
  const isHotelBooked = type === 'hotel' && entity?.availableRooms < 1;
  const isFlightFullyBooked = type === 'flight' && entity?.availableSeats < 1;
  const hasFlightDeparted = type === 'flight' && new Date(entity?.departureTime) <= new Date();
  const details = type === 'hotel' ? (
    <>
      <p className="text-slate-700">{entity.description}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">Location<br /><span className="font-semibold text-slate-900">{entity.location}</span></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4">Rooms left<br /><span className="font-semibold text-slate-900">{entity.availableRooms}</span></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4">Price per night<br /><span className="font-semibold text-slate-900">${entity.pricePerNight}</span></div>
      </div>
    </>
  ) : (
    <>
      <p className="text-slate-700">Fly from {entity.origin} to {entity.destination} with {entity.airline}. Scheduled departure on {new Date(entity.departureTime).toLocaleString()}.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">Status<br /><span className={`inline-flex rounded-full px-3 py-1 ${entity.status === 'Cancelled' ? 'bg-red-100 text-red-700' : entity.status === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{entity.status}</span></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4">Seats left<br /><span className="font-semibold text-slate-900">{entity.availableSeats ?? 0}</span></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-4">Price per person<br /><span className="font-semibold text-slate-900">${entity.price}</span></div>
      </div>
    </>
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Toast message={toast.message} type={toast.type} />
      <div className="grid gap-8 xl:grid-cols-[1.4fr,0.9fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-soft">
            <img src={entity.imageURL?.[0]} alt={entity.title || entity.airline} className="h-96 w-full object-cover" />
          </div>
          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{type === 'hotel' ? 'Hotel' : 'Flight'} details</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{entity.title || entity.airline}</h1>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{type === 'hotel' ? entity.location : `${entity.origin} → ${entity.destination}`}</div>
            </div>
            <div className="mt-6">{details}</div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Book now</p>
            <div className="mt-4 space-y-4">
              {isCancelled ? (
                <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">This flight has been cancelled. Booking is disabled.</div>
              ) : isDelayed ? (
                <div className="rounded-3xl bg-amber-50 p-4 text-sm text-amber-700">This flight is delayed. Booking is still available, but the departure time may change.</div>
              ) : null}
              {hasFlightDeparted && (
                <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">This flight has already departed. Booking is disabled.</div>
              )}
              {isFlightFullyBooked && (
                <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">This flight is fully booked. No further bookings are allowed.</div>
              )}
              {isHotelBooked && (
                <div className="rounded-3xl bg-red-50 p-4 text-sm text-red-700">This hotel is fully booked. No further bookings are allowed.</div>
              )}
              <form onSubmit={handleBooking} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Choose date</label>
                <input value={date} onChange={(e) => setDate(e.target.value)} type="date" required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                {type === 'hotel' && (
                  <>
                    <label className="block text-sm font-medium text-slate-700">Rooms</label>
                    <input value={roomsCount} onChange={(e) => setRoomsCount(Number(e.target.value))} type="number" min="1" required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                  </>
                )}
                <label className="block text-sm font-medium text-slate-700">Guests</label>
                <input value={guests} onChange={(e) => setGuests(Number(e.target.value))} type="number" min="1" required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                <button type="submit" disabled={isCancelled || isHotelBooked || isFlightFullyBooked || hasFlightDeparted} className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">Book Now</button>
              </form>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default EntityDetail;
