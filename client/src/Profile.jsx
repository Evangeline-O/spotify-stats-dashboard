import { useState, useEffect } from 'react';
import { apiRequest } from './api'; // We'll create this utility

function Profile({ accessToken, refreshToken, setAccessToken }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make sure we have an access token
        if (!accessToken) {
          setError("No access token available");
          return;
        }

        console.log("Fetching profile with token:", accessToken);
        
        // Use the apiRequest utility instead of direct fetch
        const response = await apiRequest(
          'https://d4aa76462a32.ngrok-free.app/profile',
          accessToken,
          refreshToken,
          setAccessToken
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
        
        setProfile(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      }
    };

    fetchProfile();
  }, [accessToken, refreshToken, setAccessToken]);

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <p>Please try logging in again.</p>
      </div>
    );
  }

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-view">
      <h2 className="section-title">
        <i className="fas fa-user"></i>
        Your Profile
      </h2>
      <div className="profile-info">
        {profile.images && profile.images[0] && (
          <img 
            src={profile.images[0].url} 
            alt={profile.display_name} 
            className="profile-image" 
          />
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
  );
}

export default Profile;