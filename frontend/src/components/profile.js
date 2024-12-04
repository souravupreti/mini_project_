'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/user/details', {
          withCredentials: true,
        })
        setUser(response.data)
      } catch (err) {
        alert("Failed to fetch user data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  if (loading) return <LoadingSkeleton />

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto bg-black bg-opacity-70 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center p-6 border-b border-white">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-300 overflow-hidden">
            <img src={user.profilePicture} alt={user.username} className="h-full w-full object-cover" />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h2 className="text-3xl font-semibold">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-md text-sm">Level {user.level}</span>
              <span className="px-3 py-1 bg-gray-800 rounded-md text-sm">{user.streakCount} day streak</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Tabs user={user} />
        </div>
      </div>
    </div>
  )
}

function Tabs({ user }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      <div className="flex border-b mb-6 border-white">
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'overview' ? 'border-b-2 border-gray-300 font-semibold' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'achievements' ? 'border-b-2 border-gray-300 font-semibold' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button
          className={`flex-1 py-2 text-center ${activeTab === 'goals' ? 'border-b-2 border-gray-300 font-semibold' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
      </div>
      <div>
        {activeTab === 'overview' && <OverviewTab user={user} />}
        {activeTab === 'achievements' && <AchievementsTab achievements={user.achievements} completedChallenges={user.completedChallenges} />}
        {activeTab === 'goals' && <GoalsTab goals={user.personalGoals} />}
      </div>
    </div>
  )
}

function OverviewTab({ user }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard title="Coins" value={user.coins} />
      <StatCard title="Streak" value={`${user.streakCount} days`} />
      <StatCard title="Following" value={user.following.length} />
      <StatCard title="Followers" value={user.followers.length} />
      <div className="col-span-full bg-gray-800 p-4 rounded-md">
        <h3 className="font-semibold text-lg">Level Progress</h3>
        <div className="relative w-full h-2 bg-gray-500 mt-2">
          <div className="absolute top-0 left-0 h-full bg-white" style={{ width: `${(user.level % 10) * 10}%` }}></div>
        </div>
        <p className="text-sm text-gray-300 mt-2">
          Level {user.level} - {(user.level % 10) * 10}% to next level
        </p>
      </div>
    </div>
  )
}

function AchievementsTab({ achievements, completedChallenges }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Achievements</h3>
      {achievements.map((achievement, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-md">
          <h4 className="font-semibold">{achievement.name}</h4>
          <p className="text-sm text-gray-400">Reward: {achievement.rewardCoins} coins</p>
          <p className="text-sm text-gray-400">Completed on: {new Date(achievement.completionDate).toLocaleDateString()}</p>
        </div>
      ))}
      <h3 className="text-lg font-semibold mt-6">Completed Challenges</h3>
      {completedChallenges.map((challenge, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-md">
          <h4 className="font-semibold">Challenge Completed</h4>
          <p className="text-sm text-gray-400">Reward: {challenge.reward} coins</p>
          <p className="text-sm text-gray-400">Completed on: {new Date(challenge.completedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}

function GoalsTab({ goals }) {
  return (
    <div className="space-y-4">
      {goals.map((goal, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-md">
          <h4 className="font-semibold">{goal.title}</h4>
          <p className="text-sm text-gray-400">{goal.description}</p>
          <p className="text-sm text-gray-400">Target Date: {new Date(goal.targetDate).toLocaleDateString()}</p>
          <p className="text-sm text-gray-400">Status: {goal.status}</p>
        </div>
      ))}
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-md flex items-center justify-between">
      <h4 className="font-semibold">{title}</h4>
      {title === 'Coins' && (
        <div className="flex items-center space-x-2">
          <img 
            src="https://cdn.pixabay.com/animation/2024/08/15/20/58/20-58-49-129_512.gif" 
            alt="coin icon" 
            className="h-20 w-20"
          />
          <p className="text-2xl">{value}</p>
        </div>
      )}
      {title === 'Streak' && (
        <div className="flex items-center space-x-2">
          <span className="text-yellow-400 text-4xl">⚡</span> {/* Adding the ⚡ icon */}
          <p className="text-2xl">{value}</p>
        </div>
      )}
      {title !== 'Coins' && title !== 'Streak' && <p className="text-2xl">{value}</p>}
    </div>
  )
}


function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-4 md:p-8 text-white">
      <div className="max-w-4xl mx-auto bg-black bg-opacity-70 rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-400 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 w-40 bg-gray-400 mb-2"></div>
            <div className="h-4 w-60 bg-gray-400"></div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-400 rounded-md"></div>
          <div className="h-24 bg-gray-400 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}
