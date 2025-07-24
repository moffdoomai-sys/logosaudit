
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Save,
  FileText,
  BarChart3,
  BookOpen,
  Info,
  Shield,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AuditQuestion, AuditMetadata } from '@/lib/types';
import UnifiedAuditData from '@/lib/unified-audit-data';
import { getSectionById, getStandardById } from '@/lib/section-data';
import GuidancePanel from '@/components/audit/guidance-panel';
import { useToast } from '@/hooks/use-toast';

interface Finding {
  questionId: string;
  score: string;
  notes: string;
  evidenceNotes: string;
}

interface ScoreOptionProps {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  isSelected?: boolean;
}

const ScoreOption: React.FC<ScoreOptionProps> = ({ value, label, icon: Icon, color, description, isSelected }) => {
  const getSelectedBgColor = () => {
    if (!isSelected) return 'hover:bg-violet-50/50';
    
    switch (value) {
      case 'compliant':
        return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50';
      case 'minor-nc':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100/50';
      case 'major-nc':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100/50';
      case 'critical-nc':
        return 'bg-red-50 border-red-200 hover:bg-red-100/50';
      default:
        return 'hover:bg-violet-50/50';
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
      isSelected ? getSelectedBgColor() : 'border-slate-200 hover:bg-violet-50/50'
    }`}>
      <RadioGroupItem value={value} id={value} className="text-violet-600" />
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="flex-1">
        <Label htmlFor={value} className="cursor-pointer font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );
};

const NavigationBar: React.FC<{
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  questionNumber: number;
}> = ({ onNext, onPrevious, canGoNext, canGoPrevious, questionNumber }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="text-sm text-muted-foreground font-medium">
          Question {questionNumber}
        </div>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function AuditExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const auditId = params.id as string;

  const [audit, setAudit] = useState<AuditMetadata | null>(null);
  const [questions, setQuestions] = useState<AuditQuestion[]>([]);
  const [findings, setFindings] = useState<Record<string, Finding>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load audit data and initialize questions
  useEffect(() => {
    const loadAuditData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch audit details
        const auditResponse = await fetch(`/api/audits/${auditId}`);
        if (!auditResponse.ok) {
          throw new Error('Failed to load audit');
        }
        
        const auditData = await auditResponse.json();
        setAudit(auditData);

        // Get questions using unified audit data loader
        const auditQuestions = UnifiedAuditData.getAllAuditQuestionsFlat({
          isoStandard: auditData.isoStandard,
          selectedSections: auditData.selectedSections
        });

        setQuestions(auditQuestions);

        // Load existing findings
        const findingsResponse = await fetch(`/api/audits/${auditId}/findings`);
        if (findingsResponse.ok) {
          const findingsData = await findingsResponse.json();
          const findingsMap: Record<string, Finding> = {};
          
          // Map database enum values back to frontend values
          const enumToScore = {
            'COMPLIANT': 'compliant',
            'MINOR_NC': 'minor-nc',
            'MAJOR_NC': 'major-nc',
            'CRITICAL_NC': 'critical-nc',
            'NOT_ASSESSED': 'not-assessed'
          };
          
          findingsData.forEach((finding: any) => {
            findingsMap[finding.questionId] = {
              questionId: finding.questionId,
              score: enumToScore[finding.score] || 'not-assessed',
              notes: finding.notes || '',
              evidenceNotes: finding.evidenceNotes || ''
            };
          });
          setFindings(findingsMap);
        }

      } catch (error) {
        console.error('Failed to load audit data:', error);
        toast({
          title: "Error",
          description: "Failed to load audit data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (auditId) {
      loadAuditData();
    }
  }, [auditId, toast]);

  const scoreOptions = [
    {
      value: 'compliant',
      label: 'Compliant',
      icon: CheckCircle,
      color: 'text-emerald-600',
      description: 'Fully meets all requirements and expectations'
    },
    {
      value: 'minor-nc',
      label: 'Minor Non-Conformance',
      icon: AlertTriangle,
      color: 'text-amber-600',
      description: 'Minor deviation that does not affect system effectiveness'
    },
    {
      value: 'major-nc',
      label: 'Major Non-Conformance',
      icon: XCircle,
      color: 'text-orange-600',
      description: 'Significant deviation affecting system effectiveness'
    },
    {
      value: 'critical-nc',
      label: 'Critical Non-Conformance',
      icon: XCircle,
      color: 'text-red-600',
      description: 'Severe deviation requiring immediate attention'
    }
  ];

  const handleUpdateFinding = async (questionId: string, updates: Partial<Finding>) => {
    const updatedFinding = {
      ...findings[questionId],
      questionId,
      ...updates
    };
    
    setFindings(prev => ({
      ...prev,
      [questionId]: updatedFinding
    }));
  };

  const handleSaveFinding = async (questionId: string) => {
    if (!findings[questionId]) return;
    
    try {
      setIsSaving(true);
      const finding = findings[questionId];
      
      const response = await fetch(`/api/audits/${auditId}/findings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          conformanceLevel: finding.score,
          notes: finding.notes,
          evidenceDescription: finding.evidenceNotes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save finding');
      }

      toast({
        title: "Saved",
        description: "Finding saved successfully."
      });
    } catch (error) {
      console.error('Failed to save finding:', error);
      toast({
        title: "Error",
        description: "Failed to save finding. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getProgress = () => {
    const totalQuestions = questions.length;
    const assessedQuestions = Object.keys(findings).filter(id => 
      findings[id]?.score && findings[id].score !== 'not-assessed'
    ).length;
    
    const completionPercentage = totalQuestions > 0 ? (assessedQuestions / totalQuestions) * 100 : 0;
    
    const scoreBreakdown = {
      compliant: 0,
      'minor-nc': 0,
      'major-nc': 0,
      'critical-nc': 0,
      'not-assessed': totalQuestions - assessedQuestions
    };

    Object.values(findings).forEach(finding => {
      if (finding.score && finding.score !== 'not-assessed') {
        scoreBreakdown[finding.score as keyof typeof scoreBreakdown]++;
      }
    });

    const overallScore = totalQuestions > 0 ? 
      (scoreBreakdown.compliant / totalQuestions) * 100 : 0;

    return {
      completionPercentage,
      overallScore,
      scoreBreakdown,
      totalQuestions,
      assessedQuestions
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading audit...</p>
        </div>
      </div>
    );
  }

  if (!audit || questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium">Audit Not Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            The audit you're looking for doesn't exist or has no questions configured.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentFinding = currentQuestion ? findings[currentQuestion.id] : null;
  const progress = getProgress();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{audit.title}</h1>
              <p className="text-muted-foreground">{audit.companyName}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <span>Assessment Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="font-medium">{progress.completionPercentage.toFixed(1)}% Complete</span>
                </div>
                <Progress value={progress.completionPercentage} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-emerald-600">{progress.scoreBreakdown.compliant}</div>
                  <div className="text-sm text-muted-foreground">Compliant</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-amber-600">{progress.scoreBreakdown['minor-nc']}</div>
                  <div className="text-sm text-muted-foreground">Minor NC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-orange-600">{progress.scoreBreakdown['major-nc']}</div>
                  <div className="text-sm text-muted-foreground">Major NC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">{progress.scoreBreakdown['critical-nc']}</div>
                  <div className="text-sm text-muted-foreground">Critical NC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-slate-600">{progress.scoreBreakdown['not-assessed']}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="space-y-6">
          {/* Navigation at top */}
          <NavigationBar
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentQuestionIndex < questions.length - 1}
            canGoPrevious={currentQuestionIndex > 0}
            questionNumber={currentQuestionIndex + 1}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className={`border-l-4 ${
              currentQuestion.riskLevel === 'critical' ? 'border-red-400' :
              currentQuestion.riskLevel === 'high' ? 'border-orange-400' :
              currentQuestion.riskLevel === 'medium' ? 'border-amber-400' :
              'border-emerald-400'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200">
                        Question {currentQuestionIndex + 1}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                        Clause {currentQuestion.clause}
                      </Badge>
                      <Badge variant="secondary" className="bg-violet-50 text-violet-700">
                        {currentQuestion.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          currentQuestion.riskLevel === 'critical' ? 'bg-red-100 text-red-700 border-red-200' :
                          currentQuestion.riskLevel === 'high' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          currentQuestion.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }
                      >
                        {currentQuestion.riskLevel.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-relaxed">{currentQuestion.text}</CardTitle>
                    {currentQuestion.industryContext && (
                      <CardDescription>
                        <strong>Context:</strong> {currentQuestion.industryContext}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg font-medium">Assessment Score</Label>
                  <RadioGroup
                    value={currentFinding?.score || 'not-assessed'}
                    onValueChange={(value: string) => handleUpdateFinding(currentQuestion.id, { score: value })}
                    className="space-y-3"
                  >
                    {scoreOptions.map((option) => (
                      <ScoreOption 
                        key={option.value} 
                        {...option} 
                        isSelected={currentFinding?.score === option.value}
                      />
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-lg font-medium">
                      Assessment Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Record your observations, evidence reviewed, and rationale for the assessment..."
                      value={currentFinding?.notes || ''}
                      onChange={(e) => handleUpdateFinding(currentQuestion.id, { notes: e.target.value })}
                      className="min-h-[80px] focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="evidence" className="text-lg font-medium">
                      Evidence Documentation
                    </Label>
                    <Textarea
                      id="evidence"
                      placeholder="Document specific evidence reviewed (procedures, records, interviews, observations)..."
                      value={currentFinding?.evidenceNotes || ''}
                      onChange={(e) => handleUpdateFinding(currentQuestion.id, { evidenceNotes: e.target.value })}
                      className="min-h-[60px] focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSaveFinding(currentQuestion.id)}
                      disabled={isSaving}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Finding'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation at bottom */}
            <NavigationBar
              onNext={handleNext}
              onPrevious={handlePrevious}
              canGoNext={currentQuestionIndex < questions.length - 1}
              canGoPrevious={currentQuestionIndex > 0}
              questionNumber={currentQuestionIndex + 1}
            />

            {/* Guidance Panel */}
            <GuidancePanel question={currentQuestion} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
