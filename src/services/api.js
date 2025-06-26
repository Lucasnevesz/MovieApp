import axios from 'axios';

const API_KEY = '5af02a9d6d39e8c8aae9c6e5addaa207';

// Criar uma instância do axios
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

export default api;
