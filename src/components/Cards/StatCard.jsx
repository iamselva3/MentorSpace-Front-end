import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'indigo', 
  trend = null, 
  trendValue = null,
  subtitle = null,
  loading = false,
  onClick = null,
  className = ''
}) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      dark: 'bg-indigo-600',
      light: 'bg-indigo-50'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      dark: 'bg-blue-600',
      light: 'bg-blue-50'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      dark: 'bg-green-600',
      light: 'bg-green-50'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      dark: 'bg-red-600',
      light: 'bg-red-50'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      dark: 'bg-purple-600',
      light: 'bg-purple-50'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      dark: 'bg-yellow-600',
      light: 'bg-yellow-50'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      dark: 'bg-orange-600',
      light: 'bg-orange-50'
    },
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-600',
      dark: 'bg-pink-600',
      light: 'bg-pink-50'
    }
  };

  const trendIcons = {
    up: <FiTrendingUp className="text-green-600" />,
    down: <FiTrendingDown className="text-red-600" />,
    neutral: <FiMinus className="text-gray-600" />
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 animate-pulse ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm p-6 
        hover:shadow-md transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </h3>
            
            {trend && trendValue && (
              <span className={`flex items-center text-sm font-medium ${trendColors[trend]}`}>
                {trendIcons[trend]}
                {trendValue}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}

          {/* Mini progress bar for stats like completion rate */}
          {title.toLowerCase().includes('progress') || title.toLowerCase().includes('completion') && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${colorClasses[color].dark}`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg ${colorClasses[color].bg}`}>
          <div className={`text-xl ${colorClasses[color].text}`}>
            {icon}
          </div>
        </div>
      </div>

      {/* Footer section for additional info */}
      {trend && trendValue && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Compared to previous period
          </p>
        </div>
      )}
    </div>
  );
};

// Variants for specific use cases

export const RevenueStatCard = ({ value, trend }) => (
  <StatCard
    title="Revenue"
    value={`$${value.toLocaleString()}`}
    icon="💰"
    color="green"
    trend={trend}
    trendValue="+12.5%"
    subtitle="Last 30 days"
  />
);

export const UserStatCard = ({ total, active, trend }) => (
  <StatCard
    title="Total Users"
    value={total}
    icon={<FiUsers />}
    color="blue"
    trend={trend}
    trendValue={`${active} active`}
    subtitle={`${((active/total)*100).toFixed(1)}% active rate`}
  />
);

export const ViewsStatCard = ({ views, trend }) => (
  <StatCard
    title="Total Views"
    value={views}
    icon={<FiEye />}
    color="purple"
    trend={trend}
    trendValue="+23%"
    subtitle="Last 7 days"
  />
);

export const ArticlesStatCard = ({ count, published }) => (
  <StatCard
    title="Articles"
    value={count}
    icon={<FiBookOpen />}
    color="indigo"
    subtitle={`${published} published`}
  />
);

export const TimeStatCard = ({ minutes }) => (
  <StatCard
    title="Avg. Reading Time"
    value={`${Math.floor(minutes / 60)}h ${minutes % 60}m`}
    icon={<FiClock />}
    color="orange"
  />
);

export const ProgressStatCard = ({ title, progress, total }) => (
  <StatCard
    title={title}
    value={`${progress}/${total}`}
    icon={<FiTrendingUp />}
    color="green"
    subtitle={`${((progress/total)*100).toFixed(1)}% complete`}
  />
);

export default StatCard;