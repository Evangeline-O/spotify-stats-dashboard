import './App.css'

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/login'
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Spotify Stats Dashboard</h1>
        <p>View your listening history and top tracks</p>
        <button onClick={handleLogin} className="login-btn">
          Login with Spotify
        </button>
      </div>
    </div>
  )
}

export default Login