import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://mindful-chat-server.onrender.com");






export default function CommunityChat() {
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const handleLogin = () => {
    if (username.trim()) {
      socket.emit("userJoined", username);
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { username, message: input });
      setInput("");
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    socket.emit("typing", username);
  };

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("updateUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("userTyping", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 2000); // Remove typing after 2 seconds
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateUsers");
      socket.off("userTyping");
    };
  }, []);

  return (
    <div className="h-screen p-6 bg-gray-100">
      {!username ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-6">Enter Your Name</h1>
          <input
            type="text"
            className="p-3 border rounded-lg"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="flex h-full">
          {/* Sidebar for Online Users */}
          <div className="w-1/4 bg-white p-4 border-r shadow-lg">
            <h2 className="text-xl font-bold mb-4">Online Users 🟢</h2>
            {onlineUsers.map((user, index) => (
              <p key={index} className="mb-2 text-green-600 font-semibold">
                {user}
              </p>
            ))}
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-2 w-fit rounded-lg ${
                    msg.username === username
                      ? "ml-auto bg-green-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <strong>{msg.username}: </strong>
                  {msg.message}
                </div>
              ))}

              {/* Show Typing Animation */}
              {typingUser && (
                <p className="text-gray-500 italic">{typingUser} is typing...</p>
              )}
            </div>

            <div className="p-4 bg-white border-t flex">
              <input
                type="text"
                value={input}
                onChange={handleTyping}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
