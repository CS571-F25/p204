import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem.jsx";

function MessageList({ messages, onLoadMore, canLoadMore }) {
  const scrollRef = useRef(null);
  const [isPinned, setIsPinned] = useState(true);

  useEffect(() => {
    if (isPinned && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPinned]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - (scrollTop + clientHeight) < 40;
    setIsPinned(atBottom);
  };

  const jumpToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    setIsPinned(true);
  };

  return (
    <div className="message-list p-4">
      {canLoadMore && (
        <button className="btn btn-outline-light btn-sm w-100 mb-3" onClick={onLoadMore}>
          Load 25 earlier messages
        </button>
      )}
      <div className="message-list-scroll" ref={scrollRef} onScroll={handleScroll}>
        {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      {!isPinned && (
        <button type="button" className="btn btn-outline-light btn-sm jump-to-bottom" onClick={jumpToBottom}>
          Jump to latest
        </button>
      )}
    </div>
  );
}

export default MessageList;

