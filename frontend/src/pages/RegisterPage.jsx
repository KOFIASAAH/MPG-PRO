import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('OPERATIONS');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/register/', { email, username, password, role });
            navigate('/login');
            alert('Registration successful! Please log in.');
        } catch (error) {
            alert('Registration failed.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <hr />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <label htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="OPERATIONS">Operations</option>
                    <option value="FINANCE">Finance</option>
                    <option value="HR">HR</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
