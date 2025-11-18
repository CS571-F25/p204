import MessageItem from "./MessageItem.jsx";

function MessageList({ messages, onLoadMore, canLoadMore }) {
  return (
    <div className="message-list border rounded-4 p-3 bg-black text-light mb-4">
      <div className="message-list-scroll">
        {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      {canLoadMore && (
        <button className="btn btn-outline-light btn-sm w-100 mt-3" onClick={onLoadMore}>
          Load 25 earlier messages
        </button>
      )}
    </div>
  );
}

export default MessageList;

