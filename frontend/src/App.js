import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from "./components/register.js";
import Login from "./components/login.js";
import AddNewChallenge from "./components/addnewchallenges.js";
import Header from "./components/header.js";
import UserProfile from './components/profile.js';
import ChallengeDashboard from './components/challengedashboard.js';
import Dashboard from './components/maindashboard.js';
import TrainerPage from './components/trainer.js';
import PersonalGoalDashboard from './components/personalgoal.js'; // Import PersonalGoalDashboard
import Cookies from 'js-cookie';
import { AuthProvider } from './AuthContext.js';
import ChallengeDetails from './components/challengedetails.js';
import ChallengePhotoUpload from './components/photo.js';
import GymResource from './components/resources.js';
import LandingPage from './components/details.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync isLoggedIn state with the cookie on app load and navigation
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []); // Runs on component mount and re-renders

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove('token'); // Remove the token cookie
    setIsLoggedIn(false);
  };

  // Ensure ProtectedRoute checks the token directly
  const ProtectedRoute = ({ element }) => {
    const token = Cookies.get('token'); // Re-check the token on every navigation
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <Router>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<LandingPage/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Protected Routes */}
          <Route path="/trainer" element={<ProtectedRoute element={<TrainerPage />} />} />
          <Route path="" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/challenge" element={<ProtectedRoute element={<ChallengeDashboard />} />} />
          <Route path="/addchallenges" element={<ProtectedRoute element={<AddNewChallenge />} />} />
          <Route path=":challengeId/upload-photo" element={<ProtectedRoute element={<ChallengePhotoUpload />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />
          <Route path="/goals" element={<ProtectedRoute element={<PersonalGoalDashboard />} />} /> {/* New route for Personal Goals */}
          <Route path="/challenge-details/:challengeId" element={<ChallengeDetails />} />
          <Route path="/resources" element={<ProtectedRoute element={<GymResource />} />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
