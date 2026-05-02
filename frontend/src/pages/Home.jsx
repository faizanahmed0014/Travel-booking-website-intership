import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EntityCard from '../components/EntityCard';
import Spinner from '../components/Spinner';

const Home = () => {
  const { api } = useAuth();
  const [featured, setFeatured] = useState({ hotels: [], flights: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/featured');
        setFeatured(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <section className="rounded-4xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-800 to-slate-900 px-8 py-14 text-white shadow-soft">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-emerald-300">Your next getaway awaits</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Book hotels, flights and experiences in one modern travel platform.</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-200">Explore curated hotel stays, flight deals, and seamless booking with admin-managed content and live availability.</p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Hotel Articles</h2>
          <a href="/hotels" className="text-sm font-medium text-slate-700 hover:text-slate-900">Browse all hotels →</a>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featured.hotels.map((hotel) => <EntityCard key={hotel._id} entity={hotel} type="hotel" />)}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Featured Flight Articles</h2>
          <a href="/flights" className="text-sm font-medium text-slate-700 hover:text-slate-900">Browse all flights →</a>
        </div>
        {loading ? <Spinner /> : (
          <div className="grid gap-6 md:grid-cols-2">
            {featured.flights.map((flight) => <EntityCard key={flight._id} entity={flight} type="flight" />)}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;
