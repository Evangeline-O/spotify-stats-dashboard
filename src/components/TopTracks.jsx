export default function TopTracks({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return <div className="text-center py-8">No top tracks data available.</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Your Top Tracks</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track, index) => (
          <div key={track.id} className="flex items-center bg-slate-800 p-4 rounded-lg">
            <span className="text-2xl font-bold text-slate-400 mr-4 w-8 text-right">{index + 1}</span>
            {track.album.images && track.album.images[0] && (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="w-16 h-16 rounded mr-4"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{track.name}</p>
              <p className="text-slate-400 truncate">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
              <p className="text-slate-500 text-sm">Popularity: {track.popularity}/100</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}