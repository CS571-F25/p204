function UserList({ users }) {
  return (
    <div className="user-list-panel text-light">
      <p className="eyebrow text-muted mb-1">Participants</p>
      {users.length === 0 ? (
        <p className="text-muted">User list coming soon.</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {users.map((user) => (
            <li key={user.id}>{user.displayName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;

