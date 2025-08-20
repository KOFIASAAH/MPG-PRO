import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

const EmployeeListPage = () => {
    const [employees, setEmployees] = useState([]);
    const { user } = useContext(AuthContext);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/payroll/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        }
    };

    useEffect(() => {
        if (user.role === 'HR') {
            fetchEmployees();
        }
    }, [user.role]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/payroll/employees/${id}/`);
                fetchEmployees(); // Refresh the list
            } catch (error) {
                console.error('Failed to delete employee', error);
            }
        }
    };

    if (user.role !== 'HR') {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div>
            <h1>Employee Management</h1>
            <Link to="/employees/new">Add New Employee</Link>
            <ul>
                {employees.map(employee => (
                    <li key={employee.id}>
                        {employee.first_name} {employee.last_name} - {employee.position}
                        {' '}
                        <Link to={`/employees/${employee.id}/edit`}>Edit</Link>
                        {' '}
                        <button onClick={() => handleDelete(employee.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeListPage;
