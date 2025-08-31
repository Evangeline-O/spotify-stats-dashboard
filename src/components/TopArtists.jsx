export default function TopArtists({ artists }) {
  if (!artists || artists.length === 0) {
    return <div className="text-center py-8">No top artists data available.</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Your Top Artists</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist, index) => (
          <div key={artist.id} className="bg-slate-800 p-4 rounded-lg text-center">
            <div className="relative inline-block mb-4">
              {artist.images && artist.images[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                />
              )}
              <span className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {index + 1}
              </span>
            </div>
            <h4 className="font-semibold mb-2">{artist.name}</h4>
            <p className="text-slate-400 text-sm">
              {artist.genres.slice(0, 3).join(' • ')}
            </p>
            <p className="text-slate-500 text-xs mt-2">
              {artist.followers?.total.toLocaleString()} followers
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}