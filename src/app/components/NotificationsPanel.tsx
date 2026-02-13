import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Bell, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

export const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'USB-C Cable stock is running low (12 units)',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Order Completed',
      message: 'Order #ORD-2024-001 has been completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'New Product Added',
      message: 'Wireless Headphones has been added to inventory',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
    },
    {
      id: '4',
      type: 'warning',
      title: 'Stock Alert',
      message: 'Mechanical Keyboard stock is below minimum level',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      read: false,
    },
    {
      id: '5',
      type: 'success',
      title: 'Restock Complete',
      message: '50 units of Office Chair received',
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
        return <Package className="w-5 h-5 text-blue-600" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900">No notifications</p>
              <p className="text-xs text-slate-500 mt-1">We'll notify you when something arrives</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)} border`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {format(notification.timestamp, 'MMM dd, h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-200 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={clearAll}
            >
              Clear All
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 text-xs"
            >
              View All
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
