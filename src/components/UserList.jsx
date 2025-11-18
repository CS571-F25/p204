function UserList({ users }) {
  return (
    <div className="border rounded-4 p-3 bg-black text-light">
      <h2 className="h5 mb-3">Active Participants</h2>
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

