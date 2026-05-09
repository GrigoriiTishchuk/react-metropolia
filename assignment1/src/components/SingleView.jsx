const SingleView = ({item, setSelectedItem}) => {
  return (
    <dialog open={!!item} onClose={() => setSelectedItem(null)}>
      {item && (
        <div>
          <button onClick={() => setSelectedItem(null)}>Close</button>

          <h3>{item.title}</h3>
          <p>{item.description}</p>

          {item.media_type.startsWith('image/') ? (
            <img src={item.filename} alt={item.title} />
          ) : (
            <video controls>
              <source src={item.filename} type={item.media_type} />
            </video>
          )}
        </div>
      )}
    </dialog>
  );
};
export default SingleView;