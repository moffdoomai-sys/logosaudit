
// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Plus, 
  Play, 
  Eye, 
  X, 
  TrendingUp,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuditManager } from '@/hooks/use-audit-manager';
import { AuditWithRelations } from '@/lib/firebase/models';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardContent() {
  const router = useRouter();
  const { getAllAudits, updateAudit, deleteAudit, isLoadingAudits } = useAuditManager();
  
  const [audits, setAudits] = useState<AuditWithRelations[]>([]);
  const [stats, setStats] = useState({
    totalAudits: 0,
    activeAudits: 0,
    completedAudits: 0,
    averageScore: 0
  });

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const allAudits = await getAllAudits();
      setAudits(allAudits);
      
      // Calculate stats
      const totalAudits = allAudits.length;
      const activeAudits = allAudits.filter(a => a.status === 'IN_PROGRESS').length;
      const completedAudits = allAudits.filter(a => a.status === 'COMPLETED').length;
      const completedWithScores = allAudits.filter(a => a.status === 'COMPLETED' && a.overallScore);
      const averageScore = completedWithScores.length > 0 
        ? completedWithScores.reduce((sum, a) => sum + (a.overallScore || 0), 0) / completedWithScores.length
        : 0;
      
      setStats({
        totalAudits,
        activeAudits,
        completedAudits,
        averageScore
      });
    } catch (error) {
      console.error('Failed to load audits:', error);
    }
  };

  const handleContinueAudit = (auditId: string) => {
    router.push(`/audit-execution/${auditId}`);
  };

  const handleViewAudit = (auditId: string) => {
    router.push(`/audit-view/${auditId}`);
  };

  const handleCancelAudit = async (auditId: string) => {
    if (confirm('Are you sure you want to cancel this audit?')) {
      try {
        await updateAudit(auditId, { status: 'CANCELLED' });
        await loadAudits(); // Refresh the list
      } catch (error) {
        console.error('Failed to cancel audit:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Activity className="h-4 w-4" />;
      case 'CANCELLED':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoadingAudits) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAudits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAudits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAudits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageScore > 0 ? `${stats.averageScore.toFixed(1)}%` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Audits Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Audits</CardTitle>
              <CardDescription>
                Manage and track your audit activities
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/new-audit')} className="gap-2">
              <Plus className="h-4 w-4" />
              New Audit
            </Button>
          </CardHeader>
          <CardContent>
            {audits.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No audits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first audit to get started
                </p>
                <Button onClick={() => router.push('/new-audit')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Audit
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Lead Auditor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {audits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-medium">{audit.title}</TableCell>
                        <TableCell>{audit.companyName}</TableCell>
                        <TableCell>{audit.leadAuditor?.name}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(audit.status)} className="gap-1">
                            {getStatusIcon(audit.status)}
                            {audit.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={audit.completionPercentage} className="w-16" />
                            <span className="text-sm text-muted-foreground">
                              {audit.completionPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(
                            typeof audit.dateStarted === 'string' 
                              ? new Date(audit.dateStarted) 
                              : audit.dateStarted, 
                            { addSuffix: true }
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {audit.status === 'IN_PROGRESS' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleContinueAudit(audit.id)}
                                className="gap-1"
                              >
                                <Play className="h-3 w-3" />
                                Continue
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewAudit(audit.id)}
                              className="gap-1"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                            {audit.status === 'IN_PROGRESS' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelAudit(audit.id)}
                                className="gap-1 text-destructive hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </Button>
                            )}
                          </div>
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
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-96 bg-muted rounded-lg animate-pulse" />
    </div>
  );
}
