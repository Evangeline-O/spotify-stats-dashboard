import { useState, useEffect } from 'react'

function Profile({ accessToken }) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:4000/profile?access_token=${accessToken}`)
        const data = await response.json()
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      }
    }

    fetchProfile()
  }, [accessToken])

  if (!profile) return <div className="loading">Loading profile...</div>

  return (
    <div className="profile-view">
      <h2 className="section-title">
        <i className="fas fa-user"></i>
        Your Profile
      </h2>
      <div className="profile-info">
        {profile.images && profile.images[0] && (
          <img src={profile.images[0].url} alt={profile.display_name} className="profile-image" />
        )}
        <div className="profile-details">
          <h3>{profile.display_name}</h3>
          <p>Email: {profile.email}</p>
          <p>Country: {profile.country}</p>
          <p>Followers: {profile.followers?.total}</p>
          <p>Plan: {profile.product}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile