# TermRooms - Project Specification

## Project Overview

**TermRooms** is a web-based terminal-style interface for creating and managing virtual "rooms" where users can interact through command-line-style commands. The application runs entirely in the browser using React, with data persistence via localStorage.

- ### **User Model: Simple Accounts + Guest Mode**

- **Registered Users**:
  - Create a lightweight local account (username + 6-digit PIN stored in localStorage).
  - Required to create or delete rooms.
  - Choose a display name shown in chat logs.
- **Guests**:
  - Join rooms without registering.
  - Can send messages but cannot create or delete rooms.
  - Assigned auto nickname `Guest-####`, changeable via `/setname`.
- **Sign-Up / Login Flow**:
  - Handled entirely through the `/auth` page (React Bootstrap forms). These flows are **outside** the terminal; users do not type `/signup` or `/login`.
  - Session saved in `termrooms_session`; a logout button in the Navbar clears it.
- **Permissions Summary**:
  - Create/Delete room → registered owners only.
  - Messaging/Join rooms → all roles (respecting room password if set).

---

## Design Philosophy

### **Minimal & Optimal**

- **No External Dependencies**: Uses only React, React Router, and React Bootstrap
- **Browser-Native Storage**: localStorage for persistence (built into browsers)
- **Single-Session Focus**: Designed for individual user sessions with room persistence
- **Clean Architecture**: Well-organized components following React best practices
- **Progressive Enhancement**: Start simple, add features incrementally

### **How It Works**

1. **Room Creation**: Signed-in users create rooms from the Rooms page with a name (optional password)
2. **Room Storage**: Room data stored in localStorage with unique ID
3. **Room Joining**: User can join any room by entering its ID
4. **Command Interface**: Terminal-style input processes commands
5. **Message History**: Messages stored in localStorage per room
6. **Session Persistence**: Rooms and messages persist across browser sessions

---

## Vision & Proposal Alignment

TermRooms reimagines real-time collaboration through a terminal-inspired UI. The dedicated Rooms page handles structured actions like creating or joining rooms, while the in-room terminal focuses on real-time collaboration: chatting, renaming yourself, and leaving/deleting sessions. Account creation and login happen through the `/auth` page so the terminal can remain focused on collaboration tasks. The surrounding layout keeps things simple: the primary terminal sits beside contextual cards for room info and guides. Each room surfaces ownership metadata, optional passwords, and persistent history, while the homepage doubles as a command center with onboarding content. The experience stays minimal and fast—mirroring the original proposal—yet still meets the CS571 interactive requirements by featuring multiple pages, routed views, and meaningful components.

---

## Tech Stack

### **Core Technologies** (Already Installed)

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **React Bootstrap 2** - UI components and styling
- **Bootstrap 5** - CSS framework
- **Vite** - Build tool and dev server
- **LocalStorage** - Only persistence layer (no Firebase/backend to keep scope manageable)

### **Browser APIs** (No Installation Needed)

- **localStorage** - Data persistence
- **URL API** - Room ID handling
- **Date API** - Timestamps

### **Why Not Firebase (Yet)?**

- Check-in scope focuses on a fully static React app deployable to GitHub Pages with no backend.
- LocalStorage keeps implementation simple and meets the course rubric (no real-time requirement).
- The data-layer code (`storage.js`) is isolated so it can be swapped for Firebase later if multi-device sync becomes a priority.

---

## Architecture & Data Flow

### **State Management Strategy**

1. **Local Component State**: Use `useState` for component-specific data
2. **Context API**: 
   - `AuthContext` for current session, role, and auth actions
   - `AppContext` for tracking the active room ID and terminal output buffer
3. **localStorage**: Persist rooms, messages, user preferences, accounts
4. **URL Parameters**: Room ID in route (`/room/:roomId`)

### **Data Flow**

```
User Action → Component Handler → Update State → Save to localStorage → Re-render UI
```

### **Data Structure**

#### **User & Account Model**

