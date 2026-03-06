import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiClock, 
  FiEye, 
  FiBookOpen, 
  FiStar, 
  FiChevronRight,
  FiBookmark,
  FiTrendingUp
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const RecentArticles = ({ 
  articles = [], 
  title = "Recently Read",
  showViewAll = true,
  maxItems = 5,
  variant = 'default' // 'default', 'compact', 'grid'
}) => {
  
  const getCategoryColor = (category) => {
    const colors = {
      'Science': 'bg-green-100 text-green-700 border-green-200',
      'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200',
      'Math': 'bg-blue-100 text-blue-700 border-blue-200',
      'English': 'bg-purple-100 text-purple-700 border-purple-200',
      'History': 'bg-amber-100 text-amber-700 border-amber-200',
      'Geography': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Art': 'bg-pink-100 text-pink-700 border-pink-200',
      'Technology': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Physics': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'Chemistry': 'bg-orange-100 text-orange-700 border-orange-200',
      'Biology': 'bg-lime-100 text-lime-700 border-lime-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatReadingTime = (minutes) => {
    if (minutes < 60) return `${minutes} min read`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m read`;
  };

  // Loading skeleton
  if (!articles) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiBookOpen className="text-2xl text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Articles Read Yet</h3>
        <p className="text-gray-600 mb-4">Start your learning journey by reading some articles</p>
        <Link
          to="/student/articles"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Browse Articles <FiChevronRight />
        </Link>
      </div>
    );
  }

  // Grid variant
  if (variant === 'grid') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-600" />
            {title}
          </h2>
          {showViewAll && articles.length > maxItems && (
            <Link
              to="/student/articles"
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <FiChevronRight />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.slice(0, maxItems).map(article => (
            <Link
              key={article._id}
              to={`/student/articles/${article._id}`}
              className="group block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all hover:shadow-md"
            >
              {/* Article Image Placeholder */}
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg ${getCategoryColor(article.category)} flex items-center justify-center flex-shrink-0`}>
                  <FiBookOpen className="text-lg" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                    {article.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="text-indigo-400" />
                      {formatReadingTime(article.readTime || 5)}
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <FiEye className="text-indigo-400" />
                      {article.views || 0}
                    </span>

                    {article.highlightCount > 0 && (
                      <span className="flex items-center gap-1 text-yellow-600">
                        <FiStar />
                        {article.highlightCount}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {article.progress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-indigo-600 h-1 rounded-full"
                          style={{ width: `${article.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">{title}</h3>
          {showViewAll && articles.length > maxItems && (
            <Link to="/student/articles" className="text-xs text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          )}
        </div>

        <div className="space-y-2">
          {articles.slice(0, maxItems).map(article => (
            <Link
              key={article._id}
              to={`/student/articles/${article._id}`}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-8 h-8 rounded ${getCategoryColor(article.category)} flex items-center justify-center flex-shrink-0`}>
                  <FiBookOpen className="text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {article.title}
                </span>
              </div>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <FiClock />
                {article.readTime || 5}m
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Default variant (list)
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FiBookOpen className="text-indigo-600" />
          {title}
        </h2>
        {showViewAll && articles.length > maxItems && (
          <Link
            to="/student/articles"
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All Articles <FiChevronRight />
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {articles.slice(0, maxItems).map((article, index) => (
          <Link
            key={article._id}
            to={`/student/articles/${article._id}`}
            className="block group"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Article Icon/Category */}
              <div className={`w-10 h-10 rounded-lg ${getCategoryColor(article.category)} flex items-center justify-center flex-shrink-0`}>
                <FiBookOpen className="text-lg" />
              </div>

              {/* Article Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  
                  {/* Bookmark indicator */}
                  {article.bookmarked && (
                    <FiBookmark className="text-indigo-600 flex-shrink-0" />
                  )}
                </div>

                {/* Meta Information */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <FiClock className="text-indigo-400" />
                    {formatReadingTime(article.readTime || 5)}
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <FiEye className="text-indigo-400" />
                    {article.views || 0}
                  </span>

                  {article.lastRead && (
                    <span className="text-gray-400">
                      {formatDistanceToNow(new Date(article.lastRead), { addSuffix: true })}
                    </span>
                  )}

                  {/* Category Tag */}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>

                {/* Progress Bar (if available) */}
                {article.progress > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${article.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{article.progress}%</span>
                  </div>
                )}

                {/* Highlights/Notes Preview */}
                {article.highlightCount > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600">
                    <FiStar className="text-sm" />
                    <span>{article.highlightCount} highlights</span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider (except last item) */}
            {index < Math.min(articles.length, maxItems) - 1 && (
              <div className="border-b border-gray-100 my-2"></div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Stats Footer */}
      {articles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-500">Total read: </span>
                <span className="font-medium text-gray-900">{articles.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Categories: </span>
                <span className="font-medium text-gray-900">
                  {new Set(articles.map(a => a.category)).size}
                </span>
              </div>
            </div>
            
            <Link
              to="/student/progress"
              className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
            >
              View Progress <FiChevronRight />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Example with different configurations
export const ReadingList = ({ articles }) => (
  <RecentArticles
    articles={articles}
    title="Continue Reading"
    maxItems={3}
    variant="grid"
  />
);

export const QuickAccess = ({ articles }) => (
  <RecentArticles
    articles={articles}
    title="Quick Access"
    maxItems={4}
    variant="compact"
    showViewAll={false}
  />
);

export default RecentArticles;