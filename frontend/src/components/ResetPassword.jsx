import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const [otp, setOtp] = useState(''); // State for the 6-digit code

// Inside your handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the code (token) and new password to the backend
            await axios.post('http://138.197.192.172:8000/api/reset-password', { 
                token: otp, // Your backend expects the OTP in the 'token' field
                newPassword: password 
            });
            setMessage("Password changed successfully!");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || "Error");
        }
};


    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center' }}>Create New Password</h2>
            <form onSubmit={handleSubmit}>
		<div style={{ marginBottom: '15px' }}>
                    <label>Verification Code</label>
                    <input 
                        type="text" 
                        placeholder="6-digit OTP" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                    />
                </div>
                {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Update Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
