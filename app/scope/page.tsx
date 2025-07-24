// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuditStore } from '@/hooks/use-audit-store';
import { ISO9001_SECTIONS, AUDIT_TEMPLATES } from '@/lib/section-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Zap,
  Users,
  Settings,
  BarChart3,
  FileText,
  Play,
  BookOpen,
  Target,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel) {
    case 'critical': return <Zap className="h-4 w-4 text-red-500" />;
    case 'high': return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case 'medium': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'low': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    default: return <CheckCircle className="h-4 w-4 text-slate-500" />;
  }
};

const getSectionIcon = (sectionNumber: string) => {
  switch (sectionNumber) {
    case '4': return BookOpen;
    case '5': return Users;
    case '6': return Target;
    case '7': return Settings;
    case '8': return Play;
    case '9': return BarChart3;
    case '10': return Shield;
    default: return FileText;
  }
};

export default function ScopeSelection() {
  const router = useRouter();
  const { auditScope, updateAuditScope } = useAuditStore();
  const [selectedSections, setSelectedSections] = useState<Set<string>>(auditScope.selectedSections);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(auditScope.template);

  const applyTemplate = (templateId: string) => {
    const template = AUDIT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setSelectedSections(new Set(template.sections));
      setSelectedTemplate(templateId);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId);
    } else {
      newSelected.add(sectionId);
    }
    setSelectedSections(newSelected);
    setSelectedTemplate(undefined);
  };

  const saveScope = () => {
    updateAuditScope({
      selectedSections,
      template: selectedTemplate,
      customScope: !selectedTemplate
    });
    router.push('/questions');
  };

  const totalQuestions = Array.from(selectedSections).reduce((total, sectionId) => {
    const section = ISO9001_SECTIONS.find(s => s.id === sectionId);
    return total + (section?.questionCount || 0);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Target className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold logos-heading">
              Audit Scope Configuration
            </h1>
            <p className="logos-text text-lg">
              Define your assessment scope and select relevant ISO 9001 sections
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="templates" className="text-base py-3">Quick Templates</TabsTrigger>
          <TabsTrigger value="custom" className="text-base py-3">Custom Selection</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="logos-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-violet-100">
                    <Sparkles className="h-5 w-5 text-violet-600" />
                  </div>
                  <span>Pre-configured Templates</span>
                </CardTitle>
                <CardDescription>
                  Select from carefully designed audit templates based on common assessment needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {AUDIT_TEMPLATES.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className={`cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-violet-300 bg-violet-50/50 shadow-md'
                          : 'logos-card hover:border-violet-200'
                      }`}
                      onClick={() => applyTemplate(template.id)}
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg logos-heading">{template.name}</h3>
                                <p className="text-sm logos-text">{template.description}</p>
                              </div>
                              <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200">
                                {template.sections.length} sections
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-medium logos-text-muted mb-2">INCLUDED SECTIONS:</p>
                                <div className="flex flex-wrap gap-1">
                                  {template.sections.map((sectionId) => {
                                    const section = ISO9001_SECTIONS.find(s => s.id === sectionId);
                                    return (
                                      <Badge key={sectionId} variant="secondary" className="text-xs">
                                        {section?.number}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium logos-text-muted mb-2">RECOMMENDED FOR:</p>
                                <div className="space-y-1">
                                  {template.recommendedFor.slice(0, 2).map((use, index) => (
                                    <p key={index} className="text-xs logos-text flex items-center space-x-1">
                                      <ArrowRight className="h-3 w-3 text-violet-500" />
                                      <span>{use}</span>
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="logos-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <Settings className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span>Custom Section Selection</span>
                </CardTitle>
                <CardDescription>
                  Manually select specific ISO 9001 sections for your customized audit scope
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {ISO9001_SECTIONS.map((section) => {
                    const Icon = getSectionIcon(section.number);
                    const isSelected = selectedSections.has(section.id);
                    
                    return (
                      <motion.div
                        key={section.id}
                        whileHover={{ scale: 1.02 }}
                        className="group"
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-violet-300 bg-violet-50/50 shadow-md'
                              : 'logos-card hover:border-violet-200'
                          }`}
                          onClick={() => toggleSection(section.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="mt-1"
                                />
                                <div className={`p-2 rounded-lg ${
                                  isSelected ? 'bg-violet-100' : 'bg-slate-100 group-hover:bg-violet-50'
                                }`}>
                                  <Icon className={`h-5 w-5 ${
                                    isSelected ? 'text-violet-600' : 'text-slate-600 group-hover:text-violet-600'
                                  } transition-colors duration-200`} />
                                </div>
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold logos-heading">
                                      Section {section.number}: {section.title}
                                    </h3>
                                    <p className="text-sm logos-text mt-1">{section.description}</p>
                                  </div>
                                  <Badge variant="outline" className="ml-2">
                                    {section.questionCount} questions
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {getRiskIcon(section.riskLevel)}
                                    <span className="text-xs font-medium capitalize logos-text-muted">
                                      {section.riskLevel} Priority
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-xs logos-text">{section.industryRelevance}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Scope Summary */}
      {selectedSections.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="logos-card border-violet-200 bg-violet-50/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Target className="h-5 w-5 text-violet-600" />
                </div>
                <span>Audit Scope Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-violet-600">{selectedSections.size}</p>
                  <p className="text-sm logos-text-muted">Sections Selected</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-violet-600">{totalQuestions}</p>
                  <p className="text-sm logos-text-muted">Total Questions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-violet-600">
                    {selectedTemplate ? 'Template' : 'Custom'}
                  </p>
                  <p className="text-sm logos-text-muted">Scope Type</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                {Array.from(selectedSections).map((sectionId) => {
                  const section = ISO9001_SECTIONS.find(s => s.id === sectionId);
                  return (
                    <Badge key={sectionId} variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200">
                      Section {section?.number}: {section?.title}
                    </Badge>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={saveScope}
                  className="logos-button-primary px-8 py-3 text-base"
                  size="lg"
                >
                  Configure Audit Scope
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {selectedSections.size === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Alert className="border-amber-200 bg-amber-50/50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Please select at least one section or template to continue with your audit configuration.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
}
