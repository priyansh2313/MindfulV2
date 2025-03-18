import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const breathingExercises = [
  { id: 1, activity: "Box Breathing", description: "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s." },
  { id: 2, activity: "4-7-8 Breathing", description: "Inhale for 4s, hold for 7s, exhale for 8s." },
  { id: 3, activity: "Alternate Nostril Breathing", description: "Breathe in through one nostril, hold, then exhale through the other nostril." },
];

const DailyBreathing = () => {
  const [currentExercise, setCurrentExercise] = useState(breathingExercises[0]);
  const [timer, setTimer] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setBreathingPhase((prevPhase) => {
              if (prevPhase === "Inhale") return "Hold";
              if (prevPhase === "Hold") return "Exhale";
              return "Inhale";
            });
            return breathingPhase === "Hold" ? 4 : breathingPhase === "Exhale" ? 4 : 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathingPhase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-blue-600 p-6">
      <h1 className="text-4xl font-bold text-white mb-4">✨ Guided Breathing Exercises ✨</h1>

      {/* Breathing Animation */}
      <motion.div
        animate={{ scale: isBreathing ? [1, 1.2, 1] : 1 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-lg"
      >
        <motion.p
          key={breathingPhase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-xl font-semibold text-white"
        >
          {breathingPhase}
        </motion.p>
      </motion.div>

      {/* Exercise Details */}
      <div className="mt-6 bg-white/20 backdrop-blur-lg p-6 rounded-lg shadow-md text-center w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white">{currentExercise.activity}</h2>
        <p className="text-white/80 mt-2">{currentExercise.description}</p>

        {/* Timer */}
        <p className="mt-4 text-4xl font-bold text-white">{timer}s</p>

        {/* Start/Stop Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsBreathing((prev) => !prev)}
          className={`mt-4 px-6 py-2 rounded-lg text-white transition-all ${
            isBreathing ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {isBreathing ? "Stop" : "Start"} Breathing
        </motion.button>
      </div>

      {/* Exercise Selection */}
      <div className="mt-6 flex space-x-4">
        {breathingExercises.map((exercise) => (
          <motion.button
            key={exercise.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-lg text-white ${
              currentExercise.id === exercise.id ? "bg-blue-600" : "bg-gray-400"
            } transition-all`}
            onClick={() => {
              setCurrentExercise(exercise);
              setTimer(4);
              setIsBreathing(false);
              setBreathingPhase("Inhale");
            }}
          >
            {exercise.activity}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DailyBreathing;
