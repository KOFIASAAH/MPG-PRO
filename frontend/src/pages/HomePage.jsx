import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const HomePage = () => {
    let { user, logoutUser } = useContext(AuthContext);
    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            <p>Your role is: {user.role}</p>

            {user.role === 'HR' && (
                <nav>
                    <Link to="/employees">Manage Employees</Link>
                </nav>
            )}

            {user.role === 'FINANCE' && (
                <nav>
                    <Link to="/invoices">Manage Invoices</Link>
                    <br />
                    <Link to="/dashboard">View Dashboard</Link>
                </nav>
            )}

            <button onClick={logoutUser}>Logout</button>
        </div>
    );
};

export default HomePage;
