import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackComponent, { isMood } from "../components/FeedbackComponent";
import FloatingChatbot from "../pages/FloatingChatbot";
import styles from "../styles/Evaluation.module.css";
import { logFeedback, Mood } from "../utils/reinforcement";
import axios from "../hooks/axios/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CryptoJS from "crypto-js";

const categories = {
	anxiety: [
		{ q: "Feeling nervous, anxious, or on edge", scale: 3 },
		{ q: "Not being able to stop or control worrying", scale: 3 },
		{ q: "Worrying too much about different things", scale: 3 },
		{ q: "Trouble relaxing", scale: 3 },
		{ q: "Being so restless that it is hard to sit still", scale: 3 },
		{ q: "Becoming easily annoyed or irritable", scale: 3 },
		{ q: "Feeling afraid, as if something awful might happen", scale: 3 },
	],
	depression: [
		{ q: "Little interest or pleasure in doing things", scale: 3 },
		{ q: "Feeling down, depressed, or hopeless", scale: 3 },
		{ q: "Trouble falling or staying asleep, or sleeping too much", scale: 3 },
		{ q: "Feeling tired or having little energy", scale: 3 },
		{ q: "Poor appetite or overeating", scale: 3 },
		{ q: "Feeling bad about yourself or that you are a failure", scale: 3 },
		{ q: "Trouble concentrating on things", scale: 3 },
		{ q: "Moving or speaking slowly or restlessly", scale: 3 },
		{ q: "Thoughts that you would be better off dead", scale: 3 },
	],
	insomnia: [
		{ q: "Difficulty falling asleep", scale: 4 },
		{ q: "Difficulty staying asleep", scale: 4 },
		{ q: "Problems waking up too early", scale: 4 },
		{ q: "Satisfaction with current sleep pattern", scale: 4, reverse: true },
		{ q: "Sleep interference with daily functioning", scale: 4 },
		{ q: "Noticeability of sleep problems by others", scale: 4 },
		{ q: "Worry/distress about sleep difficulties", scale: 4 },
	],
	stress: [
		{ q: "Felt upset by unexpected events", scale: 4 },
		{ q: "Felt unable to control important things in life", scale: 4 },
		{ q: "Felt nervous or stressed", scale: 4 },
		{ q: "Felt confident about handling problems", scale: 4, reverse: true },
		{ q: "Felt that things were going your way", scale: 4, reverse: true },
		{ q: "Felt that difficulties were piling up too high", scale: 4 },
	],
	selfEsteem: [
		{ q: "I am satisfied with myself", scale: 3 },
		{ q: "I think I am no good at all", scale: 3, reverse: true },
		{ q: "I have a number of good qualities", scale: 3 },
		{ q: "I am as capable as others", scale: 3 },
		{ q: "I do not have much to be proud of", scale: 3, reverse: true },
		{ q: "I feel useless at times", scale: 3, reverse: true },
		{ q: "I feel I am a person of worth", scale: 3 },
		{ q: "I wish I had more respect for myself", scale: 3, reverse: true },
		{ q: "I feel I am a failure", scale: 3, reverse: true },
		{ q: "I take a positive attitude toward myself", scale: 3 },
	],
};