- `termrooms_accounts`: `{ id, username, displayName, pinHash, createdAt }`
- `termrooms_session`: `{ username, displayName }` (stored in `sessionStorage` so each browser tab can stay signed in as a different identity)
- Guest nicknames are generated client-side per visit (not persisted today).
- Roles:
  - `owner`: any authenticated account; permitted to create/delete rooms it owns
  - `guest`: anonymous participant (local display name only)
- Permissions summary:
  - Create/Delete room → signed-in owners only
  - Messaging / joining → everyone (respecting room password)
  - Rooms cannot be renamed/locked after creation (keep flow simple)

#### **localStorage Keys**

```javascript
// Accounts
'termrooms_accounts' = [
  {
    id: "user_123",
    username: "yazod",
    displayName: "Yazod A.",
    pinHash: "hashed-1234",
    createdAt: "2025-10-20T14:00:00Z"
  }
]

// Room storage
'termrooms_rooms' = [
  {
    id: "abc123",
    name: "My Room",
    password: "secret123", // optional, plain text for simplicity
    createdAt: "2025-11-01T10:00:00Z",
    ownerId: "user_123",
    createdBy: "JohnDoe", // display name of creator
    lastActiveAt: "2025-11-01T10:30:00Z",
    topic: "",
    banned: [],
    participants: [
      { username: "user_123", displayName: "JohnDoe", role: "leader" },
      { username: null, displayName: "Guest-0912", role: "member" }
    ]
  }
]

// Messages per room
'termrooms_messages_abc123' = [
  {
    id: "msg1",
    text: "Hello!",
    user: "JohnDoe", // display name
    timestamp: "2025-11-01T10:01:00Z",
    type: "message", // "message" | "command" | "system"
    // Note: No "to" or "recipient" field - messages are broadcast to room
    roomId: "abc123" // room where message was sent
  }
]

// User preferences
'termrooms_username' = "JohnDoe" // deprecated in favor of session but retained for quick nickname edits
'termrooms_recent' = ["abc123", "def456", "ghi789"]
'termrooms_session' = {
  username: "yazod",
  displayName: "Yazod A."
}
'termrooms_invites' = [
  {
    id: "invite_1",
    roomId: "abc123",
    recipient: "classmate01",
    sender: "Yazod",
    message: "Join my debugging room!",
    createdAt: "2025-11-02T09:00:00Z"
  }
]
```

---

## File Structure

```
p204-project/
├── public/
│   └── vite.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Terminal.jsx
│   │   ├── CommandInput.jsx
│   │   ├── TerminalOutput.jsx
│   │   ├── MessageList.jsx
│   │   ├── MessageItem.jsx
│   │   ├── UserList.jsx
│   │   ├── RoomInfoCard.jsx
│   │   ├── CreateRoomForm.jsx
│   │   ├── JoinRoomForm.jsx
│   │   ├── HelpPanel.jsx
│   │   └── AuthForm.jsx
│   ├── pages/               # Page-level components (routes)
│   │   ├── HomePage.jsx
│   │   ├── RoomPage.jsx
│   │   ├── GuidePage.jsx
│   │   └── AuthPage.jsx
│   ├── context/             # React Context for shared state
│   │   ├── AppContext.jsx
│   │   └── AuthContext.jsx
│   ├── utils/               # Helper functions
│   │   └── storage.js       # localStorage helpers
│   ├── App.jsx              # Main app component with routing/nav
│   ├── App.css              # App-specific styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── docs/                    # Build output (for GitHub Pages)
├── index.html
├── package.json
├── vite.config.js
└── spec.md
```

---

## Component Breakdown

### **What Counts as a Component?**

A component is a **reusable piece of UI** that:
- Has its own file (`.jsx`)
- Can be imported and used multiple times
- Manages its own state or receives props
- Returns JSX

### **Page Components** (5 components - React Router routes)

1. **HomePage** (`src/pages/HomePage.jsx`)
   - Route: `/`
   - Purpose: Marketing-style hero with quick links and keyboard cheatsheet
   - Contains: Product summary, CTA buttons to Rooms/Guides, inline command list

