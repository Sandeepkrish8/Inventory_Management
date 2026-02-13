"use client";
import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent } from '@/app/components/ui/card';
import { UserRole } from '@/app/types';
import { AlertCircle, Lock, User, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, role);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950">
      {/* Geometric Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Wavy lines */}
        <svg className="absolute top-10 left-10 w-16 h-32 text-teal-400/30" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 10 10 Q 20 30, 10 50 T 10 90" />
        </svg>
        <svg className="absolute bottom-20 left-20 w-16 h-32 text-teal-400/30" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M 10 10 Q 20 30, 10 50 T 10 90" />
        </svg>
        
        {/* Small geometric shapes */}
        <div className="absolute top-20 right-32 w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute top-24 right-28 w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute top-28 right-36 w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute top-40 left-1/4 w-6 h-6 border border-white/20 rotate-45" />
        <div className="absolute bottom-32 right-20 w-1.5 h-1.5 bg-emerald-300/40 rounded-full" />
        <div className="absolute bottom-40 left-1/3 w-8 h-8 border border-white/10" />
        
        {/* Dots grid */}
        <div className="absolute top-12 right-48">
          <div className="grid grid-cols-3 gap-2">
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="w-1 h-1 bg-white/30 rounded-full" />
            <div className="w-1 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
        
        {/* Polygons */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[500px] bg-gradient-to-br from-emerald-400/40 to-teal-500/30"
          style={{ clipPath: 'polygon(60% 0%, 100% 0%, 100% 100%, 20% 90%, 0% 30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[400px] bg-gradient-to-tr from-emerald-400/30 to-teal-400/20"
          style={{ clipPath: 'polygon(0% 40%, 50% 0%, 100% 30%, 70% 100%, 0% 100%)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-[0_30px_80px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left - Welcome Panel */}
              <div className="relative p-10 md:p-12 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 text-white overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-40">
                  <svg className="absolute top-8 left-8 w-20 h-40 text-emerald-300/50" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 15 10 Q 25 30, 15 50 T 15 90" />
                  </svg>
                  <svg className="absolute bottom-12 left-12 w-20 h-40 text-emerald-300/50" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M 15 10 Q 25 30, 15 50 T 15 90" />
                  </svg>
                  <div className="absolute top-16 right-16 w-2 h-2 bg-white/60 rounded-full" />
                  <div className="absolute top-20 right-12 w-2 h-2 bg-white/60 rounded-full" />
                  <div className="absolute top-24 right-20 w-2 h-2 bg-white/60 rounded-full" />
                  <div className="absolute bottom-20 left-1/3 w-12 h-12 border border-white/30 rotate-45" />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="w-8 h-0.5 bg-white/60" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Welcome back!</h2>
                  </div>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    You can sign in to access with your existing account.
                  </p>
                  
                  <div className="pt-8 space-y-2">
                    <p className="text-xs text-white/70">Role Access Levels:</p>
                    <div className="space-y-1">
                      <p className="text-xs text-white/80 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Admin - Full system access
                      </p>
                      <p className="text-xs text-white/80 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Staff - Edit & manage inventory
                      </p>
                      <p className="text-xs text-white/80 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Viewer - Read-only access
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Sign In Form */}
              <div className="p-10 md:p-12 bg-white">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold text-slate-900">Sign In</h3>
                    <p className="text-sm text-slate-500">Enter your credentials to continue</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive" className="animate-in slide-in-from-top-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-slate-700">Username or email</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="email"
                          type="text"
                          placeholder="Username or email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          className="h-11 pl-10 border-slate-300 focus-visible:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm text-slate-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          className="h-11 pl-10 border-slate-300 focus-visible:ring-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm text-slate-700">Role</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10 pointer-events-none" />
                        <Select value={role} onValueChange={(value: UserRole) => setRole(value)} disabled={loading}>
                          <SelectTrigger className="h-11 pl-10 border-slate-300 focus:ring-teal-500">
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
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <Checkbox id="remember" />
                        <span>Remember me</span>
                      </label>
                      <button type="button" className="text-sm text-slate-500 hover:text-teal-600 transition-colors">
                        Forgot password?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 text-white shadow-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    <div className="text-center text-sm text-slate-600">
                      New here?{' '}
                      <button type="button" className="text-teal-600 hover:text-teal-700 font-medium">
                        Create an account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};