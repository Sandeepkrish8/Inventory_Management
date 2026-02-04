import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface QuickStatProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    text: 'text-blue-600',
    lightBg: 'bg-blue-50',
  },
  green: {
    bg: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    text: 'text-green-600',
    lightBg: 'bg-green-50',
  },
  orange: {
    bg: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-orange-600',
    lightBg: 'bg-orange-50',
  },
  purple: {
    bg: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    text: 'text-purple-600',
    lightBg: 'bg-purple-50',
  },
  red: {
    bg: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    text: 'text-red-600',
    lightBg: 'bg-red-50',
  },
};

export const QuickStat: React.FC<QuickStatProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}) => {
  const colors = colorClasses[color];

  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={cn('absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full -mr-12 -mt-12', colors.gradient)} />
      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={cn('p-2.5 sm:p-3 rounded-xl shadow-md flex-shrink-0', colors.bg)}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <span className={cn('text-xs sm:text-sm font-medium', colors.text)}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-xs text-slate-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
