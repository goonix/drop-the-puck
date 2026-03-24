import axios from 'axios';

const nhlClient = axios.create({
  baseURL: '/api/nhl/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export { nhlClient };
