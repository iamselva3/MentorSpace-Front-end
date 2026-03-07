import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiUsers, FiEye, FiBookOpen, FiClock } from 'react-icons/fi';

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
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      dark: 'bg-indigo-500',
      light: 'bg-indigo-500/5',
      border: 'border-indigo-500/30'
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      dark: 'bg-blue-500',
      light: 'bg-blue-500/5',
      border: 'border-blue-500/30'
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      dark: 'bg-green-500',
      light: 'bg-green-500/5',
      border: 'border-green-500/30'
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      dark: 'bg-red-500',
      light: 'bg-red-500/5',
      border: 'border-red-500/30'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      dark: 'bg-purple-500',
      light: 'bg-purple-500/5',
      border: 'border-purple-500/30'
    },
    yellow: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-400',
      dark: 'bg-yellow-500',
      light: 'bg-yellow-500/5',
      border: 'border-yellow-500/30'
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      dark: 'bg-orange-500',
      light: 'bg-orange-500/5',
      border: 'border-orange-500/30'
    },
    pink: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-400',
      dark: 'bg-pink-500',
      light: 'bg-pink-500/5',
      border: 'border-pink-500/30'
    }
  };

  const trendIcons = {
    up: <FiTrendingUp className="text-green-400" />,
    down: <FiTrendingDown className="text-red-400" />,
    neutral: <FiMinus className="text-gray-400" />
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400'
  };

  if (loading) {
    return (
      <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 animate-pulse ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-600 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 
        hover:shadow-xl transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-105 hover:border-indigo-500/30' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white">
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

         
          {title.toLowerCase().includes('progress') || title.toLowerCase().includes('completion') ? (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${colorClasses[color].dark}`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ) : null}
        </div>

        <div className={`p-3 rounded-lg ${colorClasses[color].bg} border ${colorClasses[color].border}`}>
          <div className={`text-xl ${colorClasses[color].text}`}>
            {icon}
          </div>
        </div>
      </div>

      {trend && trendValue && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Compared to previous period
          </p>
        </div>
      )}
    </div>
  );
};



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