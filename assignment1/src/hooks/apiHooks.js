import { useState, useEffect } from 'react';
import { fetchData } from '../utils/fetchData';

export const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use environment variable for API URL
      const mediaUrl = `${import.meta.env.VITE_MEDIA_API}/media`;
      const mediaItems = await fetchData(mediaUrl);
      // Fetch usernames for each media item 
      const mediaWithUsers = await Promise.all(
        mediaItems.map(async (item) => {
          try {
            const userUrl = `${import.meta.env.VITE_AUTH_API}/users/${item.user_id}`;
            const userData = await fetchData(userUrl);
            return {
              ...item,
              username: userData?.username || 'Unknown',
            };
          } catch (userErr) {
            console.warn(`Failed to fetch user ${item.user_id}:`, userErr);
            return { ...item, username: 'Unknown' };
          }
        })
      );
      setMediaArray(mediaWithUsers);
    } catch (err) {
      console.error('Failed to fetch media:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount
  useEffect(() => {
    fetchMedia();
  }, []); 
  return {
    mediaArray,
    loading,
    error,
    refetch: fetchMedia, // allow manual refresh
  };
};

export const useAuthentication = () => {
  const postLogin = async (credentials) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    
    const response = await fetch(
      `${import.meta.env.VITE_AUTH_API}/auth/login`, 
      fetchOptions
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }
    
    return await response.json();
  };

  return { postLogin };
};

//Custom hook for user operations
export const useUser = () => {
  const postUser = async (userData) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };
    
    const response = await fetch(
      `${import.meta.env.VITE_AUTH_API}/users`, 
      fetchOptions
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed: ${response.status}`);
    }
    
    return await response.json();
  };

  const getUserByToken = async (token) => {
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, //Bearer token auth
      },
    };
    const response = await fetch(
      `${import.meta.env.VITE_AUTH_API}/users/token`, 
      fetchOptions
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    
    return await response.json();
  };

  return { postUser, getUserByToken };
};