2. **RoomsPage** (`src/pages/RoomsPage.jsx`)
   - Route: `/rooms`
   - Purpose: Hub for creating rooms, joining by ID, and listing owned/recent rooms
   - Contains: Create/Join forms plus lists of owned and recently opened rooms

3. **RoomPage** (`src/pages/RoomPage.jsx`)
   - Route: `/room/:roomId`
   - Purpose: Main room interface
   - Contains: Terminal (single command input), MessageList, UserList, RoomInfoCard
   - One focused terminal drives all actions; supporting cards show metadata and participants

4. **GuidePage** (`src/pages/GuidePage.jsx`)
   - Route: `/guides`
   - Purpose: Learning hub with onboarding content, command reference, and design rationale
   - Contains: Interactive walkthrough plus a command glossary mirroring the in-app cheatsheet
   - Provides static content required for the "3+ pages" milestone while reinforcing the terminal metaphor

5. **MailPage** (`src/pages/MailPage.jsx`)
   - Route: `/mail`
   - Purpose: Local invite hub (“mailbox”) for sending/receiving room invites
   - Contains: Invite form (recipient, room ID, optional message) plus an inbox filtered to the signed-in username or guest display name

6. **AuthPage** (`src/pages/AuthPage.jsx`)
   - Route: `/auth`
   - Purpose: Manage account creation and login outside the terminal
   - Contains: descriptive hero card + `AuthForm` (single component toggles login/sign-up)
   - Uses React Bootstrap layout, integrates with AuthContext

### **Reusable Components** (current count: 11 core components)

The project now focuses on the components that actually ship in `src/components/`. Navigation lives in `App.jsx` (navbar + `IdentityBadge`) instead of a standalone component, and features like Room cards or password modals were deferred for scope control.

#### **Terminal Components**
1. **Terminal** (`src/components/Terminal.jsx`)
   - Wraps `TerminalOutput` and `CommandInput`
   - Handles parsing/executing commands directly (no separate `commands.js`)
   - Bridges terminal-only actions with Room/Home navigation

2. **CommandInput** (`src/components/CommandInput.jsx`)
   - Controlled input for slash commands or plain text
   - Submits on Enter and clears on Escape (no history buffer yet)

3. **TerminalOutput** (`src/components/TerminalOutput.jsx`)
   - Scrollable feed of recent command responses
   - Clears independently from chat history

#### **Messaging Components**
4. **MessageList** (`src/components/MessageList.jsx`)
   - Displays current room’s messages and exposes “Load earlier” button when applicable

5. **MessageItem** (`src/components/MessageItem.jsx`)
   - Renders individual chat entries with user name, timestamp, and type styling

#### **Room / Participant Components**
6. **UserList** (`src/components/UserList.jsx`)
   - Placeholder roster for future multi-user awareness; currently lists owner + self

7. **RoomInfoCard** (`src/components/RoomInfoCard.jsx`)
   - Shows room metadata (ID, topic, owner, timestamps, password flag)
   - Acts as a read-only summary; destructive actions now live on the Rooms page edit panel

8. **CreateRoomForm** (`src/components/CreateRoomForm.jsx`)
   - Handles room creation (name + optional password) and enforces auth requirement

9. **JoinRoomForm** (`src/components/JoinRoomForm.jsx`)
   - Allows joining by room ID plus optional password field

#### **Auth & Support Components**
10. **AuthForm** (`src/components/AuthForm.jsx`)
    - Toggleable sign-up / log-in form (username, PIN, display name)

11. **HelpPanel** (`src/components/HelpPanel.jsx`)
    - Static quick command reference that mirrors the Guide page

> **Note:** Additional components (Room cards, password modal, etc.) are intentionally deferred until after the check-in milestone so the implementation matches the deployed feature set.

---

## Feature Design

### **Core Commands**

Commands are parsed from user input starting with `/`. Structured actions (create/join) happen through the Rooms page forms, while the in-room terminal handles collaboration commands:
- **Forms on RoomsPage**: Primary method for creating or joining rooms via CreateRoomForm and JoinRoomForm
- **Terminal in RoomPage**: Chat, rename, leave, delete rooms, clear output

