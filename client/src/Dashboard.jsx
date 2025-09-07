import { useState, useEffect } from 'react'
import Profile from './Profile'
import TopTracks from './TopTracks'
import RecentlyPlayed from './RecentlyPlayed'
import './App.css'

function Dashboard() {
  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [activeView, setActiveView] = useState('profile')

  useEffect(() => {
    // Extract both tokens from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('access_token')
    const refresh = urlParams.get('refresh_token')
    
    // Check localStorage for existing tokens
    const storedToken = localStorage.getItem("spotifyAccessToken")
    const storedRefresh = localStorage.getItem("spotifyRefreshToken")
    
    if (token) {
      setAccessToken(token)
      localStorage.setItem("spotifyAccessToken", token)
    } else if (storedToken) {
      setAccessToken(storedToken)
    }
    
    if (refresh) {
      setRefreshToken(refresh)
      localStorage.setItem("spotifyRefreshToken", refresh)
    } else if (storedRefresh) {
      setRefreshToken(storedRefresh)
    }
    
    // Clean the URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }, [])

  const logout = () => {
    // Clear both tokens
    localStorage.removeItem("spotifyAccessToken")
    localStorage.removeItem("spotifyRefreshToken")
    setAccessToken(null)
    setRefreshToken(null)
    window.location.reload()
  }

  return (
    <div className="dashboard">
      <header className="app-header">
        <div className="logo-container">
          <i className="fab fa-spotify logo"></i>
          <h1 className="app-title">Spotify Stats Dashboard</h1>
        </div>
        <div className="user-info">
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
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
        {activeView === 'profile' && (
          <Profile 
            accessToken={accessToken} 
            refreshToken={refreshToken}
            setAccessToken={setAccessToken}
          />
        )}
        {activeView === 'top-tracks' && (
          <TopTracks 
            accessToken={accessToken} 
            refreshToken={refreshToken}
            setAccessToken={setAccessToken}
          />
        )}
        {activeView === 'recently-played' && (
          <RecentlyPlayed 
            accessToken={accessToken} 
            refreshToken={refreshToken}
            setAccessToken={setAccessToken}
          />
        )}
      </main>
      
      <div className="footer">
        <p>Powered by <span className="spotify-brand">Spotify</span> API • Data refreshes automatically</p>
        <p>© 2025 Spotify Stats Dashboard</p>
      </div>
    </div>
  )
}

export default Dashboard