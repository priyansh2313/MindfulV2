import { motion } from "framer-motion";
import { Search } from "lucide-react";
import React, { useState } from "react";
import styles from "../styles/Encyclopedia.module.css";
import FloatingChatbot from "./FloatingChatbot";

const disorders = [
  {
    name: "Generalized Anxiety Disorder (GAD)",
    description: "A condition characterized by excessive, uncontrollable worry about various aspects of life.",
    symptoms: ["Constant worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability"],
    treatment: "Cognitive Behavioral Therapy (CBT), medication, and mindfulness techniques.",
    image: "https://images.unsplash.com/photo-1557825835-78a94f193ed2" // anxious woman
  },
  {
    name: "Major Depressive Disorder (MDD)",
    description: "A mood disorder causing persistent feelings of sadness and loss of interest.",
    symptoms: ["Persistent sadness", "Loss of interest in activities", "Changes in appetite", "Fatigue", "Suicidal thoughts"],
    treatment: "Therapy, antidepressants, exercise, and a strong support system.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" // sad person silhouette
  },
  {
    name: "Panic Disorder",
    description: "A disorder causing sudden, intense episodes of fear (panic attacks) without a clear trigger.",
    symptoms: ["Rapid heartbeat", "Shortness of breath", "Dizziness", "Sweating", "Fear of losing control"],
    treatment: "Cognitive therapy, medication, and relaxation techniques.",
    image: "https://images.unsplash.com/photo-1603570419885-3d2e3bba36c3" // breathing panic
  },
  {
    name: "Schizophrenia",
    description: "A severe mental disorder affecting thoughts, emotions, and behaviors, often including hallucinations.",
    symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Lack of motivation", "Social withdrawal"],
    treatment: "Antipsychotic medication, therapy, and psychosocial support.",
    image: "https://images.unsplash.com/photo-1558981033-0a93f05cc0e9" // abstract confusion
  },
  {
    name: "Obsessive-Compulsive Disorder (OCD)",
    description: "A disorder characterized by unwanted repetitive thoughts and compulsive behaviors.",
    symptoms: ["Obsessive thoughts", "Compulsive actions", "Fear of contamination", "Need for symmetry", "Intrusive thoughts"],
    treatment: "CBT, exposure therapy, and medication.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28cf" // organized pens
  },
  {
    name: "Post-Traumatic Stress Disorder (PTSD)",
    description: "A disorder that can develop after exposure to a traumatic event.",
    symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Avoidance of reminders", "Hypervigilance"],
    treatment: "Trauma-focused therapy, EMDR, and medications.",
    image: "https://images.unsplash.com/photo-1548095115-45697e01925f" // soldier shadow
  },
  {
    name: "Borderline Personality Disorder (BPD)",
    description: "A mental illness characterized by unstable moods, behavior, and relationships.",
    symptoms: ["Fear of abandonment", "Intense mood swings", "Impulsive behavior", "Self-harm", "Unstable self-image"],
    treatment: "Dialectical Behavioral Therapy (DBT), mood stabilizers, and emotional regulation strategies.",
    image: "https://images.unsplash.com/photo-1514632953535-573adf31c0f2" // emotional woman
  },
  {
    name: "Bipolar Disorder",
    description: "A mental illness causing extreme mood swings, including manic and depressive episodes.",
    symptoms: ["Extreme mood swings", "Impulsivity", "Euphoria", "Fatigue", "Suicidal thoughts"],
    treatment: "Mood stabilizers, therapy, and lifestyle adjustments.",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d" // expressive face
  },
  {
    name: "Attention Deficit Hyperactivity Disorder (ADHD)",
    description: "A neurodevelopmental disorder affecting attention, impulse control, and hyperactivity.",
    symptoms: ["Inattention", "Impulsivity", "Hyperactivity", "Disorganization", "Difficulty focusing"],
    treatment: "Medication, behavioral therapy, and time management strategies.",
    image: "https://images.unsplash.com/photo-1582719478148-40a4e4c3b5b1" // kid running classroom
  },
  {
    name: "Eating Disorders (Anorexia & Bulimia)",
    description: "Severe disturbances in eating behavior related to body image concerns.",
    symptoms: ["Extreme weight loss or gain", "Obsession with food", "Binge eating", "Self-induced vomiting", "Excessive exercise"],
    treatment: "Nutritional counseling, therapy, and medication.",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1d5" // empty plate
  },
  {
    name: "Social Anxiety Disorder (SAD)",
    description: "An intense fear of social situations, leading to avoidance behavior.",
    symptoms: ["Fear of social interaction", "Blushing", "Sweating", "Trembling", "Avoidance of public speaking"],
    treatment: "CBT, exposure therapy, and anti-anxiety medication.",
    image: "https://images.unsplash.com/photo-1518081461904-9d8de7b413d5" // isolated person
  },
  {
    name: "Dissociative Identity Disorder (DID)",
    description: "A disorder where two or more distinct identities control an individual’s behavior.",
    symptoms: ["Multiple identities", "Memory gaps", "Emotional detachment", "Depersonalization", "Confusion about identity"],
    treatment: "Trauma-focused therapy and integration techniques.",
    image: "https://images.unsplash.com/photo-1541516160071-84f0f88cdd3f" // masks and identity
  },
  {
    name: "Seasonal Affective Disorder (SAD - Winter Depression)",
    description: "A type of depression that occurs at certain times of the year, usually in winter.",
    symptoms: ["Low energy", "Irritability", "Oversleeping", "Weight gain", "Feeling hopeless"],
    treatment: "Light therapy, antidepressants, and vitamin D supplements.",
    image: "https://images.unsplash.com/photo-1607305387296-07c6d2f683ed" // winter window
  }
];



const Encyclopedia = () => {
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const filteredDisorders = disorders.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((prev) => !prev)}
        hoveredSection={"encyclopedia"}
        mode="encyclopedia"
      />

      <div className={styles.wrapper}>
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

        <div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginBottom: "20px",
						fontSize: "30px",
						color: "red",
					}}>
					<marquee>
						⚠️ Disclaimer Mindful AI is a supportive tool,<strong> not a diagnosis or treatment</strong>. For severe mental health
						issues, consult a professional.
					</marquee>
				</div>

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
                <img src={disorder.image} alt={disorder.name} className={styles.cardImage} />
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
    </>
  );
};

export default Encyclopedia;
