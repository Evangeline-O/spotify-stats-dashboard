import { useState, useEffect } from 'react';
import { apiRequest } from './api'; // Import the API utility

function TopTracks({ accessToken, refreshToken, setAccessToken }) {
  const [topTracks, setTopTracks] = useState(null);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        // Make sure we have an access token
        if (!accessToken) {
          setError("No access token available");
          return;
        }

        console.log("Fetching top tracks with token:", accessToken);
        
        // Use the apiRequest utility instead of direct fetch
        const response = await apiRequest(
          'https://d4aa76462a32.ngrok-free.app/top-tracks',
          accessToken,
          refreshToken,
          setAccessToken,
          { time_range: timeRange, limit: 20 }
        );
        
        if (!response) {
          // apiRequest handled the error (likely redirect to login)
          return;
        }
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Received non-JSON response:", text.substring(0, 100));
          throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the response contains an error
        if (data.error) {
          throw new Error(data.error);
        }
        
        setTopTracks(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
        setError(error.message);
      }
    };

    fetchTopTracks();
  }, [accessToken, refreshToken, setAccessToken, timeRange]);

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Top Tracks</h2>
        <p>{error}</p>
        <p>Please try logging in again.</p>
      </div>
    );
  }

  if (!topTracks) return <div className="loading">Loading top tracks...</div>;

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
  );
}

export default TopTracks;