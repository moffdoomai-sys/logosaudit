
// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Building, 
  Phone, 
  Save,
  Download,
  Upload,
  Trash2,
  Shield
} from 'lucide-react';
import { useAuditManager } from '@/hooks/use-audit-manager';
import { useToast } from '@/hooks/use-toast';
import { AuditWithRelations } from '@/lib/firebase/models';

export default function SettingsContent() {
  const { getAllAudits } = useAuditManager();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    title: '',
    company: '',
    phone: ''
  });
  
  const [audits, setAudits] = useState<AuditWithRelations[]>([]);

  useEffect(() => {
    loadAudits();
    loadProfile();
  }, []);

  const loadAudits = async () => {
    try {
      const allAudits = await getAllAudits();
      setAudits(allAudits);
    } catch (error) {
      console.error('Failed to load audits:', error);
    }
  };

  const loadProfile = () => {
    // Load profile from localStorage for now
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  };

  const handleSaveProfile = async () => {
    // Save profile to localStorage for now
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const exportData = () => {
    const data = {
      profile: profile,
      audits: audits,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logos-audit-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your audit data has been exported successfully.",
    });
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@company.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Senior Quality Auditor"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your company name"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} className="gap-2">
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Overview
          </CardTitle>
          <CardDescription>
            Your audit activity and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{audits.length}</div>
              <div className="text-sm text-muted-foreground">Total Audits</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {audits.filter(a => a.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {audits.filter(a => a.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export your data or reset your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Export Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your audit data as a JSON file for backup or migration purposes.
              </p>
              <Button onClick={exportData} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export All Data
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2 text-destructive">Danger Zone</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Clear all application data. This action cannot be undone.
              </p>
              <Button onClick={clearAllData} variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Information */}
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium">Application</Label>
              <p className="text-sm text-muted-foreground">LogosAudit v2.0</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Framework</Label>
              <p className="text-sm text-muted-foreground">ISO 9001:2015</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-muted-foreground">
                {typeof window !== 'undefined' && localStorage.getItem('userProfile') ? 'Profile saved locally' : 'Never'}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Data Storage</Label>
              <p className="text-sm text-muted-foreground">Firebase & Local</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
