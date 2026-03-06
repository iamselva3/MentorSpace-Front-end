import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeacherDashboard from '../components/teacher/Dashboard';
import TeacherArticles from '../components/teacher/ArticleList';
import TeacherCreateArticle from '../components/teacher/CreateArticle';
import TeacherEditArticle from '../components/teacher/EditArticle';
import TeacherViewArticle from '../components/teacher/ViewArticle';
import TeacherAnalytics from '../components/teacher/Analytics';

const TeacherPortal = () => {
  return (
    <div className="min-h-screen">
      <div className="py-6">
        <Routes>
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="articles" element={<TeacherArticles />} />
          <Route path="articles/create" element={<TeacherCreateArticle />} />
          <Route path="articles/edit/:id" element={<TeacherEditArticle />} />
          <Route path="articles/view/:id" element={<TeacherViewArticle />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="*" element={<TeacherDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherPortal;