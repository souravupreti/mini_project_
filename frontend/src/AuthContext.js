import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.get('http://localhost:4000/api/v1/user/details', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Ensure cookies are sent with the request
      })
        .then(response => {
          setUser(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch user details:", err);
          Cookies.remove('token'); // If there's an error, remove the token and reset user state
          setUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
