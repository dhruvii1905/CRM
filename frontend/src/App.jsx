import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Tenders from './pages/Tenders';
import Followups from './pages/Followups';
import Documents from './pages/Documents';
import Gem from './pages/Gem';
import Invoices from './pages/Invoices';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900 dark:text-white">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
            <Route path="/customers" element={<PrivateRoute><Layout><Customers /></Layout></PrivateRoute>} />
            <Route path="/leads" element={<PrivateRoute><Layout><Leads /></Layout></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
            <Route path="/tenders" element={<PrivateRoute><Layout><Tenders /></Layout></PrivateRoute>} />
            <Route path="/followups" element={<PrivateRoute><Layout><Followups /></Layout></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Layout><Documents /></Layout></PrivateRoute>} />
            <Route path="/gem" element={<PrivateRoute><Layout><Gem /></Layout></PrivateRoute>} />
            <Route path="/invoices" element={<PrivateRoute><Layout><Invoices /></Layout></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
