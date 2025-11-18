function RoomInfoCard({ room, canDelete, onDelete }) {
  if (!room) {
    return (
      <div className="alert alert-warning mt-4">
        Room not found. It may have been deleted or the ID is incorrect.
      </div>
    );
  }

  return (
    <div className="border rounded-4 p-4 bg-black text-light mt-4">
      <h2 className="h4 mb-3">{room.name}</h2>
      <ul className="list-unstyled mb-3">
        <li>
          <strong>Room ID:</strong> {room.id}
        </li>
        <li>
          <strong>Owner:</strong> {room.ownerDisplayName}
        </li>
        <li>
          <strong>Created:</strong> {new Date(room.createdAt).toLocaleString()}
        </li>
        <li>
          <strong>Last active:</strong> {new Date(room.lastActiveAt).toLocaleString()}
        </li>
        <li>
          <strong>Password protected:</strong> {room.password ? "Yes" : "No"}
        </li>
      </ul>

      {canDelete && (
        <button className="btn btn-outline-danger w-100" onClick={onDelete}>
          Delete Room
        </button>
      )}
    </div>
  );
}

export default RoomInfoCard;

