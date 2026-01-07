import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Meals from './pages/Meals';
import Gym from './pages/Gym';
import Classes from './pages/Classes';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentClasses from './pages/StudentClasses';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import ManageUsers from './pages/ManageUsers';
import ManageCourses from './pages/ManageCourses';
import Timetable from './pages/Timetable';
import Notifications from './pages/Notifications';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
          <Route path="/gym" element={<ProtectedRoute><Gym /></ProtectedRoute>} />
          <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/student-classes" element={<ProtectedRoute><StudentClasses /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><ManageCourses /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
