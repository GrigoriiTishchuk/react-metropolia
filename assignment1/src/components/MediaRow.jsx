import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const MediaRow = ({ item }) => {
  return (
    <tr>
      <td>
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="thumbnail"
          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
        />
      </td>
      <td>{item.title}</td>
      <td>{item.description || '-'}</td>
      <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td>{(item.filesize / 1024).toFixed(1)} KB</td>
      <td>{item.media_type}</td>
      <td>
        {/*Link instead of button, pass item via state */}
        <Link 
          to="/single" 
          state={{ item }}
          className="view-link"
        >
          View
        </Link>
      </td>
    </tr>
  );
};

MediaRow.propTypes = {
  item: PropTypes.shape({
    media_id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    filesize: PropTypes.number,
    media_type: PropTypes.string.isRequired,
  }).isRequired,
};

export default MediaRow;