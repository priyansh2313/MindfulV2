import React, { useEffect, useRef, useState } from "react";
import Sentiment from "sentiment";
import confetti from "canvas-confetti";
import styles from "../styles/Gratitude.module.css";
import { FiMic, FiSend } from "react-icons/fi";
import axios from "../hooks/axios/axios";
import { toast } from "react-hot-toast";
import Loader from "../hooks/Loader/Loader";

const sentiment = new Sentiment();

// Define the JournalEntry type
interface JournalEntry {
	title: string;
	content: string;
	mood: string;
}

const moods = [
	{ value: "happy", label: "😊 Happy" },
	{ value: "sad", label: "😔 Sad" },
	{ value: "angry", label: "😠 Angry" },
	{ value: "tired", label: "😴 Tired" },
	{ value: "crying", label: "😢 Crying" },
	{ value: "anxious", label: "😰 Anxious" },
	{ value: "lonely", label: "🥺 Lonely" },
	{ value: "depressed", label: "😞 Depressed" },
	{ value: "empty", label: "😶 Empty" },
	{ value: "guilty", label: "😔 Guilty" },
];

const getMotivationalQuote = (tone: string): string => {
	const quotes: Record<string, string[]> = {
		positive: ["Keep going! You’re doing great 🌟", "Joy radiates from you ✨"],
		neutral: ["Stillness is growth too 🌱", "Breathe. You’re allowed to be still 🌤"],
		negative: ["It’s okay to feel this way 💜", "You're not alone 🫂"],
	};
	const list = quotes[tone] || [];
	return list[Math.floor(Math.random() * list.length)];
};
const Journal = () => {
	const [newEntry, setNewEntry] = useState(false);
	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedMood, setSelectedMood] = useState("default");
	const [title, setTitle] = useState("");
	const [entry, setEntry] = useState("");
	const [tone, setTone] = useState<"positive" | "negative" | "neutral" | null>(null);
	const [quote, setQuote] = useState("");
	const [listening, setListening] = useState(false);
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const [random, setRandom] = useState(Math.random());

	useEffect(() => {
		setLoading(true);
		axios
			.get("/journals", { withCredentials: true })
			.then(({ data }) => {
				setEntries(data.data);
			})
			.catch((error) => {
				console.error("Error fetching journal entries:", error);
				toast.error("Failed to load journal entries. Please try again.");
			})
			.then(() => {
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, [random]);

	// useEffect(() => {
	// 	const source = localStorage.getItem("rl_action_source");
	// 	if (source === "journal") setCameFromRL(true);
	// }, []);

	// const storedMood = localStorage.getItem("todayMood");
	// const currentMood = storedMood !== null && isMood(storedMood) ? storedMood : null;

	const handleSubmit = () => {
		if (!title.trim() || !entry.trim() || !selectedMood) {
			toast.error("Please fill in all fields.");
			return;
		};

		const newEntry: JournalEntry = {
			title: title,
			content: entry,
			mood: selectedMood,
		};
		axios
			.post("/journal", { ...newEntry }, { withCredentials: true })
			.then(() => {
				setTitle("");
				setEntry("");
				setSelectedMood("default");
				toast.success("Entry saved successfully!");
				setNewEntry(false);
				setRandom(Math.random());
			})
			.catch((error) => {
				toast.error("Failed to save entry. Please try again.");
			});
	};

	const toggleListening = () => {
		const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
		if (!SpeechRecognition) return alert("Voice input not supported.");

		if (!recognitionRef.current) {
			recognitionRef.current = new SpeechRecognition();
			recognitionRef.current.lang = "en-US";
			recognitionRef.current.continuous = true;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
				const transcript = event.results[event.results.length - 1][0].transcript;
				setEntry((prev) => prev + " " + transcript);
			};
		}

		if (listening) recognitionRef.current.stop();
		else recognitionRef.current.start();
		setListening(!listening);
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.heading}>🖋 Reflect. Release. Reconnect.</h1>

			{newEntry ? (
				<>
				<div className={styles.controls}>
					<div className={styles.dropdown}>
						<label htmlFor="mood">💭 Mood</label>
						<select id="mood" value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
							<option value="default">Choose how you feel...</option>
							{moods.map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className={styles.journalBox}>
					<input
						type="text"
						placeholder="Your title..."
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						className={styles.titleInput}
					/>
					<textarea
						placeholder="Write or speak your thoughts..."
						value={entry}
						onChange={(e) => setEntry(e.target.value)}
						className={styles.textarea}
						rows={6}
					/>
					<div className={styles.actions}>
						<button onClick={toggleListening} title="Voice Input" className={styles.micButton}>
							<FiMic />
						</button>
						<button onClick={handleSubmit} title="Submit" className={styles.sendButton}>
							<FiSend />
						</button>
					</div>
				</div>

				{tone && (
					<div className={styles.result}>
						<p className={styles.toneText}>
							{tone === "positive" && "🌞 You sound joyful."}
							{tone === "negative" && "🌧 You sound heavy."}
							{tone === "neutral" && "🌿 You sound calm."}
						</p>
						<p className={styles.quote}>💬 {quote}</p>
					</div>
				)}
				</>) : (
					<div className={styles.journals}>
						<button className={styles.newButton} onClick={()=>{setNewEntry(true)}}>New Entry</button>
						<div className={styles.journalList}>
							{entries.map((entry, index) => (
								<div key={index} className={styles.entry}>
									<h2 className={styles.entryTitle}>{entry.title}</h2>
									<p className={styles.entryContent}>{entry.content}</p>
									<p className={styles.entryMood}>Mood: {entry.mood}</p>
									<p className={styles.entryDate}>{new Date(entry.createdAt).toLocaleDateString()}</p>
								</div>
							))}
						</div>
					</div>
			)}
		</div>
	);
};

export default Journal;
