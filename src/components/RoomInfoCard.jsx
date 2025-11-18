function RoomInfoCard({ room, canDelete, onDelete }) {
  if (!room) {
    return (
      <div className="alert alert-warning mt-4">
        Room not found. It may have been deleted or the ID is incorrect.
      </div>
    );
  }

  return (
    <div className="room-info-card text-light">
      <div>
        <p className="eyebrow text-muted mb-1">Now viewing</p>
        <h2 className="h5 mb-0">{room.name}</h2>
      </div>
      <div className="meta-row">
        <span>ID</span>
        <span>{room.id}</span>
      </div>
      <div className="meta-row">
        <span>Owner</span>
        <span>{room.ownerDisplayName}</span>
      </div>
      <div className="meta-row">
        <span>Created</span>
        <span>{new Date(room.createdAt).toLocaleString()}</span>
      </div>
      <div className="meta-row">
        <span>Last active</span>
        <span>{new Date(room.lastActiveAt).toLocaleString()}</span>
      </div>
      <div className="meta-row">
        <span>Password</span>
        <span>{room.password ? "Required" : "Open"}</span>
      </div>
      {canDelete && (
        <button className="btn btn-outline-danger w-100 mt-3" onClick={onDelete}>
          Delete Room
        </button>
      )}
    </div>
  );
}

export default RoomInfoCard;

