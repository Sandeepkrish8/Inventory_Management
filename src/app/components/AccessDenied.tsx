import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AccessDeniedProps {
  onBack?: () => void;
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ onBack, message }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Access Denied
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {message || "You don't have permission to access this page. This page is restricted to administrators only."}
              </p>
            </div>
            {onBack && (
              <Button onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
