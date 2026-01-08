import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            await axios.post('http://138.197.192.172:8000/api/forgot-password', { email });
            setMessage("The code was sent to your email! Redirecting...");
            
            // 3. Wait 2 seconds so the user can read the message, then redirect
            setTimeout(() => {
                navigate('/reset-password'); 
            }, 2500);

        } catch (err) {
            setError("Email not found or server error.");
        }
     };

    return (
        <div className="auth-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        placeholder="example@uca.edu.kg"
                    />
                </div>

                {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
