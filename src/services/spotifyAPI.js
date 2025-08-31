import axios from 'axios';

const API_BASE = 'https://api.spotify.com/v1';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_BASE,
});

// Set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Get user profile
export const getUserProfile = async () => {
  const response = await api.get('/me');
  return response.data;
};

// Get user's top tracks
export const getTopTracks = async (timeRange = 'medium_term', limit = 10) => {
  const response = await api.get('/me/top/tracks', {
    params: { time_range: timeRange, limit }
  });
  return response.data;
};

// Get user's top artists
export const getTopArtists = async (timeRange = 'medium_term', limit = 10) => {
  const response = await api.get('/me/top/artists', {
    params: { time_range: timeRange, limit }
  });
  return response.data;
};

// Get user's recently played tracks
export const getRecentlyPlayed = async (limit = 20) => {
  const response = await api.get('/me/player/recently-played', {
    params: { limit }
  });
  return response.data;
};

export default api;