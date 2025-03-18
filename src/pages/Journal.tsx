import { ArrowLeft, Book, Calendar, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex justify-center items-center p-6">
      <div className="relative bg-[#fdf8e8] shadow-xl border border-gray-300 rounded-lg p-6 w-full max-w-3xl transform transition-all hover:scale-[1.02]">
        {/* Book Binding Effect */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gray-300 rounded-l-lg shadow-inner"></div>

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Book className="h-6 w-6 mr-2" />
            My Journal
          </h1>
        </div>

        {!isWriting ? (
          <div>
            <button
              onClick={() => setIsWriting(true)}
              className="w-full bg-gray-800 text-white rounded-lg py-3 mb-6 hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Write New Entry
            </button>

            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border border-gray-300 rounded-lg p-5 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{entry.title}</h3>
                    <span className="text-sm text-gray-600 italic">{entry.date}</span>
                  </div>
                  <p className="text-gray-700 font-serif italic line-clamp-3">{entry.content}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    Mood: <span className="ml-1 font-semibold">{entry.mood}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Entry Title */}
            <input
              type="text"
              placeholder="Entry Title"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              className="w-full bg-transparent border-b border-gray-600 focus:outline-none focus:border-gray-900 text-gray-900 text-lg font-bold italic placeholder-gray-500"
            />

            {/* Mood Selector */}
            <select
              value={currentEntry.mood}
              onChange={(e) => setCurrentEntry({ ...currentEntry, mood: e.target.value })}
              className="w-full bg-gray-100 border border-gray-400 rounded-lg p-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="happy">😊 Happy</option>
              <option value="calm">😌 Calm</option>
              <option value="neutral">😐 Neutral</option>
              <option value="anxious">😰 Anxious</option>
              <option value="sad">😢 Sad</option>
            </select>

            {/* Writing Area */}
            <textarea
              placeholder="Write your thoughts here..."
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              className="w-full h-64 bg-transparent border border-gray-400 rounded-lg p-4 text-gray-900 font-serif text-lg leading-relaxed focus:ring-gray-500 focus:border-gray-500 placeholder-gray-500 italic"
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsWriting(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
