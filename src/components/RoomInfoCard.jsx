function RoomInfoCard({ room }) {
  if (!room) {
    return (
      <div className="alert alert-warning mt-4">
        Room not found. It may have been deleted or the ID is incorrect.
      </div>
    );
  }

  return (
    <div className="room-info text-light" aria-label="Room information">
      <p className="eyebrow text-muted mb-1">Room details</p>
      <dl className="room-info-list">
        <div>
          <dt>ID</dt>
          <dd>{room.id}</dd>
        </div>
        {room.topic && (
          <div>
            <dt>Topic</dt>
            <dd>{room.topic}</dd>
          </div>
        )}
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
    </div>
  );
}

export default RoomInfoCard;

