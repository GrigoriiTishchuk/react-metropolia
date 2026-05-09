import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Single = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;

  // Handle direct URL access without state
  if (!item) {
    return (
      <div className="single-view">
        <h2>No media selected</h2>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="single-view">
      <button className="close-btn" onClick={handleClose} aria-label="Close">
        ← Back
      </button>
      
      <h2>{item.title}</h2>
      
      {/* Conditional rendering: image vs video */}
      {item.media_type?.startsWith('image') ? (
        <img 
          src={item.filename} 
          alt={item.title} 
          className="media-preview"
        />
      ) : item.media_type?.startsWith('video') ? (
        <video 
          src={item.filename} 
          controls 
          className="media-preview"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>Unsupported media type: {item.media_type}</p>
      )}
      
      <p className="description">{item.description || 'No description available.'}</p>
      
      <div className="meta-info">
        <small>
          <strong>Created:</strong> {new Date(item.created_at).toLocaleString('fi-FI')}<br />
          <strong>Size:</strong> {(item.filesize / 1024).toFixed(1)} KB<br />
          <strong>Type:</strong> {item.media_type}
        </small>
      </div>
    </div>
  );
};

export default Single;