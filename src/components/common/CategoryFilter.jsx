import React, { useState, useEffect, useRef } from 'react';
import { 
  FiFilter, 
  FiChevronDown, 
  FiCheck, 
  FiX,
  FiBook,
  FiCode,
  FiPenTool,
  FiGlobe,
  FiImage,
  FiCpu,
  FiBarChart2 
} from 'react-icons/fi';

const CategoryFilter = ({ 
  categories = [], 
  selected = '', 
  onChange,
  multiple = false,
  showCount = true,
  counts = {},
  variant = 'dropdown' // 'dropdown', 'chips', 'sidebar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(
    multiple ? (Array.isArray(selected) ? selected : []) : selected
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (multiple) {
      setSelectedCategories(Array.isArray(selected) ? selected : []);
    } else {
      setSelectedCategories(selected);
    }
  }, [selected, multiple]);

  const handleSelect = (category) => {
    if (multiple) {
      let newSelected;
      if (selectedCategories.includes(category)) {
        newSelected = selectedCategories.filter(c => c !== category);
      } else {
        newSelected = [...selectedCategories, category];
      }
      setSelectedCategories(newSelected);
      onChange?.(newSelected);
    } else {
      setSelectedCategories(category);
      onChange?.(category);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    if (multiple) {
      setSelectedCategories([]);
      onChange?.([]);
    } else {
      setSelectedCategories('');
      onChange?.('');
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Science': FiCode,
      'Math': FiBarChart2,
      'Mathematics': FiBarChart2,
      'English': FiPenTool,
      'Literature': FiPenTool,
      'History': FiBook,
      'Geography': FiGlobe,
      'Art': FiImage,
      'Technology': FiCpu,
    };
    const Icon = icons[category] || FiBook;
    return <Icon className="mr-2" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Science': 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
      'Math': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
      'Mathematics': 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
      'English': 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
      'Literature': 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
      'History': 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
      'Geography': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
      'Art': 'bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30',
      'Technology': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30';
  };

  // Chips variant
  if (variant === 'chips') {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => multiple ? handleClear() : onChange?.('')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all border
            ${!selected || (multiple && selectedCategories.length === 0)
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/20' 
              : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700'
            }
          `}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleSelect(category)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all border
              ${multiple 
                ? selectedCategories.includes(category)
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/20'
                  : `${getCategoryColor(category)}`
                : selected === category
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/20'
                  : `${getCategoryColor(category)}`
              }
            `}
          >
            <span className="flex items-center">
              {getCategoryIcon(category)}
              {category}
              {showCount && counts[category] && (
                <span className={`
                  ml-2 px-1.5 py-0.5 rounded-full text-xs border
                  ${multiple && selectedCategories.includes(category) || selected === category
                    ? 'bg-white/20 text-white border-white/20'
                    : 'bg-gray-700 text-gray-300 border-gray-600'
                  }
                `}>
                  {counts[category]}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <FiFilter className="text-indigo-400" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => multiple ? handleClear() : onChange?.('')}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition-colors text-sm border
              ${!selected || (multiple && selectedCategories.length === 0)
                ? 'bg-indigo-500/20 text-indigo-400 font-medium border-indigo-500/30'
                : 'text-gray-300 hover:bg-gray-700/50 border-transparent hover:border-gray-700'
              }
            `}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={`
                w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between border
                ${multiple
                  ? selectedCategories.includes(category)
                    ? 'bg-indigo-500/20 text-indigo-400 font-medium border-indigo-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 border-transparent hover:border-gray-700'
                  : selected === category
                    ? 'bg-indigo-500/20 text-indigo-400 font-medium border-indigo-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 border-transparent hover:border-gray-700'
                }
              `}
            >
              <span className="flex items-center">
                {getCategoryIcon(category)}
                {category}
              </span>
              {showCount && counts[category] && (
                <span className="text-xs text-gray-400">
                  ({counts[category]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full sm:w-48 px-4 py-2.5 border rounded-lg text-left flex items-center justify-between
          transition-colors bg-gray-800/50 backdrop-blur-sm
          ${isOpen 
            ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' 
            : 'border-gray-700 hover:border-gray-600'
          }
        `}
      >
        <span className="flex items-center truncate text-gray-300">
          <FiFilter className="mr-2 text-gray-400" />
          {multiple 
            ? selectedCategories.length > 0 
              ? `${selectedCategories.length} selected` 
              : 'All Categories'
            : selected || 'All Categories'
          }
        </span>
        <FiChevronDown className={`transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
          {/* Clear selection option */}
          {(multiple ? selectedCategories.length > 0 : selected) && (
            <button
              onClick={handleClear}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 border-b border-gray-700 flex items-center gap-2"
            >
              <FiX />
              Clear {multiple ? 'all' : 'selection'}
            </button>
          )}

          {/* All categories option (for single select) */}
          {!multiple && (
            <button
              onClick={() => handleSelect('')}
              className={`
                w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700/50 flex items-center justify-between border-b border-gray-700
                ${!selected ? 'bg-indigo-500/20 text-indigo-400 font-medium' : 'text-gray-300'}
              `}
            >
              <span>All Categories</span>
              {!selected && <FiCheck className="text-indigo-400" />}
            </button>
          )}

          {/* Category list */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={`
                w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700/50 flex items-center justify-between
                ${multiple
                  ? selectedCategories.includes(category)
                    ? 'bg-indigo-500/20 text-indigo-400 font-medium'
                    : 'text-gray-300'
                  : selected === category
                    ? 'bg-indigo-500/20 text-indigo-400 font-medium'
                    : 'text-gray-300'
                }
              `}
            >
              <span className="flex items-center">
                {getCategoryIcon(category)}
                {category}
                {showCount && counts[category] && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({counts[category]})
                  </span>
                )}
              </span>
              {(multiple ? selectedCategories.includes(category) : selected === category) && (
                <FiCheck className="text-indigo-400" />
              )}
            </button>
          ))}

          {/* No categories */}
          {categories.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              No categories available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Preset category filter with common categories
export const ArticleCategoryFilter = ({ selected, onChange, counts }) => {
  const categories = ['Science', 'Mathematics', 'English', 'History', 'Geography', 'Art', 'Technology'];
  
  return (
    <CategoryFilter
      categories={categories}
      selected={selected}
      onChange={onChange}
      counts={counts}
      variant="chips"
      showCount={true}
    />
  );
};

// Multiple select category filter
export const MultiCategoryFilter = ({ selected = [], onChange, counts }) => {
  const categories = ['Science', 'Mathematics', 'English', 'History', 'Geography', 'Art', 'Technology'];
  
  return (
    <CategoryFilter
      categories={categories}
      selected={selected}
      onChange={onChange}
      counts={counts}
      variant="dropdown"
      multiple={true}
      showCount={true}
    />
  );
};

export default CategoryFilter;