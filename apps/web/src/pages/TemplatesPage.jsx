import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutTemplate, Plus, Trash2, Edit, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TemplatePreview } from '@/components/TemplatePreview.jsx';

const PREBUILT_TEMPLATES = [
  {
    id: 'pre-1',
    name: 'Welcome Email',
    category: 'welcome',
    subject: 'Welcome to our community!',
    htmlContent: '<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #333;">Welcome Aboard!</h1><p>We are thrilled to have you with us. Get ready for exciting updates.</p><a href="#" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Get Started</a></div>'
  },
  {
    id: 'pre-2',
    name: 'Monthly Newsletter',
    category: 'newsletter',
    subject: 'Your Monthly Update',
    htmlContent: '<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #333;">Monthly Highlights</h1><p>Here is what happened this month...</p><ul><li>Feature 1</li><li>Feature 2</li></ul></div>'
  },
  {
    id: 'pre-3',
    name: 'Special Promotion',
    category: 'promotional',
    subject: 'Exclusive 20% OFF Inside',
    htmlContent: '<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; text-align: center;"><h1 style="color: #e60000;">Flash Sale!</h1><p>Use code <strong>SAVE20</strong> at checkout.</p><a href="#" style="display: inline-block; padding: 15px 30px; background: #e60000; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold;">Shop Now</a></div>'
  },
  {
    id: 'pre-4',
    name: 'Order Receipt',
    category: 'transactional',
    subject: 'Your Order Confirmation',
    htmlContent: '<div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;"><h1 style="color: #333;">Thank you for your order</h1><p>Order #12345 has been confirmed.</p><hr style="border: 1px solid #eee; margin: 20px 0;"/><p>Total: $99.00</p></div>'
  }
];

const TemplatesPage = () => {
  const { currentBusiness } = useAuth();
  const [customTemplates, setCustomTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    subject: '',
    category: 'newsletter',
    htmlContent: ''
  });

  const fetchTemplates = async () => {
    if (!currentBusiness?.id) return;
    try {
      setLoading(true);
      const records = await pb.collection('emailTemplates').getFullList({
        filter: `businessId="${currentBusiness.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setCustomTemplates(records);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load custom templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [currentBusiness]);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleEdit = (template) => {
    setFormData({
      id: template.id,
      name: template.name,
      subject: template.subject,
      category: template.category || 'newsletter',
      htmlContent: template.htmlContent
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateNew = () => {
    setFormData({
      id: null,
      name: '',
      subject: '',
      category: 'newsletter',
      htmlContent: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.htmlContent) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        businessId: currentBusiness.id,
        name: formData.name,
        subject: formData.subject,
        category: formData.category,
        htmlContent: formData.htmlContent
      };

      if (formData.id) {
        await pb.collection('emailTemplates').update(formData.id, payload, { $autoCancel: false });
        toast.success('Template updated successfully');
      } else {
        await pb.collection('emailTemplates').create(payload, { $autoCancel: false });
        toast.success('Template created successfully');
      }
      
      setIsCreateModalOpen(false);
      fetchTemplates();
    } catch (error) {
      toast.error(error.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await pb.collection('emailTemplates').delete(id, { $autoCancel: false });
      toast.success('Template deleted');
      setCustomTemplates(customTemplates.filter(t => t.id !== id));
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const TemplateCard = ({ template, isCustom }) => (
    <Card className="flex flex-col glass-card hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutTemplate className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-muted rounded-full uppercase tracking-wider">
            {template.category}
          </span>
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-1">{template.subject}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-32 bg-white rounded-md border overflow-hidden relative opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }} dangerouslySetInnerHTML={{ __html: template.htmlContent }} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border/50 pt-4">
        <Button variant="outline" size="sm" onClick={() => handlePreview(template)}>
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
        {isCustom && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(template.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <Helmet>
        <title>Templates | VegaMailer</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-muted-foreground mt-1">Design and save reusable email layouts.</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>

      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="custom">My Templates</TabsTrigger>
          <TabsTrigger value="prebuilt">Pre-built Gallery</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="space-y-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map(i => <Card key={i} className="animate-pulse h-64 bg-muted/20"></Card>)}
            </div>
          ) : customTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 border-dashed">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <LayoutTemplate className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium">No custom templates</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                Create your own reusable email templates to save time on future campaigns.
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {customTemplates.map(t => <TemplateCard key={t.id} template={t} isCustom={true} />)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="prebuilt">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PREBUILT_TEMPLATES.map(t => <TemplateCard key={t.id} template={t} isCustom={false} />)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-muted/30 p-6">
            <TemplatePreview 
              htmlContent={selectedTemplate?.htmlContent} 
              subject={selectedTemplate?.subject} 
            />
          </div>
          <DialogFooter className="px-6 py-4 border-t bg-background">
            <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>Close</Button>
            <Button onClick={() => {
              setIsPreviewModalOpen(false);
              handleEdit(selectedTemplate);
            }}>
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Edit Template' : 'Create New Template'}</DialogTitle>
            <DialogDescription>
              Design your email layout using HTML.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTemplate} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Welcome Series Email 1" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({...formData, category: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Default Subject Line</Label>
              <Input 
                id="subject" 
                placeholder="Welcome to our platform!" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="htmlContent">HTML Content</Label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Textarea 
                  id="htmlContent" 
                  placeholder="<h1>Hello World</h1>" 
                  className="min-h-[400px] font-mono text-sm"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
                  required
                />
                <div className="hidden lg:block border rounded-md overflow-hidden bg-muted/30">
                  <div className="bg-muted px-3 py-2 text-xs font-medium border-b">Live Preview</div>
                  <div className="h-[calc(100%-37px)] overflow-auto p-4">
                    <div className="bg-white text-black min-h-full p-4 rounded shadow-sm" dangerouslySetInnerHTML={{ __html: formData.htmlContent || '<p style="color:#888;text-align:center;margin-top:20px;">Preview will appear here</p>' }} />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Template
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplatesPage;