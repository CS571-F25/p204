function RoomInfoCard({ room, canDelete, onDelete }) {
  if (!room) {
    return (
      <div className="alert alert-warning mt-4">
        Room not found. It may have been deleted or the ID is incorrect.
      </div>
    );
  }

  return (
    <div className="room-info text-light">
      <p className="eyebrow text-muted mb-1">Room details</p>
      <h2 className="h5 mb-3">{room.name}</h2>
      <dl className="room-info-list">
        <div>
          <dt>ID</dt>
          <dd>{room.id}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{room.ownerDisplayName}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{new Date(room.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Last active</dt>
          <dd>{new Date(room.lastActiveAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Password</dt>
          <dd>{room.password ? "Required" : "Open"}</dd>
        </div>
      </dl>
      {canDelete && (
        <button className="btn btn-outline-danger btn-sm mt-2" onClick={onDelete}>
          Delete room
        </button>
      )}
    </div>
  );
}

export default RoomInfoCard;

