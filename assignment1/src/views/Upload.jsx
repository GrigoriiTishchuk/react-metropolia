import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/contextHooks';
import { useFile, useMedia } from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserContext();
  const { postFile } = useFile();
  const { postMedia } = useMedia();
  const initValues = { title: '', description: '' };
  
  const doUpload = async (formData) => {
  try {
    if (!file || !file.name) {
      throw new Error('Please select a file to upload');
    }
    if (!isAuthenticated || !user) {
      throw new Error('You must be logged in to upload');
    }
    setUploading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const fileData = await postFile(file, token);
    console.log('File uploaded:', fileData);
    const mediaData = await postMedia(
      {
        ...fileData,
        ...formData,
        user_id: user.user_id,
      },
      token
    );
    console.log('Media registered:', mediaData);
    alert('Upload successful!');
    navigate('/', { replace: true });
  } catch (err) {
    console.error('Upload failed:', err);
    setError(err.message || 'Upload failed. Please try again.');
  } finally {
    setUploading(false);
  }
};
  
  const { inputs, handleInputChange, handleSubmit } = useForm(doUpload, initValues);
  const handleFileChange = (evt) => {
    const selectedFile = evt.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Unsupported file type. Please upload JPG, PNG, GIF, MP4, or WebM.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      // Validate file size 
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File too large. Maximum size is 50MB.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      // Create preview URL for images/videos
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    }
  };
  
  // Cleanup preview URL on unmount
  useState(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  // Disable upload if not authenticated or missing required fields
  const canUpload = isAuthenticated && file && inputs.title?.length >= 3 && !uploading;
  return (
    <div className="upload-container">
      <h1>Upload Media</h1>
      {!isAuthenticated ? (
        <div className="auth-required">
          <p>You must be <a href="/login">logged in</a> to upload media.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="upload-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={inputs.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title"
              required
              minLength={3}
              disabled={uploading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={inputs.description}
              onChange={handleInputChange}
              placeholder="Add a description (optional)"
              disabled={uploading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="file">File *</label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={uploading}
              required
            />
            <small className="form-hint">
              Supported: JPG, PNG, GIF, MP4, WebM • Max 50MB
            </small>
          </div>
          {/* Preview section */}
          {previewUrl && (
            <div className="preview-section">
              <p>Preview:</p>
              {file?.type?.startsWith('image') ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="media-preview"
                />
              ) : file?.type?.startsWith('video') ? (
                <video 
                  src={previewUrl} 
                  controls 
                  className="media-preview"
                />
              ) : (
                <div className="file-preview">
                  {file?.name} ({(file?.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={!canUpload}
            className="upload-btn"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Upload;