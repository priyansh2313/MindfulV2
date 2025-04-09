import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Sentiment from "sentiment";

const VoiceSentiment = () => {
  const [sentimentResult, setSentimentResult] = useState<string | null>(null);

  // Speech recognition hooks
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  const analyzeSentiment = () => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(transcript);

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
      <h2 className="text-xl font-bold mb-4">Voice Sentiment Analysis</h2>

      <button
        className={`px-4 py-2 text-white rounded ${
          listening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-700"
        }`}
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
      >
        {listening ? "Listening..." : "Start Talking 🎤"}
      </button>

      <button
        className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        onClick={SpeechRecognition.stopListening}
      >
        Stop
      </button>

      <button
        className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
        onClick={resetTranscript}
      >
        Reset
      </button>

      {transcript && (
        <div className="mt-4 p-3 bg-white border border-gray-300 rounded">
          <p className="font-medium">Your Speech:</p>
          <p className="italic">{transcript}</p>
          <button
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={analyzeSentiment}
          >
            Analyze Sentiment
          </button>
        </div>
      )}

      {sentimentResult && (
        <p className="mt-4 text-lg font-semibold">Sentiment: {sentimentResult}</p>
      )}
    </div>
  );
};

export default VoiceSentiment;
