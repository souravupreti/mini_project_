import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FollowingList = () => {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/user/${userId}/following`, {
          withCredentials: true,
        });
        setFollowing(response.data);
      } catch (error) {
        setError('Error fetching following users');
        console.error('Error fetching following users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [userId]);

  return (
    <div>
      <h2>Following List</h2>
      {loading ? (
        <p>Loading...</p> // Loading message
      ) : error ? (
        <p>{error}</p> // Error message
      ) : following.length > 0 ? (
        <div>
          {following.map(user => (
            <div key={user._id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
              <p><strong>{user.username}</strong></p>
              {user.profilePicture && <img src={user.profilePicture} alt={user.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
              <p>{user.bio || 'No bio available'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No following users found.</p>
      )}
    </div>
  );
};

export default FollowingList;
