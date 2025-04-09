import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

const FaceEmotion = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emotion, setEmotion] = useState<string>("");

  // Load FaceAPI models
  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  // Start the camera
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  };

  // Detect emotions
  const detectEmotion = async () => {
    const video = videoRef.current;
    if (!video) return;

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections.length > 0) {
      const expressions = detections[0]?.expressions;
      const maxEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );
      setEmotion(maxEmotion);
    }
  };

  useEffect(() => {
    loadModels();
    startVideo();

    const interval = setInterval(detectEmotion, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-white">
      <h2 className="text-3xl font-bold mb-4">🎭 Face Emotion Detection</h2>
      <video ref={videoRef} autoPlay muted className="rounded-lg w-[500px] h-[400px] mx-auto" />
      <p className="mt-4 text-2xl">Detected Emotion: {emotion || "None"}</p>
    </div>
  );
};

export default FaceEmotion;
