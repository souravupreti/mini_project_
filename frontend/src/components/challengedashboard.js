import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, X } from 'lucide-react';

export default function ChallengeDashboard() {
  const [challenges, setChallenges] = useState([]); // List of challenges
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    rewardCoins: '',
    duration: 0,
    status: '',
    startDate: '',
    streakRequired: '',
    endDate: '',
    challengeMedia: null,
  });
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false); // Modal state for creating new challenge
  const [userName, setUserName] = useState(''); // User's name
  const [isAdmin, setIsAdmin] = useState(false); // Check if the user is an admin
  const [joinedChallenges, setJoinedChallenges] = useState([]); // Challenges the user has joined

  // Fetch challenges and user data on mount
  useEffect(() => {
    fetchChallenges();
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewChallenge((prevChallenge) => ({
      ...prevChallenge,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  // Fetch the list of challenges
  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/challenge', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        withCredentials: true,
      });
  
      const currentDate = new Date(); // Get current date
  
      // Filter challenges: only show completed challenges with an end date >= current date
      const filteredChallenges = response.data.filter((challenge) => {
        const challengeEndDate = new Date(challenge.endDate);
        return challenge.status === 'completed' || challengeEndDate >= currentDate;
      });
      setChallenges(filteredChallenges); // Set filtered challenges state
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  // Fetch user data, including role (admin or regular user)
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/user/details', {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        withCredentials: true,
      });
      setUserName(response.data.username);
      setIsAdmin(response.data.role === 'admin'); // Set admin status based on role
      setJoinedChallenges(response.data.joinedChallenges); // Get challenges the user has joined
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const openChallengeDetails = (challengeId) => {
    window.open(`/challenge-details/${challengeId}`, '_blank'); // Open challenge details in a new tab
  };

  const openChallengePhoto = (challengeId) => {
    window.open(`${challengeId}/upload-photo/`, '_blank'); // Open challenge photos in a new tab
  };

  // Join challenge
  const joinChallenge = async (challengeId) => {
    try {
      const userDataResponse = await axios.get('http://localhost:4000/api/v1/user/details', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        withCredentials: true,
      });
      const userStreak = userDataResponse.data.streakCount;
  
      const challenge = challenges.find(c => c._id === challengeId);
      if (userStreak < challenge.streakRequired) {
        alert('You need a higher streak to join this challenge.');
        return;
      }
  
      const response = await axios.post(
        `http://localhost:4000/api/v1/challenge/${challengeId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          withCredentials: true,
        }
      );
  
      fetchChallenges(); // Refresh challenge list
      fetchUserData();   // Refresh user data
      alert('Successfully joined the challenge!');
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert(error.response?.data?.message || 'Failed to join challenge');
    }
  };

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();

    // Basic Validations
    if (!newChallenge.name || !newChallenge.description || !newChallenge.rewardCoins || 
        !newChallenge.startDate || !newChallenge.endDate) {
      alert('Please fill all required fields');
      return;
    }

    if (newChallenge.startDate >= newChallenge.endDate) {
      alert('Start date must be before the end date');
      return;
    }

    if (newChallenge.rewardCoins <= 0 || newChallenge.streakRequired < 0 || newChallenge.duration <= 0) {
      alert('Reward, streak required, and duration must be positive numbers');
      return;
    }

    const formData = new FormData();
    formData.append('name', newChallenge.name);
    formData.append('description', newChallenge.description);
    formData.append('rewardCoins', newChallenge.rewardCoins);
    formData.append('status', newChallenge.status || 'Upcoming');
    formData.append('streakRequired', newChallenge.streakRequired);
    formData.append('duration', newChallenge.duration);
    formData.append('startDate', newChallenge.startDate);
    formData.append('endDate', newChallenge.endDate);

    if (newChallenge.challengeMedia) {
      formData.append('challengeMedia', newChallenge.challengeMedia);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/challenge/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        withCredentials: true,
      });

      alert('Challenge Created Successfully!');
      setIsChallengeModalOpen(false);  // Close the modal after successful creation
      setNewChallenge({  // Reset form fields
        name: '',
        description: '',
        rewardCoins: '',
        duration: 0,
        status: '',
        startDate: '',
        streakRequired: '',
        endDate: '',
        challengeMedia: null,
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Unexpected error occurred');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-8 text-white"
          >
            Challenges Dashboard
          </motion.h2>

          {/* Only show "Create New Challenge" button if user is an admin */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChallengeModalOpen(true)}
              className="mb-6 px-6 py-3 bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Challenge</span>
            </motion.button>
          )}

          <AnimatePresence>
            {isChallengeModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={() => setIsChallengeModalOpen(false)}
              >
                <motion.div
                  initial={{ y: -100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900">Create Challenge</h3>
                    <button
                      onClick={() => setIsChallengeModalOpen(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleChallengeSubmit} className="space-y-4">
                    {/* Form inputs with black-and-white theme */}
                    <input
                      type="text"
                      name="name"
                      value={newChallenge.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                      placeholder="Challenge Name"
                    />
                    <textarea
                      name="description"
                      value={newChallenge.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                      placeholder="Challenge Description"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        name="rewardCoins"
                        value={newChallenge.rewardCoins}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                        placeholder="Reward Coins"
                      />
                      <input
                        type="number"
                        name="streakRequired"
                        value={newChallenge.streakRequired}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                        placeholder="Streak Required"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        name="startDate"
                        value={newChallenge.startDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                      />
                      <input
                        type="date"
                        name="endDate"
                        value={newChallenge.endDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Create Challenge
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {challenges.length === 0 ? (
              <p className="text-white">No challenges found.</p>
            ) : (
              challenges.map((challenge) => (
                <motion.div
                  key={challenge._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-6 rounded-lg shadow-md space-y-4"
                >
                  <h3 className="text-2xl font-semibold text-gray-900">{challenge.name}</h3>
                  <p className="text-gray-600">{challenge.description}</p>
                  <div className="space-x-4">
                    {challenge.status === 'completed' ? (
                      <p className="text-green-600 font-semibold">Challenge Completed</p>
                    ) : (
                      <>
                        <button
                          onClick={() => openChallengeDetails(challenge._id)}
                          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => openChallengePhoto(challenge._id)}
                          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          Upload Photo
                        </button>
                        {!joinedChallenges.includes(challenge._id) && (
                          <button
                            onClick={() => joinChallenge(challenge._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
                          >
                            Join Challenge
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
