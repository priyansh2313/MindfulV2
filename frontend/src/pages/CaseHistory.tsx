import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/CaseHistory.module.css"; // ✅ Scoped CSS

const caseHistoryQuestions = [
  "1️⃣ Do you have any past medical conditions?",
  "2️⃣ Have you undergone any surgeries or hospitalizations?",
  "3️⃣ Have you been diagnosed with any chronic illnesses?",
  "4️⃣ Are you currently taking any medications? If yes, please specify.",
  "5️⃣ Do you have any known allergies? If yes, please specify.",
  "6️⃣ Have you ever experienced any significant head injuries?",
  "7️⃣ Do you have a family history of mental health issues?",
  "8️⃣ Have you ever been diagnosed with a mental health condition?",
  "9️⃣ Have you ever received therapy or counseling? If yes, was it helpful?",
  "🔟 How would you describe your sleep patterns (insomnia, oversleeping, normal)?",
  "1️⃣1️⃣ Do you consume alcohol, tobacco, or any other substances? If yes, how often?",
  "1️⃣2️⃣ Have you experienced any major life stressors recently (loss, trauma, etc.)?",
  "1️⃣3️⃣ Do you have a strong support system (friends, family, therapist)?",
];

const CaseHistory = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(Array(caseHistoryQuestions.length).fill(""));

  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = () => {
    console.log("Submitted Case History:", responses);
    alert("Thank you for providing your case history!");
    navigate("/login");
  };

  return (
    <div className={styles.caseHistoryContainer}>
      <h1 className={styles.title}>📝 Case History Questions</h1>

      <div className={styles.questionsWrapper}>
        {caseHistoryQuestions.map((question, index) => (
          <div key={index} className={styles.questionBlock}>
            <p className={styles.question}>{question}</p>
            <textarea
              value={responses[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Your answer here..."
              className={styles.textInput}
            />
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Submit Case History
      </button>
    </div>
  );
};

export default CaseHistory;
