// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useAuditStore, NON_CONFORMANCE_RESPONSES } from '@/hooks/use-audit-store';
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
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AuditQuestion } from '@/lib/types';
import { getSectionById } from '@/lib/section-data';
import GuidancePanel from '@/components/audit/guidance-panel';

interface ScoreOptionProps {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

const ScoreOption: React.FC<ScoreOptionProps & { isSelected?: boolean }> = ({ value, label, icon: Icon, color, description, isSelected }) => {
  // Define background colors for selected states
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
    <div className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 logos-card ${
      isSelected ? getSelectedBgColor() : 'border-slate-200 hover:bg-violet-50/50'
    }`}>
      {/* @ts-ignore */}
      <RadioGroupItem value={value} id={value} className="text-violet-600" />
      {/* @ts-ignore */}
      <Icon className={`h-5 w-5 ${color}`} />
      <div className="flex-1">
        {/* @ts-ignore */}
        <Label htmlFor={value} className="cursor-pointer font-medium logos-subheading">
          {label}
        </Label>
        <p className="text-xs logos-text-muted mt-1">{description}</p>
      </div>
    </div>
  );
};

interface NavigationBarProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  questionNumber: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  onNext, 
  onPrevious, 
  canGoNext, 
  canGoPrevious, 
  questionNumber 
}) => (
  <Card className="logos-card">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="logos-button-secondary flex items-center space-x-2"
        >
          {/* @ts-ignore */}
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="text-sm logos-text-muted font-medium">
          Question {questionNumber}
        </div>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="logos-button-primary flex items-center space-x-2"
        >
          <span>Next</span>
          {/* @ts-ignore */}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface QuestionDisplayProps {
  question: AuditQuestion;
  finding: any;
  onUpdateFinding: (data: any) => void;
  questionNumber: number;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  finding, 
  onUpdateFinding,
  questionNumber,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}) => {
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

  const handleResponseTemplate = (template: string) => {
    onUpdateFinding({ notes: template });
  };

  return (
    <div className="space-y-6">
      {/* Navigation at top */}
      <NavigationBar
        onNext={onNext}
        onPrevious={onPrevious}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        questionNumber={questionNumber}
      />

      {/* @ts-ignore */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className={`logos-card border-l-4 ${
          question.riskLevel === 'critical' ? 'border-red-400' :
          question.riskLevel === 'high' ? 'border-orange-400' :
          question.riskLevel === 'medium' ? 'border-amber-400' :
          'border-emerald-400'
        }`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200">
                    Question {questionNumber}
                  </Badge>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                    Clause {question.clause}
                  </Badge>
                  <Badge variant="secondary" className="bg-violet-50 text-violet-700">
                    {question.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={
                      question.riskLevel === 'critical' ? 'bg-red-100 text-red-700 border-red-200' :
                      question.riskLevel === 'high' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      question.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }
                  >
                    {question.riskLevel.toUpperCase()} PRIORITY
                  </Badge>
                </div>
                <CardTitle className="text-xl logos-heading leading-relaxed">{question.text}</CardTitle>
                {question.industryContext && (
                  <CardDescription className="logos-text">
                    <strong>Context:</strong> {question.industryContext}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              {/* @ts-ignore */}
              <Label className="text-lg font-medium logos-subheading">Assessment Score</Label>
              <RadioGroup
                value={finding?.score || 'not-assessed'}
                onValueChange={(value: string) => onUpdateFinding({ score: value })}
                className="space-y-3"
              >
                {scoreOptions.map((option) => (
                  <ScoreOption 
                    key={option.value} 
                    {...option} 
                    isSelected={finding?.score === option.value}
                  />
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* @ts-ignore */}
                  <Label htmlFor="notes" className="text-lg font-medium logos-subheading">
                    Assessment Notes
                  </Label>
                  {finding?.score && finding.score !== 'compliant' && finding.score !== 'not-assessed' && (
                    <Select onValueChange={handleResponseTemplate}>
                      <SelectTrigger className="w-48 logos-button-secondary">
                        <SelectValue placeholder="Use template..." />
                      </SelectTrigger>
                      <SelectContent>
                        {/* @ts-ignore */}
                        {NON_CONFORMANCE_RESPONSES[finding.score as keyof typeof NON_CONFORMANCE_RESPONSES]?.map((template, index) => (
                          <SelectItem key={index} value={template}>
                            Template {index + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <Textarea
                  id="notes"
                  placeholder="Record your observations, evidence reviewed, and rationale for the assessment..."
                  value={finding?.notes || ''}
                  onChange={(e) => onUpdateFinding({ notes: e.target.value })}
                  className="min-h-[80px] focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              <div className="space-y-3">
                {/* @ts-ignore */}
                <Label htmlFor="evidence" className="text-lg font-medium logos-subheading">
                  Evidence Documentation
                </Label>
                <Textarea
                  id="evidence"
                  placeholder="Document specific evidence reviewed (procedures, records, interviews, observations)..."
                  value={finding?.evidenceNotes || ''}
                  onChange={(e) => onUpdateFinding({ evidenceNotes: e.target.value })}
                  className="min-h-[60px] focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation at bottom */}
        <NavigationBar
          onNext={onNext}
          onPrevious={onPrevious}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          questionNumber={questionNumber}
        />

        {/* Guidance Panel */}
        {/* @ts-ignore */}
        <GuidancePanel question={question} />
      </motion.div>
    </div>
  );
};

export default function AuditPage() {
  const { getFilteredQuestions, auditScope, findings, updateFinding, getProgress, getSectionProgress } = useAuditStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<AuditQuestion[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');

  useEffect(() => {
    const questions = getFilteredQuestions();
    setActiveQuestions(questions);
    if (questions.length > 0) {
      const sectionNumber = questions[currentQuestionIndex]?.clause.split('.')[0];
      setCurrentSection(`section-${sectionNumber}`);
    }
  }, [getFilteredQuestions, currentQuestionIndex]);

  const progress = getProgress();
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentFinding = currentQuestion ? findings[currentQuestion.id] : null;

  // Get section information for current question
  const currentSectionInfo = currentSection ? getSectionById(currentSection) : null;

  // Calculate question number within section
  const getQuestionNumberInSection = (questionIndex: number) => {
    if (!activeQuestions[questionIndex]) return 1;
    
    const currentQuestionClause = activeQuestions[questionIndex].clause;
    const sectionNumber = currentQuestionClause.split('.')[0];
    
    let questionNumber = 1;
    for (let i = 0; i <= questionIndex; i++) {
      const questionSectionNumber = activeQuestions[i].clause.split('.')[0];
      if (questionSectionNumber === sectionNumber) {
        if (i === questionIndex) break;
        questionNumber++;
      } else if (i === questionIndex) {
        questionNumber = 1;
        break;
      }
    }
    return questionNumber;
  };

  const currentQuestionNumber = getQuestionNumberInSection(currentQuestionIndex);

  const handleUpdateFinding = (data: any) => {
    if (currentQuestion) {
      updateFinding(currentQuestion.id, data);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSave = () => {
    alert('Progress saved successfully!');
  };

  if (activeQuestions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto">
            {/* @ts-ignore */}
            <FileText className="h-8 w-8 text-violet-600" />
          </div>
          <h3 className="text-xl font-medium logos-heading">No Active Questions</h3>
          <p className="logos-text max-w-md mx-auto">
            All questions have been excluded from the audit scope. Please configure your scope to include relevant sections.
          </p>
          <Button 
            onClick={() => window.location.href = '/scope'}
            className="logos-button-primary"
          >
            Configure Scope
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* @ts-ignore */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
            {/* @ts-ignore */}
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold logos-heading">
              Assessment Execution
            </h1>
            <p className="logos-text text-lg">
              Conduct your comprehensive ISO 9001 quality management system audit
            </p>
          </div>
        </div>
        {auditScope.selectedSections.size < 7 && (
          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm bg-violet-100 text-violet-700 border border-violet-200">
            <BookOpen className="h-4 w-4 mr-2" />
            Auditing {auditScope.selectedSections.size} of 7 sections
          </div>
        )}
      </motion.div>

      {/* Current Section Info */}
      {currentSectionInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="logos-card bg-violet-50/50 border-violet-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Info className="h-5 w-5 text-violet-600" />
                </div>
                <span className="logos-heading">Section {currentSectionInfo.number}: {currentSectionInfo.title}</span>
              </CardTitle>
              <CardDescription className="text-violet-700 logos-text">
                {currentSectionInfo.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}

      {/* Section Navigation */}
      {auditScope.selectedSections.size > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="logos-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl logos-heading">Section Progress</CardTitle>
              <CardDescription className="logos-text">
                Track your progress across all selected audit sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {Array.from(auditScope.selectedSections).map((sectionId) => {
                  const sectionNumber = sectionId.replace('section-', '');
                  const sectionProgress = getSectionProgress(sectionId);
                  const isCurrentSection = currentSection === sectionId;
                  
                  return (
                    <div
                      key={sectionId}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all duration-200 ${
                        isCurrentSection 
                          ? 'bg-violet-100 border-violet-300 text-violet-800 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 hover:bg-violet-50 logos-card'
                      }`}
                      onClick={() => {
                        const sectionQuestions = activeQuestions.filter(q => 
                          q.clause.split('.')[0] === sectionNumber
                        );
                        if (sectionQuestions.length > 0) {
                          const firstQuestionIndex = activeQuestions.findIndex(q => q.id === sectionQuestions[0].id);
                          if (firstQuestionIndex !== -1) {
                            setCurrentQuestionIndex(firstQuestionIndex);
                          }
                        }
                      }}
                    >
                      <div className="text-sm font-medium logos-subheading">Section {sectionNumber}</div>
                      <div className="text-xs logos-text-muted mt-1">
                        {Math.round(sectionProgress.completionPercentage)}% complete
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-violet-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${sectionProgress.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="logos-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 rounded-lg bg-emerald-100">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="logos-heading">Assessment Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm logos-text mb-2">
                  <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
                  <span className="font-medium">{progress.completionPercentage.toFixed(1)}% Complete</span>
                </div>
                <Progress value={(currentQuestionIndex + 1) / activeQuestions.length * 100} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-emerald-600">{progress.scoreBreakdown.compliant}</div>
                  <div className="text-sm logos-text-muted">Compliant</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-amber-600">{progress.scoreBreakdown['minor-nc']}</div>
                  <div className="text-sm logos-text-muted">Minor NC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-orange-600">{progress.scoreBreakdown['major-nc']}</div>
                  <div className="text-sm logos-text-muted">Major NC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">{progress.scoreBreakdown['critical-nc']}</div>
                  <div className="text-sm logos-text-muted">Critical NC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-slate-600">{progress.scoreBreakdown['not-assessed']}</div>
                  <div className="text-sm logos-text-muted">Pending</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Question */}
      {currentQuestion && (
        <QuestionDisplay
          question={currentQuestion}
          finding={currentFinding}
          onUpdateFinding={handleUpdateFinding}
          questionNumber={currentQuestionNumber}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={currentQuestionIndex < activeQuestions.length - 1}
          canGoPrevious={currentQuestionIndex > 0}
        />
      )}

      {/* Bottom Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="logos-card bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="logos-button-secondary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Progress</span>
                </Button>
                
                <div className="text-sm logos-text">
                  Overall Performance: <span className="font-bold text-violet-700">{progress.overallScore.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm logos-text-muted">
                <Sparkles className="h-4 w-4" />
                <span>LogosAudit Assessment</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
