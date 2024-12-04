import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import axios from 'axios';

const Header = ({ isLoggedIn, onLogout }) => {
  const [userName, setUserName] = useState('Guest');
  const [profileImageSeed, setProfileImageSeed] = useState('Guest');

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/user/details', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        withCredentials: true,
      });
      const { username } = response.data;
      setUserName(username || 'User');
      setProfileImageSeed(response.data.profilePicture);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserName('User'); // Fallback in case of error
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-black to-indigo-800 shadow-md p-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Branding */}
        <Link to="/home">
          <p className="text-xl font-bold text-teal-400 mx-5">
            Fitness<span className="text-yellow-400">Streak</span>
          </p>
        </Link>

        {/* Profile & Logout */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 mx-5">
              <img
                src={profileImageSeed}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="text-white">{userName}</span>
            </div>

            <button
              className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-300"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-8 mx-5">
            <Link to="/login">
              <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition duration-300">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
