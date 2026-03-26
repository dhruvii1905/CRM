import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-900 dark:text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
          <button onClick={() => setSidebarOpen(true)} className="text-xl">☰</button>
          <span className="font-bold text-sm">Orical Technology</span>
        </div>
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors duration-300">{children}</main>
      </div>
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
