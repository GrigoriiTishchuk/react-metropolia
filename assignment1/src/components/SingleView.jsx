// SingleView.jsx

const SingleView = (props) => {
  if (!props.item) return null;
  const {item, setSelectedItem} = props;
  return (
    // TODO: Add JSX for displaying a mediafile here
    // - use e.g. a <dialog> element for creating a modal
    // - use item prop to render the media item details
    // - use img tag for displaying images
    // - use video tag for displaying videos
    <dialog open>
      <button onClick={() => setSelectedItem(null)}>Close</button>
      {item.type === 'image' && <img src={item.url} alt={item.title} />}
      {item.type === 'video' && <video src={item.url} controls />}
    </dialog>
  );
};
export default SingleView;