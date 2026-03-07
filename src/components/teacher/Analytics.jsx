import React, { useEffect, useState } from 'react';
import {
  getTeacherAnalytics,
  getArticleStats,
  getStudentProgress,
  getDailyEngagement,
  getCategoryDistribution
} from '../../api/endpoint';
import { PageLoader } from '../common/Loader';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import LineChart from '../charts/LineChart';
import StatCard from '../Cards/StatCard';
import { 
  FiBookOpen, 
  FiUsers, 
  FiEye, 
  FiClock,
  FiTrendingUp,
  FiDownload,
  FiCalendar,
  FiFilter
} from 'react-icons/fi';
import { format, subDays } from 'date-fns';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleStats, setArticleStats] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 7),
    end: new Date()
  });

  
  const articleAnalytics = analytics?.data?.articleAnalytics || [];


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



const calculateCompletionRate = () => {
  if (!studentProgress || studentProgress.length === 0) return 0;
  
 
  const completedCount = studentProgress.filter(student => 
    student.progress === 100 || student.completed === true
  ).length;
  
  return Math.round((completedCount / studentProgress.length) * 100);
};
  useEffect(() => {
    fetchAnalytics();
  }, []);


useEffect(() => {
  
  if (selectedArticle) {
    fetchArticleDetails(selectedArticle);
  } else {
  }
}, [selectedArticle]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsData, dailyEngagement, categoryDist] = await Promise.all([
        getTeacherAnalytics(),
        getDailyEngagement(30),
        getCategoryDistribution()
      ]);
      
      setAnalytics(analyticsData);
      setDailyData(dailyEngagement?.data?.dailyEngagement);
      setCategoryData(categoryDist.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };
