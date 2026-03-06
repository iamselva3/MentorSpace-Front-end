import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TeacherPortal from './pages/TeacherPortal';
import StudentPortal from './pages/StudentPortal';
import Home from './pages/Home';
import './index.css';

const AppRoutes = () => {
    const { isAuthenticated, isTeacher } = useAuth();

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/login" element={
                    isAuthenticated ? <Navigate to={isTeacher ? '/teacher' : '/student'} /> : <Login />
                } /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to={isTeacher ? '/teacher' : '/student'} /> : <Register />
                } />
                <Route path="/teacher/*" element={
                    <PrivateRoute allowedRoles={['teacher']}>
                        <TeacherPortal />
                    </PrivateRoute>
                } />
                <Route path="/student/*" element={
                    <PrivateRoute allowedRoles={['student']}>
                        <StudentPortal />
                    </PrivateRoute>
                } />
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;