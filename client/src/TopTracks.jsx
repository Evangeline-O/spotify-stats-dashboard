import { useState, useEffect } from 'react'

function TopTracks({ accessToken }) {
  const [topTracks, setTopTracks] = useState(null)
  const [timeRange, setTimeRange] = useState('medium_term')

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/top-tracks?access_token=${accessToken}&time_range=${timeRange}&limit=20`
        )
        const data = await response.json()
        setTopTracks(data)
      } catch (error) {
        console.error("Error fetching top tracks:", error)
      }
    }

    fetchTopTracks()
  }, [accessToken, timeRange])

  if (!topTracks) return <div className="loading">Loading top tracks...</div>

  return (
    <div className="tracks-view">
      <h2 className="section-title">
        <i className="fas fa-music"></i>
        Your Top Tracks
      </h2>
      <div className="time-range-selector">
        <button 
          className={timeRange === 'short_term' ? 'active' : ''} 
          onClick={() => setTimeRange('short_term')}
        >
          Last 4 weeks
        </button>
        <button 
          className={timeRange === 'medium_term' ? 'active' : ''} 
          onClick={() => setTimeRange('medium_term')}
        >
          Last 6 months
        </button>
        <button 
          className={timeRange === 'long_term' ? 'active' : ''} 
          onClick={() => setTimeRange('long_term')}
        >
          All time
        </button>
      </div>
      <div className="tracks-list">
        {topTracks.items.map((track, index) => (
          <div key={track.id} className="track-item">
            <span className="track-number">{index + 1}</span>
            <img src={track.album.images[2].url} alt={track.name} />
            <div className="track-info">
              <p className="track-name">{track.name}</p>
              <p className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopTracks