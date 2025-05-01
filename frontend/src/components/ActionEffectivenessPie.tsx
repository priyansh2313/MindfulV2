import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type PieData = { name: string; value: number };
const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa", "#fb7185"];

export default function ActionEffectivenessPie() {
  const [data, setData] = useState<PieData[]>([]);
  const [availableMoods, setAvailableMoods] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string>("anxious");

  useEffect(() => {
    const stored = localStorage.getItem("feedback_log");
    if (!stored) return;

    try {
      const logs: { mood: string; action: string; reward: number }[] = JSON.parse(stored);
      const moods = [...new Set(logs.map((log) => log.mood))];
      setAvailableMoods(moods);

      filterByMood(selectedMood, logs);
    } catch (err) {
      console.error("Error parsing feedback_log:", err);
    }
  }, [selectedMood]);

  const filterByMood = (mood: string, logs: { mood: string; action: string; reward: number }[]) => {
    const filtered = logs.filter((log) => log.mood === mood);

    const grouped: Record<string, { total: number; count: number }> = {};
    filtered.forEach(({ action, reward }) => {
      if (!grouped[action]) grouped[action] = { total: 0, count: 0 };
      grouped[action].total += reward;
      grouped[action].count += 1;
    });

    const formatted: PieData[] = Object.entries(grouped).map(([name, { total, count }]) => ({
      name,
      value: count === 0 ? 0 : Math.round((total / count) * 100),
    }));

    setData(formatted);
  };

  return (
    <div className="text-white mt-10 p-4 rounded-lg bg-[#1e293b] shadow-xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">🎯 Action Effectiveness</h2>
      <div className="text-center mb-4">
        <label htmlFor="mood-select" className="mr-2">Filter by Mood:</label>
        <select
          id="mood-select"
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          {availableMoods.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}%`}
              isAnimationActive={true}
              animationDuration={800}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-sm text-gray-400">
          No feedback data available for mood: {selectedMood}
        </p>
      )}
    </div>
  );
}
