import { useEffect, useState } from 'react';
import EntityCard from '../components/EntityCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';

const Hotels = () => {
  const { api } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hotels', { params: { search, location } });
      setHotels(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    await fetchHotels();
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Browse Hotels</h1>
          <p className="mt-2 text-slate-600">Search by hotel name or location and compare available rooms instantly.</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search hotel name" className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-900" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Search location" className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-slate-900" />
          <button type="submit" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Filter</button>
        </form>
      </div>
      {loading ? <Spinner /> : (
        <div className="grid gap-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
          {hotels.map((hotel) => <EntityCard key={hotel._id} entity={hotel} type="hotel" />)}
        </div>
      )}
    </main>
  );
};

export default Hotels;
