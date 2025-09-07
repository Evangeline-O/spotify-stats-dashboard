// client/src/api.js
export const apiRequest = async (url, accessToken, refreshToken, setAccessToken, params = {}) => {
  try {
    // Build query string from params
    const queryString = new URLSearchParams({
      access_token: accessToken,
      ...params
    }).toString();
    
    // First attempt with current access token
    let response = await fetch(`${url}?${queryString}`);
    
    // Check if token is expired (401 Unauthorized)
    if (response.status === 401) {
      console.log("Access token expired, attempting refresh...");
      
      // Try to refresh the token
      const refreshResponse = await fetch('https://d4aa76462a32.ngrok-free.app/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (refreshResponse.ok) {
        const tokenData = await refreshResponse.json();
        
        // Update the access token in state and localStorage
        setAccessToken(tokenData.access_token);
        localStorage.setItem("spotifyAccessToken", tokenData.access_token);
        
        // Retry the original request with new token
        const retryQueryString = new URLSearchParams({
          access_token: tokenData.access_token,
          ...params
        }).toString();
        response = await fetch(`${url}?${retryQueryString}`);
      } else {
        // If refresh fails, redirect to login
        console.error("Token refresh failed, redirecting to login");
        localStorage.removeItem("spotifyAccessToken");
        localStorage.removeItem("spotifyRefreshToken");
        window.location.href = 'https://d4aa76462a32.ngrok-free.app/login';
        return null;
      }
    }
    
    return response;
  } catch (error) {
    console.error("API request error:", error);
    return null;
  }
};