import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'regenerator-runtime/runtime';
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
import Questionnaire from './pages/Questionnaire';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} /> {/* Landing page */}
        <Route path="/Questionnaire" element={<Questionnaire />} /> {/* Show 7 Questions first */}
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
        <Route path="/case-history" element={<CaseHistory />} /> {/* Redirect here after 7 Questions */}
      </Routes>
    </Router>
  );
}

export default App;
