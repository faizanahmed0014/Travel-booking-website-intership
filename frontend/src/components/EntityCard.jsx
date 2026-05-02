import { Link } from 'react-router-dom';

const EntityCard = ({ entity, type }) => {
  const isFlight = type === 'flight';
  const isBookedHotel = type === 'hotel' && entity.availableRooms <= 0;
  const isFlightFullyBooked = isFlight && entity.availableSeats <= 0;
  const isFlightDeparted = isFlight && new Date(entity.departureTime) <= new Date();
  const badge = isFlight && (entity.status === 'Cancelled' || entity.status === 'Delayed' || isFlightFullyBooked || isFlightDeparted) || isBookedHotel;
  const badgeText = isBookedHotel
    ? 'Booked'
    : isFlightFullyBooked
      ? 'Booked'
      : isFlightDeparted
        ? 'Departed'
        : entity.status === 'Cancelled'
          ? 'Cancelled'
          : 'Delayed';
  const badgeClass = isBookedHotel || isFlightFullyBooked || isFlightDeparted
    ? 'bg-red-600 text-white'
    : 'bg-amber-500 text-slate-950';
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden">
        <img src={entity.imageURL?.[0]} alt={entity.title || entity.airline} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {badge && <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>{badgeText}</span>}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">{entity.title || entity.airline}</p>
            <p className="mt-1 text-sm text-slate-500">{isFlight ? `${entity.origin} → ${entity.destination}` : entity.location}</p>
          </div>
          <p className="text-lg font-semibold text-slate-900">${entity.pricePerNight || entity.price}</p>
        </div>
        {isFlight ? (
          <>
            <p className="text-sm text-slate-600">Departs {new Date(entity.departureTime).toLocaleString()}</p>
            <p className="text-sm text-slate-600">Seats left: <span className="font-semibold text-slate-900">{entity.availableSeats ?? 0}</span></p>
          </>
        ) : (
          <p className="text-sm text-slate-600">Rooms left: <span className="font-semibold text-slate-900">{entity.availableRooms}</span></p>
        )}
        <Link to={`/${type === 'hotel' ? 'hotels' : 'flights'}/${entity._id}`} className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
          View details
        </Link>
      </div>
    </div>
  );
};

export default EntityCard;
