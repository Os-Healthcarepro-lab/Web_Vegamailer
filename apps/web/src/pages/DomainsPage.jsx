import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Trash2, CheckCircle2, AlertCircle, Clock, Copy, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DomainsPage = () => {
  const { currentBusiness } = useAuth();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isDnsModalOpen, setIsDnsModalOpen] = useState(false);

  const fetchDomains = async () => {
    if (!currentBusiness?.id) return;
    try {
      setLoading(true);
      const response = await apiServerClient.fetch(`/domains/${currentBusiness.id}`);
      if (!response.ok) throw new Error('Failed to fetch domains');
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [currentBusiness]);

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain) return;

    setIsAdding(true);
    try {
      const response = await apiServerClient.fetch('/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain, businessId: currentBusiness.id })
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to add domain');
      }
      
      toast.success('Domain added successfully');
      setNewDomain('');
      setIsAddModalOpen(false);
      fetchDomains();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleVerify = async (domainObj) => {
    setVerifyingId(domainObj.id);
    try {
      const response = await apiServerClient.fetch('/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainObj.domain, businessId: currentBusiness.id })
      });
      
      const data = await response.json();
      
      if (data.verified) {
        toast.success(`${domainObj.domain} verified successfully!`);
      } else {
        toast.error(`Verification pending. Please check DNS records.`);
        // Show DNS records modal
        setSelectedDomain({ ...domainObj, records: data.records });
        setIsDnsModalOpen(true);
      }
      fetchDomains();
    } catch (error) {
      toast.error('Verification check failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this domain?')) return;
    
    try {
      const response = await apiServerClient.fetch(`/domains/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      toast.success('Domain deleted');
      setDomains(domains.filter(d => d.id !== id));
    } catch (error) {
      toast.error('Failed to delete domain');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Sender Domains | VegaMailer</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sender Domains</h1>
          <p className="text-muted-foreground mt-1">Manage the domains you use to send emails.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sender Domain</DialogTitle>
              <DialogDescription>
                Enter the domain you want to send emails from (e.g., example.com).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDomain}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                  <Input 
                    id="domain" 
                    placeholder="example.com" 
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isAdding || !newDomain}>
                  {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Domain
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted/50 rounded-t-xl"></CardHeader>
              <CardContent className="h-16"></CardContent>
            </Card>
          ))}
        </div>
      ) : domains.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card/50 border-dashed">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">No domains configured</h3>
          <p className="text-muted-foreground mt-2 mb-6 max-w-md">
            Add a sender domain to start sending campaigns. You'll need to verify ownership by adding DNS records.
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Domain
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => (
            <Card key={domain.id} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{domain.domain}</CardTitle>
                  </div>
                  {getStatusBadge(domain.status)}
                </div>
                <CardDescription className="mt-2">
                  Added {new Date(domain.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {domain.status !== 'verified' && (
                  <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
                    DNS records need to be configured to verify ownership and ensure deliverability.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleVerify(domain)}
                  disabled={verifyingId === domain.id}
                >
                  {verifyingId === domain.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {domain.status === 'verified' ? 'Re-verify' : 'Verify DNS'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(domain.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* DNS Records Modal */}
      <Dialog open={isDnsModalOpen} onOpenChange={setIsDnsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure DNS Records</DialogTitle>
            <DialogDescription>
              Add these records to your domain's DNS settings to verify ownership for {selectedDomain?.domain}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDomain?.records && (
            <div className="space-y-6 py-4">
              {Object.entries(selectedDomain.records).map(([type, value]) => {
                if (!value) return null;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="uppercase font-bold text-xs tracking-wider text-muted-foreground">{type} Record</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono break-all border">
                        {value}
                      </code>
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(value)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              <div className="bg-primary/10 text-primary p-4 rounded-lg text-sm flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>DNS changes can take up to 24 hours to propagate globally. If verification fails immediately after adding records, please try again later.</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDnsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainsPage;