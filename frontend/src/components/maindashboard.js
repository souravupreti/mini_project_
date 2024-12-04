'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { MessageSquare, BookOpen, User, Users, Settings, LogOut, Home, Trophy, Heart, MessageCircle, Share2 } from 'lucide-react'
import ChallengeDashboard from './challengedashboard'
import GymResource from './resources'
import UserProfile from './profile'
import TrainerPage from './trainer'
import PersonalDashboard from './personalgoal'

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/details", {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
          withCredentials: true,
        })

        const userData = response.data
        setUserDetails(userData)

        if (userData?._id) {
          const postResponse = await axios.get(
            `http://localhost:4000/api/v1/user/${userData._id}/posts`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
              withCredentials: true,
            }
          )
          setPosts(postResponse.data)
        }
      } catch (error) {
        console.error("Error fetching user details or posts:", error)
      }
    }

    fetchUserDetails()
  }, [])

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', tab: 'dashboard' },
    // { icon: MessageSquare, label: 'Chat', tab: 'chat' },
    { icon: BookOpen, label: 'Resources', tab: 'resources' },
    { icon: Trophy, label: 'Challenges', tab: 'challenges' },
    { icon: Trophy, label: 'Personal Goal', tab: 'personalgoal' },
    { icon: User, label: 'Profile', tab: 'profile' },
    { icon: Users, label: 'Trainer', tab: 'trainer' },
    { icon: Settings, label: 'Settings', tab: 'settings' },
  ]

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post._id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personalgoal':
        return <div><PersonalDashboard /></div>
      case 'challenges':
        return <div><ChallengeDashboard /></div>
      case 'chat':
        return <div className="p-6"><h2 className="text-2xl font-bold text-white">Chat Section</h2></div>
      case 'resources':
        return <div><GymResource /></div>
      case 'profile':
        return <div><UserProfile /></div>
      case 'trainer':
        return <div><TrainerPage /></div>
      case 'settings':
        return <div className="p-6"><h2 className="text-2xl font-bold text-white">Settings Section</h2></div>
      case 'dashboard':
        return (
          <div className="overflow-auto h-[calc(100vh-2rem)] pr-4 space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 bg-black text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-500 overflow-hidden">
                      {post.userId.profilePicture ? (
                        <img
                          src={post.userId.profilePicture}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-600 text-white text-lg font-bold">
                          {post.userId?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    {/* User Info */}
                    <div>
                      <p className="font-semibold">{post.userId?.username || 'Unknown User'}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-lg leading-relaxed mb-4">{post.content}</p>

                  {/* Media (Image or Video) */}
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt="Post Media"
                      className="w-full h-auto mt-4 rounded-lg shadow-md"
                    />
                  )}

                  {/* Post Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-4">
                      <button
                        className="flex items-center gap-2 text-gray-300 hover:text-white"
                        onClick={() => handleLike(post._id)}
                      >
                        <Heart className="w-5 h-5" />
                        {post.likes} Likes
                      </button>
                      <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                        <MessageCircle className="w-5 h-5" />
                        Comment
                      </button>
                    </div>
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No posts available.</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 p-6">
        <nav className="space-y-4">
          {sidebarItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.tab
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-600">
          <p className="font-semibold">{userDetails?.username || 'Loading...'}</p>
          <button className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-black">
        {renderTabContent()}
      </main>
    </div>
  )
}
