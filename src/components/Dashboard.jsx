import { useState, useEffect } from 'react';
import { setAuthToken, getUserProfile, getTopTracks, getTopArtists, getRecentlyPlayed } from '../services/spotifyAPI';
import Profile from './Profile';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import RecentlyPlayed from './RecentlyPlayed';
import TimeRangeButtons from './TimeRangeButtons';

export default function Dashboard({ token }) {
  const [userProfile, setUserProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [activeTab, setActiveTab] = useState('tracks');
  const [timeRange, setTimeRange] = useState('medium_term');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        setAuthToken(token);
        setLoading(true);
        
        // Fetch user profile
        const profile = await getUserProfile();
        setUserProfile(profile);
        
        // Fetch initial data
        await fetchTopTracks(timeRange);
        await fetchTopArtists(timeRange);
        await fetchRecentlyPlayed();
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
        if (err.response?.status === 401) {
          // Token expired, log out
          localStorage.removeItem('spotify_token');
          window.location.reload();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const fetchTopTracks = async (range) => {
    const tracks = await getTopTracks(range);
    setTopTracks(tracks.items);
  };

  const fetchTopArtists = async (range) => {
    const artists = await getTopArtists(range);
    setTopArtists(artists.items);
  };

  const fetchRecentlyPlayed = async () => {
    const recent = await getRecentlyPlayed();
    setRecentlyPlayed(recent.items);
  };

  const handleTimeRangeChange = async (newRange) => {
    setTimeRange(newRange);
    setLoading(true);
    try {
      await Promise.all([
        fetchTopTracks(newRange),
        fetchTopArtists(newRange)
      ]);
    } catch (err) {
      console.error('Error fetching data with new time range:', err);
      setError('Failed to update data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    window.location.href = '/';
  };

  if (loading && !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading your Spotify data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Spotify Stats Dashboard</h1>
          {userProfile && (
            <Profile profile={userProfile} />
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4 md:mt-0"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <TimeRangeButtons 
          currentRange={timeRange} 
          onChange={handleTimeRangeChange} 
        />
      </div>

      <div className="flex flex-wrap border-b border-slate-700 mb-6">
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'tracks' ? 'border-b-2 border-green-500 text-white' : 'text-slate-400'}`}
          onClick={() => setActiveTab('tracks')}
        >
          Top Tracks
        </button>
        <button
          className={`py-2 px-4 mr-2 ${activeTab === 'artists' ? 'border-b-2 border-green-500 text-white' : 'text-slate-400'}`}
          onClick={() => setActiveTab('artists')}
        >
          Top Artists
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'recent' ? 'border-b-2 border-green-500 text-white' : 'text-slate-400'}`}
          onClick={() => setActiveTab('recent')}
        >
          Recently Played
        </button>
      </div>

      <div>
        {activeTab === 'tracks' && <TopTracks tracks={topTracks} />}
        {activeTab === 'artists' && <TopArtists artists={topArtists} />}
        {activeTab === 'recent' && <RecentlyPlayed tracks={recentlyPlayed} />}
      </div>
    </div>
  );
}