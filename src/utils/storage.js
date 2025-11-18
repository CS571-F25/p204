const ACCOUNTS_KEY = "termrooms_accounts";
const SESSION_KEY = "termrooms_session";
const ROOMS_KEY = "termrooms_rooms";
const MESSAGES_PREFIX = "termrooms_messages_";
const RECENTS_KEY = "termrooms_recent";
const ROOM_LIMIT = 25;
const RECENTS_LIMIT = 10;
const HISTORY_BATCH = 25;

const safeLocalStorage = typeof window !== "undefined" ? window.localStorage : null;
const safeSessionStorage = typeof window !== "undefined" ? window.sessionStorage : null;

function readJSON(key, fallback, store = safeLocalStorage) {
  try {
    if (!store) return fallback;
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage`, err);
    return fallback;
  }
}

function writeJSON(key, value, store = safeLocalStorage) {
  store?.setItem(key, JSON.stringify(value));
}

/* -------------------------------------------------------------------------- */
/* Accounts & Sessions                                                         */
/* -------------------------------------------------------------------------- */

export function getAccounts() {
  return readJSON(ACCOUNTS_KEY, []);
}

export function saveAccounts(accounts) {
  writeJSON(ACCOUNTS_KEY, accounts);
}

export function findAccount(username) {
  return getAccounts().find((acct) => acct.username === username);
}

export function createAccount({ username, pin, displayName }) {
  const existing = findAccount(username);
  if (existing) {
    throw new Error("Username already exists");
  }

  const newAccount = {
    id: crypto.randomUUID(),
    username,
    pinHash: pin, // NOTE: For class project simplicity. Replace with real hashing later.
    displayName,
    createdAt: new Date().toISOString(),
  };

  const accounts = getAccounts();
  accounts.push(newAccount);
  saveAccounts(accounts);
  return newAccount;
}

export function authenticate(username, pin) {
  const account = findAccount(username);
  if (!account || account.pinHash !== pin) {
    throw new Error("Invalid credentials");
  }
  return account;
}

export function updateAccountDisplayName(username, displayName) {
  const accounts = getAccounts();
  const idx = accounts.findIndex((acct) => acct.username === username);
  if (idx === -1) return;
  accounts[idx].displayName = displayName;
  saveAccounts(accounts);
}

export function saveSession(session) {
  writeJSON(SESSION_KEY, session, safeSessionStorage);
}

export function getSession() {
  return readJSON(SESSION_KEY, null, safeSessionStorage);
}

export function clearSession() {
  safeSessionStorage?.removeItem(SESSION_KEY);
}

/* -------------------------------------------------------------------------- */
/* Rooms & Messages (stubbed for future steps)                                 */
/* -------------------------------------------------------------------------- */

export function getRooms() {
  return readJSON(ROOMS_KEY, []);
}

export function getRoomsByOwner(ownerUsername) {
  if (!ownerUsername) return [];
  return getRooms().filter((room) => room.ownerUsername === ownerUsername);
}

export function saveRooms(rooms) {
  writeJSON(ROOMS_KEY, rooms);
}

function generateRoomId() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 6; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

function makeRoomIdUnique(existingIds) {
  let id = generateRoomId();
  while (existingIds.includes(id)) {
    id = generateRoomId();
  }
  return id;
}

export function saveRoom(room) {
  const rooms = getRooms();
  const idx = rooms.findIndex((r) => r.id === room.id);
  if (idx === -1) {
    if (rooms.length >= ROOM_LIMIT) {
      throw new Error("Room limit reached. Please delete an old room.");
    }
    rooms.push(room);
  } else {
    rooms[idx] = room;
  }
  saveRooms(rooms);
}

export function createRoomRecord({ name, password = "", ownerUsername, ownerDisplayName }) {
  if (!ownerUsername) {
    throw new Error("You must be signed in to create a room.");
  }

  const rooms = getRooms();
  const roomId = makeRoomIdUnique(rooms.map((r) => r.id));
  const now = new Date().toISOString();

  const room = {
    id: roomId,
    name,
    password,
    ownerUsername,
    ownerDisplayName,
    createdAt: now,
    lastActiveAt: now,
    participants: [
      {
        username: ownerUsername,
        displayName: ownerDisplayName,
      },
    ],
  };

  saveRoom(room);
  recordRecentRoom(room.id);
  return room;
}

export function getRoom(roomId) {
  return getRooms().find((room) => room.id === roomId);
}

export function deleteRoom(roomId) {
  const rooms = getRooms().filter((room) => room.id !== roomId);
  saveRooms(rooms);
  localStorage.removeItem(`${MESSAGES_PREFIX}${roomId}`);
}

export function touchRoom(roomId) {
  const room = getRoom(roomId);
  if (!room) return;
  room.lastActiveAt = new Date().toISOString();
  saveRoom(room);
}

export function addParticipant(roomId, participant) {
  const room = getRoom(roomId);
  if (!room) return;
  room.participants = room.participants ?? [];
  const exists = room.participants.some((p) => {
    if (participant.username && p.username) {
      return p.username === participant.username;
    }
    return p.displayName === participant.displayName;
  });
  if (!exists) {
    room.participants.push(participant);
    saveRoom(room);
  }
}

export function removeParticipant(roomId, username, displayName) {
  const room = getRoom(roomId);
  if (!room || !room.participants) return;
  room.participants = room.participants.filter((p) => {
    if (username && p.username) {
      return p.username !== username;
    }
    return p.displayName !== displayName;
  });
  saveRoom(room);
}

export function roomPasswordMatches(room, passwordInput = "") {
  const stored = room.password ?? "";
  return stored === (passwordInput ?? "");
}

export function getMessages(roomId) {
  return readJSON(`${MESSAGES_PREFIX}${roomId}`, []);
}

export function saveMessages(roomId, messages) {
  writeJSON(`${MESSAGES_PREFIX}${roomId}`, messages);
}

export function getRecents() {
  return readJSON(RECENTS_KEY, []);
}

export function saveRecents(recents) {
  writeJSON(RECENTS_KEY, recents);
}

export function recordRecentRoom(roomId) {
  const recents = getRecents().filter((id) => id !== roomId);
  recents.unshift(roomId);
  saveRecents(recents.slice(0, RECENTS_LIMIT));
}

export function loadOlderMessages(roomId, currentCount) {
  const allMessages = getMessages(roomId);
  const nextCount = Math.min(currentCount + HISTORY_BATCH, allMessages.length);
  return {
    messages: allMessages.slice(-nextCount),
    canLoadMore: nextCount < allMessages.length,
    loadedCount: nextCount,
  };
}

