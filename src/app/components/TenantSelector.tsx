import React, { useState, useEffect } from 'react';
import { useTenant } from '@/app/contexts/TenantContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { 
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Database,
  Globe,
  Loader2,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { Tenant, Environment } from '@/app/types';

interface TenantSelectorProps {
  onComplete: () => void;
}

export const TenantSelector: React.FC<TenantSelectorProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { availableTenants, switchTenant, switchEnvironment, currentTenant, currentEnvironment } = useTenant();
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Pre-select current or first tenant
  useEffect(() => {
    if (currentTenant) {
      setSelectedTenantId(currentTenant.id);
      if (currentEnvironment) {
        setSelectedEnvironmentId(currentEnvironment.id);
      }
    } else if (availableTenants.length > 0) {
      const firstTenant = availableTenants[0];
      setSelectedTenantId(firstTenant.id);
      
      // Auto-select first active environment
      const firstActiveEnv = firstTenant.environments.find(e => e.status === 'active');
      if (firstActiveEnv) {
        setSelectedEnvironmentId(firstActiveEnv.id);
      } else if (firstTenant.environments.length > 0) {
        setSelectedEnvironmentId(firstTenant.environments[0].id);
      }
    }
  }, [availableTenants, currentTenant, currentEnvironment]);

  const selectedTenant = availableTenants.find(t => t.id === selectedTenantId);
  const selectedEnvironment = selectedTenant?.environments.find(e => e.id === selectedEnvironmentId);

  const handleContinue = async () => {
    if (!selectedTenantId || !selectedEnvironmentId) {
      toast.error('Please select both organization and environment');
      return;
    }

    setLoading(true);
    try {
      // Simulate tenant switch delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switchTenant(selectedTenantId);
      switchEnvironment(selectedEnvironmentId);
      
      toast.success(`Connected to ${selectedTenant?.name} - ${selectedEnvironment?.type}`);
      onComplete();
    } catch (error) {
      toast.error('Failed to switch workspace');
    } finally {
      setLoading(false);
    }
  };

  const getDbSyncStatusBadge = (status: Environment['dbSyncStatus']) => {
    switch (status) {
      case 'synced':
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Synced</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">Syncing</Badge>;
      case 'error':
        return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">Error</Badge>;
      case 'offline':
        return <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">Offline</Badge>;
    }
  };

  const getEnvironmentTypeBadge = (type: Environment['type']) => {
    switch (type) {
      case 'production':
        return <Badge variant="destructive">Production</Badge>;
      case 'staging':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Staging</Badge>;
      case 'development':
        return <Badge variant="secondary">Development</Badge>;
    }
  };

  const getEnvironmentStatusIcon = (status: Environment['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
      case 'maintenance':
        return <RefreshCw className="w-4 h-4 text-amber-500" />;
    }
  };

  const getUserRole = (tenantId: string) => {
    const tenantRole = user?.tenants?.find(t => t.tenantId === tenantId);
    return tenantRole?.role || user?.role || 'Viewer';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background geometric patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 shadow-2xl shadow-indigo-500/50">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Select Workspace</h1>
          <p className="text-slate-400">Choose your organization and environment</p>
          {user && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700">
              <Avatar className="w-6 h-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-300">{user.name}</span>
              <Badge variant="outline" className="text-xs">{user.email}</Badge>
            </div>
          )}
        </div>

        {/* Main Selection Card */}
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
          <CardHeader className="text-center pb-4">
            <CardDescription>
              {availableTenants.length === 0 ? (
                <span className="text-amber-600">No workspaces available</span>
              ) : (
                <span>You have access to {availableTenants.length} workspace{availableTenants.length !== 1 ? 's' : ''}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableTenants.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No workspaces are available for your account. Please contact your administrator.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Tenant Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Organization
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {availableTenants.length} available
                    </Badge>
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {availableTenants.map((tenant) => (
                        <Card
                          key={tenant.id}
                          className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                            selectedTenantId === tenant.id
                              ? 'ring-2 ring-indigo-500 border-indigo-500 shadow-md'
                              : 'hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          onClick={() => {
                            setSelectedTenantId(tenant.id);
                            // Auto-select first active environment
                            const firstActiveEnv = tenant.environments.find(e => e.status === 'active');
                            if (firstActiveEnv) {
                              setSelectedEnvironmentId(firstActiveEnv.id);
                            } else if (tenant.environments.length > 0) {
                              setSelectedEnvironmentId(tenant.environments[0].id);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={tenant.logo} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                                  {tenant.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="font-semibold text-sm truncate">{tenant.name}</h3>
                                  {selectedTenantId === tenant.id && (
                                    <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">
                                    {getUserRole(tenant.id)}
                                  </Badge>
                                  <Badge 
                                    variant={tenant.subscription === 'enterprise' ? 'default' : 'secondary'}
                                    className="text-xs capitalize"
                                  >
                                    {tenant.subscription}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  {tenant.environments.length} environment{tenant.environments.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right: Environment Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Environment
                    </Label>
                    {selectedTenant && (
                      <Badge variant="outline" className="text-xs">
                        {selectedTenant.environments.length} available
                      </Badge>
                    )}
                  </div>

                  {!selectedTenant ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Select an organization to view available environments
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ScrollArea className="h-[400px] pr-4">
                      <RadioGroup value={selectedEnvironmentId} onValueChange={setSelectedEnvironmentId}>
                        <div className="space-y-3">
                          {selectedTenant.environments.map((env) => (
                            <Card
                              key={env.id}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedEnvironmentId === env.id
                                  ? 'ring-2 ring-indigo-500 border-indigo-500'
                                  : 'hover:border-slate-300 dark:hover:border-slate-600'
                              }`}
                              onClick={() => setSelectedEnvironmentId(env.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <RadioGroupItem value={env.id} id={env.id} className="mt-1" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <Label htmlFor={env.id} className="font-semibold cursor-pointer flex items-center gap-2">
                                        {env.name}
                                        {getEnvironmentStatusIcon(env.status)}
                                      </Label>
                                      {getEnvironmentTypeBadge(env.type)}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-2">
                                      <Shield className="w-3 h-3 text-slate-400" />
                                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                        {env.url}
                                      </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Database className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                          DB Sync:
                                        </span>
                                        {getDbSyncStatusBadge(env.dbSyncStatus)}
                                      </div>
                                      {env.lastSyncAt && (
                                        <span className="text-xs text-slate-400">
                                          {new Date(env.lastSyncAt).toLocaleTimeString()}
                                        </span>
                                      )}
                                    </div>

                                    {env.status === 'maintenance' && (
                                      <Alert className="mt-2 py-2">
                                        <AlertCircle className="h-3 w-3" />
                                        <AlertDescription className="text-xs">
                                          Maintenance mode - limited access
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </RadioGroup>
                    </ScrollArea>
                  )}
                </div>
              </div>
            )}

            {/* Summary and Action */}
            {selectedTenant && selectedEnvironment && (
              <>
                <Separator className="my-6" />
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    Selected Workspace
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={selectedTenant.logo} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                          {selectedTenant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{selectedTenant.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {selectedEnvironment.name} ({selectedEnvironment.type})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getUserRole(selectedTenant.id)}</Badge>
                      {getDbSyncStatusBadge(selectedEnvironment.dbSyncStatus)}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Continue to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Supports 3PL multi-tenant architecture with strict data isolation</p>
        </div>
      </div>
    </div>
  );
};
