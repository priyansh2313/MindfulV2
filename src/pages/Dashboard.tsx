import { motion } from "framer-motion";
import {
  Book,
  ClipboardCheck,
  LogOut,
  MessageSquareHeart,
  Music,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowSection(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1517898717281-8e4385a41802?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main Dashboard */}
      <div className="relative z-10 max-w-6xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10">
        <nav className="flex justify-between items-center pb-6 border-b border-white/20">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            MINDFUL AI 🧠
          </h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-white hover:text-red-400 transition-transform hover:scale-110"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </nav>

        {/* Dashboard Cards - Kept Unchanged */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          <DashboardCard title="Evaluation Test" description="Take an assessment" icon={<ClipboardCheck className="h-10 w-10 text-blue-400" />} onClick={() => navigate("/evaluation")} />
          <DashboardCard title="Journal" description="Record your thoughts" icon={<Book className="h-10 w-10 text-yellow-400" />} onClick={() => navigate("/journal")} />
          <DashboardCard title="Community Chat" description="Connect with others" icon={<Users className="h-10 w-10 text-green-400" />} onClick={() => navigate("/community")} />
          <DashboardCard title="Peaceful Music" description="Listen to calming sounds" icon={<Music className="h-10 w-10 text-purple-400" />} onClick={() => navigate("/music")} />
          <DashboardCard title="Mindful Assistant" description="Get AI support" icon={<MessageSquareHeart className="h-10 w-10 text-pink-400" />} onClick={() => navigate("/assistant")} />
          <DashboardCard title="Encyclopedia" description="Learn about mental health" icon={<MessageSquareHeart className="h-10 w-10 text-pink-400" />} onClick={() => navigate("/encyclopedia")} />
          <DashboardCard title="Daily Activities" description="Mindfulness exercises" icon={<MessageSquareHeart className="h-10 w-10 text-pink-400" />} onClick={() => navigate("/daily-activities")} />
        </div>
      </div>

      {/* New Section Appears on Scroll */}
      {showSection && (
        <motion.div
          className="mt-20 flex items-center justify-center w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center">
            <img
              src="https://source.unsplash.com/featured/?happy,person"
              alt="Mental Health Support"
              className="w-80 h-80 rounded-full object-cover mb-6 md:mb-0 md:mr-10"
            />
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-white">
                Mental Health, <span className="text-pink-400">Redefined</span>
              </h2>
              <p className="text-white/80 mt-4">
                Your mental health matters. Access support anytime, anywhere.
              </p>
              <button className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md hover:scale-105 transition-transform">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const DashboardCard = ({ title, description, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl p-6 cursor-pointer transform transition-all hover:scale-105 hover:bg-white/30 hover:border-white/50 hover:shadow-2xl"
  >
    <div className="flex items-center space-x-4">
      <div className="p-3 bg-white/10 rounded-full">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
