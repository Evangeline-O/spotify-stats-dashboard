export default function Login() {
  const handleLogin = () => {
  window.location.href = "https://538849fba56a.ngrok-free.app/login";
};

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">🎵 Spotify Stats</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-green-500 rounded-lg"
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}
