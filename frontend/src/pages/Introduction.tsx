import { Brain, Cloud, Eye, Heart, Moon, Smile, Star, Sun } from "lucide-react"; // Icons
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Introduction.module.css";



const Introduction = () => {
  const navigate = useNavigate();



  const cursorRef = useRef<HTMLDivElement>(null);

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (cursorRef.current) {
    const x = `${e.clientX}px`;
    const y = `${e.clientY}px`;
    cursorRef.current.style.setProperty("--x", x);
    cursorRef.current.style.setProperty("--y", y);
  }
};


  return (

    
    <div className={styles.container} onMouseMove={handleMouseMove}>
  <div className={styles.gradientCursor} ref={cursorRef} />
      {/* Animated Stars Background */}
<div className={styles.starryBackground}>
  {Array.from({ length: 60 }).map((_, i) => (
    <div
      key={i}
      className={styles.star}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 5}s`,
      }}
    />
  ))}
</div>

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
