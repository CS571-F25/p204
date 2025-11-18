function MessageItem({ message }) {
  const { type, user, text, timestamp } = message;

  return (
    <div className={`message-item message-${type}`}>
      <div className="d-flex justify-content-between align-items-center">
        <strong>{user}</strong>
        <span className="timestamp text-muted small">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="mb-0">{text}</p>
    </div>
  );
}

export default MessageItem;