Commands use simple argument syntax (no flags). The single terminal input is the canonical way to interact, with forms providing optional fallbacks. Authentication is handled outside the terminal, so the command list starts with room actions.  
**Notation**: `<value>` = required argument, `[value]` = optional argument.

#### Identity Commands
1. **`/setname <display-name>`**
   - Updates display name (persists for logged-in users; temporary for guests)

2. **`/whoami`**
   - Shows current identity and role (“owner” when authenticated, “guest” otherwise)

#### Room Commands
3. **`/leave`**
   - Leaves the current room and returns to Home

4. **`/delete <room-id>`** *(owner only)*
   - Immediately removes the room and its messages from localStorage

#### Messaging & Support Commands
5. **`/topic [text|clear]`**
   - Without arguments shows the current room topic; owners can set a new topic or run `/topic clear` to remove it

6. **`/invite <username> [message]`**
   - Leaders or co-leaders can send an invite that appears in the recipient’s Mail page inbox

7. **`/kick <display-name>`**
   - Leaders or co-leaders can remove a participant (only leaders can remove another co-leader)

8. **`/ban <display-name>`**
   - Leaders can remove and ban a participant; banned names can’t rejoin unless unbanned manually

9. **`/promote <display-name>`**
   - Leaders can promote a member to co-leader

10. **`/demote <display-name>`**
    - Leaders can demote a co-leader back to member

11. **Plain text (no leading slash)**
    - Broadcasts to the current room; anything that doesn’t start with `/` is treated as chat

12. **`/help`**
    - Prints the inline cheat sheet (no topic filtering yet)

13. **`/guide`**
    - Navigates to the Guide page for the full documentation

14. **`/clear`**
    - Clears terminal output locally (does not delete chat history)

15. **`/recent [clear]`**
    - Lists the last few rooms you opened (stored in `localStorage`); `clear` wipes the list

16. **`/relay <room-id> [password] <message>`**
    - Injects a chat message into another room’s history without leaving your current room (password required unless you own the room)

### **Leadership Roles & Permissions**

- **Leader**: The room owner. Can promote/demote, ban, kick, invite, delete, and edit room metadata.
- **Co-leader**: Delegated by the leader. Can invite and kick members, but cannot ban, promote, or delete.
- **Member**: Default role for everyone else. Can chat, set display names, and use informational commands.
- Roles are persisted per participant entry (`participants[].role`) and rendered in the user list/UI badges.

### **Messaging Model**

**Room-Based Broadcasting**: Messages are sent to rooms, not to specific users. This is similar to a chat room or IRC channel - all messages are public to everyone in that room.

- **No Direct Messages**: There is no user-to-user private messaging
- **No Recipients**: Messages don't have a "to" field - they're broadcast to the room
- **Room Visibility**: All users viewing a room see all messages in that room
- **Simple Design**: Keeps the implementation minimal and avoids complex user management
- **Message Loading**:
  - When you enter a room, the latest 50 messages load instantly from localStorage and render in the chat list.
  - A “Load 25 earlier messages” button appears when older messages exist; each press loads another 25 until history is exhausted.
  - Terminal output only shows command results; chat history stays separate so the terminal stays lightweight.

### **Message Types**

Messages saved in `localStorage` currently use a single `type` of `"message"` because only chat content is persisted. Terminal feedback (like `/help` output) stays in the transient terminal buffer instead of being written to history. The schema keeps the `type` field so future iterations can add `"system"` or `"command"` entries, but today only user chat bubbles are stored.

### **Room Features**

- **Room Creation**: Name + optional password
- **Room Joining**: By ID + password verification
- **Message Persistence**: Messages saved per room as chat bubbles
- **Room List**: View all created rooms on the Rooms page
- **Recent Rooms**: Track recently visited rooms
- **Room Topics**: Owners can assign an optional topic via `/topic`, surfaced in the sidebar
- **Single Terminal Focus**: One primary terminal per page; users switch rooms via commands or cards instead of multiple floating panels.
- **Activity Indicators**: Room info card shows owner, creation time, last activity, and whether a password exists.
- **Ownership Controls**:
  - Only the authenticated creator can delete (or restore) the room.
  - Ownership is displayed on RoomInfoCard and GuidePage.
  - Guests attempting owner-only commands receive actionable errors with guidance to register.
