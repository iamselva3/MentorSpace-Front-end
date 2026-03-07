import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiBookOpen, FiStar } from 'react-icons/fi';

const RecentArticles = ({ articles = [] }) => {
  
  const getCategoryColor = (category) => {
    const colors = {
      'Science': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Mathematics': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'English': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'History': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Art': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Technology': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Take only first 3 articles
  const displayArticles = articles.slice(0, 3);

  if (!displayArticles.length) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 text-center">
        <p className="text-gray-400">No articles available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-3">

      <div className="space-y-3">
        {displayArticles.map((article, index) => (
          <Link
            key={article._id}
            to={`/student/articles/${article._id}`}
            className="block group"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700/30 transition-colors">
              <div className={`w-10 h-10 rounded-lg border ${getCategoryColor(article.category)} flex items-center justify-center`}>
                <FiBookOpen className="text-lg" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {article.title}
                </h3>
                
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <FiClock className="text-indigo-400" />
                    {article.readTime || 5} min
                  </span>
                  
                  <span className="flex items-center gap-1">
                    <FiEye className="text-indigo-400" />
                    {article.views || 0}
                  </span>

                  {article.highlightCount > 0 && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <FiStar />
                      {article.highlightCount}
                    </span>
                  )}

                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
              </div>
            </div>

            {index < displayArticles.length - 1 && (
              <div className="border-b border-gray-700 my-2"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentArticles;