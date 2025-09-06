import { useState, useEffect } from 'react'

function RecentlyPlayed({ accessToken }) {
  const [recentTracks, setRecentTracks] = useState(null)

  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/recently-played?access_token=${accessToken}&limit=20`
        )
        const data = await response.json()
        setRecentTracks(data)
      } catch (error) {
        console.error("Error fetching recently played tracks:", error)
      }
    }

    fetchRecentTracks()
  }, [accessToken])

  if (!recentTracks) return <div className="loading">Loading recently played tracks...</div>

  return (
    <div className="tracks-view">
      <h2 className="section-title">
        <i className="fas fa-history"></i>
        Recently Played Tracks
      </h2>
      <div className="tracks-list">
        {recentTracks.items.map((item, index) => (
          <div key={item.played_at} className="track-item">
            <span className="track-number">{index + 1}</span>
            <img src={item.track.album.images[2].url} alt={item.track.name} />
            <div className="track-info">
              <p className="track-name">{item.track.name}</p>
              <p className="track-artist">{item.track.artists.map(artist => artist.name).join(', ')}</p>
              <p className="played-at">Played at: {new Date(item.played_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentlyPlayed