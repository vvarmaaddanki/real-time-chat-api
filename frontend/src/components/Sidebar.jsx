import { useEffect, useState } from "react";
import axios from "axios";

// Sidebar component that displays a list of users to chat with.
export default function Sidebar({
  currentUser,
  selectedUser,
  onSelectUser,
}) {
  // State to store the list of all users.
  const [users, setUsers] = useState([]);
  // State to store the presence status (online/offline) of users, indexed by user ID.
  const [presence, setPresence] = useState({});
  // State to store unread message counts from other users, indexed by user ID.
  const [unreadCounts, setUnreadCounts] = useState({});
  // State for the search input value.
  const [searchTerm, setSearchTerm] = useState("");

  // Effect to fetch the list of all users once when the component mounts.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetches users from the API.
        const token = localStorage.getItem("access");
        const res = await axios.get("https://yashgarje31.pythonanywhere.com/api/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users", err);
      }
    };

    fetchUsers();
  }, []);

  // Effect to poll for user presence updates periodically.
  useEffect(() => {
    const token = localStorage.getItem("access");

    const loadPresence = async () => {
      // Fetches the latest presence data for all users.
      try {
        const res = await axios.get(
          "https://yashgarje31.pythonanywhere.com/api/presence/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Transforms the array of presence data into a map (object) for quick lookups by user ID.
        const map = {};
        res.data.forEach((u) => {
          map[u.id] = u;
        });
        setPresence(map);
      } catch (err) {
        console.error("Presence error", err);
      }
    };

    // Load presence immediately and then set up an interval to poll every 3 seconds.
    loadPresence();
    const interval = setInterval(loadPresence, 3000);

    // Cleanup function to clear the interval when the component unmounts.
    return () => clearInterval(interval);
  }, []);

  // Effect to poll for unread message counts periodically.
  useEffect(() => {
    const token = localStorage.getItem("access");

    // Fetches the unread message counts for the current user from all other users.
    const loadUnread = async () => {
      try {
        const res = await axios.get(
          "https://yashgarje31.pythonanywhere.com/api/chat/unread_counts/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Transforms the array of unread counts into a map for quick lookups by sender's user ID.
        let map = {};
        res.data.forEach((u) => {
          map[u.user_id] = u.count;
        });

        setUnreadCounts(map);
      } catch (err) {
        console.error("Unread error", err);
      }
    };

    // Load unread counts immediately and then set up an interval to poll every 2 seconds.
    loadUnread();
    const interval = setInterval(loadUnread, 2000);

    // Cleanup function to clear the interval.
    return () => clearInterval(interval);
  }, []);

  // Filters the user list based on the search term.
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-100 d-flex flex-column wa-sidebar">
      {/* Sidebar Header */}
      <div className="wa-sidebar-header px-3 py-2">
        <div className="fw-semibold">Chats</div>
        <div className="small text-muted">
          Logged in as {currentUser.username}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2">
        <input
          type="text"
          className="form-control form-control-sm wa-search-input"
          placeholder="Search or start a new chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Chat List: Displays the filtered list of users. */}
      <div className="flex-grow-1 wa-chat-list">
        {filteredUsers.length === 0 && (
          <div className="text-muted small px-3 mt-2">
            No users found.
          </div>
        )}

        {filteredUsers.length > 0 &&
          filteredUsers.map((user) => {
            const p = presence[user.id]; // Get presence info for this user.
            const isOnline = p?.online; // Check if the user is online.
            const unread = unreadCounts[user.id] || 0; // Get unread message count for this user.

            // Check if this user is the currently selected one for chatting.
            const isActive =
              selectedUser && selectedUser.id === user.id;

            return (
              <div
                key={user.id}
                // Apply an 'active' class if this user is selected.
                className={`wa-chat-item ${
                  isActive ? "wa-chat-item-active" : ""
                }`}
                onClick={() => {
                  // When a user is clicked, call the onSelectUser prop and reset their unread count to 0 locally.
                  onSelectUser(user);
                  setUnreadCounts((prev) => ({
                    ...prev,
                    [user.id]: 0,
                  }));
                }}
              >
                {/* User Avatar */}
                <div className="wa-chat-avatar">
                  <span>{user.username[0].toUpperCase()}</span>
                </div>

                {/* Chat Body: Contains name, last message, and time. */}
                <div className="wa-chat-body">

                  <div className="wa-chat-row-top">
                    <span className="wa-chat-name">{user.username}</span>

                    {/* Display the time of the last message, if available. */}
                    {user.last_message_time && (
                      <span className="wa-chat-time">
                        {new Date(user.last_message_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="wa-chat-row-bottom">
                    {/* Display the content of the last message. */}
                    <span className="wa-chat-last-msg text-muted">
                      {user.last_message && user.last_message.trim().length > 0
                        ? user.last_message
                        : "No messages yet"}
                    </span>
                  </div>


                </div>

                {/* Chat Meta: Contains online status dot and unread count badge. */}
                <div className="wa-chat-meta">
                  <div className="wa-chat-status-dot-wrapper">
                    {/* Green dot for online users. */}
                    <span
                      className={`wa-status-dot ${
                        isOnline ? "wa-status-dot-online" : ""
                      }`}
                    ></span>
                  </div>

                  {/* Badge for unread message count. */}
                  {unread > 0 && (
                    <span className="wa-unread-badge">
                      {unread}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
