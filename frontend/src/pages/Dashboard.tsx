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
  Music,
  Smile,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EvaluationGraph from "../pages/EvaluationGraph";
import FloatingChatbot from "../pages/FloatingChatbot";
import styles from "../styles/Dashboard.module.css";

const tips = [
  "Take a 10-minute walk to clear your mind.",
  "Practice deep breathing for 2 minutes.",
  "Journal your thoughts before bed.",
  "Drink a full glass of water to reset.",
  "Check in with a friend today.",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [showSection, setShowSection] = useState(false);
  const [mood, setMood] = useState(localStorage.getItem("todayMood") || "");
  const [tip, setTip] = useState(tips[Math.floor(Math.random() * tips.length)]);
  const [progress, setProgress] = useState(0);
  const [moodHistory, setMoodHistory] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false); // ✅ moved inside

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

  const handleMoodChange = (emoji: string) => {
    setMood(emoji);
    localStorage.setItem("todayMood", emoji);
    const updatedHistory = [...moodHistory, emoji].slice(-5);
    setMoodHistory(updatedHistory);
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
  };

  const refreshTip = () => {
    let newTip = tip;
    while (newTip === tip) {
      newTip = tips[Math.floor(Math.random() * tips.length)];
    }
    setTip(newTip);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.dashboardPanel}>
        <nav className={styles.dashboardNav}>
          <h1 className={styles.dashboardTitle}>MINDFUL AI</h1>
          <div className={styles.navButtons}>
            <button
              onClick={() => navigate("/nearby-professionals")}
              className={styles.mapButton}
              title="Find Nearby Professionals"
            >
              <MapPin size={20} />
            </button>
            <button onClick={() => navigate("/")} className={styles.logoutButton}>
              <LogOut className={styles.logoutIcon} /> Logout
            </button>
          </div>
        </nav>

        <div className={styles.dashboardGrid}>
          <DashboardCard title="Evaluation Test" description="Take an assessment" icon={<ClipboardCheck className={styles.cardIcon} />} onClick={() => navigate("/evaluation")} />
          <DashboardCard title="Journal" description="Record your thoughts" icon={<Book className={styles.cardIcon} />} onClick={() => navigate("/journal")} />
          <DashboardCard title="Community Chat" description="Connect with others" icon={<Users className={styles.cardIcon} />} onClick={() => navigate("/community")} />
          <DashboardCard title="Peaceful Music" description="Listen to calming sounds" icon={<Music className={styles.cardIcon} />} onClick={() => navigate("/music")} />
          <DashboardCard title="Mindful Assistant" description="Get AI support" icon={<MessageSquareHeart className={styles.cardIcon} />} onClick={() => navigate("/assistant")} />
          <DashboardCard title="Encyclopedia" description="Learn about mental health" icon={<Brain className={styles.cardIcon} />} onClick={() => navigate("/encyclopedia")} />
          <DashboardCard title="Daily Activities" description="Mindfulness exercises" icon={<Activity className={styles.cardIcon} />} onClick={() => navigate("/daily-activities")} />
          <DashboardCard title="Image Analyzer" description="Analyze your images" icon={<Image className={styles.cardIcon} />} onClick={() => navigate("/image-analyzer")} />
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
            <img
              src="https://source.unsplash.com/featured/?happy,person"
              alt="Mental Health Support"
              className={styles.scrollImage}
            />
            <div className={styles.scrollContent}>
              <h2 className={styles.scrollTitle}>
                Mental Health, <span className={styles.highlight}>Redefined</span>
              </h2>
              <p className={styles.scrollDescription}>
                Your mental health matters. Access support anytime, anywhere.
              </p>
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
            <div className={styles.widgetHeader}><Smile /> Mood Tracker</div>
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

      {/* ✅ Floating chatbot now handled correctly */}
      <FloatingChatbot isOpen={showChat} onToggle={() => setShowChat((prev) => !prev)} />
    </div>
  );
};

const DashboardCard = ({ title, description, icon, onClick }) => (
  <div onClick={onClick} className={styles.dashboardCard}>
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
