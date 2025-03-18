import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Evaluation = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const questions = [
    "How often have you felt down or depressed in the last week?",
    "How would you rate your anxiety levels currently?",
    "How well have you been sleeping lately?",
    "How would you rate your stress levels?",
    "How often do you feel overwhelmed by your emotions?",
  ];

  const options = ["Never", "Rarely", "Sometimes", "Often", "Always"];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const calculateScore = () => {
    const total = answers.reduce((acc, curr) => acc + curr, 0);
    const maxScore = questions.length * 4; // 4 is max score per question
    const percentage = (total / maxScore) * 100;

    return {
      score: total,
      maxScore,
      percentage,
      level:
        percentage <= 25
          ? "Low Risk"
          : percentage <= 50
          ? "Moderate Risk"
          : percentage <= 75
          ? "High Risk"
          : "Severe Risk",
    };
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleFindTherapists = () => {
    if (userLocation) {
      const googleMapsURL = `https://www.google.com/maps/search/Mental+Health+Therapists/@${userLocation.lat},${userLocation.lng},15z`;
      window.open(googleMapsURL, "_blank");
    } else {
      alert("Unable to fetch your location. Please enable location services.");
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl bg-white rounded-xl shadow-md p-8"
        >
          <button onClick={() => navigate("/dashboard")} className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mental Health Evaluation</h2>

          <p className="text-gray-600 mb-6">
            This evaluation consists of {questions.length} questions. It will help assess your mental well-being. Answer honestly for the best results.
          </p>

          <button onClick={() => setStarted(true)} className="w-full bg-indigo-600 text-white rounded-md py-3 hover:bg-indigo-700 transition-all">
            Start Evaluation
          </button>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const result = calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Your Mental Health Results</h2>

          <div className="mb-8 text-center">
            <div className="inline-block bg-indigo-100 rounded-full px-6 py-2 text-indigo-800 font-semibold text-lg">
              {result.level}
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className="bg-indigo-600 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.percentage}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-center text-gray-600 mt-2">
              Score: {result.score} out of {result.maxScore} ({Math.round(result.percentage)}%)
            </p>
          </div>

          {(result.level === "High Risk" || result.level === "Severe Risk") && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">
                  We recommend seeking professional support. Find nearby mental health experts.
                </p>
              </div>
            </div>
          )}

          {(result.level === "High Risk" || result.level === "Severe Risk") && (
            <button onClick={handleFindTherapists} className="w-full bg-red-600 text-white rounded-lg py-3 mb-4 hover:bg-red-700 transition-all">
              <MapPin className="h-5 w-5 mr-2 inline" />
              Find Nearby Experts
            </button>
          )}

          <button
            onClick={() => {
              setShowResults(false);
              setStarted(false);
              setCurrentQuestion(0);
              setAnswers([]);
            }}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 hover:bg-indigo-700 transition-all"
          >
            Restart Evaluation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl bg-white rounded-xl shadow-md p-8"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{questions[currentQuestion]}</h3>

        {options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(index)} className="w-full p-4 rounded-lg border border-gray-300 hover:bg-indigo-50 transition-all mb-3">
            {option}
          </button>
        ))}
      </motion.div>
    </div>
  );
};

export default Evaluation;
