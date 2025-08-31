import { getAuthorizationUrl } from '../utils/spotifyAuth';

export default function Login() {
  const handleLogin = () => {
    window.location.href = getAuthorizationUrl();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-md w-full bg-slate-700 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">Spotify Stats Dashboard</h1>
        <p className="mb-8 text-slate-300">
          View your listening history, top artists, and favorite tracks with personalized statistics.
        </p>
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center mx-auto"
        >
          <span>Login with Spotify</span>
        </button>
      </div>
    </div>
  );
}