import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('nowPlaying');

  useEffect(() => {
    async function loadMovies() {
      try {
        setIsSearching(true);

        let url = '';
        const params = {
          language: 'pt-BR',
          page: 1,
        };

        if (activeFilter === 'nowPlaying') {
          url = '/movie/now_playing';
        } else if (activeFilter === 'popular') {
          url = '/movie/popular';
        } else if (activeFilter === 'topRated') {
          url = '/movie/top_rated';
        }

        if (search) {
          url = '/search/movie';
          params.query = search;
        }

        const response = await api.get(url, { params });

        setMovies(response.data.results); 
        setIsSearching(false); 
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        setIsSearching(false);
      }
    }

    loadMovies();
  }, [search, activeFilter]);

  return (
    <div className="flex">
      <aside className="w-64 bg-blue-500 min-h-screen p-4">
        <h1 className="text-white text-2xl font-bold mb-4">Filmes</h1>

        <input
          type="text"
          placeholder="Buscar filme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded mb-4"
        />
        
        {/* Menu de filtros */}
        <nav>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeFilter === 'nowPlaying' ? 'bg-blue-700' : 'bg-blue-500'}`}
                onClick={() => setActiveFilter('nowPlaying')}
              >
                Filmes em Cartaz
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeFilter === 'popular' ? 'bg-blue-700' : 'bg-blue-500'}`}
                onClick={() => setActiveFilter('popular')}
              >
                Filmes Populares
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeFilter === 'topRated' ? 'bg-blue-700' : 'bg-blue-500'}`}
                onClick={() => setActiveFilter('topRated')}
              >
                Filmes Mais Votados
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold">
            {activeFilter === 'nowPlaying' ? 'Filmes em Cartaz' : activeFilter === 'popular' ? 'Filmes Populares' : 'Filmes Mais Votados'}
          </h2>
        </div>

        {isSearching ? (
          <div className="col-span-4 text-center">Buscando filmes...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{movie.title}</h2>
                    <p className="text-gray-600 mt-2">Nota: {movie.vote_average}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
