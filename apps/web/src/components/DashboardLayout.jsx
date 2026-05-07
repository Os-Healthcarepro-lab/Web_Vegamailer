import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Globe, 
  Users, 
  Send, 
  LayoutTemplate, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Domains', path: '/dashboard/domains', icon: Globe },
  { name: 'Subscribers', path: '/dashboard/subscribers', icon: Users },
  { name: 'Campaigns', path: '/dashboard/campaigns', icon: Send },
  { name: 'Templates', path: '/dashboard/templates', icon: LayoutTemplate },
  { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const DashboardLayout = () => {
  const { currentBusiness, currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLinks = ({ onClick }) => (
    <div className="flex flex-col gap-2 w-full">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary/20 p-1.5 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">VegaMailer</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 px-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Business</p>
            <p className="text-sm font-medium truncate">{currentBusiness?.name || 'Loading...'}</p>
          </div>
          <NavLinks />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
              {currentUser?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{currentUser?.email}</span>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b border-border bg-background sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">VegaMailer</span>
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-border">
              <span className="font-bold text-lg">Menu</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="mb-6 px-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Business</p>
                <p className="text-sm font-medium truncate">{currentBusiness?.name}</p>
              </div>
              <NavLinks onClick={() => setMobileOpen(false)} />
            </div>
            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;