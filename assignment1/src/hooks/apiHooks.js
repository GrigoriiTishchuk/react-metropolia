import { useState, useEffect, useCallback } from 'react';
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

  const postMedia = async (mediaData, token) => {
    const mediaUrl = `${import.meta.env.VITE_MEDIA_API}/media`;
    const payload = {
      filename: mediaData.filename,
      title: mediaData.title,
      description: mediaData.description || '',
      filesize: mediaData.filesize,
      media_type: mediaData.media_type,
      user_id: mediaData.user_id,
      thumbnail: mediaData.thumbnail,
    };
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token?.trim()}`,
      },
      body: JSON.stringify(payload),
    };
    
    console.log('Registering media:', payload.title);
    const response = await fetch(mediaUrl, fetchOptions);
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Media API error:', {
        status: response.status,
        body: responseText,
      });
      
      let errorMsg = `Media registration failed: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData?.message) errorMsg = errorData.message;
      } catch {}
      
      throw new Error(errorMsg);
    }
    const mediaResult = JSON.parse(responseText);
    console.log('Media registered:', mediaResult);
    return mediaResult;
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
    postMedia,
  };
};

export const useFile = () => {
  const postFile = async (file, token) => {
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file provided');
    }
    const uploadUrl = `${import.meta.env.VITE_UPLOAD_SERVER}/upload`;
    const formData = new FormData();
    formData.append('file', file); 
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token?.trim()}`,
      },
      body: formData,
    };
    console.log('Uploading to:', uploadUrl);
    console.log('File:', file.name, `(${(file.size / 1024).toFixed(1)} KB)`);
    const response = await fetch(uploadUrl, fetchOptions);
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Upload API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      // Try to parse error message from API
      let errorMsg = `Upload failed: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData?.message) errorMsg = errorData.message;
      } catch {
        if (responseText.trim()) errorMsg = responseText.trim();
      }
      throw new Error(errorMsg);
    }
    const result = JSON.parse(responseText);
    if (!result?.data) {
      throw new Error('Invalid response format from upload API');
    }
    
    const fileData = result.data;
    console.log('File uploaded successfully:', {
      filename: fileData.filename,
      media_type: fileData.media_type,
      filesize: fileData.filesize,
    });
    // Return file metadata
    return {
      filename: fileData.filename,
      media_type: fileData.media_type,
      filesize: fileData.filesize,
    };
  };
  
  return { postFile };
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

  const getUserByToken = useCallback(async (token) => {
    if (!token || typeof token !== 'string') {
      throw new Error('Token is required');
    }
    const cleanToken = token.trim();
    const apiUrl = `${import.meta.env.VITE_AUTH_API}/users/token`;
    //Headers:Authorization for GET 
    const headers = {
      'Authorization': `Bearer ${cleanToken}`,
    };
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
    });
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      // Try to extract error message
      let errorMsg = `Failed to fetch user: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData?.message) errorMsg = errorData.message;
      } catch {
        if (responseText.trim()) errorMsg = responseText.trim();
      }
      
      throw new Error(errorMsg);
    }
    
    // Parse successful response
    const data = JSON.parse(responseText);
    return data.user;
    
  }, []);

  return { postUser, getUserByToken };
};