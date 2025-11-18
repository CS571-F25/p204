import { useParams } from "react-router-dom";

function RoomPage() {
  const { roomId } = useParams();

  return (
    <section className="py-5">
      <div className="container">
        <h1>Room View</h1>
        <p className="text-muted">
          You are viewing the placeholder for room <strong>{roomId ?? "unknown"}</strong>. The
          terminal and chat interface will live here.
        </p>
      </div>
    </section>
  );
}

export default RoomPage;

