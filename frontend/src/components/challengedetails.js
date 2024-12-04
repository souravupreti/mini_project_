'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useParams } from 'react-router-dom'

export default function ChallengeDetails() {
  const params = useParams()
  const challengeId = params?.challengeId
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [userProgress, setUserProgress] = useState([])
  const [followingUsers, setFollowingUsers] = useState([])
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/challenge/${challengeId}`, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          withCredentials: true
        })
        setChallenge(response.data.challenge)
        setIsJoined(response.data.challenge.participants.some((p) => p._id === Cookies.get('userId')))
        setUserProgress(generateMockProgress())
        setFollowingUsers(response.data.followingUsers || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching challenge details:', error)
        setLoading(false)
      }
    }

    fetchChallengeDetails()
  }, [challengeId])

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/details", {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          withCredentials: true
        })
        setUserDetails(response.data)
      } catch (error) {
        console.error("Error fetching user details:", error)
      }
    }

    fetchUserDetails()
  }, [])

  const handleJoinChallenge = async () => {
    try {
      await axios.post(`http://localhost:4000/api/v1/challenge/${challengeId}/join`, {}, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        withCredentials: true
      })
      setIsJoined(true)
      alert('You have joined the challenge!')
    } catch (error) {
      console.error('Error joining challenge:', error)
      alert('Failed to join the challenge. Please try again.')
    }
  }

  const handleFollowUser = async (username) => {
    if (!userDetails || !userDetails._id) {
      alert('User details are not loaded. Please try again later.')
      return
    }

    try {
      await axios.post(
        `http://localhost:4000/api/v1/user/follow`,
        { userId: userDetails._id, targetUsername: username },
        {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          withCredentials: true,
        }
      )

      setFollowingUsers((prev) => [...prev, username])
      alert('You are now following this user!')
    } catch (error) {
      console.error('Error following user:', error)
      alert('Failed to follow user. Please try again.')
    }
  }

  const generateMockProgress = () => {
    const progress = []
    const today = new Date()
    for (let i = 0; i < 10; i++) {
      if (Math.random() > 0.3) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        progress.push(date)
      }
    }
    return progress
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!challenge) {
    return <div className="p-8 text-center text-gray-500">Challenge not found</div>
  }

  return (
    <div className="container mx-auto p-6 bg-black text-white">
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-100">{challenge.name}</h1>
        <p className="text-gray-300 mt-2">{challenge.description}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Challenge Details</h2>
            <p>Streak Required: <span className="font-medium">{challenge.streakRequired} days</span></p>
            <p>Reward: <span className="font-medium">{challenge.rewardCoins} Coins</span></p>
            <p>Start Date: {new Date(challenge.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(challenge.endDate).toLocaleDateString()}</p>
            <button
              onClick={handleJoinChallenge}
              className={`mt-4 px-4 py-2 rounded-md text-white ${
                isJoined ? 'bg-gray-600' : 'bg-blue-800 hover:bg-blue-700'
              }`}
              disabled={isJoined}
            >
              {isJoined ? 'Joined Challenge' : 'Join Challenge'}
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-200 mb-2">Your Progress</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - i)
                const isComplete = userProgress.some(d => d.toDateString() === date.toDateString())
                return (
                  <div
                    key={i}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      isComplete ? 'bg-blue-600 text-white' : 'bg-gray-500'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Participants</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {challenge.participants.map((participant) => (
              <div key={participant.id} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-600 text-gray-100 flex items-center justify-center mx-auto">
                  {participant.username.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 text-gray-300">{participant.username}</p>
                {participant._id !== Cookies.get('token') && (
                  <button
                    onClick={() => handleFollowUser(participant.username)}
                    className={`mt-2 px-3 py-1 rounded-md border ${
                      followingUsers.includes(participant.username)
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-transparent text-gray-300 border-gray-500'
                    }`}
                    disabled={followingUsers.includes(participant.username)}
                  >
                    {followingUsers.includes(participant.username) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 bg-black text-white">
      <div className="bg-gray-800 shadow rounded-lg p-6">
        <div className="h-8 w-3/4 bg-gray-600 rounded-md mb-4"></div>
        <div className="h-4 w-full bg-gray-600 rounded-md mb-2"></div>
        <div className="h-4 w-full bg-gray-600 rounded-md mb-2"></div>
        <div className="h-4 w-full bg-gray-600 rounded-md"></div>
      </div>
    </div>
  )
}
