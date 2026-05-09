// src/hooks/apiHooks.js
import { useState, useEffect } from 'react';
import { fetchData } from '../utils/fetchData';

export const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch logic (moved from Home.jsx)
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
    refetch: fetchMedia, // Optional: allow manual refresh
  };
};