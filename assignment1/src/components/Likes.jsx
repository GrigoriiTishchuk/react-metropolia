import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '../hooks/contextHooks';
import { useLike } from '../hooks/apiHooks';

const Likes = ({ mediaId }) => {
  const { user } = useUserContext();
  const { 
    postLike, 
    deleteLike, 
    getLikeCountByMediaId, 
    getLikeByUser 
  } = useLike();
  const [likeCount, setLikeCount] = useState(0);
  const [userLike, setUserLike] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const countData = await getLikeCountByMediaId(mediaId);
        setLikeCount(countData.count || 0);
        if (user) {
          try {
            const userLikeData = await getLikeByUser(mediaId);
            setUserLike(userLikeData);
          } catch (err) {
            // 404 = not liked, which is fine
            if (err.message?.includes('404') || err.message?.includes('NotLiked')) {
              setUserLike(null);
            } else {
              console.warn('Failed to check user like:', err);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch likes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLikes();
  }, [mediaId, user, getLikeCountByMediaId, getLikeByUser]);

  const handleToggleLike = async () => {
    if (!user) {
      alert('Please login to like media');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (userLike) {
        await deleteLike(userLike.like_id, token);
        setUserLike(null);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await postLike(mediaId, token);
        // Fetch the new like object to store its ID for deletion later
        const newLike = await getLikeByUser(mediaId);
        setUserLike(newLike);
        setLikeCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
      setError(err.message);
      // Refresh state on error
      const countData = await getLikeCountByMediaId(mediaId);
      setLikeCount(countData.count || 0);
    }
  };
  if (loading) {
    return <span className="text-gray-400 text-sm">Loading...</span>;
  }
  if (error) {
    return <span className="text-red-500 text-sm" title={error}>{error}</span>;
  }
  const isLiked = !!userLike;
  const canLike = !!user;
  return (
    <button
      onClick={handleToggleLike}
      disabled={!canLike}
      className={`flex items-center gap-1 text-sm px-2 py-1 rounded transition-colors ${
        isLiked 
          ? 'text-red-500 hover:text-red-600 bg-red-50' 
          : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
      } ${!canLike ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={canLike ? (isLiked ? 'Unlike' : 'Like this media') : 'Login to like'}
    >
      <span className={isLiked ? 'animate-pulse' : ''}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span className="font-medium">{likeCount}</span>
    </button>
  );
};
Likes.propTypes = {
  mediaId: PropTypes.number.isRequired,
};

export default Likes;