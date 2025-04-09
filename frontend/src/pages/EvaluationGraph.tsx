// components/EvaluationGraph.tsx
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EvaluationGraph = () => {
  const rawScore = localStorage.getItem("evaluationScore");
  const score = rawScore ? parseInt(rawScore, 10) : 0;
  const maxScore = 20;
  const percentage = Math.min((score / maxScore) * 100, 100);

  const getFeedback = () => {
    if (percentage <= 25) return { text: "You're doing well. Keep it up!", color: "#4ade80" }; // green
    if (percentage <= 50) return { text: "Mild concern. A little self-care goes a long way.", color: "#facc15" }; // yellow
    if (percentage <= 75) return { text: "Moderate risk. Consider talking to someone.", color: "#f97316" }; // orange
    return { text: "High risk. Please reach out for help.", color: "#ef4444" }; // red
  };

  const feedback = getFeedback();

  const data = {
    labels: ["Your Score"],
    datasets: [
      {
        label: "Evaluation Score (%)",
        data: [percentage],
        backgroundColor: feedback.color,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 500,
      margin: "3rem auto",
      background: "rgba(255, 255, 255, 0.06)",
      borderRadius: "12px",
      padding: "2rem",
      backdropFilter: "blur(6px)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
      textAlign: "center",
      color: "#fff"
    }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", fontWeight: "600" }}>
        🧠 Your Evaluation Summary
      </h2>

      <Bar data={data} options={options} />

      <p style={{
        marginTop: "1.5rem",
        fontSize: "1rem",
        fontWeight: "500",
        color: feedback.color,
      }}>
        {feedback.text}
      </p>
    </div>
  );
};

export default EvaluationGraph;
