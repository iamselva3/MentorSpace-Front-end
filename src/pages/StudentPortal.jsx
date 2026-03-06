// StudentPortal.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboard from '../components/student/Dashboard';
import StudentArticles from '../components/student/ArticleList';
import StudentArticleView from '../components/student/ArticleViewer';
import StudentHighlights from '../components/student/StudentHighlights';
import StudentProgress from '../components/student/StudentProgress';

const StudentPortal = () => {
  return (
    <div className="min-h-screen ">
      <div className="py-6">
        <Routes>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="articles" element={<StudentArticles />} />
          <Route path="articles/:id" element={<StudentArticleView />} />
          <Route path="highlights" element={<StudentHighlights />} />
          <Route path="progress" element={<StudentProgress />} />
          <Route path="*" element={<StudentDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentPortal;