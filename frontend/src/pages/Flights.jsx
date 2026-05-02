import { useEffect, useState } from 'react';
import EntityCard from '../components/EntityCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';

const Flights = () => {
  const { api } = useAuth();
  const [flights, setFlights] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await api.get('/flights', { params: { origin, destination } });
      setFlights(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchFlights();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Flights</h1>
          <p className="mt-2 text-slate-600">Search flights by origin and destination and view current status easily.</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-900" />
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-900" />
          <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Search</button>
        </form>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-6 lg:grid-cols-2">
          {flights.map((flight) => <EntityCard key={flight._id} entity={flight} type="flight" />)}
        </div>
      )}
    </main>
  );
};

export default Flights;
