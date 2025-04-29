// components/EvaluationGraph.tsx
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import axios from "../hooks/axios/axios";
import Loader from "../hooks/Loader/Loader";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EvaluationGraph = () => {
    const rawScore = localStorage.getItem("evaluationScore");
    const score = rawScore ? parseInt(rawScore, 10) : 0;
    const maxScore = 20;
    const [results, setResults] = useState<number[]>([]); // Array of numbers
    const [resultsLoading, setResultsLoading] = useState(false);

    useEffect(() => {
        setResultsLoading(true);
        axios
            .get("/test", { withCredentials: true })
            .then(({ data }) => {
                // Assuming `data` is an array of objects with a `score` property
				const percentages = data.testResults.map((doc: any) => (doc.score / maxScore) * 100); // Convert scores to percentages
				console.log("Percentages:", percentages); // Debugging
                setResults(percentages);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setResultsLoading(false);
            });
    }, []);

    const getFeedback = () => {
        if (score / maxScore <= 0.25) return { text: "You're doing well. Keep it up!", color: "#4ade80" }; // green
        if (score / maxScore <= 0.5) return { text: "Mild concern. A little self-care goes a long way.", color: "#facc15" }; // yellow
        if (score / maxScore <= 0.75) return { text: "Moderate risk. Consider talking to someone.", color: "#f97316" }; // orange
        return { text: "High risk. Please reach out for help.", color: "#ef4444" }; // red
    };

    const feedback = getFeedback();

    const data = {
        labels: results.map((_, index) => `Test ${index + 1}`), // Generate labels dynamically
        datasets: [
            {
                label: "Evaluation Score (%)",
                data: resultsLoading ? [] : results, // Use the array of percentages
                backgroundColor: results.map(() => feedback.color), // Apply feedback color to all bars
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
        <div
            style={{
                width: "100%",
                maxWidth: 500,
                margin: "3rem auto",
                background: "rgba(255, 255, 255, 0.06)",
                borderRadius: "12px",
                padding: "2rem",
                backdropFilter: "blur(6px)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                textAlign: "center",
                color: "#fff",
            }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", fontWeight: "600" }}>🧠 Your Evaluation Summary</h2>

            <Bar data={data} options={options} />

            <p
                style={{
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