const formatCategory = (key) => key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const Evaluation = () => {
	const navigate = useNavigate();
	const user = useSelector((state: any) => state.user.user);
	console.log(user);
	const [started, setStarted] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [chatbotOpen, setChatbotOpen] = useState(false);
	const [cameFromRL, setCameFromRL] = useState(false);
	const [feedbackGiven, setFeedbackGiven] = useState(false);

	const questions = Object.entries(categories).flatMap(([category, items]) =>
		items.map(({ q, scale, reverse }: { q: string; scale: number; reverse?: boolean }) => ({
			category,
			question: q,
			scale,
			reverse: reverse || false,
		}))
	);

	const handleOptionSelect = (value) => {
		const { reverse, scale } = questions[currentQuestionIndex];
		const score = reverse ? scale - value : value;
		const updatedAnswers = [...answers, score];
		setAnswers(updatedAnswers);

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			const score = updatedAnswers.reduce((a, b) => a + b, 0);
			handleUpload(score);
			localStorage.setItem("evaluationScore", score.toString());
			setShowResults(true);
		}
	};

	const getCategoryScores = () => {
		const scores: Record<string, number> = {};
		let index = 0;

		for (const key in categories) {
			const qCount = categories[key].length;
			scores[key] = answers.slice(index, index + qCount).reduce((a, b) => a + b, 0);
			index += qCount;
		}

		return scores;
	};

	const interpretCategory = (score, max) => {
		const percentage = (score / max) * 100;
		if (percentage <= 25) return "Low";
		if (percentage <= 50) return "Moderate";
		if (percentage <= 75) return "High";
		return "Severe";
	};

	useEffect(() => {
		const source = localStorage.getItem("rl_action_source");
		if (source === "evaluation") setCameFromRL(true);
	}, []);

	const currentMood = localStorage.getItem("todayMood") || "😐";

	useEffect(() => {
		if (showResults) {
			const scores = getCategoryScores();
			const hasSevere = Object.entries(scores).some(
				([key, score]) => score >= categories[key].length * (categories[key][0].scale * 0.75)
			);
			if (hasSevere) setChatbotOpen(true);
		}
	}, [showResults]);

	const handleUpload = (score: number) => {
		const scores: { [key: string]: number } = {};
		let index = 0;

		for (const key in categories) {
			const qCount = categories[key].length;
			scores[key] = answers.slice(index, index + qCount).reduce((a, b) => a + b, 0);
			index += qCount;
		}

		axios
			.post("/test", { ...scores, score }, { withCredentials: true })
			.then(({ data }) => {
				toast.success("Test Results Updated");
			})
			.catch((error) => {
				console.error("Error uploading data:", error);
			});
	};

	return (
		<div className={styles.evaluationContainer}>
			<FloatingChatbot
				isOpen={chatbotOpen}
				onToggle={() => setChatbotOpen((prev) => !prev)}
				mode="evaluation"
				hoveredSection={null}
			/>

			<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={styles.evaluationCard}>
				{showResults ? (
					<>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: "20px",
								fontSize: "25px",
								color: "red",
							}}>
							<marquee>
								⚠️ Disclaimer Mindful AI is a supportive tool,<strong> not a diagnosis or treatment</strong>. For
								severe mental health issues, consult a professional.
							</marquee>
						</div>
						<motion.h2 className={styles.evaluationTitle}>Your Mental Health Results</motion.h2>
						<div className={styles.resultText}>
							<p>Here's a breakdown of your mental health evaluation:</p>
							{Object.entries(getCategoryScores()).map(([key, score]) => {
								const max = categories[key].length * categories[key][0].scale;
								const status = interpretCategory(score, max);
								return (
									<motion.div
										key={key}
										className={styles.resultBox}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}>
										<strong>{formatCategory(key)}:</strong> {status} ({score}/{max})
									</motion.div>
								);
							})}
							{Object.entries(getCategoryScores()).some(
								([key, score]) => score >= categories[key].length * (categories[key][0].scale * 0.75)
							) && (
								<motion.div
									className={styles.severeWarning}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.5 }}>
									<p>One or more categories show high or severe risk. We recommend seeking help.</p>
									<a
										href="https://www.google.com/maps/search/mental+health+professionals+near+me"
										target="_blank"
										rel="noopener noreferrer"
										className={styles.getHelpLink}>
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
							whileTap={{ scale: 0.9 }}>
							Restart Evaluation
						</motion.button>
					</>
				) : started ? (
					<>
						<motion.h3 className={styles.questionText}>{questions[currentQuestionIndex].question}</motion.h3>
						<p className={styles.progressText}>
							Question {currentQuestionIndex + 1} of {questions.length}
						</p>
						<div className={styles.optionsContainer}>
							{[...Array(questions[currentQuestionIndex].scale + 1).keys()].map((index) => (
								<motion.button
									key={index}
									onClick={() => handleOptionSelect(index)}
									className={styles.optionButton}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}>
									{["Never", "Rarely", "Sometimes", "Often", "Always"][index] || `Option ${index}`}
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
							whileTap={{ scale: 0.9 }}>
							<ArrowLeft className="inline h-5 w-5 mr-2" /> Back to Dashboard
						</motion.button>
						{cameFromRL && isMood(currentMood) && <FeedbackComponent mood={currentMood} action="evaluation" />}
						<motion.h2 className={styles.evaluationTitle}>Mental Health Evaluation</motion.h2>
						<p className={styles.description}>
							This test includes questions for anxiety, stress, insomnia, depression, and self-esteem. Be honest for
							accurate insights.
						</p>
						<motion.button
							onClick={() => setStarted(true)}
							className={styles.startButton}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}>
							Start Evaluation
						</motion.button>
					</>
				)}
			</motion.div>
			{!feedbackGiven && (
				<div className="mt-6 p-4 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
					<p className="text-gray-800 font-semibold mb-3">🧘 Was this helpful?</p>
					<div className="flex justify-center gap-4">
						<button
							onClick={() => {
								const mood = localStorage.getItem("todayMood") || "unknown";
								logFeedback(mood, "evaluation", 1);
								setFeedbackGiven(true);
							}}
							className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
							Yes
						</button>
						<button
							onClick={() => {
								const mood = localStorage.getItem("todayMood") || "unknown";
								logFeedback(mood, "evaluation", 0);
								setFeedbackGiven(true);
							}}
							className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
							No
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Evaluation;
