import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiBookmark, FiBookOpen } from 'react-icons/fi';

const ArticleCard = ({ article, isStudent = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Science': 'bg-green-100 text-green-700',
      'Math': 'bg-blue-100 text-blue-700',
      'English': 'bg-purple-100 text-purple-700',
      'History': 'bg-amber-100 text-amber-700',
      'Geography': 'bg-emerald-100 text-emerald-700',
      'Art': 'bg-pink-100 text-pink-700',
      'Technology': 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image placeholder if no image */}
      <div className="h-40 bg-gradient-to-r from-indigo-100 to-purple-100 relative">
        {article.image ? (
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBookOpen className="text-4xl text-indigo-300" />
          </div>
        )}
        
        {/* Category badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FiClock className="text-indigo-400" />
              {article.readTime || '5 min'}
            </span>
            <span className="flex items-center gap-1">
              <FiEye className="text-indigo-400" />
              {article.views || 0}
            </span>
          </div>
          
          {isStudent && (
            <button className="text-gray-400 hover:text-indigo-600 transition-colors">
              <FiBookmark />
            </button>
          )}
        </div>

        <Link
          to={isStudent ? `/student/articles/${article._id}` : `/teacher/articles/view/${article._id}`}
          className="block w-full text-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2 rounded-lg transition-colors font-medium text-sm"
        >
          {isStudent ? 'Start Reading' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;