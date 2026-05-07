import React from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3 } from 'lucide-react';

const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <Helmet>
        <title>Analytics | VegaMailer</title>
      </Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your campaign performance.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 border-dashed">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium">Detailed Reports</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          This feature is coming soon. You will be able to view detailed metrics on opens, clicks, bounces, and more.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;