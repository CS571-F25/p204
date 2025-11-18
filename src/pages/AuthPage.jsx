import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AuthForm from "../components/AuthForm.jsx";
import { getRoomsByOwner } from "../utils/storage.js";

function AuthPage() {
  const { login, signup, isAuthenticated, identity, logout } = useAuth();
  const ownedRooms = useMemo(
    () => (isAuthenticated ? getRoomsByOwner(identity.username) : []),
    [isAuthenticated, identity]
  );

  return (
    <section className="content-section py-5">
      <div className="section-content">
        <div className="account-layout">
          <div>
            <p className="eyebrow text-muted mb-2">Identity</p>
            {isAuthenticated ? (
              <>
                <h1 className="mb-1">{identity.displayName}</h1>
                <p className="text-light">Username: {identity.username}</p>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <AuthForm onLogin={login} onSignup={signup} />
            )}
          </div>
          {isAuthenticated && (
            <div>
              <h2 className="h5 text-light">Your rooms</h2>
              {ownedRooms.length === 0 ? (
                <p className="text-muted">No rooms yet. Create one from Rooms.</p>
              ) : (
                <ul className="room-list simple">
                  {ownedRooms.map((room) => (
                    <li key={room.id}>
                      <span>{room.name}</span>
                      <code>{room.id}</code>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AuthPage;

