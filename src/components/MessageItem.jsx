function MessageItem({ message }) {
  const { type, user, text, timestamp } = message;

  return (
    <div className={`message-item message-${type}`}>
      <div className="d-flex justify-content-between">
        <strong>{user}</strong>
        <span className="text-muted small">{new Date(timestamp).toLocaleTimeString()}</span>
      </div>
      <p className="mb-0">{text}</p>
    </div>
  );
}

export default MessageItem;

