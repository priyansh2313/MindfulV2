import { ArrowLeft, Book, Calendar, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Journal.module.css"; // Import CSS Module
import axios from "../hooks/axios/axios";
import { toast } from "react-hot-toast";
import Loader from "../hooks/Loader/Loader";

const Journal = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [entries, setEntries] = useState([]);
	const [currentEntry, setCurrentEntry] = useState({
		title: "",
		content: "",
		date: new Date().toLocaleDateString(),
		mood: "neutral",
	});
	const [isWriting, setIsWriting] = useState(false);

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
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleSave = () => {
		if (!currentEntry.title.trim() || !currentEntry.content.trim()) return;

		const newEntry: JournalEntry = {
			title: currentEntry.title,
			content: currentEntry.content,
			mood: currentEntry.mood,
		};
		axios
			.post("/journal", { ...newEntry }, { withCredentials: true })
			.then(() => {
				setEntries([newEntry, ...entries]);
				setCurrentEntry({ title: "", content: "", mood: "neutral" });
				setIsWriting(false);
				toast.success("Entry saved successfully!");
			})
			.catch((error) => {
				toast.error("Failed to save entry. Please try again.");
			});
	};

	return (
		<div className={styles.journalContainer}>
			{/* Back Button */}
			<button className={styles.backButton} onClick={() => navigate("/dashboard")}>
				<ArrowLeft className={styles.backIcon} /> Back to Dashboard
			</button>

			{/* Journal UI */}
			<div className={styles.journalBook}>
				<div className={styles.bookBinding}></div>
				<div className={styles.journalContent}>
					<h1 className={styles.journalTitle}>
						<Book className={styles.bookIcon} /> My Journal
					</h1>

					{!isWriting ? (
						<>
							<button onClick={() => setIsWriting(true)} className={styles.newEntryButton}>
								<Calendar className={styles.icon} /> Write New Entry
							</button>

							<div className={styles.entriesList}>
								{loading ? (
									<Loader />
								) : entries.length === 0 ? (
									<p className={styles.noEntries}>No journal entries yet. Start writing!</p>
								) : (
									entries.map((entry, index) => (
										<div key={index} className={styles.entryCard}>
											<div className={styles.entryHeader}>
												<h3 className={styles.entryTitle}>{entry.title}</h3>
											</div>
											<p className={styles.entryContent}>{entry.content}</p>
											<p className={styles.entryMood}>
												Mood: <span>{entry.mood}</span>
											</p>
										</div>
									))
								)}
							</div>
						</>
					) : (
						<div className={styles.entryForm}>
							<input
								type="text"
								placeholder="Entry Title"
								value={currentEntry.title}
								onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
								className={styles.entryTitleInput}
							/>

							<select
								value={currentEntry.mood}
								onChange={(e) => setCurrentEntry({ ...currentEntry, mood: e.target.value })}
								className={styles.moodSelector}>
								<option value="happy">😊 Happy</option>
								<option value="calm">😌 Calm</option>
								<option value="neutral">😐 Neutral</option>
								<option value="anxious">😰 Anxious</option>
								<option value="sad">😢 Sad</option>
							</select>

							<textarea
								placeholder="Write your thoughts here..."
								value={currentEntry.content}
								onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
								className={styles.entryTextarea}
							/>

							<div className={styles.buttonGroup}>
								<button onClick={() => setIsWriting(false)} className={styles.cancelButton}>
									Cancel
								</button>
								<button onClick={handleSave} className={styles.saveButton}>
									<Save className={styles.icon} /> Save Entry
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Journal;
