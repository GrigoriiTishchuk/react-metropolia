// SingleView.jsx

const SingleView = (props) => {
  if (!props.item) return null;
  const {item, setSelectedItem} = props;
  const handleClose = () => {
    setSelectedItem(null);
  };
  return (
    // TODO: Add JSX for displaying a mediafile here
    // - use e.g. a <dialog> element for creating a modal
    // - use item prop to render the media item details
    // - use img tag for displaying images
    // - use video tag for displaying videos
    <dialog open className="single-view-dialog" onClick={(e) => {
      // Close when clicking outside the content
      if (e.target === e.currentTarget) handleClose();
    }}>
      <div className="single-view-content">
        <button className="close-btn" onClick={handleClose} aria-label="Close">
          Close
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
    </dialog>
  );
};
export default SingleView;