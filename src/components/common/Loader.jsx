import React from 'react';

const Loader = ({ size = 'medium', color = 'indigo' }) => {
  // Size mappings for Tailwind classes
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  // Color mappings
  const colorClasses = {
    indigo: 'border-indigo-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.medium}
          ${colorClasses[color] || colorClasses.indigo}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

// Full page loader with backdrop
export const PageLoader = () => (
  <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <Loader size="xl" color="indigo" />
      <p className="mt-4 text-gray-600 font-medium animate-pulse">Loading...</p>
    </div>
  </div>
);

// Content loader with shimmer effect
export const ContentLoader = () => (
  <div className="space-y-4 w-full max-w-4xl mx-auto p-4">
    {/* Header shimmer */}
    <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
    
    {/* Content shimmers */}
    <div className="space-y-3">
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-5/6"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-2/3"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-4/5"></div>
    </div>
    
    {/* Card shimmers */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] mb-4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] mb-2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-2/3"></div>
        </div>
      ))}
    </div>
  </div>
);

// Button loader
export const ButtonLoader = () => (
  <Loader size="small" color="white" />
);

// Card loader
export const CardLoader = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// List loade
export const ListLoader = ({ count = 5 }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
);


export const TableRowLoader = ({ columns = 5 }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="bg-gray-50 p-4 border-b">
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    </div>
    {[...Array(3)].map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center gap-4 p-4 border-b last:border-b-0">
        {[...Array(columns)].map((_, colIndex) => (
          <div key={colIndex} className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    ))}
  </div>
);


export const DotLoader = () => (
  <div className="flex items-center justify-center gap-1">
    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);


export const ProgressLoader = ({ progress = 0 }) => (
  <div className="w-full">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-indigo-700">Loading...</span>
      <span className="text-sm font-medium text-indigo-700">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div 
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);


export const SpinnerWithText = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <Loader size="medium" color="indigo" />
    <p className="text-gray-600 text-sm font-medium animate-pulse">{text}</p>
  </div>
);


export default Loader;