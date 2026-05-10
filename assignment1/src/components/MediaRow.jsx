import { Link } from 'react-router-dom';
import { useUserContext } from '../hooks/contextHooks';
import { useMedia } from '../hooks/apiHooks';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const MediaRow = ({ item }) => {
  const { user } = useUserContext();
  const { deleteMedia, modifyMedia, refetch} = useMedia();
  const navigate = useNavigate();
  // Permission check: owner OR admin can modify/delete
  const canModify = user && (
    user.user_id === item.user_id || 
    user.level_name === 'Admin'
  );
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering row click handlers
    // Confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      await deleteMedia(item.media_id, token);
      await refetch?.();
      alert('Media deleted successfully');
      navigate(0);
    } catch (err) {
      console.error('Delete failed:', err);
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const handleModify = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newTitle = prompt('Edit title:', item.title);
    if (newTitle === null) return; // User cancelled
    const newDescription = prompt('Edit description:', item.description || '');
    if (newDescription === null) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login again');
      await modifyMedia(
        item.media_id,
        {
          title: newTitle,
          description: newDescription,
        },
        token
      );
      await refetch?.();
      alert('Media updated');
    } catch (err) {
      console.error('Modify failed:', err);
      // Show validation errors if available
      let userMsg = err.message;
      if (err.errors?.length) {
        userMsg = 'Errors:\n' + err.errors.map(e => e.msg).join('\n');
      } else if (err.code === 'Unauthorized') {
        userMsg = 'You cannot edit this media';
      }
      alert(userMsg);
    }
  };
  // Format filesize for display
  const formatFilesize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
      {/* Thumbnail */}
      <td className="p-3 align-middle">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-20 h-16 object-cover rounded border border-gray-200 shadow-sm"
          loading="lazy"
        />
      </td>
      
      {/* Title */}
      <td className="p-3 align-middle font-medium text-gray-900">
        {item.title}
      </td>
      
      {/* Description */}
      <td className="p-3 align-middle text-gray-600 max-w-xs truncate">
        {item.description || <span className="text-gray-400 italic">No description</span>}
      </td>
      
      {/* Owner Username */}
      <td className="p-3 align-middle">
        <span 
          className="text-sm text-gray-700 font-medium"
          title={`User ID: ${item.user_id}`}
        >
          {item.username || 'Unknown'}
        </span>
      </td>
      
      {/* Created Date */}
      <td className="p-3 align-middle text-sm text-gray-500 whitespace-nowrap">
        {new Date(item.created_at).toLocaleString('fi-FI')}
      </td>
      
      {/* Filesize */}
      <td className="p-3 align-middle text-sm text-gray-500 whitespace-nowrap">
        {formatFilesize(item.filesize)}
      </td>
      
      {/* Media Type */}
      <td className="p-3 align-middle text-sm text-gray-500">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          item.media_type?.startsWith('image') 
            ? 'bg-blue-100 text-blue-800' 
            : item.media_type?.startsWith('video')
            ? 'bg-purple-100 text-purple-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.media_type?.split('/')[1]?.toUpperCase() || item.media_type}
        </span>
      </td>
      
      {/* Actions */}
      <td className="p-3 align-middle">
        <div className="flex items-center gap-2">
          <Link 
            to="/single" 
            state={{ item }}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
            title="View media details"
          >
            View
          </Link>
          {/* Conditional Modify/Delete Buttons */}
          {canModify && (
            <>
              <button
                type="button"
                onClick={handleModify}
                className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 active:bg-yellow-700 transition-colors shadow-sm"
                title="Edit media details"
              >
                Modify
              </button>
              
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 active:bg-red-800 transition-colors shadow-sm"
                title="Delete media permanently"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};


MediaRow.propTypes = {
  item: PropTypes.shape({
    media_id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    filesize: PropTypes.number,
    media_type: PropTypes.string.isRequired,
  }).isRequired,
};

export default MediaRow;