import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiBookOpen } from 'react-icons/fi';

const RecentArticles = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8">
        <FiBookOpen className="mx-auto text-4xl text-gray-400 mb-3" />
        <p className="text-gray-500">No articles read yet</p>
        <Link 
          to="/student/articles" 
          className="inline-block mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          Browse Articles →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article, index) => (
        <Link
          key={article._id || index}
          to={`/student/articles/${article._id}`}
          className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">
                {article.title}
              </h4>
              
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiClock className="text-indigo-400" />
                  {article.readTime || '5 min read'}
                </span>
                
                <span className="flex items-center gap-1">
                  <FiEye className="text-indigo-400" />
                  {article.views || 0} views
                </span>
                
                {article.category && (
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    {article.category}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-indigo-600 text-sm font-medium">
              Read again →
            </div>
          </div>
        </Link>
      ))}
      
      {articles.length > 0 && (
        <Link
          to="/student/articles"
          className="block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2"
        >
          View all articles
        </Link>
      )}
    </div>
  );
};

export default RecentArticles;