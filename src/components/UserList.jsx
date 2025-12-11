function UserList({ users }) {
  return (
    <div className="user-list-panel text-light" aria-label="Room participants">
      <p className="eyebrow text-muted mb-1">Participants</p>
      {users.length === 0 ? (
        <p className="text-muted">User list coming soon.</p>
      ) : (
        <ul className="list-unstyled mb-0" aria-label="List of participants">
          {users.map((user) => (
            <li key={user.id}>
              <span className="user-name">{user.displayName}</span>
              <span className="badge rounded-pill text-bg-secondary ms-2" aria-label={`Role: ${user.role}`}>
                {user.role}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

