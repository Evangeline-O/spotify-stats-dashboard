import { useState } from 'react'
import Profile from './Profile'
import TopTracks from './TopTracks'
import RecentlyPlayed from './RecentlyPlayed'
import './App.css'

function Dashboard({ accessToken }) {
  const [activeView, setActiveView] = useState('profile')

  const logout = () => {
    window.localStorage.removeItem("spotifyAccessToken")
    window.location.reload()
  }

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="logo-container">
          <i className="fab fa-spotify logo"></i>
          <h1 className="app-title">Spotify Stats Dashboard</h1>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>
      
      <nav className="nav">
        <button 
          className={activeView === 'profile' ? 'active' : ''} 
          onClick={() => setActiveView('profile')}
        >
          <i className="fas fa-user"></i> Profile
        </button>
        <button 
          className={activeView === 'top-tracks' ? 'active' : ''} 
          onClick={() => setActiveView('top-tracks')}
        >
          <i className="fas fa-music"></i> Top Tracks
        </button>
        <button 
          className={activeView === 'recently-played' ? 'active' : ''} 
          onClick={() => setActiveView('recently-played')}
        >
          <i className="fas fa-history"></i> Recently Played
        </button>
      </nav>
      
      <main className="main-content">
        {activeView === 'profile' && <Profile accessToken={accessToken} />}
        {activeView === 'top-tracks' && <TopTracks accessToken={accessToken} />}
        {activeView === 'recently-played' && <RecentlyPlayed accessToken={accessToken} />}
      </main>
      
      <div className="footer">
        <p>Powered by <span className="spotify-brand">Spotify</span> API • Data refreshes automatically</p>
        <p>© 2025 Spotify Stats Dashboard</p>
      </div>
    </div>
  )
}

export default Dashboard