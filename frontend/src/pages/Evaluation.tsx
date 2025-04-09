import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Evaluation.module.css";

const categories = {
  anxiety: [
    "I felt nervous or on edge.",
    "I had trouble relaxing.",
    "I felt fearful for no reason.",
  ],
  stress: [
    "I found it hard to wind down.",
    "I felt that I was using a lot of nervous energy.",
    "I felt touchy and easily upset.",
  ],
  insomnia: [
    "I had difficulty falling asleep.",
    "I woke up frequently during the night.",
    "I felt tired upon waking.",
  ],
  depression: [
    "I felt down or hopeless.",
    "I had little interest or pleasure in doing things.",
    "I had trouble concentrating.",
  ],
  selfEsteem: [
    "I felt confident in myself.",
    "I felt like I had value as a person.",
    "I had negative thoughts about myself.",
  ],
};

const options = ["Never", "Rarely", "Sometimes", "Often", "Always"];

const Evaluation = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = Object.entries(categories).flatMap(([key, qs]) =>
    qs.map((q) => ({ category: key, question: q }))
  );

  const handleOptionSelect = (value: number) => {
    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      localStorage.setItem("evaluationScore", updatedAnswers.reduce((a, b) => a + b, 0).toString());
      setShowResults(true);
    }
  };

  const getCategoryScores = () => {
    const scores: { [key: string]: number } = {};
    let index = 0;

    for (const key in categories) {
      const qCount = categories[key].length;
      scores[key] = answers.slice(index, index + qCount).reduce((a, b) => a + b, 0);
      index += qCount;
    }

    return scores;
  };

  const interpretCategory = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage <= 25) return "Low";
    if (percentage <= 50) return "Moderate";
    if (percentage <= 75) return "High";
    return "Severe";
  };

  return (
    <div className={styles.evaluationContainer}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.evaluationCard}
      >
        {showResults ? (
          <>
            <motion.h2 className={styles.evaluationTitle}>
              Your Mental Health Results
            </motion.h2>

            <div className={styles.resultText}>
              <p>Here's a breakdown of your mental health evaluation:</p>
              {Object.entries(getCategoryScores()).map(([key, score]) => {
                const max = categories[key].length * 4;
                const status = interpretCategory(score, max);
                return (
                  <motion.div
                    key={key}
                    className={styles.resultBox}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                    {status} ({score}/{max})
                  </motion.div>
                );
              })}

              {Object.values(getCategoryScores()).some(
                (score, i) =>
                  score >= categories[Object.keys(categories)[i]].length * 3
              ) && (
                <motion.div
                  className={styles.severeWarning}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p>
                    One or more categories show high or severe risk. We recommend seeking help.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/mental+health+professionals+near+me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.getHelpLink}
                  >
                    Find a Professional Near You
                  </a>
                </motion.div>
              )}
            </div>

            <motion.button
              onClick={() => {
                setShowResults(false);
                setStarted(false);
                setCurrentQuestionIndex(0);
                setAnswers([]);
              }}
              className={styles.restartButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Restart Evaluation
            </motion.button>
          </>
        ) : started ? (
          <>
            <motion.h3 className={styles.questionText}>
              {questions[currentQuestionIndex].question}
            </motion.h3>

            <div className={styles.optionsContainer}>
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  className={styles.optionButton}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <motion.button
              onClick={() => navigate("/dashboard")}
              className={styles.backButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="inline h-5 w-5 mr-2" /> Back to Dashboard
            </motion.button>

            <motion.h2 className={styles.evaluationTitle}>
              Mental Health Evaluation
            </motion.h2>

            <p className={styles.description}>
              This test includes questions for anxiety, stress, insomnia, depression, and self-esteem. Be honest for accurate insights.
            </p>

            <motion.button
              onClick={() => setStarted(true)}
              className={styles.startButton}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start Evaluation
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Evaluation;
