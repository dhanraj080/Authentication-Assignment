import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const email = localStorage.getItem('email');
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify-otp', {
        email,
        otp
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage(response.data.message);
      
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'OTP verification failed');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Enter OTP</h1>
      <p style={{textAlign: 'center', marginBottom: '20px'}}>
        Check your email for the 6-digit OTP
      </p>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default OTPVerification;