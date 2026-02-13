import React, { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const getCurrentIcon = () => {
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {getCurrentIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="cursor-pointer"
        >
          <Sun className="w-4 h-4 mr-2 text-amber-500" />
          <span>Light</span>
          {theme === 'light' && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="cursor-pointer"
        >
          <Moon className="w-4 h-4 mr-2 text-indigo-500" />
          <span>Dark</span>
          {theme === 'dark' && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className="cursor-pointer"
        >
          <Monitor className="w-4 h-4 mr-2 text-slate-500" />
          <span>System</span>
          {theme === 'system' && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
