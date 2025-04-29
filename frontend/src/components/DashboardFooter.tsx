// src/components/DashboardFooter.tsx
import { Github, Instagram, Linkedin } from "lucide-react";
import React from "react";
import styles from "../styles/DashboardFooter.module.css";

const DashboardFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <h3>🧠 Mindful AI</h3>
        <p>Helping you feel better — one breath at a time.</p>
      </div>

      <div className={styles.right}>
        <a
          href="https://github.com/your-profile"
          target="_blank"
          rel="noreferrer"
          title="GitHub"
        >
          <Github size={20} />
        </a>
        <a
          href="https://instagram.com/your-handle"
          target="_blank"
          rel="noreferrer"
          title="Instagram"
        >
          <Instagram size={20} />
        </a>
        <a
          href="https://linkedin.com/in/your-profile"
          target="_blank"
          rel="noreferrer"
          title="LinkedIn"
        >
          <Linkedin size={20} />
        </a>
      </div>
    </footer>
  );
};

export default DashboardFooter;
