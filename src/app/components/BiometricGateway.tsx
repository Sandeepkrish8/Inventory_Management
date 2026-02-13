import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/app/components/ui/input-otp';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { UserRole } from '@/app/types';
import { 
  User, 
  Lock, 
  Fingerprint, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle2,
  Shield,
  CreditCard,
  Scan
} from 'lucide-react';
import { toast } from 'sonner';

interface BiometricGatewayProps {
  onSuccess: () => void;
}

export const BiometricGateway: React.FC<BiometricGatewayProps> = ({ onSuccess }) => {
  const { login, loginWithBiometric, isBiometricAvailable } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('biometric');
  
  // Password login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Biometric state
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-select biometric tab if available
  useEffect(() => {
    if (isBiometricAvailable) {
      setActiveTab('biometric');
    } else {
      setActiveTab('password');
    }
  }, [isBiometricAvailable]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, role);
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      }
      toast.success('Authentication successful');
      onSuccess();
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setBiometricScanning(true);
    setBiometricStatus('scanning');
    
    try {
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = await loginWithBiometric();
      if (success) {
        setBiometricStatus('success');
        toast.success('Biometric authentication successful');
        setTimeout(() => onSuccess(), 500);
      } else {
        setBiometricStatus('error');
        toast.error('Biometric authentication failed');
      }
    } catch (error) {
      setBiometricStatus('error');
      toast.error('Biometric authentication error');
    } finally {
      setBiometricScanning(false);
      setTimeout(() => setBiometricStatus('idle'), 2000);
    }
  };

  const handleBadgeScan = async () => {
    setBiometricScanning(true);
    setBiometricStatus('scanning');
    
    try {
      // Simulate NFC badge scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock badge authentication
      const success = await loginWithBiometric();
      if (success) {
        setBiometricStatus('success');
        toast.success('Badge scan successful');
        setTimeout(() => onSuccess(), 500);
      } else {
        setBiometricStatus('error');
        toast.error('Badge not recognized');
      }
    } catch (error) {
      setBiometricStatus('error');
      toast.error('Badge scan error');
    } finally {
      setBiometricScanning(false);
      setTimeout(() => setBiometricStatus('idle'), 2000);
    }
  };

  const handleSendOTP = async () => {
    if (!otpEmail) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP send
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      toast.success('Verification code sent to your email');
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful verification
      if (otpCode === '123456') {
        await login(otpEmail, 'mock-password', 'Admin');
        toast.success('Verification successful');
        onSuccess();
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 flex items-center justify-center p-4">
      {/* Background geometric patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Status */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-400 mb-4 shadow-2xl shadow-teal-500/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-slate-400">Secure Identity Gateway</p>
          
          {/* Connectivity Status */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400">Offline Mode</span>
              </>
            )}
          </div>
        </div>

        {/* Main Authentication Card */}
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Choose your authentication method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="biometric" disabled={!isBiometricAvailable}>
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Biometric
                </TabsTrigger>
                <TabsTrigger value="password">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="otp">
                  <Smartphone className="w-4 h-4 mr-2" />
                  2FA
                </TabsTrigger>
              </TabsList>

              {/* Biometric Tab */}
              <TabsContent value="biometric" className="space-y-4">
                {!isOnline && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Offline biometric authentication using cached credentials
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Fingerprint/Face ID */}
                  <div className="text-center py-8">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 transition-all ${
                      biometricStatus === 'scanning' ? 'bg-teal-500/20 animate-pulse' :
                      biometricStatus === 'success' ? 'bg-emerald-500/20' :
                      biometricStatus === 'error' ? 'bg-red-500/20' :
                      'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {biometricStatus === 'success' ? (
                        <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                      ) : (
                        <Fingerprint className={`w-16 h-16 ${
                          biometricStatus === 'scanning' ? 'text-teal-500' :
                          biometricStatus === 'error' ? 'text-red-500' :
                          'text-slate-400'
                        }`} />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {biometricStatus === 'scanning' ? 'Scanning...' :
                       biometricStatus === 'success' ? 'Authenticated!' :
                       biometricStatus === 'error' ? 'Authentication Failed' :
                       'Use Your Biometric'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      {biometricStatus === 'idle' && 'Touch the sensor or scan your face'}
                      {biometricStatus === 'scanning' && 'Please wait...'}
                      {biometricStatus === 'success' && 'Access granted'}
                      {biometricStatus === 'error' && 'Please try again'}
                    </p>
                    <Button 
                      onClick={handleBiometricAuth}
                      disabled={biometricScanning}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                    >
                      {biometricScanning ? 'Scanning...' : 'Authenticate'}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or</span>
                    </div>
                  </div>

                  {/* Badge Scan */}
                  <div className="text-center py-4">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all ${
                      biometricStatus === 'scanning' ? 'bg-emerald-500/20 animate-pulse' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <CreditCard className={`w-12 h-12 ${
                        biometricStatus === 'scanning' ? 'text-emerald-500' : 'text-slate-400'
                      }`} />
                    </div>
                    <Button 
                      onClick={handleBadgeScan}
                      disabled={biometricScanning}
                      variant="outline"
                      className="w-full"
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      {biometricScanning ? 'Reading Badge...' : 'Scan Badge (NFC)'}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password" className="space-y-4">
                {!isOnline && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Offline mode: Using cached credentials
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                      <Select value={role} onValueChange={(value: UserRole) => setRole(value)} disabled={loading}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>Admin - Full Access</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Staff">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span>Staff - Standard Access</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Viewer">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span>Viewer - Read Only</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                      />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              {/* OTP Tab */}
              <TabsContent value="otp" className="space-y-4">
                {!otpSent ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        A 6-digit verification code will be sent to your email
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="otp-email">Email Address</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="otp-email"
                          type="email"
                          placeholder="admin@example.com"
                          className="pl-10"
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSendOTP}
                      className="w-full"
                      disabled={loading}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      {loading ? 'Sending...' : 'Send Verification Code'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800 dark:text-emerald-400">
                        Verification code sent to {otpEmail}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label className="text-center block">Enter 6-Digit Code</Label>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-xs text-center text-slate-500">
                        Demo code: 123456
                      </p>
                    </div>

                    <Button 
                      onClick={handleVerifyOTP}
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600"
                      disabled={loading || otpCode.length !== 6}
                    >
                      {loading ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    <button
                      onClick={() => setOtpSent(false)}
                      className="w-full text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      Use different email
                    </button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Fallback Link */}
            {activeTab !== 'password' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveTab('password')}
                  className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  Hardware failure? Login with credentials →
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Secured by multi-factor authentication</p>
          <p className="mt-1">© 2026 Inventory Management System</p>
        </div>
      </div>
    </div>
  );
};
