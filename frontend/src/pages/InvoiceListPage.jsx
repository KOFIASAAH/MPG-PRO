import { useState, useEffect, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const InvoiceListPage = () => {
    const [invoices, setInvoices] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/invoicing/invoices/');
                setInvoices(response.data);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            }
        };

        if (user.role === 'FINANCE') {
            fetchInvoices();
        }
    }, [user.role]);

    if (user.role !== 'FINANCE') {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div>
            <h1>Invoices</h1>
            {/* Add link to Create Invoice page here */}
            <ul>
                {invoices.map(invoice => (
                    <li key={invoice.id}>
                        Invoice #{invoice.id} - {invoice.customer_name} - ${invoice.total_amount} ({invoice.status})
                        {/* Add link to view details */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvoiceListPage;
