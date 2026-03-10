import React, { useState } from 'react';
import { useTenant } from '@/app/contexts/TenantContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Progress } from '@/app/components/ui/progress';
import { CreditCard, CheckCircle2, Zap, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for small businesses just getting started.',
    features: ['Up to 500 Products', '1 Warehouse', 'Basic Reporting', 'Community Support'],
    limit: 500,
    icon: Shield
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '$49/mo',
    description: 'Everything you need to grow your operations.',
    features: ['Up to 5,000 Products', '3 Warehouses', 'Advanced Analytics', 'Email Support'],
    limit: 5000,
    icon: Zap,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199/mo',
    description: 'Advanced features for scaling organizations.',
    features: ['Unlimited Products', 'Unlimited Warehouses', 'Custom Integrations', '24/7 Priority Support'],
    limit: Infinity,
    icon: CheckCircle2
  }
];

export const SubscriptionPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [loading, setLoading] = useState(false);

  // Mock usage data
  const currentUsage = 342;
  const currentPlan = PRICING_PLANS.find(p => p.id === (currentTenant?.subscription || 'free')) || PRICING_PLANS[0];
  const usagePercentage = currentPlan.limit === Infinity ? 0 : Math.round((currentUsage / currentPlan.limit) * 100);

  const handleUpgrade = (planId: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Successfully upgraded to the ${planId} plan!`);
    }, 1500);
  };

  if (!currentTenant) return null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Subscription & Billing</h2>
        <p className="text-slate-500 mt-1">Manage your plan, usage, and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Overview */}
        <Card className="lg:col-span-2 border-teal-100 dark:border-teal-900 shadow-md">
          <CardHeader className="bg-teal-50/50 dark:bg-teal-950/20 rounded-t-xl border-b border-teal-100 dark:border-teal-900">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-teal-600 dark:text-teal-400 font-medium tracking-wide uppercase text-xs mb-1">
                  Current Plan
                </CardDescription>
                <CardTitle className="text-2xl capitalize">{currentPlan.name}</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Limit Usage</h4>
                  <span className="text-sm text-slate-500">
                    {currentUsage} / {currentPlan.limit === Infinity ? 'Unlimited' : currentPlan.limit} Products
                  </span>
                </div>
                <Progress 
                  value={usagePercentage} 
                  className={`h-2 ${usagePercentage > 90 ? '[&>div]:bg-red-500' : usagePercentage > 75 ? '[&>div]:bg-amber-500' : '[&>div]:bg-teal-500'}`} 
                />
                {usagePercentage > 90 && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    You are nearing your product limit. Upgrade to add more.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Next Billing Date</p>
                  <p className="font-semibold text-slate-900 dark:text-white">Oct 15, 2026</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Billing Amount</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{currentPlan.price}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
            <CardDescription>Primary billing card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white tracking-wide">
                  •••• •••• •••• 4242
                </p>
                <p className="text-xs text-slate-500">Expires 12/28</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-xs">
              Update Payment Method
            </Button>
            <Button variant="ghost" className="w-full text-xs text-slate-500 hover:text-slate-700">
              View Billing History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Available Plans */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Upgrade Your Plan</h3>
          <p className="text-sm text-slate-500">Choose the right features for your growing business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = currentPlan.id === plan.id;
            const PlanIcon = plan.icon;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 ${plan.popular ? 'border-2 border-indigo-500 shadow-xl scale-[1.02]' : 'hover:border-slate-300 dark:hover:border-slate-600'} ${isCurrent ? 'opacity-80' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${plan.popular ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <PlanIcon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-end justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price.split('/')[0]}</span>
                    {plan.price.includes('/') && <span className="text-slate-500 mb-1">/mo</span>}
                  </div>
                  <CardDescription className="mt-2 text-xs">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-teal-500' : 'text-slate-400'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant={isCurrent ? "outline" : (plan.popular ? "default" : "secondary")}
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-purple-700 text-white' : ''}`}
                    disabled={isCurrent || loading}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    {isCurrent ? 'Current Plan' : (
                      <>
                        Upgrade to {plan.name}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
