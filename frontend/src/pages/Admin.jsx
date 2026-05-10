import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';

const Admin = () => {
  const { api } = useAuth();
  const [tab, setTab] = useState('add');
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [hotelPayload, setHotelPayload] = useState({ title: '', description: '', location: '', pricePerNight: '', totalRooms: '', imageURL: [''] });
  const [flightPayload, setFlightPayload] = useState({ airline: '', origin: '', destination: '', price: '', departureTime: '', journeyTime: '', flightType: 'Domestic', totalSeats: '', imageURL: [''], status: 'Scheduled' });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/entities');
      setHotels(response.data.hotels);
      setFlights(response.data.flights);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  useEffect(() => {
    if (tab === 'bookings') {
      loadBookings();
    }
  }, [tab]);

  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await api.get('/admin/bookings');
      setBookings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
      setToast({ message: error.response?.data?.message || 'Could not load bookings', type: 'error' });
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleHotelSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/entities', { type: 'hotel', payload: { ...hotelPayload, pricePerNight: Number(hotelPayload.pricePerNight), totalRooms: Number(hotelPayload.totalRooms), availableRooms: Number(hotelPayload.totalRooms) } });
      setToast({ message: 'Hotel article created successfully', type: 'success' });
      setHotelPayload({ title: '', description: '', location: '', pricePerNight: '', totalRooms: '', imageURL: [''] });
      await loadAdminData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Could not create hotel', type: 'error' });
    }
  };

  const handleFlightSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/entities', {
        type: 'flight',
        payload: {
          ...flightPayload,
          price: Number(flightPayload.price),
          totalSeats: Number(flightPayload.totalSeats),
          availableSeats: Number(flightPayload.totalSeats),
        },
      });
      setToast({ message: 'Flight article created successfully', type: 'success' });
      setFlightPayload({ airline: '', origin: '', destination: '', price: '', departureTime: '', journeyTime: '', flightType: 'Domestic', totalSeats: '', imageURL: [''], status: 'Scheduled' });
      await loadAdminData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Could not create flight', type: 'error' });
    }
  };

  const openEdit = (type, entity) => {
    const clonedEntity = { ...entity };
    if (type === 'hotel') {
      clonedEntity.pricePerNight = clonedEntity.pricePerNight ?? '';
      clonedEntity.totalRooms = clonedEntity.totalRooms ?? '';
      clonedEntity.availableRooms = clonedEntity.availableRooms ?? '';
    }
    if (type === 'flight') {
      clonedEntity.price = clonedEntity.price ?? '';
      clonedEntity.totalSeats = clonedEntity.totalSeats ?? '';
      clonedEntity.availableSeats = clonedEntity.availableSeats ?? '';
    }
    setSelected({ type, entity: clonedEntity });
  };

  const closeEdit = () => setSelected(null);

  const handleSaveEdit = async () => {
    try {
      const payload = {};
      if (selected.type === 'hotel') {
        payload.title = selected.entity.title;
        payload.description = selected.entity.description;
        payload.location = selected.entity.location;
        if (selected.entity.pricePerNight !== '') payload.pricePerNight = Number(selected.entity.pricePerNight);
        if (selected.entity.totalRooms !== '') payload.totalRooms = Number(selected.entity.totalRooms);
        if (selected.entity.availableRooms !== '') payload.availableRooms = Number(selected.entity.availableRooms);
        if (selected.entity.imageURL?.length) payload.imageURL = selected.entity.imageURL;
      } else {
        payload.airline = selected.entity.airline;
        payload.origin = selected.entity.origin;
        payload.destination = selected.entity.destination;
        if (selected.entity.price !== '') payload.price = Number(selected.entity.price);
        if (selected.entity.totalSeats !== '') payload.totalSeats = Number(selected.entity.totalSeats);
        if (selected.entity.availableSeats !== '') payload.availableSeats = Number(selected.entity.availableSeats);
        payload.departureTime = selected.entity.departureTime;
        payload.journeyTime = selected.entity.journeyTime;
        payload.flightType = selected.entity.flightType;
        payload.status = selected.entity.status;
        if (selected.entity.imageURL?.length) payload.imageURL = selected.entity.imageURL;
      }
      await api.put(`/admin/entities/${selected.type}/${selected.entity._id}`, payload);
      setToast({ message: 'Entity updated successfully', type: 'success' });
      closeEdit();
      await loadAdminData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Update failed', type: 'error' });
    }
  };

  const deleteEntity = async (type, id) => {
    try {
      await api.delete(`/admin/entities/${type}/${id}`);
      setToast({ message: 'Article deleted successfully', type: 'success' });
      await loadAdminData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Unable to delete article', type: 'error' });
    }
  };

  const updateFlightStatus = async (flight, newStatus) => {
    try {
      if (flight.status === newStatus) return;
      await api.put(`/admin/entities/flight/${flight._id}`, { status: newStatus });
      setToast({ message: `Flight marked ${newStatus.toLowerCase()} successfully`, type: 'success' });
      await loadAdminData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Unable to update flight status', type: 'error' });
    }
  };

  const updateSelectedField = (key, value) => {
    setSelected((prev) => ({ ...prev, entity: { ...prev.entity, [key]: value } }));
  };

  if (loading) return <Spinner />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Toast message={toast.message} type={toast.type} />
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Admin Panel</h1>
          <p className="mt-2 text-slate-600">Manage hotel and flight articles, update details, and cancel flights in real time.</p>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
          <button onClick={() => setTab('add')} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === 'add' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Add Content</button>
          <button onClick={() => setTab('manage')} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === 'manage' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Existing Articles</button>
          <button onClick={() => setTab('bookings')} className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === 'bookings' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Bookings Registry</button>
        </div>

        {tab === 'add' ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Add Hotel Article</h2>
              <form onSubmit={handleHotelSubmit} className="mt-5 space-y-4">
                <input value={hotelPayload.title} onChange={(e) => setHotelPayload({ ...hotelPayload, title: e.target.value })} placeholder="Hotel title" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                <textarea value={hotelPayload.description} onChange={(e) => setHotelPayload({ ...hotelPayload, description: e.target.value })} placeholder="Description" rows="4" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                <input value={hotelPayload.location} onChange={(e) => setHotelPayload({ ...hotelPayload, location: e.target.value })} placeholder="Location" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={hotelPayload.pricePerNight} onChange={(e) => setHotelPayload({ ...hotelPayload, pricePerNight: e.target.value })} placeholder="Price per night" type="number" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                  <input value={hotelPayload.totalRooms} onChange={(e) => setHotelPayload({ ...hotelPayload, totalRooms: e.target.value })} placeholder="Total rooms" type="number" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                </div>
                <input value={hotelPayload.imageURL[0]} onChange={(e) => setHotelPayload({ ...hotelPayload, imageURL: [e.target.value] })} placeholder="Image URL" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Publish hotel article</button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Add Flight Article</h2>
              <form onSubmit={handleFlightSubmit} className="mt-5 space-y-4">
                <input value={flightPayload.airline} onChange={(e) => setFlightPayload({ ...flightPayload, airline: e.target.value })} placeholder="Airline" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={flightPayload.origin} onChange={(e) => setFlightPayload({ ...flightPayload, origin: e.target.value })} placeholder="Origin" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                  <input value={flightPayload.destination} onChange={(e) => setFlightPayload({ ...flightPayload, destination: e.target.value })} placeholder="Destination" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={flightPayload.price} onChange={(e) => setFlightPayload({ ...flightPayload, price: e.target.value })} placeholder="Price" type="number" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                  <input value={flightPayload.totalSeats} onChange={(e) => setFlightPayload({ ...flightPayload, totalSeats: e.target.value })} placeholder="Total seats" type="number" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input value={flightPayload.departureTime} onChange={(e) => setFlightPayload({ ...flightPayload, departureTime: e.target.value })} type="datetime-local" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                  <input value={flightPayload.journeyTime} onChange={(e) => setFlightPayload({ ...flightPayload, journeyTime: e.target.value })} placeholder="Journey time (e.g. 2h 30m)" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" />
                </div>
                <select value={flightPayload.flightType} onChange={(e) => setFlightPayload({ ...flightPayload, flightType: e.target.value })} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3">
                  <option value="Domestic">Domestic</option>
                  <option value="International">International</option>
                </select>
                <select value={flightPayload.status} onChange={(e) => setFlightPayload({ ...flightPayload, status: e.target.value })} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3">
                  <option value="Scheduled">Scheduled</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <input value={flightPayload.imageURL[0]} onChange={(e) => setFlightPayload({ ...flightPayload, imageURL: [e.target.value] })} placeholder="Image URL" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3" required />
                <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Publish flight article</button>
              </form>
            </div>
          </div>
        ) : tab === 'manage' ? (
          <div className="mt-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Hotels</h2>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{hotel.title}</h3>
                        <p className="text-sm text-slate-600">{hotel.location}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openEdit('hotel', hotel)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                        <button onClick={() => deleteEntity('hotel', hotel._id)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Rooms left: {hotel.availableRooms}</p>
                    {hotel.availableRooms < 1 ? (
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">Booked</span>
                    ) : null}
                    <p className="mt-2 text-sm text-slate-600">${hotel.pricePerNight}/night</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">Flights</h2>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {flights.map((flight) => (
                  <div key={flight._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{flight.airline}</h3>
                        <p className="text-sm text-slate-600">{flight.origin} → {flight.destination}</p>
                        <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${flight.status === 'Cancelled' ? 'bg-red-100 text-red-700' : flight.status === 'Delayed' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{flight.status}</span>
                        <p className="mt-2 text-sm text-slate-600">Type: <span className="font-semibold text-slate-900">{flight.flightType || 'Domestic'}</span></p>
                        <p className="mt-2 text-sm text-slate-600">Seats left: <span className="font-semibold text-slate-900">{flight.availableSeats}</span></p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openEdit('flight', flight)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                        <button onClick={() => deleteEntity('flight', flight._id)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                        {flight.status !== 'Scheduled' && (
                          <button onClick={() => updateFlightStatus(flight, 'Scheduled')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">Scheduled</button>
                        )}
                        {flight.status !== 'Delayed' && (
                          <button onClick={() => updateFlightStatus(flight, 'Delayed')} className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900">Delayed</button>
                        )}
                        {flight.status !== 'Cancelled' && (
                          <button onClick={() => updateFlightStatus(flight, 'Cancelled')} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Cancelled</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Total bookings</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{bookings.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Active bookings</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{bookings.filter((booking) => booking.status === 'confirmed' && new Date(booking.bookedDate) >= new Date()).length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Past bookings</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{bookings.filter((booking) => booking.status === 'confirmed' && new Date(booking.bookedDate) < new Date()).length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <p className="text-sm text-slate-500">Pending / cancelled</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{bookings.filter((booking) => booking.status !== 'confirmed').length}</p>
              </div>
            </div>

            {bookingsLoading ? (
              <Spinner />
            ) : bookings.length ? (
              <div className="space-y-5">
                {bookings.map((booking) => {
                  const now = new Date();
                  const bookingDate = new Date(booking.bookedDate);
                  const isActive = booking.status === 'confirmed' && bookingDate >= now;
                  const isPast = booking.status === 'confirmed' && bookingDate < now;
                  const tagLabel = booking.status === 'cancelled' ? 'Cancelled' : booking.status === 'pending' ? 'Pending' : isActive ? 'Active' : 'Past';
                  const tagClass = booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';

                  return (
                    <div key={booking._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-900">{booking.entity?.title || booking.entity?.airline || 'Booking'}</h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {booking.entityType} reservation for {booking.guestsCount} guest(s){booking.roomsCount ? ` · ${booking.roomsCount} room(s)` : ''}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">Travel date: {bookingDate.toLocaleDateString()}</p>
                          <p className="mt-1 text-sm text-slate-500">Booked by: {booking.user?.name || booking.user?.email || 'Unknown user'}</p>
                        </div>
                        <div className="space-y-2 text-right">
                          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tagClass}`}>{tagLabel}</span>
                          <span className="block text-sm text-slate-500">Status: {booking.status}</span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">User email</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">{booking.user?.email || 'Unknown'}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-50 p-4">
                          <p className="text-sm text-slate-500">Total amount</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">${booking.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-soft">No bookings have been made yet.</div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
          <div className="w-full max-w-3xl rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-slate-900">Edit {selected.type === 'hotel' ? 'Hotel' : 'Flight'}</h2>
              <button onClick={closeEdit} className="text-slate-500 hover:text-slate-900">Close</button>
            </div>
            <div className="mt-6 space-y-4">
              {selected.type === 'hotel' ? (
                <>
                  <input value={selected.entity.title} onChange={(e) => updateSelectedField('title', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <textarea value={selected.entity.description} onChange={(e) => updateSelectedField('description', e.target.value)} rows="4" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <input value={selected.entity.location} onChange={(e) => updateSelectedField('location', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <input value={selected.entity.pricePerNight ?? ''} type="number" onChange={(e) => updateSelectedField('pricePerNight', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                    <input value={selected.entity.totalRooms ?? ''} type="number" onChange={(e) => updateSelectedField('totalRooms', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  </div>
                  <input value={selected.entity.availableRooms ?? ''} type="number" onChange={(e) => updateSelectedField('availableRooms', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <input value={selected.entity.imageURL?.[0] || ''} onChange={(e) => updateSelectedField('imageURL', [e.target.value])} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                </>
              ) : (
                <>
                  <input value={selected.entity.airline} onChange={(e) => updateSelectedField('airline', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <input value={selected.entity.origin} onChange={(e) => updateSelectedField('origin', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                    <input value={selected.entity.destination} onChange={(e) => updateSelectedField('destination', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    <input value={selected.entity.price ?? ''} type="number" onChange={(e) => updateSelectedField('price', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                    <input value={selected.entity.totalSeats ?? ''} type="number" onChange={(e) => updateSelectedField('totalSeats', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                    <input value={selected.entity.availableSeats ?? ''} type="number" onChange={(e) => updateSelectedField('availableSeats', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  </div>
                  <input value={new Date(selected.entity.departureTime).toISOString().slice(0, 16)} type="datetime-local" onChange={(e) => updateSelectedField('departureTime', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <input value={selected.entity.journeyTime || ''} onChange={(e) => updateSelectedField('journeyTime', e.target.value)} placeholder="Journey time (e.g. 2h 30m)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                  <select value={selected.entity.flightType || 'Domestic'} onChange={(e) => updateSelectedField('flightType', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <option value="Domestic">Domestic</option>
                    <option value="International">International</option>
                  </select>
                  <select value={selected.entity.status} onChange={(e) => updateSelectedField('status', e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <option value="Scheduled">Scheduled</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <input value={selected.entity.imageURL?.[0] || ''} onChange={(e) => updateSelectedField('imageURL', [e.target.value])} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3" />
                </>
              )}
              <div className="flex flex-wrap gap-3">
                <button onClick={handleSaveEdit} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Save changes</button>
                <button onClick={closeEdit} className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Admin;
