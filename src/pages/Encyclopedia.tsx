import { motion } from "framer-motion";
import { Moon, Search, Sun } from "lucide-react";
import { useState } from "react";

const disorders = [
  {
    name: "Generalized Anxiety Disorder (GAD)",
    description:
      "A condition characterized by excessive, uncontrollable worry about various aspects of life.",
    symptoms: [
      "Constant worry",
      "Restlessness",
      "Fatigue",
      "Difficulty concentrating",
      "Irritability",
    ],
    treatment: "Cognitive Behavioral Therapy (CBT), medication, and mindfulness techniques.",
  },
  {
    name: "Major Depressive Disorder (MDD)",
    description:
      "A mood disorder causing persistent feelings of sadness and loss of interest.",
    symptoms: [
      "Persistent sadness",
      "Loss of interest in activities",
      "Changes in appetite",
      "Fatigue",
      "Suicidal thoughts",
    ],
    treatment: "Therapy, antidepressants, exercise, and a strong support system.",
  },
  {
    name: "Obsessive-Compulsive Disorder (OCD)",
    description:
      "A disorder characterized by unwanted repetitive thoughts and compulsive behaviors.",
    symptoms: [
      "Obsessive thoughts",
      "Compulsive actions",
      "Fear of contamination",
      "Need for symmetry",
      "Intrusive thoughts",
    ],
    treatment: "CBT, exposure therapy, and medication.",
  },
  {
    name: "Post-Traumatic Stress Disorder (PTSD)",
    description:
      "A disorder that can develop after exposure to a traumatic event.",
    symptoms: [
      "Flashbacks",
      "Nightmares",
      "Severe anxiety",
      "Avoidance of reminders",
      "Hypervigilance",
    ],
    treatment: "Trauma-focused therapy, EMDR, and medications.",
  },
  {
    name: "Bipolar Disorder",
    description:
      "A mental illness causing extreme mood swings, including manic and depressive episodes.",
    symptoms: [
      "Extreme mood swings",
      "Impulsivity",
      "Euphoria",
      "Fatigue",
      "Suicidal thoughts",
    ],
    treatment: "Mood stabilizers, therapy, and lifestyle adjustments.",
  },
];

const Encyclopedia = () => {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const filteredDisorders = disorders.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={
      `min-h-screen p-6 transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`
    }>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mental Health Encyclopedia</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-110 transition"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for a disorder..."
            className="w-full p-4 rounded-lg border focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-4 top-4 h-5 w-5 text-gray-400" />
        </div>

        <div className="space-y-6">
          {filteredDisorders.length > 0 ? (
            filteredDisorders.map((disorder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg border-l-4 border-indigo-500"
              >
                <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{disorder.name}</h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{disorder.description}</p>
                <h3 className="mt-4 font-semibold">Symptoms:</h3>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                  {disorder.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
                <h3 className="mt-4 font-semibold">Treatment:</h3>
                <p className="text-gray-700 dark:text-gray-300">{disorder.treatment}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500">No disorders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Encyclopedia;
