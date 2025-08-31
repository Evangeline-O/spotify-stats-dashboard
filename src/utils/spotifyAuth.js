// Spotify API constants
export const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played'
].join('%20');

// Get credentials from environment variables
export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

// Generate a random string for state parameter
export const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Get the Spotify authorization URL
export const getAuthorizationUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const url = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SPOTIFY_SCOPES}&state=${state}`;
  
  console.log("Auth URL:", url); // Add this line
  return url;
};

// Extract access token from URL after redirect
export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  return {
    access_token: params.get('access_token'),
    token_type: params.get('token_type'),
    expires_in: parseInt(params.get('expires_in') || '0'),
    state: params.get('state')
  };
};

// Check if token is valid (not expired)
export const isTokenValid = (token) => {
  if (!token) return false;
  
  const now = new Date();
  return token.expires_at > now.getTime();
};
