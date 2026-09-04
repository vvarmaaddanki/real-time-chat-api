import { useEffect, useRef, useState } from "react";
import axios from "axios";

// Helper function to format an ISO date string into a human-readable "last seen" status.
function formatLastSeen(isoString) {
  if (!isoString) return "";
  const last = new Date(isoString);
  const now = new Date();
  const diffMs = now - last;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "a few seconds ago";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? "s" : ""} ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

// Helper function to format an ISO date string into a time string like "10:45 AM".
function formatTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

// ChatWindow component displays the conversation with a selected user.
export default function ChatWindow({
  currentUser,
  otherUser,
  isMobile,
  onBack,
}) {
  // State to hold the array of messages for the current chat.
  const [messages, setMessages] = useState([]);
  // State for the text being typed in the message input field.
  const [text, setText] = useState("");
  // Ref to keep track of the ID of the last message received, to avoid re-processing.
  const lastMessageIdRef = useRef(null);

  // State to hold information about whether the current user is blocked by or has blocked the other user.
  const [blockInfo, setBlockInfo] = useState({
    blockedByMe: false,
    blockedMe: false,
  });

  // State to hold the presence information (online status, last seen) of the other user.
  const [presence, setPresence] = useState(null);

  // This effect runs when `otherUser` changes (i.e., when a new chat is selected).
  // It's responsible for loading all initial data for the chat and setting up polling.
  useEffect(() => {
    // If no user is selected, reset all state.
    if (!otherUser) {
      setMessages([]);
      lastMessageIdRef.current = null;
      setBlockInfo({ blockedByMe: false, blockedMe: false });
      setPresence(null);
      return;
    }

    const token = localStorage.getItem("access");

    // Fetches the block status between the current user and the other user.
    const fetchBlockStatus = async () => {
      try {
        const res = await axios.get(
          `https://yashgarje31.pythonanywhere.com/api/chat/block/status/?user_id=${otherUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlockInfo({
          blockedByMe: res.data.blocked_by_me,
          blockedMe: res.data.blocked_me,
        });
      } catch (err) {
        console.error("Error loading block status", err);
      }
    };

    // Fetches the message history with the other user.
    const fetchMessages = async () => {
      try {
        const url = `https://yashgarje31.pythonanywhere.com/api/chat/messages/?user_id=${otherUser.id}`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allMessages = res.data;
        setMessages(allMessages);

        if (allMessages.length > 0) {
          lastMessageIdRef.current = allMessages[allMessages.length - 1].id;
        }
      } catch (err) {
        console.error("Error loading messages", err);
      }
    };

    // Fetches the presence status for the other user.
    const fetchPresence = async () => {
      try {
        const res = await axios.get("https://yashgarje31.pythonanywhere.com/api/presence/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userPresence = res.data.find((u) => u.id === otherUser.id);
        if (userPresence) {
          setPresence(userPresence);
        }
      } catch (err) {
        console.error("Error loading presence", err);
      }
    };

    // Function to perform the initial load of all data for the chat.
    const initialLoad = async () => {
      setMessages([]);
      lastMessageIdRef.current = null;
      await fetchMessages();
      await fetchBlockStatus();
      await fetchPresence();
    };

    initialLoad();

    // Set up intervals to poll for new messages and presence updates.
    const messagesInterval = setInterval(fetchMessages, 1000); // 1s polling
    const presenceInterval = setInterval(fetchPresence, 5000); // 5s presence

    // Cleanup function: clear intervals when the component unmounts or `otherUser` changes.
    return () => {
      clearInterval(messagesInterval);
      clearInterval(presenceInterval);
    };
  }, [otherUser]);

  const handleSend = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page.
    // Don't send if the input is empty or no user is selected.
    if (!text.trim() || !otherUser) return;

    // Don't send if the chat is blocked.
    if (blockInfo.blockedByMe || blockInfo.blockedMe) {
      return;
    }

    try {
      const token = localStorage.getItem("access");
      // POST request to send the new message.
      const res = await axios.post(
        "https://yashgarje31.pythonanywhere.com/api/chat/messages/",
        {
          receiver: otherUser.id,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newMsg = res.data;
      // Add the new message to the local state to display it immediately.
      setMessages((prev) => [...prev, newMsg]);
      lastMessageIdRef.current = newMsg.id;
      setText("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // Handles toggling the block status for the other user.
  const handleBlockToggle = async () => {
    if (!otherUser) return;

    const token = localStorage.getItem("access");

    try {
      if (!blockInfo.blockedByMe) {
        // If not blocked, send a request to block the user.
        await axios.post(
          "https://yashgarje31.pythonanywhere.com/api/chat/block/",
          { user_id: otherUser.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlockInfo((prev) => ({ ...prev, blockedByMe: true }));
      } else {
        // If already blocked, send a request to unblock the user.
        await axios.delete(
          `https://yashgarje31.pythonanywhere.com/api/chat/block/?user_id=${otherUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBlockInfo((prev) => ({ ...prev, blockedByMe: false }));
      }
    } catch (err) {
      console.error("Error toggling block", err);
    }
  };

  // If no user is selected, show a placeholder message.
  if (!otherUser) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 wa-chat-empty">
        <div className="text-muted">
          Select a chat on the left to start messaging.
        </div>
      </div>
    );
  }

  // Determine the status text to display in the header based on block and presence info.
  let statusText = "";
  const inputDisabled = blockInfo.blockedByMe || blockInfo.blockedMe;

  if (blockInfo.blockedByMe) {
    statusText = "You blocked this user";
  } else if (blockInfo.blockedMe) {
    statusText = "This user has blocked you";
  } else if (presence?.online) {
    statusText = "Online";
  } else if (presence?.last_seen) {
    statusText = `Last seen ${formatLastSeen(presence.last_seen)}`;
  } else {
    statusText = "Offline";
  }

  return (
    <div className="d-flex flex-column h-100 chat-window-whatsapp">
      {/* Chat Header: Displays user info, status, and block button. */}
      <div className="wa-header d-flex align-items-center px-3 py-2">
        {/* Back button for mobile view */}
        {isMobile && (
          <button
            type="button"
            className="btn btn-sm btn-link text-white me-2"
            onClick={onBack}
          >
            ←
          </button>
        )}

        {/* Avatar and user details */}
        <div className="wa-avatar me-2">
          <span>{otherUser.username[0].toUpperCase()}</span>
        </div>
        <div className="flex-grow-1">
          <div className="wa-header-name">{otherUser.username}</div>
          <div className="wa-header-status">{statusText}</div>
        </div>

        {/* Block/Unblock button */}
        {!blockInfo.blockedMe && (
          <button
            className="btn btn-sm btn-outline-light wa-block-btn"
            onClick={handleBlockToggle}
          >
            {blockInfo.blockedByMe ? "Unblock" : "Block"}
          </button>
        )}
      </div>

      {/* Messages Area: Renders the list of messages. */}
      <div className="flex-grow-1 wa-messages-wrapper">
        <div className="chat-messages">
          {messages.map((msg) => {
            const isMine = msg.sender === currentUser.id; // Check if the message was sent by the current user.
            const timeStr = formatTime(msg.timestamp); // Format the message timestamp.
            const isRead = msg.is_read; // Check if the message has been read.

            // Logic for read receipts (ticks). ✓✓ grey = delivered, ✓✓ blue = seen.
            const tickText = "✓✓";
            const tickClass = isRead
              ? "wa-tick wa-tick-seen"
              : "wa-tick wa-tick-delivered";

            return (
              <div
                // Each message row is aligned left (in) or right (out)
                key={msg.id}
                className={`wa-message-row ${
                  isMine ? "wa-message-row-out" : "wa-message-row-in"
                }`}
              >
                <div
                  // The message bubble has different styling for incoming and outgoing messages.
                  className={`wa-message-bubble ${
                    isMine ? "wa-bubble-out" : "wa-bubble-in"
                  }`}
                >
                  <div className="wa-message-text">{msg.content}</div>
                  <div className="wa-message-meta">
                    <span className="wa-message-time">{timeStr}</span>
                    {/* Show read receipt ticks only for outgoing messages. */}
                    {isMine && <span className={tickClass}>{tickText}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input Form */}
      <form className="wa-input-row" onSubmit={handleSend}>
        {/* The input field is disabled and shows a different placeholder if the chat is blocked. */}
        <input
          type="text"
          className="form-control wa-input"
          placeholder={
            inputDisabled
              ? "You can't send messages in this chat"
              : "Type a message"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={inputDisabled}
        />
        {/* Send button */}
        <button className="btn wa-send-btn" disabled={inputDisabled}>
          ➤
        </button>
      </form>
    </div>
  );
}
