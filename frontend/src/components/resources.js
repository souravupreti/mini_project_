import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GymResource = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get('https://exercisedb.p.rapidapi.com/exercises', {
        headers: {
          'X-RapidAPI-Key': '5b0e5b41b5msh3a165aa7d3b10e0p14e280jsn6ec8636600b5',
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
      });
      setExercises(response.data);
      setFilteredExercises(response.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleFilterChange = (e) => {
    const selectedBodyPart = e.target.value;
    setBodyPart(selectedBodyPart);

    if (selectedBodyPart === 'all') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((exercise) => exercise.bodyPart === selectedBodyPart);
      setFilteredExercises(filtered);
    }
  };

  return (
    <div className="p-6 bg-black text-white">
      <h1 className="text-4xl font-semibold mb-6 text-center">Gym Resource</h1>
      
      <div className="mb-6">
        <label htmlFor="bodyPart" className="block text-xl mb-3">Filter by Body Part:</label>
        <select
          id="bodyPart"
          value={bodyPart}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-500 rounded-lg bg-gray-800 text-white"
        >
          <option value="all">All</option>
          <option value="back">Back</option>
          <option value="chest">Chest</option>
          <option value="shoulders">Shoulders</option>
          <option value="legs">Legs</option>
          <option value="arms">Arms</option>
          <option value="abs">Abs</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="bg-white text-black shadow-lg rounded-lg p-6 transition-transform hover:scale-105">
            <h3 className="font-semibold text-2xl text-gray-900 mb-3">{exercise.name}</h3>
            <p className="text-gray-700 mb-2">
              <strong>Target:</strong> {exercise.target}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Equipment:</strong> {exercise.equipment}
            </p>
            {exercise.gifUrl && (
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="mt-4 w-full h-auto rounded-lg shadow-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GymResource;