- **Room Persistence & Limits**:
  - Rooms persist in localStorage until the owner deletes them.
  - Hard cap of 25 rooms per installation to prevent unbounded storage.
  - The recents list keeps the 10 most recently opened room IDs for quick access.
- **Mail & Invites**:
  - Invites are stored in `termrooms_invites` with sender, recipient, and message metadata.
  - MailPage surfaces invites addressed to the signed-in username (or guest display name) and offers a simple invite form.

---

## Course Requirements Alignment

- **Initial Publish (Nov 5)**: Deployed to GitHub Pages, React Bootstrap integrated, StrictMode removed, HashRouter configured.
- **Check-In (Nov 19)**:
  - Live on GitHub.io with commit history
  - Primary navigation bar implemented
  - **At least 3 pages** partially developed via React Router (`/`, `/room/:roomId`, `/guides`), plus `/auth` scaffolded
  - **At least 5 reusable components** in use (Navbar, Terminal, CommandInput, TerminalOutput, MessageList, etc.)
  - Visible use of React Bootstrap components
- **Final Deliverable (Dec 10)**:
  - 3+ fully developed pages (Home, Room, Guide) + Auth experience polished
  - 12+ meaningful components
  - Thoughtful visual design + accessibility (contrast, alt text, labeled inputs, keyboard support)
  - Interactive element: room creation/joining/messaging workflow
  - Recorded presentation (4–7 minutes) covering features + design decisions

This spec keeps the design ambitious enough to be portfolio-ready but scoped to meet every checkpoint listed in the CS571 syllabus.

---

## Implementation Plan

### **Phase 1: Foundation** (Initial Publish - Nov 5)

**Goal**: Basic structure and routing

- [ ] Set up file structure (components/, pages/, utils/, context/)
- [ ] Create App.jsx with HashRouter and routes
- [ ] Build Navbar component
- [ ] Create HomePage (basic layout)
- [ ] Create RoomPage (basic layout)
- [ ] Create GuidePage (basic layout with placeholder content)
- [ ] Create AuthPage with SignUp/Login tabs
- [ ] Set up AppContext for shared state
- [ ] Create storage.js utilities
- [ ] Deploy to GitHub Pages

**Deliverables**:
- ✅ Website deployed and functional
- ✅ Navigation bar present
- ✅ 3 pages scaffolded (HomePage, RoomPage, GuidePage)
- ✅ Basic routing works

### **Phase 2: Core Functionality** (Check-In - Nov 19)

**Goal**: Room creation, joining, and messaging

- [ ] Implement CreateRoomForm component
- [ ] Implement JoinRoomForm component
- [ ] Build Terminal component
- [ ] Build CommandInput component
- [ ] Build TerminalOutput component
- [ ] Implement command handler logic inside `Terminal` (commands kept inline; standalone `commands.js` deferred)
- [ ] Wire plain-text chat handling in `Terminal`
- [ ] Build MessageList component
- [ ] Build MessageItem component
- [ ] Implement room storage utilities
- [ ] Style with React Bootstrap
- [ ] Populate GuidePage with command glossary + onboarding content
- [ ] Hook AuthPage forms into storage/session management

**Deliverables**:
- ✅ At least 5 components defined
- ✅ Room creation works
- ✅ Room joining works
- ✅ Basic messaging works
- ✅ Terminal interface functional
- ✅ React Bootstrap styling applied
- ✅ Sign-up / login / guest flows connected to context

### **Phase 3: Enhancement & Polish** (Final - Dec 10)

**Goal**: Complete features, accessibility, polish

- [ ] Stretch commands (future): `/users`, `/history`, richer `/help` topics
- [ ] Build RoomCard component (future backlog)
- [ ] Build RoomInfoCard component (✅ core version done; polish iteration pending)
- [ ] Build UserList component (✅ basic placeholder done; needs live presence later)
- [ ] Build HelpPanel component (✅)
- [ ] PasswordModal (future backlog)
- [ ] AuthForm (✅ single toggle component delivered)
- [ ] Harden auth flows (PIN hash, session persistence, logout everywhere)
- [ ] Add password protection
- [ ] Improve visual design (terminal aesthetic)
- [ ] Add accessibility features:
  - [ ] Alt text on images
  - [ ] Proper heading hierarchy
  - [ ] Form labels
  - [ ] Color contrast (WCAG AA)
  - [ ] Keyboard navigation
  - [ ] ARIA labels
- [ ] Final testing and bug fixes

- **Deliverables**:
- ✅ 12+ components defined and used
- ✅ Home, Room, Guide, and Auth experiences fully developed
- ✅ Interactive element (room creation, messaging)
- ✅ Thoughtful design principles applied
- ✅ Accessibility requirements met
- ✅ Polished, professional website

---

## Step-by-Step Build Plan & Progress Tracking

Follow these numbered steps sequentially. After completing a step, mark it done (in a TODO list, journal, or GitHub issue) so you always know where you left off.

0. **Environment Prep**
   - `npm install`, run `npm run dev`.
   - Remove StrictMode, ensure Bootstrap CSS import is present.

1. **Routing Skeleton**
   - Configure HashRouter routes for `/`, `/room/:roomId`, `/guides`, `/auth`.
   - Each page renders a heading + placeholder text.

2. **Context & Storage**
   - Implement `AuthContext` (session state, signup/login/logout).
   - Implement `AppContext` (current room id, command output array).
   - Create `storage.js` helpers for accounts, rooms, messages, sessions.

3. **Layout & Navbar**
   - Build Navbar with links to all pages and identity badge (`Guest-####` or username).
   - Wire logout button to AuthContext.

4. **Terminal Loop**
   - Build `Terminal`, `CommandInput`, `TerminalOutput`.
   - Implement `/help`, `/guide`, `/whoami`, `/clear`.

5. **Auth Experience**
   - Build `AuthForm` (login / sign-up toggle) that talks to `AuthContext`.
   - Ensure Navbar logout button clears session.
   - Keep `/setname` and `/whoami` commands for quick identity changes/inspections.

6. **Room Lifecycle**
   - Build `CreateRoomForm` and `JoinRoomForm`.
   - Implement `/leave`, `/delete`, and `/topic`.
   - Add `RoomInfoCard` showing owner info + topic metadata; destructive actions live in the Rooms page edit panel.

7. **Messaging**
   - Build `MessageList`, `MessageItem`, `UserList`.
   - Ensure plain-text chat flow works end-to-end (non-slash input posts to the room).
   - Add `/recent` (with `clear`) and `/relay` for cross-room coordination.
   - Load last 50 messages on room entry; add “Load 25 earlier messages” button (UI-only for now; `/history` command deferred).

8. **Mail & Invites**
   - Build `MailPage` with invite form + inbox view.
   - Add `sendInvite` / `getInvitesForRecipient` helpers and `/invite` command wiring.

9. **Guide & Help Content**
   - Flesh out `GuidePage` (onboarding steps + command glossary).
   - Connect `HelpPanel` to the same content.

10. **Styling & Accessibility**
   - Apply terminal theme (colors, fonts), ensure responsive layout.
   - Add form labels, ARIA attributes, keyboard focus states.

11. **Testing & Deployment**
    - Manual test script: signup, create room, join as guest in another tab, chat, delete room, reload.
    - `npm run build`, push to GitHub, verify GitHub Pages deployment.

Repeat the checklist review before each work session so progress stays clear and no functionality is left behind.

---

## Future Roadmap (Firebase Migration)

- **Data layer swap**: All persistence lives in `storage.js`, so we can replace the read/write helpers with Firebase SDK calls (Firestore/Realtime DB) without rewriting components.
- **Auth upgrade**: Once Firebase Auth is introduced, `AuthContext` simply switches from local PIN storage to Firebase auth tokens.
- **Live presence & invites**: Invites and participant roles will sync in real time once Firebase listeners replace the current `storage` event bridge.
- **Security**: Firebase rules will enforce that only leaders/co-leaders can mutate protected fields (topics, bans, leadership roles).

This roadmap keeps the current local-first approach lightweight while signaling exactly how the project will grow for the final submission.

---

## Component Design Patterns

### **Best Practices**

#### **1. Component Structure**

```jsx
// Good: Clear, focused component
function MessageItem({ message }) {
  return (
    <div className={`message-item message-${message.type}`}>
      <span className="message-user">{message.user || "Anonymous"}</span>
      <span className="message-text">{message.text}</span>
      <span className="message-time">{formatTime(message.timestamp)}</span>
    </div>
  );
}

// Bad: Component doing too much
function RoomPage() {
  // Don't put all logic here - break into smaller components
}
```

#### **2. Props & State**

```jsx
// Good: Props for data, state for UI
function CommandInput({ onCommand, history }) {
  const [input, setInput] = useState('');
  // ...
}

// Bad: Storing everything in state
function CommandInput() {
  const [everything, setEverything] = useState({ /* too much */ });
}
```

#### **3. Event Handlers**

```jsx
// Good: Named handler functions
function CreateRoomForm({ onCreateRoom }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // validation
    onCreateRoom(roomData);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### **4. Conditional Rendering**

```jsx
// Good: Clear conditional rendering
function RoomCard({ room }) {
  return (
    <Card>
      <Card.Title>{room.name}</Card.Title>
      {room.password && <Badge>Protected</Badge>}
      {room.messageCount > 0 && (
        <span>{room.messageCount} messages</span>
      )}
    </Card>
  );
}
```

#### **5. useEffect for Side Effects**

```jsx
// Good: useEffect for localStorage operations
function RoomPage({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Load messages from localStorage
    const stored = loadMessages(roomId);
    setMessages(stored);
  }, [roomId]);
  
  // ...
}
```

#### **6. Custom Hooks for Reusability**

```jsx
// Good: Extract logic into custom hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}
```

---

## Utility Functions

### **storage.js** - localStorage Helpers

```javascript
// Account operations
export function createAccount({ username, displayName, pin }) { /* hash pin, persist */ }
export function getAccount(username) { /* ... */ }
export function authenticate(username, pin) { /* ... */ }
export function saveSession(session) { /* ... */ }
export function clearSession() { /* ... */ }
export function getSession() { /* ... */ }

// Room operations
export function saveRoom(room) { /* ... */ }
export function getRoom(roomId) { /* ... */ }
export function getAllRooms() { /* ... */ }
export function deleteRoom(roomId) { /* ... */ }

// Message operations
export function saveMessage(roomId, message) { /* ... */ }
export function getMessages(roomId) { /* ... */ }
export function clearMessages(roomId) { /* ... */ }

// User preferences
export function getUsername() { 
  // Returns username from localStorage, or "Anonymous" if not set
  // Returns: string
}
export function setUsername(username) { 
  // Sets username in localStorage, or removes it if username is empty/null
  // If removed, user will appear as "Anonymous"
}
```

### **commands.js** (future extraction) - Command Parser

> _Current implementation keeps parsing/execution logic inside `Terminal.jsx`. The sketch below remains as a reference if we later extract it into its own module._

```javascript
export function parseCommand(input) {
  // Parse "/command arg1 arg2" (simple syntax, no flags)
  // Returns: { command, args }
  // Example: "/setname New Name" → { command: "setname", args: ["New", "Name"] }
}

export function executeCommand(command, args, context) {
  // Execute command based on type
  // Returns: { success, message, action, messageType }
  // messageType: "message" | "command" | "system"
}
```

### **roomUtils.js** (future extraction) - Room Utilities

> _Room helpers such as ID generation already live in `storage.js`. This section documents how they could be split out if the module grows._

```javascript
export function generateRoomId() {
  // Generate unique 6-character alphanumeric room ID
  // Format: lowercase letters (a-z) + numbers (0-9)
  // Examples: "abc123", "x7k9m2", "z4f8q1"
  // Checks localStorage for uniqueness, regenerates if duplicate
  // Returns: string (6 characters)
}

export function validateRoomId(roomId) {
  // Validate room ID format
  // Must be exactly 6 characters, alphanumeric (lowercase)
  // Returns: boolean
}

export function formatTimestamp(date) {
  // Format date for display
  // Input: Date object or ISO string
  // Returns: formatted string (e.g., "10:30 AM", "Nov 1, 2025 10:30 AM")
}
```

---

## Visual Design

### **Terminal Aesthetic**

- **Background**: Dark (`#0d1117` or `#1a1a1a`)
- **Text**: Light gray (`#c9d1d9`)
- **Accent**: Blue (`#58a6ff`) or Green (`#3fb950`)
- **Font**: Monospace for terminal (`'Courier New', monospace`)
- **Prompt**: `$` or `termrooms@room:~$`

### **Bootstrap Integration**

- Use Bootstrap components (Card, Form, Button, Modal, etc.)
- Customize with CSS variables for terminal theme
- Maintain Bootstrap's responsive grid system
- Use Bootstrap utilities for spacing, colors

### **Color Scheme**

```css
:root {
  --terminal-bg: #0d1117;
  --terminal-text: #c9d1d9;
  --terminal-accent: #58a6ff;
  --terminal-success: #3fb950;
  --terminal-error: #f85149;
  --terminal-prompt: #58a6ff;
}
```

---

## Accessibility Checklist

- [ ] **Headings**: Proper hierarchy (h1 → h2 → h3)
- [ ] **Images**: All have descriptive alt text
- [ ] **Forms**: All inputs have associated labels
- [ ] **Color Contrast**: Meets WCAG AA standards (4.5:1 for text)
- [ ] **Keyboard Navigation**: All interactive elements keyboard accessible
- [ ] **Focus Indicators**: Visible focus states
- [ ] **ARIA Labels**: Used where semantic HTML isn't sufficient
- [ ] **Form Validation**: Clear error messages

---

## Testing Strategy

### **Manual Testing Checklist**

- [ ] Create room works
- [ ] Join room works
- [ ] Password protection works
- [ ] Messages save and display
- [ ] Commands execute correctly
- [ ] Navigation works
- [ ] localStorage persists data
- [ ] Page refresh maintains state
- [ ] Invalid commands show errors
- [ ] Forms validate input

---

## Success Metrics

### **Minimum Requirements Met**

- ✅ Deployed on GitHub.io
- ✅ React Bootstrap used consistently
- ✅ Navigation bar present and functional
- ✅ 4 core experiences implemented (Home, Room, Guide, Auth)
- ✅ 12+ components defined and used
- ✅ Interactive element (room creation, messaging)
- ✅ Authenticated + guest flows operational
- ✅ Design principles applied
- ✅ Accessibility requirements met

---

## Next Steps

1. **Set up file structure** - Create folders (components/, pages/, utils/, context/)
2. **Create utility functions** - Build storage.js, commands.js, roomUtils.js
3. **Set up routing** - Configure App.jsx with HashRouter
4. **Build Navbar** - First component
5. **Build RoomsPage** - Create/join hub + edit drawer + icon buttons
6. **Build RoomPage** - Terminal interface, user list, topic display
7. **Implement commands** - Core commands, leadership actions, `/invite` + `/mail`
8. **Build MailPage** - Invite form + inbox wired to `termrooms_invites`
9. **Add styling** - Terminal theme with Bootstrap
10. **Test & polish** - Accessibility, edge cases
11. **Deploy** - Build and push to GitHub
12. **Prep for Firebase** - Abstract storage helpers so they can be swapped for Firestore later

---

## Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [React Bootstrap Documentation](https://react-bootstrap.github.io/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/)
- [MDN localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Status**: Ready for Implementation
**Last Updated**: Planning Phase
