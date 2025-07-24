// @ts-nocheck
'use client';

import { useState } from 'react';
import { useAuditStore } from '@/hooks/use-audit-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Building,
  User,
  Settings,
  Printer,
  Mail,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReportCard = ({ icon: Icon, title, description, color, onClick, disabled = false }: any) => (
  <motion.div
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
  >
    <Card 
      className={`cursor-pointer transition-all border-2 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed border-gray-200' 
          : 'hover:shadow-lg hover:border-blue-300'
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        {disabled && (
          <Badge variant="secondary" className="mt-2">
            Coming Soon
          </Badge>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const StatCard = ({ icon: Icon, title, value, color, description }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

export default function ReportsPage() {
  const { auditInfo, getProgress, exportAuditData } = useAuditStore();
  const progress = getProgress();

  const handleExportData = () => {
    const data = exportAuditData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iso9001-audit-${auditInfo.facility || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = (type: string) => {
    alert(`Generating ${type} report...\n\nThis is a placeholder. In the full implementation, this would generate a comprehensive ${type.toLowerCase()} report with all audit findings, evidence, and recommendations.`);
  };

  const reportTypes = [
    {
      icon: FileText,
      title: 'Executive Summary',
      description: 'High-level overview for management with key findings and recommendations',
      color: 'bg-blue-500',
      type: 'executive'
    },
    {
      icon: BarChart3,
      title: 'Detailed Audit Report',
      description: 'Comprehensive report with all findings, evidence, and non-conformances',
      color: 'bg-green-500',
      type: 'detailed'
    },
    {
      icon: AlertTriangle,
      title: 'Non-Conformance Report',
      description: 'Focused report on identified non-conformances and corrective actions',
      color: 'bg-orange-500',
      type: 'nonconformance'
    },
    {
      icon: TrendingUp,
      title: 'Performance Dashboard',
      description: 'Visual dashboard with charts and performance metrics',
      color: 'bg-purple-500',
      type: 'dashboard',
      disabled: true
    },
    {
      icon: CheckCircle,
      title: 'Compliance Matrix',
      description: 'ISO 9001 clause-by-clause compliance status matrix',
      color: 'bg-cyan-500',
      type: 'compliance',
      disabled: true
    },
    {
      icon: Calendar,
      title: 'Action Plan',
      description: 'Prioritized action plan with timelines and responsibilities',
      color: 'bg-indigo-500',
      type: 'actionplan',
      disabled: true
    }
  ];

  const auditSummary = {
    totalQuestions: progress.totalQuestions,
    assessedQuestions: progress.assessedQuestions,
    completionRate: progress.completionPercentage,
    overallScore: progress.overallScore,
    compliantCount: progress.scoreBreakdown.compliant,
    minorNCCount: progress.scoreBreakdown['minor-nc'],
    majorNCCount: progress.scoreBreakdown['major-nc'],
    criticalNCCount: progress.scoreBreakdown['critical-nc'],
    pendingCount: progress.scoreBreakdown['not-assessed']
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Audit Reports
        </h1>
        <p className="text-gray-600">
          Generate comprehensive reports and export audit data
        </p>
      </motion.div>

      {/* Audit Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Audit Summary</span>
            </CardTitle>
            <CardDescription>
              Current audit status and key information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Audit Title:</span>
                  <span className="text-sm">{auditInfo.auditTitle || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Audit Date:</span>
                  <span className="text-sm">{auditInfo.auditDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Lead Auditor:</span>
                  <span className="text-sm">{auditInfo.auditor || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Facility:</span>
                  <span className="text-sm">{auditInfo.facility || 'Not specified'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Rate:</span>
                  <Badge variant="outline" className="text-blue-600">
                    {auditSummary.completionRate.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score:</span>
                  <Badge 
                    variant="outline" 
                    className={
                      auditSummary.overallScore >= 80 ? 'text-green-600' :
                      auditSummary.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }
                  >
                    {auditSummary.overallScore.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Questions Assessed:</span>
                  <span className="text-sm">{auditSummary.assessedQuestions} / {auditSummary.totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Non-Conformances:</span>
                  <span className="text-sm text-red-600">
                    {auditSummary.minorNCCount + auditSummary.majorNCCount + auditSummary.criticalNCCount}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={CheckCircle}
            title="Compliant"
            value={auditSummary.compliantCount}
            color="text-green-600"
            description="Fully compliant findings"
          />
          <StatCard
            icon={AlertTriangle}
            title="Minor NC"
            value={auditSummary.minorNCCount}
            color="text-yellow-600"
            description="Minor non-conformances"
          />
          <StatCard
            icon={XCircle}
            title="Major NC"
            value={auditSummary.majorNCCount}
            color="text-orange-600"
            description="Major non-conformances"
          />
          <StatCard
            icon={XCircle}
            title="Critical NC"
            value={auditSummary.criticalNCCount}
            color="text-red-600"
            description="Critical non-conformances"
          />
        </div>
      </motion.div>

      {/* Report Generation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Generate Reports</span>
            </CardTitle>
            <CardDescription>
              Create professional audit reports for different audiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((report, index) => (
                <motion.div
                  key={report.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <ReportCard
                    {...report}
                    onClick={() => handleGenerateReport(report.type)}
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export & Share</span>
            </CardTitle>
            <CardDescription>
              Export audit data and share reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleExportData}
                className="h-20 flex flex-col space-y-2"
                variant="outline"
              >
                <Download className="h-6 w-6" />
                <span>Export Raw Data</span>
                <span className="text-xs text-gray-500">JSON format</span>
              </Button>
              <Button 
                onClick={() => alert('Print functionality would be implemented here')}
                className="h-20 flex flex-col space-y-2"
                variant="outline"
                disabled
              >
                <Printer className="h-6 w-6" />
                <span>Print Reports</span>
                <span className="text-xs text-gray-500">Coming soon</span>
              </Button>
              <Button 
                onClick={() => alert('Email functionality would be implemented here')}
                className="h-20 flex flex-col space-y-2"
                variant="outline"
                disabled
              >
                <Mail className="h-6 w-6" />
                <span>Email Reports</span>
                <span className="text-xs text-gray-500">Coming soon</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Report Features (Full Implementation)</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Executive Summary Report:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Overall compliance score and trend analysis</li>
                  <li>• Key findings and critical non-conformances</li>
                  <li>• Risk assessment and priority recommendations</li>
                  <li>• Resource requirements and timeline</li>
                  <li>• Management dashboard with KPIs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Detailed Audit Report:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Clause-by-clause assessment results</li>
                  <li>• Evidence documentation and references</li>
                  <li>• Non-conformance details and root causes</li>
                  <li>• Corrective action recommendations</li>
                  <li>• Appendices with supporting documentation</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <h4 className="font-semibold mb-2">Water Utility Specific Elements:</h4>
              <p className="text-sm">
                Reports will include industry-specific sections covering water quality compliance, 
                public health protection measures, environmental impact assessments, regulatory 
                compliance status, and emergency response capabilities.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Implementation Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Settings className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Implementation Roadmap</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  The reporting module is designed for comprehensive audit documentation. 
                  Full implementation would include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-800 text-sm">
                  <ul className="space-y-1">
                    <li>• PDF report generation with professional templates</li>
                    <li>• Interactive charts and visualizations</li>
                    <li>• Automated compliance scoring algorithms</li>
                    <li>• Integration with evidence management system</li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• Email distribution and scheduling</li>
                    <li>• Report versioning and approval workflows</li>
                    <li>• Integration with external QMS platforms</li>
                    <li>• Regulatory reporting format compliance</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
