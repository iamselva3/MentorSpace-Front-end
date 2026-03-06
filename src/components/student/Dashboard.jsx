import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentAnalytics, getRecentArticles } from '../../api/endpoint';
import PieChart from '../../components/charts/PieChart.jsx';
import RecentArticles from '../../components/student/RecentArticles';
import Loader from '../common/Loader';
import { 
  FiBookOpen, 
  FiClock, 
  FiStar, 
  FiLayers,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiTarget,
  FiArrowRight
} from 'react-icons/fi';

const StudentDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [categoryTime, setCategoryTime] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsResponse, recentArticlesResponse] = await Promise.all([
        getStudentAnalytics(),
        getRecentArticles()
      ]);

      const analyticsData = analyticsResponse?.data || analyticsResponse || {};
      const { summary = {}, categoryAnalytics = [], recentHighlights = [] } = analyticsData;

      let articlesData = [];
      if (recentArticlesResponse?.data?.articles) {
        articlesData = recentArticlesResponse.data.articles;
      } else if (recentArticlesResponse?.articles) {
        articlesData = recentArticlesResponse.articles;
      } else if (Array.isArray(recentArticlesResponse)) {
        articlesData = recentArticlesResponse;
      }

      const totalSeconds = summary.totalReadingTime || 0;
      
      setAnalytics({
        totalArticlesRead: summary.totalArticlesRead || 0,
        totalReadingTime: totalSeconds,
        totalReadingTimeFormatted: formatTime(totalSeconds),
        totalHighlights: recentHighlights?.length || 0,
        categoriesCount: categoryAnalytics.length,
        recentHighlights: recentHighlights || []
      });

      setRecentArticles(articlesData);

      const formattedCategoryTime = categoryAnalytics.map(c => {
        const seconds = c.totalDuration || 0;
        return {
          category: c.category || c._id || 'Unknown',
          minutes: Math.round(seconds / 60),
          seconds: seconds,
          formatted: formatTime(seconds)
        };
      }).filter(item => item.minutes > 0);

      setCategoryTime(formattedCategoryTime);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return '0 min';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 py-8 pt-24 relative overflow-hidden">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.3,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My Learning Dashboard</h1>
              <p className="text-gray-400 mt-2">Track your reading progress and achievements</p>
            </div>
            
            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
              <div className="flex items-center gap-1 text-indigo-400">
                <FiCalendar className="text-lg" />
                <span className="text-sm font-medium">Last 30 days</span>
              </div>
              <div className="w-px h-4 bg-gray-700"></div>
              <div className="flex items-center gap-1 text-green-400">
                <FiTrendingUp className="text-lg" />
                <span className="text-sm font-medium">+12% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-indigo-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl group-hover:scale-110 transition-transform border border-indigo-500/30">
                <FiBookOpen className="text-2xl text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                +{analytics?.totalArticlesRead || 0} total
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Articles Read</h3>
            <p className="text-3xl font-bold text-white">{analytics?.totalArticlesRead || 0}</p>
            <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, (analytics?.totalArticlesRead || 0) * 10)}%` }}></div>
            </div>
          </div>

          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform border border-green-500/30">
                <FiClock className="text-2xl text-green-400" />
              </div>
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/30">
                {formatTime(analytics?.totalReadingTime || 0)}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Reading Time</h3>
            <p className="text-3xl font-bold text-white">
              {Math.floor((analytics?.totalReadingTime || 0) / 60)}m
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Total: {formatTime(analytics?.totalReadingTime || 0)}
            </p>
          </div>

          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform border border-yellow-500/30">
                <FiStar className="text-2xl text-yellow-400" />
              </div>
              <span className="text-xs font-medium text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/30">
                Avg {(analytics?.totalHighlights / (analytics?.totalArticlesRead || 1)).toFixed(1)}/article
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Highlights</h3>
            <p className="text-3xl font-bold text-white">{analytics?.totalHighlights || 0}</p>
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i < Math.min(5, Math.ceil((analytics?.totalHighlights || 0) / 2)) ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
              ))}
            </div>
          </div>

          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform border border-purple-500/30">
                <FiLayers className="text-2xl text-purple-400" />
              </div>
              <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/30">
                {analytics?.categoriesCount || 0} explored
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Categories</h3>
            <p className="text-3xl font-bold text-white">{analytics?.categoriesCount || 0}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {categoryTime.slice(0, 3).map((cat, i) => (
                <span key={i} className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30">
                  {cat.category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Charts and Recent Articles Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Reading Time Chart - Takes 2 columns */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Reading Time by Category</h3>
                <p className="text-sm text-gray-400 mt-1">Distribution of your reading time across topics</p>
              </div>
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <FiTarget className="text-indigo-400 text-xl" />
              </div>
            </div>
            
            {categoryTime.length > 0 ? (
              <div className="h-72 text-white">
                <PieChart 
                  data={categoryTime}
                  nameKey="category"
                  valueKey="minutes"
                />
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-gray-400 bg-gray-900/50 rounded-xl border border-gray-700">
                <FiClock className="text-5xl mb-3 text-gray-600" />
                <p className="font-medium">No reading data available yet</p>
                <p className="text-sm mt-1">Start reading articles to see your progress!</p>
              </div>
            )}

            {/* Category Legend with Times */}
            {categoryTime.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoryTime.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className={`w-3 h-3 rounded-full bg-${['indigo', 'green', 'amber', 'red', 'purple', 'pink'][i % 6]}-500`}></div>
                    <span className="text-sm font-medium text-gray-300 flex-1">{cat.category}</span>
                    <span className="text-xs text-gray-500">{cat.formatted}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Articles - Takes 1 column */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Recently Read</h3>
                <p className="text-sm text-gray-400 mt-1">Continue your learning journey</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <FiBookOpen className="text-green-400 text-xl" />
              </div>
            </div>
            
            <RecentArticles articles={recentArticles} />
            
            {/* Reading Streak Mini Card */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <FiAward className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-xl font-bold text-white">5 days 🔥</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Highlights Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Highlights</h3>
              <p className="text-sm text-gray-400 mt-1">Your latest notes and highlights</p>
            </div>
            <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <FiStar className="text-yellow-400 text-xl" />
            </div>
          </div>

          {analytics?.recentHighlights?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.recentHighlights.slice(0, 3).map((highlight, index) => (
                <div 
                  key={highlight._id || index} 
                  className="group p-5 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <FiStar className="text-yellow-500 text-lg" />
                    <span className="text-xs text-gray-500">
                      {new Date(highlight.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">"{highlight.text}"</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FiBookOpen className="text-indigo-400 flex-shrink-0" />
                    <span className="truncate">{highlight.articleTitle || 'Unknown article'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                <FiStar className="text-2xl text-yellow-400" />
              </div>
              <p className="text-gray-300 font-medium">No highlights yet</p>
              <p className="text-sm text-gray-500 mt-1">Start reading and highlight text to save them here</p>
            </div>
          )}
        </div>

        {/* Learning Insights Footer */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Reading Streak */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <FiAward className="text-2xl text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-xl font-bold text-white">5 days 🔥</p>
                <p className="text-xs text-gray-500 mt-1">Best: 12 days</p>
              </div>
            </div>

            {/* Average Reading Time */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <FiClock className="text-2xl text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg. per Session</p>
                <p className="text-xl font-bold text-white">
                  {Math.round((analytics?.totalReadingTime || 0) / (analytics?.totalArticlesRead || 1) / 60)} mins
                </p>
                <p className="text-xs text-gray-500 mt-1">Per article</p>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                <FiTarget className="text-2xl text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completion Rate</p>
                <p className="text-xl font-bold text-white">78%</p>
                <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-2">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-700"></div>

          {/* Bottom Links */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/student/articles" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                Browse Articles <FiArrowRight />
              </Link>
              <Link to="/student/highlights" className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1">
                View All Highlights <FiArrowRight />
              </Link>
            </div>
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;