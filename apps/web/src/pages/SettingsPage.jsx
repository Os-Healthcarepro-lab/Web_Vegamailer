import React from 'react';
import { Helmet } from 'react-helmet';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <Helmet>
        <title>Settings | VegaMailer</title>
      </Helmet>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and business preferences.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 border-dashed">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium">Account Settings</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          This feature is coming soon. You will be able to update your profile, billing, and API keys here.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;