
// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Building, 
  User, 
  Users, 
  Settings,
  CheckCircle,
  Upload
} from 'lucide-react';
import { useAuditManager } from '@/hooks/use-audit-manager';
import { CreateAuditData } from '@/lib/firebase/models';
import { getSectionsByStandard, getStandardById, ISO_STANDARDS } from '@/lib/section-data';
import { useToast } from '@/hooks/use-toast';
import DocumentUpload from '@/components/documents/document-upload';
import { FirebaseDocument } from '@/lib/firebase/models';

interface FormData extends CreateAuditData {
  // Add any additional fields for form state
  uploadedDocuments?: FirebaseDocument[];
}

const STEPS = [
  { id: 1, title: 'Audit Details', icon: Building },
  { id: 2, title: 'Lead Auditor', icon: User },
  { id: 3, title: 'Interviewees', icon: Users },
  { id: 4, title: 'Scope Selection', icon: Settings },
  { id: 5, title: 'Document Upload', icon: Upload },
  { id: 6, title: 'Review & Create', icon: CheckCircle }
];

export default function NewAuditWorkflow() {
  const router = useRouter();
  const { createAudit, isCreatingAudit } = useAuditManager();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    companyName: '',
    companyAddress: '',
    leadAuditorName: '',
    leadAuditorEmail: '',
    leadAuditorTitle: '',
    isoStandard: 'ISO9001',
    interviewees: [],
    selectedSections: [],
    customScope: false,
    uploadedDocuments: []
  });
  
  const [createdAuditId, setCreatedAuditId] = useState<string | null>(null);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.companyName && formData.companyAddress);
      case 2:
        return !!(formData.leadAuditorName && formData.leadAuditorEmail);
      case 3:
        return true; // Interviewees are optional
      case 4:
        return formData.selectedSections.length > 0;
      case 5:
        return true; // Document upload is optional
      case 6:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (!validateStep(currentStep)) return;
    
    // Create audit after step 4 (scope selection) before moving to document upload
    if (currentStep === 4 && !createdAuditId) {
      try {
        const audit = await createAudit(formData);
        if (audit) {
          setCreatedAuditId(audit.id);
          toast({
            title: "Audit Created",
            description: "Your audit has been created. You can now upload documents.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create audit. Please try again.",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create audit. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCompleteAudit = async () => {
    if (!createdAuditId) {
      toast({
        title: "Error",
        description: "Audit was not properly created. Please go back and try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Audit Setup Complete",
      description: "Your audit has been created and is ready for execution.",
    });
    router.push(`/audit-execution/${createdAuditId}`);
  };

  const handleDocumentUpload = (document: FirebaseDocument) => {
    updateFormData({
      uploadedDocuments: [...(formData.uploadedDocuments || []), document]
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AuditDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <LeadAuditorStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <IntervieweesStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ScopeSelectionStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <DocumentUploadStep 
          auditId={createdAuditId} 
          isoStandard={formData.isoStandard}
          uploadedBy="current-user" // TODO: Replace with actual user ID
          onDocumentUpload={handleDocumentUpload}
          uploadedDocuments={formData.uploadedDocuments || []}
        />;
      case 6:
        return <ReviewStep formData={formData} createdAuditId={createdAuditId} />;
      default:
        return null;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Step {currentStep} of {STEPS.length}</CardTitle>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 
                    ${currentStep >= step.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground text-muted-foreground'
                    }
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-xs ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={nextStep}
            disabled={!validateStep(currentStep) || (currentStep === 4 && isCreatingAudit)}
            className="gap-2"
          >
            {currentStep === 4 && isCreatingAudit ? 'Creating Audit...' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCompleteAudit}
            disabled={!createdAuditId}
            className="gap-2"
          >
            Complete Setup
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Step Components
function DocumentUploadStep({ 
  auditId, 
  isoStandard, 
  uploadedBy, 
  onDocumentUpload, 
  uploadedDocuments 
}: {
  auditId: string | null;
  isoStandard: 'ISO9001' | 'ISO45001';
  uploadedBy: string;
  onDocumentUpload: (document: FirebaseDocument) => void;
  uploadedDocuments: FirebaseDocument[];
}) {
  if (!auditId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Audit must be created before uploading documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Upload Supporting Documents</h3>
        <p className="text-muted-foreground">
          Upload relevant documents that will be analyzed using AI to match with ISO clauses. 
          This step is optional but will enhance your audit with intelligent document references.
        </p>
      </div>
      
      <DocumentUpload
        auditId={auditId}
        isoStandard={isoStandard}
        uploadedBy={uploadedBy}
        onUploadComplete={onDocumentUpload}
      />
      
      {uploadedDocuments.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Documents</h4>
          <div className="grid gap-2">
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{doc.originalName}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {doc.analysisStatus === 'PENDING' && 'Queued'}
                  {doc.analysisStatus === 'PROCESSING' && 'Analyzing'}
                  {doc.analysisStatus === 'COMPLETED' && 'Complete'}
                  {doc.analysisStatus === 'FAILED' && 'Failed'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AuditDetailsStep({ formData, updateFormData }: { formData: FormData, updateFormData: (updates: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Audit Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g., Annual ISO 9001 Compliance Audit"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            placeholder="e.g., ABC Manufacturing Ltd."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address *</Label>
          <Textarea
            id="companyAddress"
            value={formData.companyAddress}
            onChange={(e) => updateFormData({ companyAddress: e.target.value })}
            placeholder="Full company address including city, state, and postal code"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function LeadAuditorStep({ formData, updateFormData }: { formData: FormData, updateFormData: (updates: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="leadAuditorName">Lead Auditor Name *</Label>
          <Input
            id="leadAuditorName"
            value={formData.leadAuditorName}
            onChange={(e) => updateFormData({ leadAuditorName: e.target.value })}
            placeholder="Full name of the lead auditor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadAuditorEmail">Email Address *</Label>
          <Input
            id="leadAuditorEmail"
            type="email"
            value={formData.leadAuditorEmail}
            onChange={(e) => updateFormData({ leadAuditorEmail: e.target.value })}
            placeholder="lead.auditor@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadAuditorTitle">Job Title</Label>
          <Input
            id="leadAuditorTitle"
            value={formData.leadAuditorTitle}
            onChange={(e) => updateFormData({ leadAuditorTitle: e.target.value })}
            placeholder="e.g., Senior Quality Auditor"
          />
        </div>
      </div>
    </div>
  );
}

function IntervieweesStep({ formData, updateFormData }: { formData: FormData, updateFormData: (updates: Partial<FormData>) => void }) {
  const addInterviewee = () => {
    const newInterviewees = [
      ...formData.interviewees,
      { name: '', jobTitle: '', department: '', email: '' }
    ];
    updateFormData({ interviewees: newInterviewees });
  };

  const removeInterviewee = (index: number) => {
    const newInterviewees = formData.interviewees.filter((_, i) => i !== index);
    updateFormData({ interviewees: newInterviewees });
  };

  const updateInterviewee = (index: number, field: string, value: string) => {
    const newInterviewees = formData.interviewees.map((interviewee, i) =>
      i === index ? { ...interviewee, [field]: value } : interviewee
    );
    updateFormData({ interviewees: newInterviewees });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Interviewees</h3>
          <p className="text-sm text-muted-foreground">
            Add key personnel who will be interviewed during the audit
          </p>
        </div>
        <Button onClick={addInterviewee} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Interviewee
        </Button>
      </div>

      {formData.interviewees.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No interviewees added yet</p>
          <Button onClick={addInterviewee} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Add First Interviewee
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.interviewees.map((interviewee, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium">Interviewee {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInterviewee(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={interviewee.name}
                      onChange={(e) => updateInterviewee(index, 'name', e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input
                      value={interviewee.jobTitle}
                      onChange={(e) => updateInterviewee(index, 'jobTitle', e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      value={interviewee.department}
                      onChange={(e) => updateInterviewee(index, 'department', e.target.value)}
                      placeholder="Department"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={interviewee.email}
                      onChange={(e) => updateInterviewee(index, 'email', e.target.value)}
                      placeholder="email@company.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ScopeSelectionStep({ formData, updateFormData }: { formData: FormData, updateFormData: (updates: Partial<FormData>) => void }) {
  const selectedStandard = getStandardById(formData.isoStandard);
  const availableSections = getSectionsByStandard(formData.isoStandard);

  const handleStandardChange = (standardId: 'ISO9001' | 'ISO45001') => {
    updateFormData({ 
      isoStandard: standardId,
      selectedSections: [] // Reset sections when standard changes
    });
  };

  const toggleSection = (sectionId: string) => {
    const newSelectedSections = formData.selectedSections.includes(sectionId)
      ? formData.selectedSections.filter(id => id !== sectionId)
      : [...formData.selectedSections, sectionId];
    updateFormData({ selectedSections: newSelectedSections });
  };

  const selectAll = () => {
    const allSectionIds = availableSections.map(section => section.id);
    updateFormData({ selectedSections: allSectionIds });
  };

  const selectNone = () => {
    updateFormData({ selectedSections: [] });
  };

  return (
    <div className="space-y-8">
      {/* ISO Standard Selection */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Select ISO Standard</h3>
          <p className="text-sm text-muted-foreground">
            Choose the ISO standard for this audit
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ISO_STANDARDS.map((standard) => {
            const isSelected = formData.isoStandard === standard.id;
            return (
              <Card
                key={standard.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleStandardChange(standard.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-semibold">
                          {standard.name}
                        </Badge>
                        <Badge variant="secondary">
                          {standard.version}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-2">{standard.fullName}</h4>
                      <p className="text-sm text-muted-foreground">{standard.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {standard.sections.length} sections • {
                      standard.sections.reduce((total, section) => total + section.questionCount, 0)
                    } total questions
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section Selection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Select Audit Scope</h3>
            <p className="text-sm text-muted-foreground">
              Select the {selectedStandard?.name} sections to include in this audit
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
            <Button variant="outline" size="sm" onClick={selectNone}>Select None</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {availableSections.map((section) => {
            const isSelected = formData.selectedSections.includes(section.id);
            return (
              <Card
                key={section.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => toggleSection(section.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{section.number}</Badge>
                        <Badge variant={section.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                          {section.riskLevel}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'
                    }`}>
                      {isSelected && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {section.questionCount} questions • {section.industryRelevance}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          Selected: {formData.selectedSections.length} of {availableSections.length} sections
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ formData, createdAuditId }: { formData: FormData; createdAuditId: string | null }) {
  const selectedStandard = getStandardById(formData.isoStandard);
  const availableSections = getSectionsByStandard(formData.isoStandard);
  const selectedSections = availableSections.filter(section => 
    formData.selectedSections.includes(section.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Audit Setup Complete</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your audit has been successfully created. Review the configuration below and click "Complete Setup" to begin the audit execution.
        </p>
        {createdAuditId && (
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Audit ID: {createdAuditId}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Title:</span>
              <p className="text-sm text-muted-foreground">{formData.title}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Company:</span>
              <p className="text-sm text-muted-foreground">{formData.companyName}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Address:</span>
              <p className="text-sm text-muted-foreground">{formData.companyAddress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Auditor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Name:</span>
              <p className="text-sm text-muted-foreground">{formData.leadAuditorName}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Email:</span>
              <p className="text-sm text-muted-foreground">{formData.leadAuditorEmail}</p>
            </div>
            {formData.leadAuditorTitle && (
              <div>
                <span className="text-sm font-medium">Title:</span>
                <p className="text-sm text-muted-foreground">{formData.leadAuditorTitle}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interviewees ({formData.interviewees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.interviewees.length === 0 ? (
              <p className="text-sm text-muted-foreground">No interviewees added</p>
            ) : (
              <div className="space-y-2">
                {formData.interviewees.map((interviewee, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{interviewee.name}</span>
                    <span className="text-muted-foreground"> - {interviewee.jobTitle}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">ISO Standard:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="font-semibold">
                    {selectedStandard?.name}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedStandard?.version}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Selected Sections:</span>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedSections.length} of {availableSections.length} sections selected
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedSections.map((section) => (
                    <Badge key={section.id} variant="outline" className="text-xs">
                      {section.number}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documents ({formData.uploadedDocuments?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {!formData.uploadedDocuments || formData.uploadedDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            ) : (
              <div className="space-y-2">
                {formData.uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{doc.originalName}</span>
                      <p className="text-xs text-muted-foreground">
                        {(doc.fileSize / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.analysisStatus === 'PENDING' && 'Queued'}
                      {doc.analysisStatus === 'PROCESSING' && 'Analyzing'}
                      {doc.analysisStatus === 'COMPLETED' && 'Complete'}
                      {doc.analysisStatus === 'FAILED' && 'Failed'}
                    </Badge>
                  </div>
                ))}
                <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    📄 Documents will be analyzed to provide intelligent clause references during the audit.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