const fetchArticleDetails = async (articleId) => {
  try {
    const [stats, progress] = await Promise.all([
      getArticleStats(articleId),
      getStudentProgress(articleId)
    ]);

   

    setArticleStats(stats?.data?.article);
    
    if (Array.isArray(progress)) {
      setStudentProgress(progress);
    } else if (progress?.data && Array.isArray(progress.data)) {
      setStudentProgress(progress.data);
    } else {
      setStudentProgress([]); 
    }
  } catch (error) {
    console.error('Failed to fetch article details:', error);
    toast.error('Failed to load article details');
    setStudentProgress([]);
  }
};

  const exportAnalytics = () => {
    const exportData = {
      summary: analytics,
      dailyEngagement: dailyData,
      categoryDistribution: categoryData,
      articleStats: articleStats,
      studentProgress: studentProgress,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-900 py-8 pt-24 relative overflow-hidden">
      
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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-2">
              Track student engagement and article performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week" className="bg-gray-800">Last 7 Days</option>
              <option value="month" className="bg-gray-800">Last 30 Days</option>
              <option value="year" className="bg-gray-800">Last Year</option>
            </select>

            
            <button
              onClick={exportAnalytics}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiDownload /> Export
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Articles"
            value={analytics?.data?.summary?.totalArticles || 0}
            icon={<FiBookOpen />}
            color="indigo"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Active Students"
            value={analytics?.data?.summary?.totalStudents || 0}
            icon={<FiUsers />}
            color="green"
            trend="up"
            trendValue="+8%"
          />
          <StatCard
            title="Total Views"
            value={analytics?.data?.summary.totalViews || 0}
            icon={<FiEye />}
            color="blue"
            trend="up"
            trendValue="+23%"
          />
          <StatCard
            title="Avg. Reading Time"
            value={`${avgReadingTime} min`}
            icon={<FiClock />}
            color="purple"
            trend="down"
            trendValue="-5%"
          />
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Articles Performance</h2>
              <FiTrendingUp className="text-gray-400" />
            </div>
            {analytics?.data?.articleAnalytics && analytics?.data?.articleAnalytics.length > 0 ? (
              <div className="text-white">
                <BarChart
                  data={analytics?.data?.articleAnalytics.slice(0, 10)}
                  xKey="title"
                  yKey="totalViews"
                  height={300}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700">
                No data available
              </div>
            )}
          </div>

          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Category Distribution</h2>
              <FiFilter className="text-gray-400" />
            </div>
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
                No data available
              </div>
            )}
          </div>
        </div>

        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Daily Engagement Trends</h2>
            <FiCalendar className="text-gray-400" />
          </div>
          {dailyData.length > 0 ? (
            <div className="text-white">
              <LineChart
                data={dailyData.map(day => ({
        date: new Date(day._id.date).toLocaleDateString(),
        views: day.views,
        students: day.uniqueStudents.length
      }))}
                xKey="date"
                yKey="views"
                height={300}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-900/50 rounded-lg border border-gray-700">
              No data available
            </div>
          )}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Select Article</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
          {analytics?.data?.articleAnalytics?.map(article => {
  return (
    <button
      key={article._id} 
      onClick={(e) => {
            e.preventDefault(); 
            setSelectedArticle(article._id);
          }}
      className={`w-full text-left p-3 rounded-lg transition-colors ${
        selectedArticle === (article._id || article.id)
          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          : 'hover:bg-gray-700/50 text-gray-300'
      }`}
    >
      <p className="font-medium truncate">{article.title}</p>      <p className="text-sm text-gray-400">
        {article.views || article.totalViews} views • {article.students || article.uniqueStudents?.length || 0} students
      </p>
    </button>
  );
})}
            </div>
          </div>

          
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            {selectedArticle ? (
              <>
                <h2 className="text-lg font-semibold text-white mb-4">
                  Article Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400">Total Views</p>
                    <p className="text-2xl font-bold text-white">
                      {articleStats?.totalViews || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400">Unique Students</p>
                    <p className="text-2xl font-bold text-white">
                      {Array.isArray(articleStats?.uniqueStudents) 
      ? articleStats.uniqueStudents.length 
      : articleStats?.uniqueStudents || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400">Avg. Reading Time</p>
                    <p className="text-2xl font-bold text-white">
                     {calculateAvgReadingTime()}m
                    </p>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400">Completion Rate</p>
                    <p className="text-2xl font-bold text-white">
                       {calculateCompletionRate()}%
                    </p>
                  </div>
                </div>

                {/* Student Progress Table */}
                {/* <h3 className="font-semibold text-white mb-3">Student Progress</h3> */}
                {/* <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 text-sm font-medium text-gray-400">Student</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-400">Views</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-400">Time Spent</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-400">Last Viewed</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-400">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentProgress.map(student => (
                        <tr key={student.studentId} className="border-b border-gray-700">
                          <td className="py-2 text-sm text-gray-300">{student.studentName}</td>
                          <td className="py-2 text-sm text-gray-400">{student.views}</td>
                          <td className="py-2 text-sm text-gray-400">
                            {Math.floor(student.timeSpent / 60)}m
                          </td>
                          <td className="py-2 text-sm text-gray-400">
                            {format(new Date(student.lastViewed), 'MMM d, yyyy')}
                          </td>
                          <td className="py-2">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Select an article to view detailed statistics
              </div>
            )}
          </div>
        </div>

       <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
  <h2 className="text-lg font-semibold text-white mb-4">Top Performing Categories</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {analytics?.data?.topCategories
      ?.sort((a, b) => b.totalViews - a.totalViews) // Sort by views descending
      .map((cat, index) => (
        <div key={cat._id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
            {index + 1}
          </div>
          <div>
            <p className="font-medium text-white">{cat._id}</p>
            <p className="text-sm text-gray-400">
              {cat.count} {cat.count === 1 ? 'article' : 'articles'} • {cat.totalViews} {cat.totalViews === 1 ? 'view' : 'views'}
            </p>
          </div>
        </div>
      ))}
  </div>
</div>
      </div>
    </div>
  );
};

export default Analytics; 