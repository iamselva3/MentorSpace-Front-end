import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiBookmark, FiBookOpen } from 'react-icons/fi';

const ArticleCard = ({ article, isStudent = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'Science': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Math': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'English': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'History': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Geography': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Art': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Technology': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 group hover:border-indigo-500/30">
      {/* Image placeholder if no image */}
      <div className="h-40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 relative">
        {article.image ? (
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBookOpen className="text-4xl text-indigo-400/50" />
          </div>
        )}
        
        {/* Category badge */}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {article.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {article.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
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
            <button className="text-gray-500 hover:text-indigo-400 transition-colors">
              <FiBookmark />
            </button>
          )}
        </div>

        <Link
          to={isStudent ? `/student/articles/${article._id}` : `/teacher/articles/view/${article._id}`}
          className="block w-full text-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 py-2 rounded-lg transition-all duration-200 font-medium text-sm border border-indigo-500/30 hover:border-indigo-500/50"
        >
          {isStudent ? 'Start Reading' : 'View Details'}
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;