import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
    const [reportData, setReportData] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await api.get('/reporting/total-paid/');
                setReportData(response.data);
            } catch (error) {
                console.error("Failed to fetch report data", error);
            }
        };

        if (user.role === 'FINANCE') {
            fetchReportData();
        }
    }, [user.role]);

    if (user.role !== 'FINANCE') {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {reportData ? (
                <div>
                    <h2>Total Paid Invoices</h2>
                    <p>${parseFloat(reportData.total_paid_invoices).toFixed(2)}</p>
                </div>
            ) : (
                <p>Loading report...</p>
            )}
        </div>
    );
};

export default DashboardPage;
