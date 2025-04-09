import { ArrowLeft, Book, Calendar, Save } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/journal.module.css"; // Import CSS Module

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
}

const Journal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    mood: "neutral",
  });
  const [isWriting, setIsWriting] = useState(false);

  const handleSave = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      title: currentEntry.title,
      content: currentEntry.content,
      mood: currentEntry.mood,
    };
    setEntries([newEntry, ...entries]);
    setCurrentEntry({ title: "", content: "", mood: "neutral" });
    setIsWriting(false);
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
                {entries.length === 0 ? (
                  <p className={styles.noEntries}>No journal entries yet. Start writing!</p>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className={styles.entryCard}>
                      <div className={styles.entryHeader}>
                        <h3 className={styles.entryTitle}>{entry.title}</h3>
                        <span className={styles.entryDate}>{entry.date}</span>
                      </div>
                      <p className={styles.entryContent}>{entry.content}</p>
                      <p className={styles.entryMood}>Mood: <span>{entry.mood}</span></p>
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
                className={styles.moodSelector}
              >
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
