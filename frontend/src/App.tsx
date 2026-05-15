import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import MainLayout from './components/MainLayout';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import History from './pages/History';
import SavedArticles from './pages/SavedArticles';
import Statistics from './pages/Statistics';
import Sources from './pages/Sources';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';

function App() {
  return (
    <AuthProvider>
      <DarkModeProvider>
        <Router>
          <Routes>
            {/* Auth (no layout) */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Home/Public pages — Top Navbar Layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Dashboard pages — Sidebar Layout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze" element={<Analysis />} />
              <Route path="/history" element={<History />} />
              <Route path="/saved" element={<SavedArticles />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<HelpSupport />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DarkModeProvider>
    </AuthProvider>
  );
}

export default App;
