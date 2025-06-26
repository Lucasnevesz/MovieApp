import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]); // Elenco
  const [trailers, setTrailers] = useState([]); // Trailers

  useEffect(() => {
    async function fetchMovieDetail() {
      try {
        // Detalhes do filme
        const movieResponse = await api.get(`/movie/${id}`, {
          params: { language: 'pt-BR' },
        });
        setMovie(movieResponse.data);

        // Elenco do filme
        const castResponse = await api.get(`/movie/${id}/credits`, {
          params: { language: 'pt-BR' },
        });
        setCast(castResponse.data.cast);

        // Trailers do filme
        const trailerResponse = await api.get(`/movie/${id}/videos`, {
          params: { language: 'pt-BR' },
        });
        setTrailers(trailerResponse.data.results);
      } catch (error) {
        console.error('Erro ao carregar detalhes do filme', error);
      }
    }

    fetchMovieDetail();
  }, [id]);

  if (!movie) return <div>Carregando...</div>;

  // Combina tudo para exibir no JSON
  const fullData = {
    ...movie,
    cast,
    trailers,
  };

  return (
    <div className="p-8 flex flex-wrap justify-center text-white">
      <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 pr-8">
        <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
        <p className="text-lg mb-4"><strong>Descrição:</strong> {movie.overview}</p>
        <p className="text-lg mb-4"><strong>Data de Lançamento:</strong> {movie.release_date}</p>
        <p className="text-lg mb-4"><strong>Nota:</strong> {movie.vote_average}</p>
        <p className="text-lg mb-4"><strong>Popularidade:</strong> {movie.popularity}</p>
        <p className="text-lg mb-4"><strong>Receita:</strong> R$ {movie.revenue.toLocaleString('pt-BR')}</p>

        {/* Elenco */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Elenco:</h3>
          <ul className="list-disc pl-5">
            {cast.slice(0, 10).map((actor) => (
              <li key={actor.id} className="text-lg">
                {actor.name} como {actor.character}
              </li>
            ))}
          </ul>
        </div>

        {/* Trailers */}
        {trailers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-2xl font-semibold">Trailers:</h3>
            <div className="flex space-x-4">
              {trailers.slice(0, 3).map((trailer) => (
                <div key={trailer.id} className="w-64 h-36">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exibe todos os dados combinados da API */}
        <div className="mt-8 bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm font-mono">
          <h3 className="text-xl font-semibold mb-2">Dados completos da API:</h3>
          <pre>{JSON.stringify(fullData, null, 2)}</pre>
        </div>
      </div>

      {/* Pôster */}
      <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 mb-8 sm:mb-0">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default MovieDetail;
