import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Settings2, GripVertical } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';

export interface TableColumn {
  id: string;
  label: string;
  visible: boolean;
  pinned?: boolean;
}

interface ColumnCustomizerProps {
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
  trigger?: React.ReactNode;
}

export const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  columns,
  onColumnsChange,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState(columns);

  const handleToggleVisibility = (columnId: string) => {
    const updated = localColumns.map((col) =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    setLocalColumns(updated);
  };

  const handleApply = () => {
    onColumnsChange(localColumns);
    setOpen(false);
  };

  const handleReset = () => {
    const reset = columns.map((col) => ({ ...col, visible: true }));
    setLocalColumns(reset);
    onColumnsChange(reset);
  };

  const visibleCount = localColumns.filter((col) => col.visible).length;

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Customize Columns
          <Badge variant="secondary" className="ml-1 text-xs">
            {visibleCount}/{localColumns.length}
          </Badge>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Table Columns</DialogTitle>
            <DialogDescription>
              Show, hide, and reorder columns to customize your view
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {localColumns.map((column) => (
              <div
                key={column.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <Checkbox
                    id={column.id}
                    checked={column.visible}
                    onCheckedChange={() => handleToggleVisibility(column.id)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  
                  <Label
                    htmlFor={column.id}
                    className="flex-1 cursor-pointer font-medium text-sm text-slate-900 dark:text-white"
                  >
                    {column.label}
                  </Label>
                </div>

                {column.pinned && (
                  <Badge variant="outline" className="text-xs">
                    Pinned
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-slate-600 dark:text-slate-400"
            >
              Reset to Default
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
