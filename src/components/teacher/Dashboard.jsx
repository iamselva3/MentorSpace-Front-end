import React, { useEffect, useState } from 'react';
import { getTeacherAnalytics, getDailyEngagement } from '../../api/endpoint';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';
import Loader from '../common/Loader';
import { FiBookOpen, FiUsers, FiEye, FiClock, FiTrendingUp, FiAward } from 'react-icons/fi';

const TeacherDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const transformedTrends = trends.map(item => ({
  date: item._id.date,
  views: item.views,
  duration: item.totalDuration,
  students: item.uniqueStudents.length
}));

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsResponse, trendsData] = await Promise.all([
        getTeacherAnalytics(),
        getDailyEngagement(30)
      ]);

      
      
      const analyticsData = analyticsResponse.data || analyticsResponse;
      const trendsResponse = trendsData?.data?.dailyEngagement || trendsData;


      
      setAnalytics(analyticsData);
      setTrends(trendsResponse);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const summary = analytics?.summary || {};
  const articleAnalytics = analytics?.articleAnalytics || [];
  const categoryStats = analytics?.categoryStats || [];
  const topCategories = analytics?.topCategories || [];


  const calculateAvgReadingTime = () => {
  if (!articleAnalytics || articleAnalytics.length === 0) return 0;
  
  const totalDuration = articleAnalytics.reduce((sum, article) => {
    return sum + (article.totalDuration || 0);
  }, 0);
  
  const totalArticles = articleAnalytics.length;
  const avgMinutes = Math.round((totalDuration / totalArticles) / 60); 
  
  return avgMinutes || 0;
};

const avgReadingTime = calculateAvgReadingTime();



  const articleViewsData = analytics?.articleAnalytics?.map(article => ({
    title: article.title || 'Untitled',
    views: article.totalViews || 0
  })) || [];



  const categoryData = categoryStats.map(cat => ({
    category: cat._id || 'Unknown',
    count: cat.count || 0,
    views: cat.totalViews || 0
  }));

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-gray-400 mt-2">Welcome back! Here's your analytics overview</p>
            </div>
            
            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
              <div className="flex items-center gap-1 text-indigo-400">
                <FiTrendingUp className="text-lg" />
                <span className="text-sm font-medium">Last 30 days</span>
              </div>
              <div className="w-px h-4 bg-gray-700"></div>
              <div className="flex items-center gap-1 text-green-400">
                <FiAward className="text-lg" />
                <span className="text-sm font-medium">+8% engagement</span>
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
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/30">
                Created
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Articles Created</h3>
            <p className="text-3xl font-bold text-white">{summary.totalArticles || 0}</p>
          </div>

          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform border border-green-500/30">
                <FiUsers className="text-2xl text-green-400" />
              </div>
              <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
                Active
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Students</h3>
            <p className="text-3xl font-bold text-white">{summary.totalStudents || 0}</p>
          </div>

          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform border border-blue-500/30">
                <FiEye className="text-2xl text-blue-400" />
              </div>
              <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/30">
                All time
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Total Views</h3>
            <p className="text-3xl font-bold text-white">{summary.totalViews || 0}</p>
          </div>

          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform border border-purple-500/30">
                <FiClock className="text-2xl text-purple-400" />
              </div>
              <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/30">
                Average
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Avg. Reading Time</h3>
             <p className="text-3xl font-bold text-white">{`${avgReadingTime} min`}</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Articles vs Views</h3>
            {articleViewsData.length > 0 ? (
              <div className="text-white">
                <BarChart 
                  data={articleViewsData}
                  xKey="title"
                  yKey="views"
                  height={300}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700">
                No article data available
              </div>
            )}
          </div>

          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
            {categoryData.length > 0 ? (
              <div className="text-white">
                <PieChart 
                  data={categoryData}
                  nameKey="category"
                  valueKey="count"
                  height={300}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700">
                No category data available
              </div>
            )}
          </div>
        </div>

     
        <div className="mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Engagement Trends</h3>
            {trends.length > 0 ? (
              <div className="text-white">
                <LineChart 
                  data={transformedTrends}
                  xKey="date"
                  yKey="views"
                  height={300}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700">
                No engagement data available
              </div>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
          {topCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategories.slice(0, 3).map((cat, index) => (
                <div 
                  key={cat._id || index} 
                  className={`
                    flex items-center p-4 rounded-lg border
                    ${index === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : ''}
                    ${index === 1 ? 'bg-gray-700/50 border-gray-600' : ''}
                    ${index === 2 ? 'bg-orange-500/10 border-orange-500/30' : ''}
                  `}
                >
                  
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4
                    ${index === 0 ? 'bg-yellow-500 text-white' : ''}
                    ${index === 1 ? 'bg-gray-600 text-white' : ''}
                    ${index === 2 ? 'bg-orange-500 text-white' : ''}
                  `}>
                    #{index + 1}
                  </div>
                  
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{cat._id || 'Unknown'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400">
                        {cat.count} {cat.count === 1 ? 'article' : 'articles'}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-sm text-gray-400">
                        {cat.totalViews || 0} {cat.totalViews === 1 ? 'view' : 'views'}
                      </span>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="w-16 ml-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`
                          h-2 rounded-full
                          ${index === 0 ? 'bg-yellow-500' : ''}
                          ${index === 1 ? 'bg-gray-500' : ''}
                          ${index === 2 ? 'bg-orange-500' : ''}
                        `}
                        style={{ width: `${Math.min(100, (cat.count / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8 bg-gray-900/50 rounded-lg border border-gray-700">No category data available</p>
          )}
        </div>

        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-500/10 rounded-lg p-4 text-center border border-indigo-500/30">
            <p className="text-2xl font-bold text-indigo-400">{summary.totalArticles || 0}</p>
            <p className="text-sm text-gray-400">Total Articles</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 text-center border border-green-500/30">
            <p className="text-2xl font-bold text-green-400">{summary.totalStudents || 0}</p>
            <p className="text-sm text-gray-400">Active Students</p>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
            <p className="text-2xl font-bold text-blue-400">{summary.totalViews || 0}</p>
            <p className="text-sm text-gray-400">Total Views</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4 text-center border border-purple-500/30">
            <p className="text-2xl font-bold text-purple-400">{categoryStats.length || 0}</p>
            <p className="text-sm text-gray-400">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;