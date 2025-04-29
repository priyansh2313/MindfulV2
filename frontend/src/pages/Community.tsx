import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/community.module.css";
declare module "emoji-picker-react";
import { useSelector } from "react-redux";

// const socket = io("https://mindful-chat-server.onrender.com");
const socket = io("http://localhost:3000", { withCredentials: true });

const colors = ["#F06292", "#64B5F6", "#81C784", "#FFD54F", "#BA68C8"];

export default function CommunityChat() {
	const user = useSelector((state: any) => state.user);
	console.log(user);
	const [username, setUsername] = useState("");
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<{ id: string; username: string; message: string; fileUrl?: string }[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [typingUser, setTypingUser] = useState<string | null>(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [currentRoom, setCurrentRoom] = useState("general");
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// Generate user color
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

    socket.on("receiveMessage", (data) => {
      console.log(data)
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

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		if (username.trim()) {
			setUsername(username.trim()); // update real username
		}
	};

	const sendMessage = () => {
		if (input.trim()) {
			socket.emit("sendMessage", {
				username,
				message: input,
				room: currentRoom,
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
		setMessages([]); // Clear messages on room change
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
				});
			};
			reader.readAsDataURL(file); // basic image/file preview support
		}
	};

	return (
		<div className={`${styles.container} ${styles[theme]}`}>
			{!username ? (
				<div className={styles.loginScreen}>
					<h1 className={styles.title}>Join the Mindful Chat s🌍</h1>
					<form onSubmit={handleLogin} className={styles.loginForm}>
						<input
							type="text"
							className={styles.inputBox}
							placeholder="Enter your name..."
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<button className={styles.startButton} type="submit">
							Join Chat
						</button>
					</form>
				</div>
			) : (
				<div className={styles.chatContainer}>
					{/* Sidebar */}
					<div className={styles.sidebar}>
						<h2 className={styles.sidebarTitle}>Online Users 🟢</h2>
						{onlineUsers.map((user, i) => (
							<p key={i} style={{ color: getUserColor(user) }}>
								{user}
							</p>
						))}
						<hr />
						<h3>Rooms</h3>
						{["general", "mental-health", "random", "productivity"].map((room) => (
							<button
								key={room}
								className={`${styles.roomButton} ${currentRoom === room ? styles.activeRoom : ""}`}
								onClick={() => handleRoomChange(room)}>
								#{room}
							</button>
						))}
						<button onClick={toggleTheme} className={styles.themeToggle}>
							{theme === "light" ? "🌙 Dark" : "☀️ Light"}
						</button>
					</div>

					{/* Chat */}
					<div className={styles.chatBox}>
						<div className={styles.messagesContainer}>
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={`${styles.message} ${
										msg.username === username ? styles.myMessage : styles.otherMessage
									}`}>
									<strong style={{ color: getUserColor(msg.username) }}>{msg.username}:</strong> {msg.message}
									{msg.fileUrl && (
										<div>
											<img src={msg.fileUrl} alt="shared" style={{ maxWidth: "200px", marginTop: "8px" }} />
										</div>
									)}
								</div>
							))}
							{typingUser && <p className={styles.typing}>{typingUser} is typing...</p>}
						</div>

						{/* Input */}
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
							<input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
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
