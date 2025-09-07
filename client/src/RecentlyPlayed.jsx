import { useState, useEffect } from 'react';
import { apiRequest } from './api'; // Import the API utility

function RecentlyPlayed({ accessToken, refreshToken, setAccessToken }) {
  const [recentTracks, setRecentTracks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentTracks = async () => {
      try {
        // Make sure we have an access token
        if (!accessToken) {
          setError("No access token available");
          return;
        }

        console.log("Fetching recently played tracks with token:", accessToken);
        
        // Use the apiRequest utility instead of direct fetch
        const response = await apiRequest(
          'https://d4aa76462a32.ngrok-free.app/recently-played',
          accessToken,
          refreshToken,
          setAccessToken,
          { limit: 20 }
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
        
        setRecentTracks(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
        setError(error.message);
      }
    };

    fetchRecentTracks();
  }, [accessToken, refreshToken, setAccessToken]);

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Recently Played Tracks</h2>
        <p>{error}</p>
        <p>Please try logging in again.</p>
      </div>
    );
  }

  if (!recentTracks) return <div className="loading">Loading recently played tracks...</div>;

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
  );
}

export default RecentlyPlayed;