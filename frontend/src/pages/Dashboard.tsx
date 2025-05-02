import { motion } from "framer-motion";
import {
  Activity,
  Book,
  Brain,
  ClipboardCheck,
  Image,
  Lightbulb,
  LogOut,
  MapPin,
  MessageSquareHeart,
  Moon,
  Music,
  Smile,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ActionEffectivenessPie from "../components/ActionEffectivenessPie";
import EvaluationGraph from "../pages/EvaluationGraph";
import FloatingChatbot from "../pages/FloatingChatbot";
import FloatingLeaves from "../pages/FloatingLeaves";
import styles from "../styles/Dashboard.module.css";
import { chooseAction, initQTable } from "../utils/reinforcement";


const qTable = initQTable();
const mood = localStorage.getItem("todayMood") as any;


// 👇 Add this if VANTA.CLOUDS is available as module

const tips = [
  "Take a 10-minute walk to clear your mind.",
  "Practice deep breathing for 2 minutes.",
  "Journal your thoughts before bed.",
  "Drink a full glass of water to reset.",
  "Check in with a friend today.",
];




function interpretMood(emoji: string): 'happy' | 'neutral' | 'sad' | 'anxious' {
  switch (emoji) {
    case '😄':
    case '🙂':
      return 'happy';
    case '😐':
      return 'neutral';
    case '😕':
      return 'anxious';
    case '😢':
      return 'sad';
    default:
      return 'neutral';
  }
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [showSection, setShowSection] = useState(false);
  const [mood, setMood] = useState(localStorage.getItem("todayMood") || "");
  const [tip, setTip] = useState(tips[Math.floor(Math.random() * tips.length)]);
  const [progress, setProgress] = useState(0);
  const [moodHistory, setMoodHistory] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [recommendedContent, setRecommendedContent] = useState<string | null>(null);


  // 👇 Vanta setup
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowSection(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("moodHistory") || "[]");
    setMoodHistory(stored);

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 1;
      if (progressValue <= 70) setProgress(progressValue);
      else clearInterval(interval);
    }, 20);
  }, []);

  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const source = localStorage.getItem("rl_action_source");
    if (source === "music") {
      setShowPrompt(true);
      localStorage.removeItem("rl_action_source"); // clear it after use
    }
  }, []);
  


  

  const handleMoodChange = (emoji: string) => {
    setMood(emoji);
    localStorage.setItem("todayMood", emoji);
    const updatedHistory = [...moodHistory, emoji].slice(-5);
    setMoodHistory(updatedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
  
    // ✅ RL: choose next best action (section)
    const rlMood = interpretMood(emoji);
    const content = chooseAction(rlMood, qTable);
    setRecommendedContent(content);
  
    // ✅ Route map based on RL action
    const redirectMap: Record<string, string> = {
      music: "/music",
      quote: "/journal", // assume reflective writing
      breathing: "/daily-activities",
      journal_prompt: "/evaluation", // or any suitable page
    };
  
    const path = redirectMap[content];
    if (path) {
      navigate(path);
    }
    localStorage.setItem("rl_action_source", content);
navigate(path);

  };

  


  const refreshTip = () => {
    let newTip = tip;
    while (newTip === tip) {
      newTip = tips[Math.floor(Math.random() * tips.length)];
    }
    setTip(newTip);
  };

  return (
    <div  className={styles.dashboardContainer}>
      <FloatingLeaves />
      <div className={styles.dashboardPanel}>
        <nav className={styles.dashboardNav}>
          <h1 className={styles.dashboardTitle}>MINDFUL AI</h1>
          <div className={styles.navButtons}>
            <button onClick={() => navigate("/nearby-professionals")} className={styles.mapButton} title="Find Nearby Professionals">
              <MapPin size={20} />
            </button>
            <button onClick={() => navigate("/profile")} className={styles.profileButton} title="My Profile">
              <Smile size={20} />
            </button>
            <button onClick={() => navigate("/")} className={styles.logoutButton}>
              <LogOut className={styles.logoutIcon} /> Logout
            </button>
          </div>
        </nav>

        <div className={styles.dashboardGrid}>
          <DashboardCard title="Evaluation Test" description="Take an assessment" icon={<ClipboardCheck className={styles.cardIcon} />} onClick={() => navigate("/evaluation")} onHoverEnter={() => setHoveredSection("Evaluation Test")}
  onHoverLeave={() => setHoveredSection(null)}/>
          <DashboardCard title="Journal" description="Record your thoughts" icon={<Book className={styles.cardIcon} />} onClick={() => navigate("/journal")} onHoverEnter={() => setHoveredSection("Journal")}
  onHoverLeave={() => setHoveredSection(null)} />
          <DashboardCard title="Community Chat" description="Connect with others" icon={<Users className={styles.cardIcon} />} onClick={() => navigate("/community")} onHoverEnter={() => setHoveredSection("Community Chat")}
  onHoverLeave={() => setHoveredSection(null)} />
          <DashboardCard title="Peaceful Music" description="Listen to calming sounds" icon={<Music className={styles.cardIcon} />} onClick={() => navigate("/music")} onHoverEnter={() => setHoveredSection("Peaceful Music")}
  onHoverLeave={() => setHoveredSection(null)}/>
          <DashboardCard title="Mindful Assistant" description="Get AI support" icon={<MessageSquareHeart className={styles.cardIcon} />} onClick={() => navigate("/assistant")} onHoverEnter={() => setHoveredSection("Mindful Assistant")}
  onHoverLeave={() => setHoveredSection(null)} />
          <DashboardCard title="Encyclopedia" description="Learn about mental health" icon={<Brain className={styles.cardIcon} />} onClick={() => navigate("/encyclopedia")} onHoverEnter={() => setHoveredSection("Encyclopedia")}
  onHoverLeave={() => setHoveredSection(null)}/>
          <DashboardCard title="Daily Activities" description="Mindfulness exercises" icon={<Activity className={styles.cardIcon} />} onClick={() => navigate("/daily-activities")} onHoverEnter={() => setHoveredSection("Daily Activities")}
  onHoverLeave={() => setHoveredSection(null)} />
          <DashboardCard title="Image Analyzer" description="Analyze your images" icon={<Image className={styles.cardIcon} />} onClick={() => navigate("/image-analyzer")} onHoverEnter={() => setHoveredSection("Image Analyzer")}
  onHoverLeave={() => setHoveredSection(null)} />
  <DashboardCard title="Sleep Cycle Analysis" description="Analysing your sleep for better mental health" icon={<Moon className={styles.cardIcon} />} onClick={() => navigate("/SleepCycleSection")} onHoverEnter={() => setHoveredSection("SleepCycleSection")}
  onHoverLeave={() => setHoveredSection(null)} />
        </div>
      </div>

      {showSection && (
        <motion.div
          className={styles.scrollRevealSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className={styles.scrollPanel}>
            <img src="./images/logo.png" alt="Mental Health Support" className={styles.scrollImage} />
            <div className={styles.scrollContent}>
              <h2 className={styles.scrollTitle}>Mental Health, <span className={styles.highlight}>Redefined</span></h2>
              <p className={styles.scrollDescription}>Your mental health matters. Access support anytime, anywhere.</p>
              <button className={styles.ctaButton}>Learn More</button>
            </div>
          </div>
        </motion.div>
      )}

      <div className={styles.analyticsSection}>
        <h2 className={styles.analyticsHeading}>Your Analytics</h2>
        {localStorage.getItem("evaluationScore") && (
          <div className={styles.graphContainer}>
            <EvaluationGraph />
          </div>
        )}

<div className={styles.dashboardWidgets}>
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}><Smile /> Select your current mood </div>
            <div className={styles.moodOptions}>
              {["😄", "🙂", "😐", "😕", "😢"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleMoodChange(emoji)}
                  className={`${styles.moodButton} ${mood === emoji ? styles.activeMood : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <p className={styles.widgetNote}>Today's Mood: <strong>{mood || "Not set"}</strong></p>
            {moodHistory.length > 0 && (
              <p className={styles.moodHistory}>
                Last Moods: {moodHistory.map((m, i) => <span key={i} className={styles.historyEmoji}>{m}</span>)}
              </p>
            )}
          </div>

          <div className={styles.widgetCard}>
  
  <p className={styles.widgetNote}>Which activities helped most when anxious</p>
  <ActionEffectivenessPie />
</div>

          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}><TrendingUp /> Daily Progress</div>
            <div className={styles.progressCircle}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path
                  className={styles.circle}
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <p className={styles.percentageText}>{progress}%</p>
            </div>
            <p className={styles.widgetNote}>You're doing great! Keep it up 💪</p>
          </div>

          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}><Lightbulb /> Mental Health Tip</div>
            <p className={styles.widgetTip}>{tip}</p>
            <button onClick={refreshTip} className={styles.tipRefreshButton}>Refresh Tip</button>
            
          </div>
        </div>
      </div>

      <FloatingChatbot
  isOpen={showChat}
  onToggle={() => setShowChat((prev) => !prev)}
  hoveredSection={hoveredSection}
  mode="dashboard"
  
/>

    </div>
  );
};

const DashboardCard = ({ title, description, icon, onClick, onHoverEnter, onHoverLeave }) => (
  <div onClick={onClick} onMouseEnter={onHoverEnter} onMouseLeave={onHoverLeave} className={styles.dashboardCard}>
    <div className={styles.cardContent}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.cardText}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;