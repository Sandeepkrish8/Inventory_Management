import React from 'react';
import { cn } from '@/app/components/ui/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'list' | 'stat' | 'chart' | 'text';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'card', 
  count = 1,
  className 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={cn("bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg", className)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28 animate-pulse" />
          </div>
        );

      case 'table':
        return (
          <div className={cn("bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden", className)}>
            {/* Table Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 p-4">
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 dark:bg-slate-700 rounded flex-1 animate-pulse" />
                ))}
              </div>
            </div>
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="border-b border-slate-200 dark:border-slate-700 p-4">
                <div className="flex gap-4 items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" style={{ animationDelay: `${rowIndex * 100}ms` }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className={cn("space-y-3", className)}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                </div>
              </div>
            ))}
          </div>
        );

      case 'stat':
        return (
          <div className={cn("bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg", className)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-28 animate-pulse" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse" />
              </div>
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className={cn("bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg", className)}>
            <div className="space-y-3 mb-6">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse" />
            </div>
            <div className="h-64 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent animate-shimmer" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={cn("space-y-2", className)}>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6 animate-pulse" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </>
  );
};

// Shimmer animation styles - add to your global CSS
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }
