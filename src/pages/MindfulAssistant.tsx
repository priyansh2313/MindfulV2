import { useState } from 'react';
import BodyEmotion from '../pages/BodyEmotion';
import FaceEmotion from '../pages/FaceEmotion';
import TextSentiment from '../pages/TextSentiment';
import VoiceSentiment from '../pages/VoiceSentiment';

const MindfulAssistant = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleFeatureClick = (feature: string) => {
    setActiveFeature(feature);
  };

  const renderComponent = () => {
    switch (activeFeature) {
      case 'voice':
        return <VoiceSentiment />;
      case 'face':
        return <FaceEmotion />;
      case 'body':
        return <BodyEmotion />;
      case 'text':
        return <TextSentiment />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold mb-8">🧘‍♀️ Mindful Assistant</h1>

      {activeFeature === null ? (
        <div className="flex space-x-8">
          <button onClick={() => handleFeatureClick('voice')} className="px-8 py-4 bg-purple-600 rounded-lg hover:bg-purple-700">
            🎤 Voice Sentiment
          </button>
          <button onClick={() => handleFeatureClick('face')} className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-700">
            🎭 Face Emotion
          </button>
          <button onClick={() => handleFeatureClick('body')} className="px-8 py-4 bg-green-600 rounded-lg hover:bg-green-700">
            🕺 Body Emotion
          </button>
          <button onClick={() => handleFeatureClick('text')} className="px-8 py-4 bg-yellow-600 rounded-lg hover:bg-yellow-700">
            📝 Text Sentiment
          </button>
        </div>
      ) : (
        <div>{renderComponent()}</div>
      )}
    </div>
  );
};

export default MindfulAssistant;
