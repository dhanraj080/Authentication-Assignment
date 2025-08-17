import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchProfileImage(token);
  }, [navigate]);

  const fetchProfileImage = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/profile-image', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      setProfileImage(imageUrl);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:3000/api/auth/delete-account', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        localStorage.clear();
        setMessage('Account deleted successfully');
        setTimeout(() => navigate('/'), 2000);
      } catch (error) {
        setMessage('Error deleting account');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Welcome {user.name}!</h1>
      {message && <div className="message">{message}</div>}
      
      <div className="user-info">
        <h2>Account Details</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Company:</strong> {user.companyName}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
        
        {profileImage && (
          <div>
            <p><strong>Profile Image:</strong></p>
            <img src={profileImage} alt="Profile" className="profile-image" />
          </div>
        )}
      </div>
      
      <button onClick={handleLogout} style={{marginBottom: '10px'}}>
        Logout
      </button>
      
      <button onClick={handleDeleteAccount} style={{background: '#666666'}}>
        Remove Account
      </button>
    </div>
  );
};

export default Dashboard;