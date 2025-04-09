import { useState } from "react";
import styles from "../styles/MindfulAssistant.module.css"; // Import the CSS module
import BodyEmotion from "./BodyEmotion";
import FaceEmotion from "./FaceEmotion";
import TextSentiment from "./TextSentiment";
import VoiceSentiment from "./VoiceSentiment";

const MindfulAssistant = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleFeatureClick = (feature: string) => {
    setActiveFeature(feature);
  };

  const renderComponent = () => {
    switch (activeFeature) {
      case "voice":
        return <VoiceSentiment />;
      case "face":
        return <FaceEmotion />;
      case "body":
        return <BodyEmotion />;
      case "text":
        return <TextSentiment />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧘‍♀️ Mindful Assistant</h1>

      {activeFeature === null ? (
        <div className={styles.buttonContainer}>
          <button
            onClick={() => handleFeatureClick("voice")}
            className={`${styles.featureButton} ${styles.voice}`}
          >
            🎤 Voice Sentiment
          </button>
          <button
            onClick={() => handleFeatureClick("face")}
            className={`${styles.featureButton} ${styles.face}`}
          >
            🎭 Face Emotion
          </button>
          <button
            onClick={() => handleFeatureClick("body")}
            className={`${styles.featureButton} ${styles.body}`}
          >
            🕺 Body Emotion
          </button>
          <button
            onClick={() => handleFeatureClick("text")}
            className={`${styles.featureButton} ${styles.text}`}
          >
            📝 Text Sentiment
          </button>
        </div>
      ) : (
        <div className={styles.componentContainer}>{renderComponent()}</div>
      )}
    </div>
  );
};

export default MindfulAssistant;
