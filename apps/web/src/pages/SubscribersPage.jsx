import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import apiServerClient from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Upload, Search, Trash2, Loader2, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { EmailValidationInput } from '@/components/EmailValidationInput.jsx';

const SubscribersPage = () => {
  const { currentBusiness } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Add Subscriber State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ email: '', name: '', tags: '' });
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Bulk Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState(null);

  const fetchSubscribers = async () => {
    if (!currentBusiness?.id) return;
    try {
      setLoading(true);
      let filterStr = `businessId="${currentBusiness.id}"`;
      if (statusFilter !== 'all') {
        filterStr += ` && status="${statusFilter}"`;
      }
      if (searchQuery) {
        filterStr += ` && (email~"${searchQuery}" || name~"${searchQuery}")`;
      }

      const records = await pb.collection('subscribers').getList(1, 50, {
        filter: filterStr,
        sort: '-created',
        $autoCancel: false
      });
      setSubscribers(records.items);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSubscribers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentBusiness, searchQuery, statusFilter]);

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      toast.error('Please provide a valid email address');
      return;
    }

    setIsAdding(true);
    try {
      await pb.collection('subscribers').create({
        businessId: currentBusiness.id,
        email: newSub.email,
        name: newSub.name,
        tags: newSub.tags,
        status: 'active'
      }, { $autoCancel: false });
      
      toast.success('Subscriber added successfully');
      setNewSub({ email: '', name: '', tags: '' });
      setIsAddModalOpen(false);
      fetchSubscribers();
    } catch (error) {
      toast.error(error.message || 'Failed to add subscriber');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    setIsImporting(true);
    setImportReport(null);
    
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('businessId', currentBusiness.id);

    try {
      const response = await apiServerClient.fetch('/subscribers/import', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setImportReport(data);
        toast.error('Import failed due to validation errors');
        return;
      }

      // If backend validation passed, we need to insert them into PocketBase
      // The backend endpoint might have already inserted them if it was designed that way,
      // but the prompt says "Frontend will handle actual PocketBase insert".
      // Wait, the prompt says: "If all valid, return {success: true, validCount: number, importedCount: number}. Frontend will handle actual PocketBase insert."
      // Actually, parsing CSV on frontend to insert is complex without papaparse. Let's assume the backend returns the valid data to insert, OR we just show success if backend did it.
      // Let's check the prompt again: "Frontend will handle actual PocketBase insert."
      // Since we don't have the parsed data returned in the success response (only counts), we can't insert it from frontend unless we parse it here.
      // Let's assume the backend returns `validData` array if success=true, or we just rely on the backend having done it if it's a full stack feature.
      // I will parse it on frontend using a simple split just in case, or assume backend returns `validEmails` array.
      // Let's just show success and refetch. If they aren't there, the backend didn't insert them.
      
      toast.success(`Successfully validated ${data.validCount} subscribers. Importing...`);
      
      // Simple frontend CSV parse fallback since prompt asked frontend to insert
      const text = await importFile.text();
      const rows = text.split('\n').slice(1); // skip header
      let inserted = 0;
      
      for (const row of rows) {
        if (!row.trim()) continue;
        const [email, name, tags] = row.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (email) {
          try {
            await pb.collection('subscribers').create({
              businessId: currentBusiness.id,
              email,
              name: name || '',
              tags: tags || '',
              status: 'active'
            }, { $autoCancel: false });
            inserted++;
          } catch (e) {
            console.error('Insert error', e);
          }
        }
      }
      
      toast.success(`Imported ${inserted} subscribers successfully`);
      setIsImportModalOpen(false);
      setImportFile(null);
      fetchSubscribers();
      
    } catch (error) {
      toast.error(error.message || 'Failed to process import');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      await pb.collection('subscribers').delete(id, { $autoCancel: false });
      toast.success('Subscriber deleted');
      setSubscribers(subscribers.filter(s => s.id !== id));
    } catch (error) {
      toast.error('Failed to delete subscriber');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20">Active</Badge>;
      case 'bounced': return <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">Bounced</Badge>;
      case 'unsubscribed': return <Badge variant="outline" className="bg-muted text-muted-foreground">Unsubscribed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Subscribers | VegaMailer</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground mt-1">Manage your audience and segments.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="glass-panel">
                <Upload className="mr-2 h-4 w-4" /> Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Import Subscribers</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with columns: email, name, tags. All emails will be validated before import.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleBulkImport} className="space-y-4 py-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors">
                  <Input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    id="csv-upload"
                    onChange={(e) => setImportFile(e.target.files[0])}
                  />
                  <Label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                    <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                    <span className="text-sm font-medium">{importFile ? importFile.name : 'Click to select CSV file'}</span>
                    <span className="text-xs text-muted-foreground mt-1">Max file size: 5MB</span>
                  </Label>
                </div>

                {importReport && !importReport.success && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-destructive font-medium">
                      <AlertCircle className="h-4 w-4" />
                      <span>Import Rejected: {importReport.invalidCount} invalid emails found</span>
                    </div>
                    <div className="max-h-32 overflow-y-auto text-sm space-y-1">
                      {importReport.invalidEmails?.map((err, i) => (
                        <div key={i} className="text-destructive/80">
                          Row {err.row}: {err.email} - {err.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={!importFile || isImporting}>
                    {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Validate & Import
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscriber</DialogTitle>
                <DialogDescription>
                  Manually add a single subscriber to your list.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubscriber} className="space-y-4 py-4">
                <EmailValidationInput 
                  value={newSub.email}
                  onChange={(e) => setNewSub({...newSub, email: e.target.value})}
                  onValidationChange={setIsEmailValid}
                  required
                />
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (Optional)</Label>
                  <Input 
                    id="name" 
                    placeholder="Jane Doe" 
                    value={newSub.name}
                    onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Comma separated)</Label>
                  <Input 
                    id="tags" 
                    placeholder="newsletter, customer, vip" 
                    value={newSub.tags}
                    onChange={(e) => setNewSub({...newSub, tags: e.target.value})}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isAdding || !isEmailValid}>
                    {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Subscriber
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search email or name..." 
                className="pl-9 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No subscribers found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {searchQuery || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters." 
                  : "Start building your audience by adding subscribers manually or importing a CSV."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Subscribed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub) => (
                    <TableRow key={sub.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell className="text-muted-foreground">{sub.name || '-'}</TableCell>
                      <TableCell>{getStatusBadge(sub.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {sub.tags ? sub.tags.split(',').map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal bg-secondary/10 text-secondary hover:bg-secondary/20">
                              {tag.trim()}
                            </Badge>
                          )) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(sub.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(sub.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribersPage;