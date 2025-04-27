import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'regenerator-runtime/runtime';
import SleepCycleSection from './components/SleepCycleSection';
import CaseHistory from './pages/CaseHistory';
import Community from './pages/Community';
import DailyActivities from "./pages/DailyActivities";
import Dashboard from './pages/Dashboard';
import Encyclopedia from "./pages/Encyclopedia";
import Evaluation from './pages/Evaluation';
import ImageAnalyzer from './pages/ImageAnalyser';
import Introduction from './pages/Introduction';
import Journal from './pages/Journal';
import Login from './pages/Login';
import MindfulAssistant from './pages/MindfulAssistant';
import Music from './pages/Music';
import Profile from './pages/Profile';
import Questionnaire from './pages/Questionnaire';
import Signup from './pages/Signup';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/Questionnaire" element={<Questionnaire />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/community" element={<Community />} />
        <Route path="/music" element={<Music />} />
        <Route path="/image-analyzer" element={<ImageAnalyzer />} />
        <Route path="/assistant" element={<MindfulAssistant />} />
        <Route path="/encyclopedia" element={<Encyclopedia />} />
        <Route path="/daily-activities" element={<DailyActivities />} />
        <Route path="/case-history" element={<CaseHistory />} />
        <Route path="/SleepCycleSection" element={<SleepCycleSection />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
