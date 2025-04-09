import { Brain, Cloud, Eye, Heart, Moon, Smile, Star, Sun } from "lucide-react"; // Icons
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Introduction.module.css";

const Introduction = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Floating Icons */}
      <div className={styles.floatingIcons}>
        <Brain className={styles.icon} />
        <Heart className={styles.icon} />
        <Smile className={styles.icon} />
        <Sun className={styles.icon} />
        <Star className={styles.icon} />
        <Moon className={styles.icon} />
        <Cloud className={styles.icon} />
        <Eye className={styles.icon} />
      </div>

      {/* Glass Container with Light Ray */}
      <div className={styles.glassContainer}>
        <div className={styles.lightRay}></div>
        <h1 className={styles.title}>Welcome to Mindful AI</h1>
        <p className={styles.subtitle}>
          Let's understand your mental well-being.
        </p>
        
        {/* Start Assessing Button */}
        <button className={styles.startButton} onClick={() => navigate("/questionnaire")}>
          Start Assessing
        </button>
      </div>
    </div>
  );
};

export default Introduction;
