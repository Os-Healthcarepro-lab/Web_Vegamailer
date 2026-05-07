import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Send, Plus, Trash2, Loader2, Eye, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { CampaignAnalyticsCard } from '@/components/CampaignAnalyticsCard.jsx';

const CampaignsPage = () => {
  const { currentBusiness } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [domains, setDomains] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Campaign State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    senderId: '',
    recipientTag: '',
    subject: '',
    htmlContent: '',
    scheduleType: 'now',
    scheduledAt: ''
  });

  // View Details State
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const fetchData = async () => {
    if (!currentBusiness?.id) return;
    try {
      setLoading(true);
      
      // Fetch Campaigns
      const camps = await pb.collection('campaigns').getList(1, 50, {
        filter: `businessId="${currentBusiness.id}"`,
        sort: '-created',
        expand: 'senderId',
        $autoCancel: false
      });
      setCampaigns(camps.items);

      // Fetch Verified Domains
      const doms = await pb.collection('senderDomains').getFullList({
        filter: `businessId="${currentBusiness.id}" && status="verified"`,
        $autoCancel: false
      });
      setDomains(doms);

      // Fetch unique tags from subscribers
      const subs = await pb.collection('subscribers').getFullList({
        filter: `businessId="${currentBusiness.id}" && status="active"`,
        $autoCancel: false
      });
      
      const uniqueTags = new Set();
      subs.forEach(sub => {
        if (sub.tags) {
          sub.tags.split(',').forEach(t => uniqueTags.add(t.trim()));
        }
      });
      setTags(Array.from(uniqueTags));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load campaigns data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentBusiness]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.senderId || !newCampaign.subject || !newCampaign.htmlContent) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        businessId: currentBusiness.id,
        name: newCampaign.name,
        subject: newCampaign.subject,
        htmlContent: newCampaign.htmlContent,
        senderId: newCampaign.senderId,
        recipientListId: newCampaign.recipientTag, // Using tag as list identifier for now
        scheduledAt: newCampaign.scheduleType === 'later' ? new Date(newCampaign.scheduledAt).toISOString() : null
      };

      const response = await apiServerClient.fetch('/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      toast.success('Campaign created successfully');
      setIsCreateModalOpen(false);
      setNewCampaign({
        name: '', senderId: '', recipientTag: '', subject: '', htmlContent: '', scheduleType: 'now', scheduledAt: ''
      });
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await pb.collection('campaigns').delete(id, { $autoCancel: false });
      toast.success('Campaign deleted');
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  const handleViewDetails = async (campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsModalOpen(true);
    
    try {
      // Fetch analytics for this campaign
      const analyticsRecords = await pb.collection('campaignAnalytics').getFullList({
        filter: `campaignId="${campaign.id}"`,
        $autoCancel: false
      });
      
      if (analyticsRecords.length > 0) {
        setAnalytics(analyticsRecords[0]);
      } else {
        // Mock empty analytics if none exist yet
        setAnalytics({ sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent': return <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Sent</Badge>;
      case 'scheduled': return <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"><Clock className="w-3 h-3 mr-1" /> Scheduled</Badge>;
      case 'failed': return <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default: return <Badge variant="outline" className="bg-muted text-muted-foreground">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Campaigns | VegaMailer</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and schedule email campaigns.</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Design your email and choose your audience.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Summer Sale 2024" 
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender">Sender Domain</Label>
                  <Select 
                    value={newCampaign.senderId} 
                    onValueChange={(val) => setNewCampaign({...newCampaign, senderId: val})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select verified domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.length === 0 ? (
                        <SelectItem value="none" disabled>No verified domains found</SelectItem>
                      ) : (
                        domains.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.domain}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Recipient Segment (Tag)</Label>
                <Select 
                  value={newCampaign.recipientTag} 
                  onValueChange={(val) => setNewCampaign({...newCampaign, recipientTag: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Active Subscribers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Active Subscribers</SelectItem>
                    {tags.map(t => (
                      <SelectItem key={t} value={t}>Tag: {t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input 
                  id="subject" 
                  placeholder="Don't miss out on these deals!" 
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content (HTML)</Label>
                <Textarea 
                  id="content" 
                  placeholder="<h1>Hello World</h1><p>Your content here...</p>" 
                  className="min-h-[200px] font-mono text-sm"
                  value={newCampaign.htmlContent}
                  onChange={(e) => setNewCampaign({...newCampaign, htmlContent: e.target.value})}
                  required
                />
                <p className="text-xs text-muted-foreground">Basic HTML is supported. Use inline styles for best compatibility.</p>
              </div>

              <div className="space-y-3 border rounded-xl p-4 bg-muted/20">
                <Label>Schedule</Label>
                <RadioGroup 
                  value={newCampaign.scheduleType} 
                  onValueChange={(val) => setNewCampaign({...newCampaign, scheduleType: val})}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now" className="font-normal">Send immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="later" />
                    <Label htmlFor="later" className="font-normal">Schedule for later</Label>
                  </div>
                </RadioGroup>
                
                {newCampaign.scheduleType === 'later' && (
                  <div className="pt-2 pl-6">
                    <Input 
                      type="datetime-local" 
                      value={newCampaign.scheduledAt}
                      onChange={(e) => setNewCampaign({...newCampaign, scheduledAt: e.target.value})}
                      required={newCampaign.scheduleType === 'later'}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isCreating || domains.length === 0}>
                  {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  {newCampaign.scheduleType === 'now' ? 'Create & Send' : 'Schedule Campaign'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-48 bg-muted/20"></Card>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 border-dashed">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No campaigns yet</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">
            Create your first email campaign to start engaging with your audience.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col glass-card hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  {getStatusBadge(campaign.status)}
                  <span className="text-xs text-muted-foreground">
                    {new Date(campaign.created).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-1" title={campaign.name}>{campaign.name}</CardTitle>
                <CardDescription className="line-clamp-1" title={campaign.subject}>{campaign.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sender:</span>
                    <span className="font-medium truncate ml-2">{campaign.expand?.senderId?.domain || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audience:</span>
                    <span className="font-medium">{campaign.recipientListId === 'all' ? 'All Active' : `Tag: ${campaign.recipientListId}`}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/50 pt-4">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(campaign)}>
                  <Eye className="mr-2 h-4 w-4" /> Details
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(campaign.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <DialogTitle className="text-2xl">{selectedCampaign?.name}</DialogTitle>
              {selectedCampaign && getStatusBadge(selectedCampaign.status)}
            </div>
            <DialogDescription>
              Subject: {selectedCampaign?.subject}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-8">
            <CampaignAnalyticsCard stats={analytics} />
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Campaign Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/30 rounded-lg border">
                  <span className="text-muted-foreground block mb-1">Created On</span>
                  <span className="font-medium">{selectedCampaign ? new Date(selectedCampaign.created).toLocaleString() : ''}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border">
                  <span className="text-muted-foreground block mb-1">Scheduled For</span>
                  <span className="font-medium">{selectedCampaign?.scheduledAt ? new Date(selectedCampaign.scheduledAt).toLocaleString() : 'Immediate'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsPage;