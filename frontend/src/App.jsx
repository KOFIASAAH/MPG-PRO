import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import InvoiceListPage from './pages/InvoiceListPage';
import DashboardPage from './pages/DashboardPage'; // Import new page
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="/employees/new" element={<EmployeeFormPage />} />
            <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
            <Route path="/invoices" element={<InvoiceListPage />} />
            <Route path="/dashboard" element={<DashboardPage />} /> {/* Add new route */}
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
