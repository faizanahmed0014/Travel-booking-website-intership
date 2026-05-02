const BookingCard = ({ booking, onCancel }) => {
  const entity = booking.entity || {};
  const bookingType = booking.entityType || 'Booking';
  const normalizedType = bookingType.toLowerCase();
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">{entity.title || entity.airline || `${bookingType} reservation`}</p>
          <p className="mt-1 text-sm text-slate-600">{normalizedType === 'hotel' ? 'Hotel' : normalizedType === 'flight' ? 'Flight' : bookingType} booking for {booking.guestsCount} guest(s)</p>
          {normalizedType === 'hotel' && (
            <p className="mt-1 text-sm text-slate-600">Rooms booked: {booking.roomsCount || 1}</p>
          )}
          {normalizedType === 'flight' && entity.origin && entity.destination && (
            <p className="mt-1 text-sm text-slate-600">Route: {entity.origin} → {entity.destination}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">Travel date: {new Date(booking.bookedDate).toLocaleDateString()}</p>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-sm text-slate-500">Status</p>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{booking.status}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-700">Total paid: <span className="font-semibold text-slate-900">${booking.totalPrice}</span></p>
        <button disabled={booking.status === 'cancelled'} onClick={() => onCancel(booking._id)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          Cancel booking
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
