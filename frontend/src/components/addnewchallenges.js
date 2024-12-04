import React, { useState } from 'react';
import { X, Plus, Coins, Calendar, Flame } from 'lucide-react';
import axios from 'axios';

const AddNewChallenge = ({ onClose, onAddChallenge }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rewardCoins: 0,
    streakRequired: 0,
    duration: 0,
    challengeMedia: '',
    status: 'upcoming',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: 
        name === 'rewardCoins' || name === 'streakRequired' || name === 'duration'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/challenge/create', {
        ...formData,
      });
      
      console.log('Challenge created:', response.data);
      onAddChallenge(response.data); // Call the parent function with the created challenge
      onClose();
    } catch (error) {
      console.error('Error creating challenge:', error);
      // Handle error (e.g., show an alert or notification)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 to-violet-900 rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Add New Challenge</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Challenge Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="rewardCoins" className="block text-sm font-medium text-gray-300 mb-1">
                <Coins size={16} className="inline mr-1 text-teal-300" />
                Reward Coins
              </label>
              <input
                type="number"
                id="rewardCoins"
                name="rewardCoins"
                value={formData.rewardCoins}
                onChange={handleChange}
                min={0}
                className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="streakRequired" className="block text-sm font-medium text-gray-300 mb-1">
                <Flame size={16} className="inline mr-1 text-red-500" />
                Streak Required
              </label>
              <input
                type="number"
                id="streakRequired"
                name="streakRequired"
                value={formData.streakRequired}
                onChange={handleChange}
                min={0}
                className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
              <Calendar size={16} className="inline mr-1 text-blue-400" />
              Duration (days)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min={1}
              className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="challengeMedia" className="block text-sm font-medium text-gray-300 mb-1">Challenge Media URL</label>
            <input
              type="url"
              id="challengeMedia"
              name="challengeMedia"
              value={formData.challengeMedia}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 transition duration-300 flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Create Challenge
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewChallenge;
