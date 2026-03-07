import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiTarget,
  FiCalendar,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';
import {
  getStudentAnalytics,
  getReadingTimeByCategory,
  getReadingProgress
} from '../../api/endpoint';
import { PageLoader } from '../../components/common/Loader';
import PieChart from '../../components/charts/PieChart';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import { format, subDays } from 'date-fns';

const StudentProgress = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [categoryTime, setCategoryTime] = useState([]);
  const [progress, setProgress] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); 
  const [selectedMetric, setSelectedMetric] = useState('articles'); 

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [analyticsData, timeData, progressData] = await Promise.all([
        getStudentAnalytics(),
        getReadingTimeByCategory(),
        getReadingProgress()
      ]);
      setAnalytics(analyticsData);
      setCategoryTime(timeData);
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Read your first article',
      achieved: analytics?.totalArticlesRead > 0,
      icon: FiBookOpen,
      color: 'blue',
      progress: analytics?.totalArticlesRead > 0 ? 100 : 0
    },
    {
      id: 2,
      name: 'Bookworm',
      description: 'Read 10 articles',
      achieved: analytics?.totalArticlesRead >= 10,
      icon: FiBookOpen,
      color: 'green',
      progress: Math.min((analytics?.totalArticlesRead / 10) * 100, 100)
    },
    {
      id: 3,
      name: 'Time Keeper',
      description: 'Spend 5 hours reading',
      achieved: analytics?.totalReadingTime >= 300,
      icon: FiClock,
      color: 'purple',
      progress: Math.min((analytics?.totalReadingTime / 300) * 100, 100)
    },
    {
      id: 4,
      name: 'Note Master',
      description: 'Create 20 highlights',
      achieved: analytics?.totalHighlights >= 20,
      icon: FiAward,
      color: 'orange',
      progress: Math.min((analytics?.totalHighlights / 20) * 100, 100)
    },
    {
      id: 5,
      name: 'Explorer',
      description: 'Read from 5 different categories',
      achieved: analytics?.categoriesCount >= 5,
      icon: FiTarget,
      color: 'indigo',
      progress: Math.min((analytics?.categoriesCount / 5) * 100, 100)
    }
  ];

  const generateDailyData = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayProgress = progress.find(p => 
        format(new Date(p.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      data.push({
        date: format(date, 'MMM d'),
        articles: dayProgress?.articlesRead || 0,
        time: dayProgress?.readingTime || 0,
        highlights: dayProgress?.highlights || 0
      });
    }
    
    return data;
  };

  const dailyData = generateDailyData();

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Learning Progress</h1>
          <p className="text-gray-600 mt-2">
            Track your reading journey and achievements
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FiBookOpen className="text-2xl text-indigo-600" />
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +{analytics?.weeklyIncrease || 0} this week
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics?.totalArticlesRead || 0}</h3>
            <p className="text-gray-600 text-sm">Articles Read</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FiClock className="text-2xl text-green-600" />
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {Math.floor((analytics?.totalReadingTime || 0) / 60)} hrs total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Math.floor((analytics?.totalReadingTime || 0) / 60)}h {Math.floor((analytics?.totalReadingTime || 0) % 60)}m
            </h3>
            <p className="text-gray-600 text-sm">Reading Time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FiAward className="text-2xl text-purple-600" />
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {analytics?.totalHighlights || 0} total
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics?.totalHighlights || 0}</h3>
            <p className="text-gray-600 text-sm">Highlights & Notes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <FiTarget className="text-2xl text-orange-600" />
              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                {analytics?.categoriesCount || 0} categories
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{analytics?.categoriesCount || 0}</h3>
            <p className="text-gray-600 text-sm">Categories Explored</p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Reading Time by Category</h2>
              <FiPieChart className="text-gray-400" />
            </div>
            {categoryTime.length > 0 ? (
              <div className="h-64">
                <PieChart 
                  data={categoryTime}
                  nameKey="category"
                  valueKey="minutes"
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available yet</p>
            )}
          </div>

          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Progress Timeline</h2>
              <div className="flex items-center gap-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="year">Last year</option>
                </select>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="articles">Articles</option>
                  <option value="time">Reading Time</option>
                  <option value="highlights">Highlights</option>
                </select>
              </div>
            </div>
            {dailyData.length > 0 ? (
              <div className="h-64">
                <BarChart 
                  data={dailyData}
                  xKey="date"
                  yKey={selectedMetric}
                  title={selectedMetric === 'articles' ? 'Articles Read' : selectedMetric === 'time' ? 'Minutes' : 'Highlights'}
                />
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available yet</p>
            )}
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
              <p className="text-sm text-gray-600">
                {achievements.filter(a => a.achieved).length} of {achievements.length} unlocked
              </p>
            </div>
            <FiAward className="text-2xl text-yellow-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => {
              const Icon = achievement.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
                indigo: 'bg-indigo-100 text-indigo-600'
              };

              return (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 ${
                    achievement.achieved ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses[achievement.color]}`}>
                      <Icon className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      
                      
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-600">{Math.round(achievement.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              achievement.achieved ? 'bg-green-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {achievement.achieved && (
                        <span className="inline-block mt-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          ✓ Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FiTrendingUp className="text-3xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Current Reading Streak</h3>
                <p className="text-white text-opacity-90">
                  You've been reading for {analytics?.currentStreak || 0} days in a row!
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{analytics?.currentStreak || 0}</div>
              <div className="text-sm text-white text-opacity-90">Days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;