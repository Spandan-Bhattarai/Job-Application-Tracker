import React from 'react';
import { BarChart3, TrendingUp, Clock, XCircle } from 'lucide-react';
import { Analytics } from '../lib/nhost';

interface AnalyticsWidgetProps {
  analytics: Analytics | null;
}

export function AnalyticsWidget({ analytics }: AnalyticsWidgetProps) {
  const stats = [
    {
      title: 'Total Applications',
      value: analytics?.total_applications || 0,
      icon: BarChart3,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Active Applications',
      value: analytics?.active_applications || 0,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
      iconBg: 'bg-emerald-500',
    },
    {
      title: 'Interviews',
      value: analytics?.interviews_scheduled || 0,
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20',
      iconBg: 'bg-amber-500',
    },
    {
      title: 'Rejected',
      value: analytics?.rejected_applications || 0,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      iconBg: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.title} 
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up`}
          style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
        >
          {/* Background decoration */}
          <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`} />
          
          <div className="relative flex items-start justify-between">
            <div className="space-y-1 md:space-y-2">
              <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {stat.value}
              </p>
            </div>
            <div className={`p-2 md:p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
              <stat.icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}