// src/components/MediaRow.jsx
const MediaRow = (props) => {
  const {item, setSelectedItem} = props;
  const handleViewClick = () => {
    setSelectedItem(item);
  };
  return (
    <tr>
      <td>
        <img src={item.thumbnail} alt={item.title} />
      </td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
      <td><button onClick={handleViewClick} className="view-btn">
          View
        </button></td>
    </tr>
  );
};

export default MediaRow;