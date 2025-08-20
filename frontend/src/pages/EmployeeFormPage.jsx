import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

const EmployeeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        position: '',
        salary: '',
        hire_date: '',
        user: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users/');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        const fetchEmployee = async () => {
            if (id) {
                try {
                    const response = await api.get(`/payroll/employees/${id}/`);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Failed to fetch employee', error);
                }
            }
        };

        if (user.role === 'HR') {
            fetchUsers();
            fetchEmployee();
        }
    }, [id, user.role]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.user) {
            alert('Please select a user.');
            return;
        }
        const apiCall = id
            ? api.put(`/payroll/employees/${id}/`, formData)
            : api.post('/payroll/employees/', formData);

        try {
            await apiCall;
            navigate('/employees');
        } catch (error) {
            console.error('Failed to save employee', error);
            alert('Failed to save employee. Note: Each employee must be linked to a unique user in the system.');
        }
    };

    if (user.role !== 'HR') {
        return <p>You do not have permission to perform this action.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>{id ? 'Edit Employee' : 'Add Employee'}</h1>
            <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
            <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
            <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
            <input name="salary" type="number" step="0.01" value={formData.salary} onChange={handleChange} placeholder="Salary" required />
            <input name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} required />

            <label htmlFor="user">Assign to User</label>
            <select name="user" id="user" value={formData.user} onChange={handleChange} required>
                <option value="">Select a User</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                    </option>
                ))}
            </select>

            <button type="submit">Save</button>
        </form>
    );
};

export default EmployeeFormPage;
