export default function RecentlyPlayed({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return <div className="text-center py-8">No recently played data available.</div>;
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-6">Recently Played Tracks</h3>
      <div className="space-y-4">
        {tracks.map((item, index) => (
          <div key={`${item.track.id}-${item.played_at}`} className="flex items-center bg-slate-800 p-4 rounded-lg">
            <span className="text-slate-400 mr-4 w-6 text-right">{index + 1}</span>
            {item.track.album.images && item.track.album.images[0] && (
              <img
                src={item.track.album.images[0].url}
                alt={item.track.name}
                className="w-12 h-12 rounded mr-4"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{item.track.name}</p>
              <p className="text-slate-400 truncate">
                {item.track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
            <div className="text-right text-slate-500 text-sm">
              {new Date(item.played_at).toLocaleDateString()}
              <br />
              {new Date(item.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}