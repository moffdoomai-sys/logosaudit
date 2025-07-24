// @ts-nocheck
'use client';

import { useState } from 'react';
import { useAuditStore } from '@/hooks/use-audit-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Search, 
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AuditQuestion } from '@/lib/types';

const RiskBadge = ({ level }: { level: string }) => {
  const colors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  
  return (
    <Badge variant="outline" className={colors[level as keyof typeof colors]}>
      {level.toUpperCase()}
    </Badge>
  );
};

const QuestionCard = ({ 
  question, 
  isOmitted, 
  onToggleOmission, 
  children 
}: { 
  question: AuditQuestion;
  isOmitted: boolean;
  onToggleOmission: (id: string) => void;
  children?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${isOmitted ? 'opacity-60' : ''}`}
  >
    <Card className={`hover:shadow-md transition-all ${question.isParent ? 'border-l-4 border-blue-500' : 'ml-6 border-l-2 border-gray-300'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                Clause {question.clause}
              </Badge>
              <RiskBadge level={question.riskLevel} />
              <Badge variant="secondary" className="text-xs">
                {question.category}
              </Badge>
            </div>
            <CardTitle className={`text-sm ${question.isParent ? 'font-semibold' : 'font-medium'}`}>
              {question.text}
            </CardTitle>
            {question.industryContext && (
              <CardDescription className="mt-2 text-xs">
                <strong>Industry Context:</strong> {question.industryContext}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Switch
              checked={!isOmitted}
              onCheckedChange={() => onToggleOmission(question.id)}
            />
            {isOmitted ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-green-600" />
            )}
          </div>
        </div>
      </CardHeader>
      {children && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  </motion.div>
);

export default function QuestionsPage() {
  const { questions, omittedQuestions, auditScope, toggleQuestionOmission, getProgress, getFilteredQuestions } = useAuditStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showOmitted, setShowOmitted] = useState(true);

  const progress = getProgress();
  const scopeFilteredQuestions = getFilteredQuestions();

  // Get all categories from scope-filtered questions
  const categories = Array.from(new Set(scopeFilteredQuestions.flatMap(q => [
    q.category,
    ...(q.children?.map(c => c.category) || [])
  ])));

  // Build question hierarchy for scope-filtered questions
  const buildHierarchy = (flatQuestions: any[]) => {
    const parentQuestions = flatQuestions.filter(q => q.isParent);
    return parentQuestions.map(parent => ({
      ...parent,
      children: flatQuestions.filter(q => q.parentId === parent.id)
    }));
  };

  const hierarchicalQuestions = buildHierarchy(scopeFilteredQuestions);

  // Filter questions based on search and other criteria
  const filteredQuestions = hierarchicalQuestions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.children?.some(child => 
                           child.text.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = filterCategory === 'all' || question.category === filterCategory;
    const matchesRisk = filterRisk === 'all' || question.riskLevel === filterRisk;
    const shouldShow = showOmitted || !omittedQuestions.has(question.id);
    
    return matchesSearch && matchesCategory && matchesRisk && shouldShow;
  });

  const handleExportQuestions = () => {
    const exportData = {
      questions: questions,
      omittedQuestions: Array.from(omittedQuestions),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iso9001-questions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          Question Management
        </h1>
        <p className="text-gray-600">
          Configure your audit scope by enabling or omitting questions
        </p>
        {auditScope.selectedSections.size < 7 && (
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            <Target className="h-4 w-4 mr-1" />
            Showing {auditScope.selectedSections.size} of 7 sections
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Total Questions</p>
                  <p className="text-xl font-bold">{progress.totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xl font-bold">{progress.activeQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <EyeOff className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Omitted</p>
                  <p className="text-xl font-bold">{progress.omittedQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Critical Risk</p>
                  <p className="text-xl font-bold">
                    {questions.filter(q => q.riskLevel === 'critical' || 
                      q.children?.some(c => c.riskLevel === 'critical')).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Questions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="All risk levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">View Options</label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showOmitted}
                    onCheckedChange={setShowOmitted}
                  />
                  <span className="text-sm">Show omitted</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleExportQuestions} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Questions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          >
            <QuestionCard
              question={question}
              isOmitted={omittedQuestions.has(question.id)}
              onToggleOmission={toggleQuestionOmission}
            >
              {question.children && question.children.length > 0 && (
                <div className="space-y-3">
                  {question.children.map((child) => (
                    <QuestionCard
                      key={child.id}
                      question={child}
                      isOmitted={omittedQuestions.has(child.id)}
                      onToggleOmission={toggleQuestionOmission}
                    />
                  ))}
                </div>
              )}
            </QuestionCard>
          </motion.div>
        ))}
      </motion.div>

      {filteredQuestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find questions.
          </p>
        </motion.div>
      )}
    </div>
  );
}
