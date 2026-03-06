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
      'Science': 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
      'Math': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      'Mathematics': 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
      'English': 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
      'Literature': 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200',
      'History': 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
      'Geography': 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
      'Art': 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200',
      'Technology': 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200';
  };

  // Chips variant
  if (variant === 'chips') {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => multiple ? handleClear() : onChange?.('')}
          className={`
            px-3 py-1.5 rounded-full text-sm font-medium transition-all
            ${!selected || (multiple && selectedCategories.length === 0)
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${multiple 
                ? selectedCategories.includes(category)
                  ? 'bg-indigo-600 text-white shadow-md'
                  : `${getCategoryColor(category)}`
                : selected === category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : `${getCategoryColor(category)}`
              }
            `}
          >
            <span className="flex items-center">
              {getCategoryIcon(category)}
              {category}
              {showCount && counts[category] && (
                <span className={`
                  ml-2 px-1.5 py-0.5 rounded-full text-xs
                  ${multiple && selectedCategories.includes(category) || selected === category
                    ? 'bg-white bg-opacity-20'
                    : 'bg-gray-200'
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
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FiFilter className="text-indigo-600" />
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => multiple ? handleClear() : onChange?.('')}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition-colors text-sm
              ${!selected || (multiple && selectedCategories.length === 0)
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
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
                w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between
                ${multiple
                  ? selectedCategories.includes(category)
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  : selected === category
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className="flex items-center">
                {getCategoryIcon(category)}
                {category}
              </span>
              {showCount && counts[category] && (
                <span className="text-xs text-gray-500">
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
          transition-colors bg-white
          ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <span className="flex items-center truncate">
          <FiFilter className="mr-2 text-gray-400" />
          {multiple 
            ? selectedCategories.length > 0 
              ? `${selectedCategories.length} selected` 
              : 'All Categories'
            : selected || 'All Categories'
          }
        </span>
        <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Clear selection option */}
          {(multiple ? selectedCategories.length > 0 : selected) && (
            <button
              onClick={handleClear}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-b border-gray-100 flex items-center gap-2"
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
                w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between
                ${!selected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}
              `}
            >
              <span>All Categories</span>
              {!selected && <FiCheck className="text-indigo-600" />}
            </button>
          )}

          {/* Category list */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={`
                w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between
                ${multiple
                  ? selectedCategories.includes(category)
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700'
                  : selected === category
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700'
                }
              `}
            >
              <span className="flex items-center">
                {getCategoryIcon(category)}
                {category}
                {showCount && counts[category] && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({counts[category]})
                  </span>
                )}
              </span>
              {(multiple ? selectedCategories.includes(category) : selected === category) && (
                <FiCheck className="text-indigo-600" />
              )}
            </button>
          ))}

          {/* No categories */}
          {categories.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
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