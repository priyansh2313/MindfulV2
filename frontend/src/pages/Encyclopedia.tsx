import { motion } from "framer-motion";
import { Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import styles from "../styles/Encyclopedia.module.css"; // Importing CSS module

const disorders = [
  {
    name: "Generalized Anxiety Disorder (GAD)",
    description: "A condition characterized by excessive, uncontrollable worry about various aspects of life.",
    symptoms: ["Constant worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability"],
    treatment: "Cognitive Behavioral Therapy (CBT), medication, and mindfulness techniques.",
  },
  {
    name: "Major Depressive Disorder (MDD)",
    description: "A mood disorder causing persistent feelings of sadness and loss of interest.",
    symptoms: ["Persistent sadness", "Loss of interest in activities", "Changes in appetite", "Fatigue", "Suicidal thoughts"],
    treatment: "Therapy, antidepressants, exercise, and a strong support system.",
  },
  {
    name: "Panic Disorder",
    description: "A disorder causing sudden, intense episodes of fear (panic attacks) without a clear trigger.",
    symptoms: ["Rapid heartbeat", "Shortness of breath", "Dizziness", "Sweating", "Fear of losing control"],
    treatment: "Cognitive therapy, medication, and relaxation techniques.",
  },
  {
    name: "Schizophrenia",
    description: "A severe mental disorder affecting thoughts, emotions, and behaviors, often including hallucinations.",
    symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Lack of motivation", "Social withdrawal"],
    treatment: "Antipsychotic medication, therapy, and psychosocial support.",
  },
  {
    name: "Obsessive-Compulsive Disorder (OCD)",
    description: "A disorder characterized by unwanted repetitive thoughts and compulsive behaviors.",
    symptoms: ["Obsessive thoughts", "Compulsive actions", "Fear of contamination", "Need for symmetry", "Intrusive thoughts"],
    treatment: "CBT, exposure therapy, and medication.",
  },
  {
    name: "Post-Traumatic Stress Disorder (PTSD)",
    description: "A disorder that can develop after exposure to a traumatic event.",
    symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Avoidance of reminders", "Hypervigilance"],
    treatment: "Trauma-focused therapy, EMDR, and medications.",
  },
  {
    name: "Borderline Personality Disorder (BPD)",
    description: "A mental illness characterized by unstable moods, behavior, and relationships.",
    symptoms: ["Fear of abandonment", "Intense mood swings", "Impulsive behavior", "Self-harm", "Unstable self-image"],
    treatment: "Dialectical Behavioral Therapy (DBT), mood stabilizers, and emotional regulation strategies.",
  },
  {
    name: "Bipolar Disorder",
    description: "A mental illness causing extreme mood swings, including manic and depressive episodes.",
    symptoms: ["Extreme mood swings", "Impulsivity", "Euphoria", "Fatigue", "Suicidal thoughts"],
    treatment: "Mood stabilizers, therapy, and lifestyle adjustments.",
  },
  {
    name: "Attention Deficit Hyperactivity Disorder (ADHD)",
    description: "A neurodevelopmental disorder affecting attention, impulse control, and hyperactivity.",
    symptoms: ["Inattention", "Impulsivity", "Hyperactivity", "Disorganization", "Difficulty focusing"],
    treatment: "Medication, behavioral therapy, and time management strategies.",
  },
  {
    name: "Eating Disorders (Anorexia & Bulimia)",
    description: "Severe disturbances in eating behavior related to body image concerns.",
    symptoms: ["Extreme weight loss or gain", "Obsession with food", "Binge eating", "Self-induced vomiting", "Excessive exercise"],
    treatment: "Nutritional counseling, therapy, and medication.",
  },
  {
    name: "Social Anxiety Disorder (SAD)",
    description: "An intense fear of social situations, leading to avoidance behavior.",
    symptoms: ["Fear of social interaction", "Blushing", "Sweating", "Trembling", "Avoidance of public speaking"],
    treatment: "CBT, exposure therapy, and anti-anxiety medication.",
  },
  {
    name: "Dissociative Identity Disorder (DID)",
    description: "A disorder where two or more distinct identities control an individual’s behavior.",
    symptoms: ["Multiple identities", "Memory gaps", "Emotional detachment", "Depersonalization", "Confusion about identity"],
    treatment: "Trauma-focused therapy and integration techniques.",
  },
  {
    name: "Seasonal Affective Disorder (SAD - Winter Depression)",
    description: "A type of depression that occurs at certain times of the year, usually in winter.",
    symptoms: ["Low energy", "Irritability", "Oversleeping", "Weight gain", "Feeling hopeless"],
    treatment: "Light therapy, antidepressants, and vitamin D supplements.",
  }
];

const Encyclopedia = () => {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const filteredDisorders = disorders.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>📚 Mental Health Encyclopedia</h1>
          <button onClick={() => setDarkMode(!darkMode)} className={styles.themeToggle}>
            {darkMode ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
          </button>
        </div>

        {/* Search Bar */}
        <motion.div 
          className={styles.searchContainer}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            placeholder="🔍 Search for a disorder..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className={styles.searchIcon} />
        </motion.div>

        {/* Disorder Cards */}
        <div className={styles.cardContainer}>
          {filteredDisorders.length > 0 ? (
            filteredDisorders.map((disorder, index) => (
              <motion.div
                key={index}
                className={styles.card}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <h2 className={styles.cardTitle}>{disorder.name}</h2>
                <p className={styles.description}>{disorder.description}</p>
                <h3 className={styles.sectionTitle}>Symptoms:</h3>
                <ul className={styles.list}>
                  {disorder.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
                <h3 className={styles.sectionTitle}>Treatment:</h3>
                <p className={styles.description}>{disorder.treatment}</p>
              </motion.div>
            ))
          ) : (
            <p className={styles.noResults}>No disorders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Encyclopedia;
