import { useState } from "react";
import Sentiment from "sentiment";

const TextSentiment = () => {
  const [text, setText] = useState("");
  const [sentimentResult, setSentimentResult] = useState<string | null>(null);

  const analyzeSentiment = () => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    
    let sentimentLabel = "Neutral";
    if (result.score > 0) {
      sentimentLabel = "Positive 😊";
    } else if (result.score < 0) {
      sentimentLabel = "Negative 😞";
    }

    setSentimentResult(sentimentLabel);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold mb-4">Text Sentiment Analysis</h2>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg"
        placeholder="Type something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={analyzeSentiment}
      >
        Analyze Sentiment
      </button>
      {sentimentResult && (
        <p className="mt-4 text-lg font-semibold">Sentiment: {sentimentResult}</p>
      )}
    </div>
  );
};

export default TextSentiment;
