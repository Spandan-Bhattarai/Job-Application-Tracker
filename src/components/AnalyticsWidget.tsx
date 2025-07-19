import React from 'react';
import { BarChart3, TrendingUp, Clock, XCircle } from 'lucide-react';
import { Analytics } from '../lib/supabase';

interface AnalyticsWidgetProps {
  analytics: Analytics | null;
}

export function AnalyticsWidget({ analytics }: AnalyticsWidgetProps) {
  const stats = [
    {
      title: 'Total Applications',
      value: analytics?.total_applications || 0,
      icon: BarChart3,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Applications',
      value: analytics?.active_applications || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Interviews Scheduled',
      value: analytics?.interviews_scheduled || 0,
      icon: Clock,
      color: 'bg-amber-500',
    },
    {
      title: 'Rejected',
      value: analytics?.rejected_applications || 0,
      icon: XCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}