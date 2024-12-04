import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FollowingList() {
  const { userId } = useParams();  // Assuming userId is passed via URL
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!userId) {
      console.error("UserId is not defined.");
      return; // Stop if userId is missing
    }
    
    const fetchFollowing = async () => {
      try {
        console.log("Fetching following list for userId:", userId); // Log the userId
        const response = await axios.get(`http://localhost:4000/api/v1/following/following/${userId}`, {
          withCredentials: true, // If your API requires authentication
        });
        setFollowing(response.data);  // Set the following users
      } catch (error) {
        console.error("Error fetching following users", error);
      }
    };

    fetchFollowing();
  }, [userId]);  // Refetch if userId changes

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">Following Users</h2>
        <div className="grid grid-cols-1 gap-4">
          {following.length > 0 ? (
            following.map((user, index) => (
              <div key={index} className="flex items-center bg-gray-700 p-4 rounded-lg mb-4">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.username}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div className="text-white">
                  <p className="text-xl font-semibold">{user.username}</p> {/* Display username */}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No following users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
