import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { Keyboard } from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

export const KeyboardShortcutsHelp: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only trigger if not typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setOpen(true);
        }
      }
      
      // ESC to close
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['⌘', 'K'], description: 'Open command palette' },
        { keys: ['⌘', 'D'], description: 'Go to Dashboard' },
        { keys: ['⌘', 'P'], description: 'Go to Products' },
        { keys: ['⌘', 'O'], description: 'Go to Orders' },
        { keys: ['⌘', 'A'], description: 'Go to Analytics' },
        { keys: ['⌘', ','], description: 'Open Settings' },
      ],
    },
    {
      title: 'Actions',
      shortcuts: [
        { keys: ['⌘', 'N'], description: 'Create new item' },
        { keys: ['⌘', 'S'], description: 'Save changes' },
        { keys: ['⌘', 'E'], description: 'Export data' },
        { keys: ['⌘', 'F'], description: 'Search/Filter' },
        { keys: ['⌘', 'Z'], description: 'Undo' },
        { keys: ['⌘', '⇧', 'Z'], description: 'Redo' },
      ],
    },
    {
      title: 'Selection',
      shortcuts: [
        { keys: ['⌘', 'A'], description: 'Select all items' },
        { keys: ['⇧', '↑/↓'], description: 'Multi-select items' },
        { keys: ['ESC'], description: 'Clear selection' },
      ],
    },
    {
      title: 'General',
      shortcuts: [
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['ESC'], description: 'Close dialog/modal' },
        { keys: ['⌘', '/'], description: 'Toggle dark mode' },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Keyboard className="w-5 h-5 text-blue-600" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and perform actions quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-3">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wide">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, shortcutIndex) => (
                  <div
                    key={shortcutIndex}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 font-mono text-xs font-semibold text-slate-900 dark:text-white shadow-sm">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-slate-400 dark:text-slate-600 text-xs mx-0.5">
                              +
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Press <kbd className="inline-flex h-5 items-center rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px]">?</kbd> anytime to view shortcuts</span>
            <Badge variant="outline" className="text-xs">
              ⌘ = Cmd/Ctrl
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Trigger component to add to the UI
export const KeyboardShortcutsHint: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
      >
        <Keyboard className="w-3 h-3" />
        Press <kbd className="inline-flex h-4 items-center rounded border bg-slate-100 dark:bg-slate-800 px-1 font-mono text-[10px]">?</kbd> for shortcuts
      </button>
      
      <KeyboardShortcutsHelp />
    </>
  );
};
