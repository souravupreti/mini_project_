'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function TrainerPage() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [showAddTrainerForm, setShowAddTrainerForm] = useState(false)
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    specialization: '',
    experience: '',
    amount: '',
    availability: { days: [] },
    bio: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainersRes, userRes] = await Promise.all([
          axios.get('http://localhost:4000/api/v1/trainer/'),
          axios.get('http://localhost:4000/api/v1/user/details', {
            withCredentials: true,
          }),
        ])
        setTrainers(trainersRes.data)
        setUser(userRes.data)
      } catch (err) {
        console.error('Error fetching data:', err)
        alert('Failed to fetch data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddTrainer = async () => {
    try {
      await axios.post('http://localhost:4000/api/v1/trainer/', newTrainer, { withCredentials: true })
      setShowAddTrainerForm(false)
      setNewTrainer({
        name: '',
        specialization: '',
        experience: '',
        amount: '',
        availability: { days: [] },
        bio: '',
      })
      alert('Trainer added successfully!')
    } catch (err) {
      console.error('Error adding trainer:', err)
      alert('Failed to add trainer. Please try again.')
    }
  }

  const handlePurchase = async (trainerId) => {
    if (!user) return
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/trainer/buy/${trainerId}/`,
        { userId: user._id },
        { withCredentials: true }
      )
      alert(response.data.message)
      console.log(response.data)
      setUser({ ...user, coins: response.data.user.coins, trainerPurchased: true })
    } catch (err) {
      console.error('Error purchasing trainer service:', err)
      alert('Failed to purchase trainer service. Please try again.')
    }
  }

  const calculateDiscount = (price) => {
    if (user && user.coins >= 0.1 * price) {
      return price * 0.1
    }
    return 0
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Trainers</h1>

      {user?.role === 'trainer' && (
        <div className="text-center mb-8">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowAddTrainerForm(true)}
          >
            Add Trainer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
          >
            <div>
              <img
                src={trainer.profileImage || '/default-profile.jpg'}
                alt={trainer.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            </div>
            <h3 className="text-xl font-bold">{trainer.name}</h3>
            <p className="text-gray-500">{trainer.specialization}</p>
            <p className="text-sm text-gray-700">
              {trainer.experience} years of experience
            </p>
            <p className="text-sm text-gray-700">{trainer.amount} coins</p>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => setSelectedTrainer(trainer)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-xl font-bold mb-4">{selectedTrainer.name}</h3>
            <p className="mb-2">Specialization: {selectedTrainer.specialization}</p>
            <p className="mb-2">Experience: {selectedTrainer.experience} years</p>
            <p className="mb-2">
              Price: {selectedTrainer.amount} coins
              <span className="text-green-500">
                {' '}
                (-{calculateDiscount(selectedTrainer.amount)} coins discount)
              </span>
            </p>
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => handlePurchase(selectedTrainer._id)}
            >
              Buy Trainer
            </button>
            <button
              className="mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              onClick={() => setSelectedTrainer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showAddTrainerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 className="text-xl font-bold mb-4">Add Trainer</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddTrainer()
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newTrainer.name}
                  onChange={(e) =>
                    setNewTrainer({ ...newTrainer, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Specialization</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={newTrainer.specialization}
                  onChange={(e) =>
                    setNewTrainer({ ...newTrainer, specialization: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Experience</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={newTrainer.experience}
                  onChange={(e) =>
                    setNewTrainer({ ...newTrainer, experience: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={newTrainer.amount}
                  onChange={(e) =>
                    setNewTrainer({ ...newTrainer, amount: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Availability</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  placeholder="e.g., Monday, Tuesday"
                  value={newTrainer.availability.days.join(', ')}
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      availability: { days: e.target.value.split(', ') },
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Add Trainer
              </button>
              <button
                type="button"
                className="mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                onClick={() => setShowAddTrainerForm(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
