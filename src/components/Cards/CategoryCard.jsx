import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBook, 
  FiCode, 
  FiPenTool, 
  FiBarChart2, 
  FiGlobe, 
  FiImage,
  FiCpu 
} from 'react-icons/fi';

const CategoryCard = ({ category, count, icon, color = 'indigo' }) => {
  const icons = {
    'Science': FiCode,
    'Math': FiBarChart2,
    'English': FiPenTool,
    'History': FiBook,
    'Geography': FiGlobe,
    'Art': FiImage,
    'Technology': FiCpu,
  };

  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    amber: 'from-amber-500 to-amber-600',
    pink: 'from-pink-500 to-pink-600',
  };

  const CategoryIcon = icons[category] || FiBook;

  return (
    <Link
      to={`/student/articles?category=${category}`}
      className="block group"
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[color]} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <CategoryIcon className="text-2xl" />
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {category}
        </h3>
        
        <p className="text-gray-500 text-sm mb-4">
          {count} {count === 1 ? 'article' : 'articles'}
        </p>
        
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
            style={{ width: `${Math.min(100, (count / 50) * 100)}%` }}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;