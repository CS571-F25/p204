function MessageItem({ message }) {
  const { user, text, timestamp } = message;
  return (
    <div className="message-line">
      <span className="message-username">{user}</span>
      <span className="message-text">{text}</span>
      <time className="message-time">{new Date(timestamp).toLocaleTimeString()}</time>
    </div>
  );
}

export default MessageItem;

