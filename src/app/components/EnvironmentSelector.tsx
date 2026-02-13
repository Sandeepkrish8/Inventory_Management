import React, { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CheckCircle2, AlertCircle, RefreshCw, Search, Building2 } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

interface Tenant {
  id: string;
  name: string;
  userRole: 'ADMIN' | 'MANAGER' | 'VIEWER' | 'STAFF';
  region: string;
  lastSync: string;
  syncStatus: 'synced' | 'syncing' | 'offline';
}

interface EnvironmentSelectorProps {
  onSelect?: (tenantId: string) => void;
}

// Mock tenant data matching Figma design
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'North American Production',
    userRole: 'ADMIN',
    region: 'US-EAST-1',
    lastSync: '2 mins ago',
    syncStatus: 'synced',
  },
  {
    id: '2',
    name: 'Euro Distribution',
    userRole: 'MANAGER',
    region: 'EU-WEST-1',
    lastSync: 'Syncing now...',
    syncStatus: 'syncing',
  },
  {
    id: '3',
    name: 'Sandbox / Training',
    userRole: 'ADMIN',
    region: 'US-WEST-2',
    lastSync: '15 mins ago',
    syncStatus: 'synced',
  },
  {
    id: '4',
    name: 'Asia-Pacific Warehouse',
    userRole: 'VIEWER',
    region: 'AP-SOUTH-1',
    lastSync: '2 hours ago',
    syncStatus: 'offline',
  },
  {
    id: '5',
    name: 'Latin America Distribution',
    userRole: 'MANAGER',
    region: 'SA-EAST-1',
    lastSync: '5 mins ago',
    syncStatus: 'synced',
  },
];

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({ onSelect }) => {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenants] = useState<Tenant[]>(mockTenants);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTenantSelect = (tenantId: string) => {
    setSelectedTenant(tenantId);
    if (onSelect) {
      onSelect(tenantId);
    }
  };

  const getSyncStatusBadge = (status: Tenant['syncStatus']) => {
    switch (status) {
      case 'synced':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            SYNCED
          </Badge>
        );
      case 'syncing':
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            SYNCING
          </Badge>
        );
      case 'offline':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            OFFLINE
          </Badge>
        );
    }
  };

  const getRoleBadgeColor = (role: Tenant['userRole']) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white border-slate-900 dark:border-slate-700';
      case 'MANAGER':
        return 'bg-slate-800 text-white dark:bg-slate-600 dark:text-white border-slate-800 dark:border-slate-600';
      case 'VIEWER':
        return 'bg-slate-600 text-white dark:bg-slate-500 dark:text-white border-slate-600 dark:border-slate-500';
      case 'STAFF':
        return 'bg-slate-700 text-white dark:bg-slate-600 dark:text-white border-slate-700 dark:border-slate-600';
    }
  };

  const isEmpty = filteredTenants.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 dark:from-teal-950 dark:via-teal-900 dark:to-emerald-950 flex items-center justify-center p-4 sm:p-6">
      {/* Main Container */}
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 mb-4 shadow-lg shadow-teal-500/30 dark:shadow-teal-400/20">
            <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-emerald-50 mb-2">
            Select Environment
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-teal-300">
            Choose your operational workspace
          </p>
        </div>

        {/* Search and Tenant Cards Container */}
        <Card className="border-slate-200/80 dark:border-teal-800/70 shadow-xl backdrop-blur-sm bg-white/95 dark:bg-teal-950/95">
          <CardContent className="p-4 sm:p-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-teal-400" />
              <Input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 dark:bg-teal-900/50 border-slate-200 dark:border-teal-800 dark:text-emerald-50 dark:placeholder:text-teal-400"
              />
            </div>

            {isEmpty ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-teal-900/50 mb-4">
                  <Building2 className="w-8 h-8 text-slate-400 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-emerald-50 mb-2">
                  No Workspaces Found
                </h3>
                <p className="text-sm text-slate-500 dark:text-teal-300 max-w-sm mx-auto">
                  No workspaces match your search. Try a different search term.
                </p>
              </div>
            ) : (
              <>
                {/* Tenant List */}
                <ScrollArea className="h-[400px] sm:h-[450px] pr-4">
                  <div className="space-y-2">
                    {filteredTenants.map((tenant) => (
                      <Card
                        key={tenant.id}
                        onClick={() => handleTenantSelect(tenant.id)}
                        className={cn(
                          'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-teal-300 dark:hover:border-emerald-500',
                          selectedTenant === tenant.id
                            ? 'border-2 border-teal-500 bg-teal-50/30 dark:bg-teal-900/40 dark:border-emerald-400 shadow-sm'
                            : 'border border-slate-200 dark:border-teal-800'
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Left: Icon */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-teal-900/60 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-slate-600 dark:text-teal-300" />
                              </div>
                            </div>

                            {/* Middle: Tenant Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-base text-slate-900 dark:text-emerald-50 truncate">
                                  {tenant.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={cn('text-xs font-bold px-2 py-0', getRoleBadgeColor(tenant.userRole))}
                                >
                                  {tenant.userRole}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-teal-300">
                                <span className="flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-teal-400"></span>
                                  {tenant.region}
                                </span>
                                <span>•</span>
                                <span>Last sync: {tenant.lastSync}</span>
                              </div>
                            </div>

                            {/* Right: Sync Status */}
                            <div className="flex-shrink-0">
                              {getSyncStatusBadge(tenant.syncStatus)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {/* Bottom Message */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-teal-800">
                  <p className="text-center text-sm text-slate-500 dark:text-teal-300 italic">
                    Please select a workspace to continue
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
