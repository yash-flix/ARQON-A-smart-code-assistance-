import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CodeEditor from './pages/CodeEditor';
import BugFixer from './pages/BugFixer';
import Documentation from './pages/Documentation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/code-editor" 
            element={
              <ProtectedRoute>
                <CodeEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bug-fixer" 
            element={
              <ProtectedRoute>
                <BugFixer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documentation" 
            element={
              <ProtectedRoute>
                <Documentation />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
