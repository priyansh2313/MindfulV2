import emailjs from "emailjs-com";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Questionnaire.module.css"; // ✅ Import Scoped Styles

const questions = [
	"Feeling nervous, anxious, or on edge?",
	"Not being able to stop or control worrying?",
	"Worrying too much about different things?",
	"Trouble relaxing?",
	"Being so restless that it is hard to sit still?",
	"Becoming easily annoyed or irritable?",
	"Feeling afraid as if something awful might happen?",
];

const options = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
]

const Questionnaire = () => {
	const [responses, setResponses] = useState(Array(questions.length).fill("0"));
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const navigate = useNavigate();

	const handleChange = (index: number, value: string) => {
		const newResponses = [...responses];
		newResponses[index] = value;
		setResponses(newResponses);
	};

	const handleSubmit = () => {
		setShowEmailInput(true);
	};

	const handleSendReport = async () => {
		if (!email) {
			alert("Please enter a valid email address.");
			return;
    }
    
    const score = responses.reduce((acc, curr) => acc + parseInt(curr), 0);
    let result;
    if (score > 0 && score <= 4) {
      result = "Minimal Anxiety";
    } else if (score >= 5 && score <= 9) {
      result = "Mild Anxiety";
    } else if (score >= 10 && score <= 14) {
      result = "Moderate Anxiety";
    } else if (score >= 15 && score <= 21) {
      result = "Severe Anxiety";
    }

		try {
			await emailjs.send(
      "service_6dchref",
      "template_h7uqq2m",
      {
        email,
        subject: "Your Mental Health Assessment Report",
        Response1: options[responses[0]] || "N/A",
        Response2: options[responses[1]] || "N/A",
        Response3: options[responses[2]] || "N/A",
        Response4: options[responses[3]] || "N/A",
        Response5: options[responses[4]] || "N/A",
        Response6: options[responses[5]] || "N/A",
        Response7: options[responses[6]] || "N/A",
        TOTAL_SCORE: score,
        RESULT: result,
      },
      "AItht_OS3-C6_Q3nG"
    );

			alert("✅ Report sent successfully to " + email);
			setSubmitted(true);

			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error("Email sending failed:", error);
			alert("❌ Failed to send report. Try again.");
		}
	};

	return (
		<div className={styles.questionnaire_container}>
			{/* 🔥 Branding (Top-Left) */}
			<div className={styles.questionnaire_branding}>
				<img src="./images/logo.png" alt="Mindful AI Logo" className={styles.questionnaire_brainIcon} />
				<h1 className={styles.questionnaire_brandText}>MINDFUL AI</h1>
			</div>

			{/* Main Questionnaire Box */}
			<div className={styles.questionnaire_box}>
				{!submitted ? (
					<>
						<h2>Mental Health Questionnaire</h2>
						{questions.map((question, index) => (
							<div key={index} className={styles.questionnaire_block}>
								<p className={styles.questionnaire_question}>{question}</p>
								<select
									value={responses[index]}
									onChange={(e) => handleChange(index, e.target.value)}
									className={styles.questionnaire_dropdown}>
									<option value="0">Not at all</option>
									<option value="1">Several days</option>
									<option value="2">More than half the days</option>
									<option value="3">Nearly every day</option>
								</select>
							</div>
						))}

						{!showEmailInput ? (
							<button className={styles.questionnaire_submitBtn} onClick={handleSubmit}>
								Submit & Continue
							</button>
						) : (
							<>
								<input
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={styles.questionnaire_emailInput}
								/>
								<button className={styles.questionnaire_sendBtn} onClick={handleSendReport}>
									Send Report
								</button>
							</>
						)}
					</>
				) : (
					<div className={styles.questionnaire_successMessage}>
						<h2>✅ Report Sent Successfully!</h2>
						<p>
							Check your inbox at <strong>{email}</strong>.
						</p>
						<p>Redirecting to Case History...</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Questionnaire;



