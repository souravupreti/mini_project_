import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "date-fns";

const PersonalDashboard = () => {
  const [goals, setGoals] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", targetDate: "", status: "not started" });
  const [loading, setLoading] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");

      const response = await axios.get("http://localhost:4000/api/v1/goals", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setGoals(response.data);
      const todayProgress = calculateDailyProgress(response.data);
      setDailyProgress(todayProgress);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyProgress = (goals) => {
    let progress = 0;
    goals.forEach((goal) => {
      if (goal.status === "in progress") {
        progress += 20; // Each goal adds 20% progress
      }
    });
    return Math.min(progress, 100); // Limit progress to 100%
  };

  const handleSaveGoal = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      if (!token) throw new Error("Unauthorized");
  
      // Check if the goal has an _id, meaning it is being edited
      if (newGoal._id) {
        // Update the existing goal
        const response = await axios.put(`http://localhost:4000/api/v1/goals/${newGoal._id}`, newGoal, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
  
        // Update the goals list with the updated goal
        setGoals((prevGoals) =>
          prevGoals.map((goal) => (goal._id === newGoal._id ? response.data : goal))
        );
      } else {
        // Create a new goal
        const response = await axios.post("http://localhost:4000/api/v1/goals", newGoal, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
  
        // Add the new goal to the list
        setGoals((prevGoals) => [...prevGoals, response.data]);
      }
  
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving goal:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditGoal = (goal) => {
    setNewGoal({ ...goal });
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://localhost:4000/api/v1/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const handleMarkDailyChallengeCompleted = async (goalId) => {
    try {
      const token = Cookies.get("token");
      const updatedGoal = { ...goals.find((goal) => goal._id === goalId), status: "completed" };
      await axios.put(`http://localhost:4000/api/v1/goals/${goalId}`, updatedGoal, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal._id === goalId ? { ...goal, status: "completed" } : goal))
      );
      setDailyProgress(100); // Set progress to 100% when challenge is completed
    } catch (error) {
      console.error("Error marking daily challenge as completed:", error);
    }
  };


  const formatDate = (date) => {
 // Ensure the date is valid and format it correctly
 const formattedDate = new Date(date);
 if (isNaN(formattedDate)) {
   return "";
 }
 return formattedDate.toISOString().split("T")[0]; // Extracts only "yyyy-MM-dd"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Personal Dashboard</h1>

      {/* Goal Form Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{newGoal._id ? "Edit Goal" : "Add New Goal"}</h2>
            <input
              type="text"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              placeholder="Goal Title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              placeholder="Goal Description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <input
              type="date"
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
            />
            <select
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
              value={newGoal.status}
              onChange={(e) => setNewGoal({ ...newGoal, status: e.target.value })}
            >
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={handleSaveGoal}
              >
                {loading ? "Saving..." : "Save Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Button */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-8"
        onClick={() => setIsDialogOpen(true)}
      >
        Add New Goal
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal, index) => (
  <div key={`${goal._id}-${index}`} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 rounded-lg p-6">
    <h3 className="text-xl font-semibold">{goal.title}</h3>
    <p className="text-sm text-gray-400">{goal.description}</p>
    <p className="mt-2 text-sm">Target Date: {formatDate(goal.targetDate)}</p>
    <p className="mt-2 text-sm">Status: {goal.status}</p>

    {goal.status === "in progress" && (
      <div>
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${dailyProgress}%` }}
          onClick={() => handleMarkDailyChallengeCompleted(goal._id)}
        ></div>
        <p className="text-gray-400 text-sm mt-2">{dailyProgress}% Completed</p>
      </div>
    )}

    <div className="flex justify-between mt-4">
      <button
        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        onClick={() => handleEditGoal(goal)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        onClick={() => handleDeleteGoal(goal._id)}
      >
        Delete
      </button>
    </div>
  </div>
))}

</div>

    </div>
  );
};

export default PersonalDashboard;
