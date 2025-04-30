"use client";

import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/community.module.css";
declare module "emoji-picker-react";
import { useSelector } from "react-redux";

// const socket = io("https://mindful-chat-server.onrender.com");
const socket = io("https://mindful-chat-server.onrender.com", { withCredentials: true });
// const socket = io("http://localhost:3000", { withCredentials: true });

const colors = ["#F06292", "#64B5F6", "#81C784", "#FFD54F", "#BA68C8"];

export default function CommunityChat() {
  const user = useSelector((state : any) => state.user.user)
  console.log(user)
  const [username, setUsername] = useState(user.anonymousUsername);
  const [loginName, setLoginName] = useState(""); // live input for name
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; username: string; message: string; fileUrl?: string; profilePicUrl?: string; timestamp?: string }[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentRoom, setCurrentRoom] = useState("general");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // User color generator
  const getUserColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (!username) return;

    socket.emit("userJoined", { username, room: currentRoom });

    socket.on("previousMessages", ({ messages, room }) => {
      console.log(messages);
      if (room === currentRoom) {
        // setMessages(messages.map((msg: any) => ({ ...msg, id: uuidv4() })));
        setMessages(messages);
      }
    });

    socket.on("receiveMessage", (data) => {
      console.log(data);
      if (data.room === currentRoom) {
        setMessages((prev) => [...prev, { ...data, id: uuidv4() }]);
      }
    });

    socket.on("updateUsers", (users) => setOnlineUsers(users));
    socket.on("userTyping", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 2000);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateUsers");
      socket.off("userTyping");
    };
  }, [username, currentRoom]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;

    if (profilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicUrl(reader.result as string);
        setUsername(loginName.trim());
      };
      reader.readAsDataURL(profilePicFile);
    } else {
      setUsername(loginName.trim());
    }
  };

  const sendMessage = () => {
    if (input.trim()) {
      console.log(input);
      socket.emit("sendMessage", {
        username,
        message: input,
        room: currentRoom,
        profilePicUrl,
        timestamp: new Date().toISOString(),
        senderId: user._id,
      });
      setInput("");
    }
  };

	const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		socket.emit("typing", { username, room: currentRoom });
	};

	const handleEmojiClick = (emoji: any) => {
		setInput((prev) => prev + emoji.emoji);
	};

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

  const handleRoomChange = (room: string) => {
    setCurrentRoom(room);
    setMessages([]);
    socket.emit("joinRoom", room);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        socket.emit("sendMessage", {
          username,
          message: "",
          fileUrl: reader.result,
          room: currentRoom,
          profilePicUrl,
          timestamp: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {!username ? (
        <div className={styles.loginScreen}>
          <h1 className={styles.title}>Join the Mindful Chat 🌍</h1>

          {/* Single Correct Form */}
          <form onSubmit={handleLogin} className={styles.loginForm}>
  <input
    type="text"
    className={styles.inputBox}
    placeholder="Enter your name..."
    value={loginName}
    onChange={(e) => setLoginName(e.target.value)}
  />

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
    className={styles.inputBox}
  />

  {/* 👇 Profile Preview */}
  {profilePicFile && (
    <div className={styles.previewBox}>
      <h4>Profile Preview:</h4>
      <img
        src={URL.createObjectURL(profilePicFile)}
        alt="Profile Preview"
        className={styles.previewImage}
      />
    </div>
  )}

  <button className={styles.startButton} type="submit">
    Join Chat
  </button>
</form>


        </div>
      ) : (
        <div className={styles.chatContainer}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}> <p className={styles.onlineUser}>Online Users 🟢</p></h2>
            {onlineUsers.map((user, i) => (
              <p key={i} style={{ color: getUserColor(user) }}>{user}</p>
            ))}
            <hr />
            <h3 className={styles.roomsTitle}>Rooms 🏠</h3>
<div className={styles.roomsList}>
  {["general", "mental-health", "random", "productivity"].map((room) => (
    <button
      key={room}
      className={`${styles.roomButton} ${currentRoom === room ? styles.activeRoom : ""}`}
      onClick={() => handleRoomChange(room)}
    >
      #{room.replace("-", " ")}
    </button>
  ))}
</div>
            <button onClick={toggleTheme} className={styles.themeToggle}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>

          {/* Chat Box */}
          <div className={styles.chatBox}>
            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={msg.id}
                  className={`${styles.message} ${msg.username === username ? styles.myMessage : styles.otherMessage}`}
                >
                  <div className={styles.messageHeader}>
                    {msg.profilePicUrl && (
                      <img src={msg.profilePicUrl} alt="profile" className={styles.avatar} />
                    )}
                    <strong style={{ color: getUserColor(msg.username) }}>
                      {msg.username}
                    </strong>
                  </div>
                  <div className={styles.messageContent}>
                    {msg.message}
                  </div>
                  <div className={styles.timestamp}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                  {msg.fileUrl && (
                    <div>
                      <img src={msg.fileUrl} alt="shared" style={{ maxWidth: "200px", marginTop: "8px" }} />
                    </div>
                  )}
                  {msg.username === username && (
                    <div className={styles.readReceipt}>
                      ✓✓ Seen
                    </div>
                  )}
                </motion.div>
              ))}

{typingUser && (
  <div className={styles.typingArea}>
    <strong>{typingUser}</strong> is typing
    <span className={styles.typingDots}>
      <span>.</span><span>.</span><span>.</span>
    </span>
  </div>
)}
            </div>

            {/* Input Field */}
            <div className={styles.inputContainer}>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
              {showEmojiPicker && (
                <div className={styles.emojiPickerWrapper}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <input
                type="text"
                className={styles.inputField}
                placeholder="Type a message..."
                value={input}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={() => fileInputRef.current?.click()}>📎</button>
              <button className={styles.sendButton} onClick={sendMessage}>
                🚀
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
