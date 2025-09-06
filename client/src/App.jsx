import { useState, useEffect } from 'react'
import './App.css'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    // Extract access token from URL
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('access_token')
    
    if (token) {
      setAccessToken(token)
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  return (
    <div className="app">
      {!accessToken ? <Login /> : <Dashboard accessToken={accessToken} />}
    </div>
  )
}

export default App