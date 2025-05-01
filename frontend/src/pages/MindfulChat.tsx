// Updated MindfulChat.tsx with RL integration

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchChatResponse } from "../api/chatAPI";
import styles from "../styles/MindfulChat.module.css";
import { detectMoodFromInput, getRecommendedActionForMood } from "../utils/reinforcement";

type MindfulChatProps = {
  mode: "dashboard" | "evaluation" | "exercise";
  setInstructorMode?: (active: boolean) => void;
};

export default function MindfulChat({ mode, setInstructorMode }: MindfulChatProps) {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);


  const isUrgent = mode === "evaluation";
  const isExercise = mode === "exercise";

  useEffect(() => {
    if (isUrgent) {
      setMessages([{ sender: "bot", text: "🚨 It looks like you might benefit from talking to someone. Would you like me to find a nearby professional?" }]);
    } else if (isExercise) {
      setMessages([{ sender: "bot", text: "🌿 Which mindfulness exercise would you like to try?\n(Breathing / Body Scan / Gratitude / Grounding)" }]);
    } else {
      setMessages([{ sender: "bot", text: "Hey 👋 I'm here to support you. How are you feeling today?" }]);
    }
  }, [isUrgent, isExercise]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
  
    const lowerInput = input.toLowerCase();
  
    if (mode === "dashboard") {
      // ✅ First: handle "yes" reply to RL suggestion
      if (lowerInput === "yes") {
        const route = localStorage.getItem("rl_next_action");
        if (route) {
          localStorage.removeItem("rl_next_action");
          setLoading(false);
          navigate(route);
          return;
        }
      }
  
      // ✅ Then: handle mood detection + RL recommendation
      const mood = detectMoodFromInput(lowerInput);
      if (mood) {
        const recommendation = getRecommendedActionForMood(mood);
  
        const suggestionMap: Record<string, string> = {
          music: "some calming music 🎵",
          quote: "a reflective journal entry ✍️",
          breathing: "a deep breathing session 🧘",
          journal_prompt: "an emotional evaluation 📔",
        };
  
        const redirectMap: Record<string, string> = {
          music: "/music",
          quote: "/journal",
          breathing: "/daily-activities",
          journal_prompt: "/evaluation",
        };
  
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `I hear you're feeling that way. Based on your mood, I recommend ${suggestionMap[recommendation]}. Want to go there? (yes/no)`,
          },
        ]);
  
        localStorage.setItem("rl_next_action", redirectMap[recommendation]);
        setLoading(false);
        return;
      }
    }
  
    try {
      if (isExercise) {
        if (lowerInput.includes("breathing")) {
          startBreathingCoaching();
          setInstructorMode?.(true);
        } else if (lowerInput.includes("body scan")) {
          startBodyScanCoaching();
          setInstructorMode?.(true);
        } else if (lowerInput.includes("gratitude")) {
          startGratitudeCoaching();
          setInstructorMode?.(true);
        } else if (lowerInput.includes("grounding")) {
          startGroundingCoaching();
          setInstructorMode?.(true);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "🌟 Please choose: Breathing, Body Scan, Gratitude, or Grounding!" },
          ]);
        }
      } else {
        const botReply = await fetchChatResponse(userMessage.text, isUrgent ? "evaluation" : "dashboard");
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
  
        if (isUrgent && lowerInput.includes("yes")) {
          setTimeout(() => {
            window.open("https://www.google.com/maps/search/mental+health+professional+near+me/", "_blank");
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Something went wrong. 😢" }]);
    }
  
    setLoading(false);
  };
  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startBreathingCoaching = () => {
    setVideoUrl("https://www.youtube.com/embed/LiUnFJ8P4gM?si=vyjy4xnHtRRw2VJP");
    setMessages(prev => [
      ...prev,
      { sender: "bot", text: "🫁 Let's practice Box Breathing together." },
      { sender: "bot", text: "Inhale slowly for 4 seconds... 🌬️" },
      { sender: "bot", text: "Hold your breath for 4 seconds... ⏳" },
      { sender: "bot", text: "Exhale gently for 4 seconds... 🍃" },
      { sender: "bot", text: "Hold again for 4 seconds... 🧘‍♂️" },
      { sender: "bot", text: "Repeat for 5 rounds. Feel the calmness. 🌿" }
    ]);
  };

  const startBodyScanCoaching = () => {
    const bodySteps = [
      "🌀 Close your eyes softly.",
      "Focus on your toes... 👣",
      "Focus on your legs... 🦵",
      "Move your attention to your belly... 🌸",
      "Shift to your chest... 💖",
      "Feel your shoulders relaxing... 🧘‍♂️",
      "Relax your neck and jaw... 😌",
      "Feel your whole body as one peaceful flow. 🌿",
      "Thank you for the patience. You did great!😊"
    ];

    bodySteps.forEach((step, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: step }]);
      }, index * 4000);
    });
  };

  const startGratitudeCoaching = () => {
    const gratitudeSteps = [
      "🙏 Let's begin gratitude reflection.",
      "Think of one small thing you are grateful for today. ✨",
      "Hold it in your mind for a few seconds... 💖",
      "Now think of a second gratitude... 🌼",
      "Feel the warmth it brings to your heart. 🌞",
      "Now one last gratitude... 🕊️",
      "You are surrounded by blessings. 🌟",
      "Thank you for the patience. You did great!😊"
    ];

    gratitudeSteps.forEach((step, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: step }]);
      }, index * 4000);
    });
  };

  const startGroundingCoaching = () => {
    const groundingSteps = [
      "🌍 Let's ground ourselves together.",
      "5 things you can SEE around you. 👀",
      "4 things you can TOUCH. ✋",
      "3 things you can HEAR. 👂",
      "2 things you can SMELL. 👃",
      "1 thing you can TASTE. 👅",
      "You are present. You are safe. 🌱",
      "Thank you for the patience. You did great!😊"
    ];

    groundingSteps.forEach((step, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: step }]);
      }, index * 4000);
    });
  };

  
  

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          
        ))}
        {loading && (
          <div className={styles.botMessage}>
            <div className={styles.typingBubble}>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
              <span className={styles.typingDot}></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>


      {videoUrl && (
      <div className="mt-6 flex justify-center">
        <iframe
          width="360"
          height="215"
          src={videoUrl}
          title="Mindfulness Exercise Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      </div>
    )}

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Tell me how you feel..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className={styles.inputBox}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          ➤
        </button>
      </div>
    </div>
  );
}
