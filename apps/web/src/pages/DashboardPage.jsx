import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Send, MousePointerClick, AlertCircle, Plus, ArrowUpRight, Globe, LayoutTemplate } from 'lucide-react';
import { Link } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const DashboardPage = () => {
  const { currentBusiness } = useAuth();
  const [stats, setStats] = useState({
    subscribers: 0,
    campaigns: 0,
    sent: 0,
    openRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentBusiness?.id) return;
      
      try {
        // Fetch subscribers count
        const subs = await pb.collection('subscribers').getList(1, 1, {
          filter: `businessId="${currentBusiness.id}"`,
          $autoCancel: false
        });
        
        // Fetch campaigns count
        const camps = await pb.collection('campaigns').getList(1, 1, {
          filter: `businessId="${currentBusiness.id}"`,
          $autoCancel: false
        });

        // Mocking sent and open rate for now since we don't have aggregated analytics yet
        setStats({
          subscribers: subs.totalItems,
          campaigns: camps.totalItems,
          sent: camps.totalItems * 1250, // Mock data
          openRate: 24.8 // Mock data
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentBusiness]);

  const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? '-' : value}</div>
        {trend && (
          <p className={`text-xs mt-1 flex items-center ${trendUp ? 'text-emerald-500' : 'text-destructive'}`}>
            {trendUp ? '+' : '-'}{trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Dashboard | VegaMailer</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back to {currentBusiness?.name || 'your dashboard'}.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/dashboard/subscribers">
              <Users className="mr-2 h-4 w-4" /> Add Subscriber
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/campaigns">
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Subscribers" 
          value={stats.subscribers.toLocaleString()} 
          icon={Users} 
          trend="12.5" 
          trendUp={true} 
        />
        <StatCard 
          title="Active Campaigns" 
          value={stats.campaigns.toLocaleString()} 
          icon={Send} 
        />
        <StatCard 
          title="Emails Sent" 
          value={stats.sent.toLocaleString()} 
          icon={MousePointerClick} 
          trend="4.2" 
          trendUp={true} 
        />
        <StatCard 
          title="Avg. Open Rate" 
          value={`${stats.openRate}%`} 
          icon={AlertCircle} 
          trend="1.1" 
          trendUp={false} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.campaigns === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No campaigns yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                  Create your first email campaign to start engaging with your audience.
                </p>
                <Button asChild>
                  <Link to="/dashboard/campaigns">Create Campaign</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Placeholder for recent campaigns list */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Welcome Series - Email 1</p>
                    <p className="text-sm text-muted-foreground">Sent 2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-500">42.1% Open</p>
                    <p className="text-sm text-muted-foreground">1,240 delivered</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/dashboard/domains" className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Verify Sender Domain</h4>
                <p className="text-sm text-muted-foreground">Improve deliverability</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link to="/dashboard/templates" className="flex items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors group">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mr-4">
                <LayoutTemplate className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Create Template</h4>
                <p className="text-sm text-muted-foreground">Design your next email</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;