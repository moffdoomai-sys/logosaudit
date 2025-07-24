// @ts-nocheck
'use client';

import { useState } from 'react';
import { AuditQuestion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronRight,
  FileText,
  Users,
  Eye,
  Database,
  AlertTriangle,
  XCircle,
  Lightbulb,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GuidancePanelProps {
  question: AuditQuestion;
}

const GuidanceSection = ({ 
  title, 
  icon: Icon, 
  items, 
  color = "text-blue-600" 
}: {
  title: string;
  icon: any;
  items: string[];
  color?: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <h4 className="font-medium text-sm">{title}</h4>
    </div>
    <ul className="space-y-1 ml-6">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-gray-600 flex items-start">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const NonConformanceCard = ({ 
  type, 
  example, 
  color, 
  icon: Icon 
}: {
  type: string;
  example: any;
  color: string;
  icon: any;
}) => (
  <div className={`border-l-4 ${color} bg-gray-50 p-4 rounded-r-lg`}>
    <div className="flex items-center space-x-2 mb-2">
      <Icon className="h-4 w-4" />
      <h5 className="font-medium text-sm">{type} Non-Conformance</h5>
    </div>
    <div className="space-y-2 text-sm">
      <p><strong>Description:</strong> {example.description}</p>
      <p><strong>Impact:</strong> {example.impact}</p>
      <p><strong>Example:</strong> {example.example}</p>
    </div>
  </div>
);

export default function GuidancePanel({ question }: GuidancePanelProps) {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);

  if (!question.evidenceGuidance && !question.nonConformanceExamples && !question.auditTips) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="border-2 border-blue-200 bg-blue-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>Auditor Guidance & Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Evidence Guidance */}
          {question.evidenceGuidance && (
            <Collapsible open={isEvidenceOpen} onOpenChange={setIsEvidenceOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover:bg-blue-50 border-blue-300"
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>What to Look For - Evidence Guidance</span>
                  </div>
                  {isEvidenceOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <GuidanceSection
                        title="Documents to Review"
                        icon={FileText}
                        items={question.evidenceGuidance.documents}
                        color="text-blue-600"
                      />
                      <GuidanceSection
                        title="People to Interview"
                        icon={Users}
                        items={question.evidenceGuidance.interviews}
                        color="text-green-600"
                      />
                      <GuidanceSection
                        title="Observations to Make"
                        icon={Eye}
                        items={question.evidenceGuidance.observations}
                        color="text-purple-600"
                      />
                      <GuidanceSection
                        title="Records to Examine"
                        icon={Database}
                        items={question.evidenceGuidance.records}
                        color="text-orange-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Non-Conformance Examples */}
          {question.nonConformanceExamples && (
            <Collapsible open={isExamplesOpen} onOpenChange={setIsExamplesOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover:bg-red-50 border-red-300"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span>Non-Conformance Examples & Scoring Guide</span>
                  </div>
                  {isExamplesOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2 border-red-200">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <NonConformanceCard
                        type="Minor"
                        example={question.nonConformanceExamples.minor}
                        color="border-yellow-400"
                        icon={AlertTriangle}
                      />
                      <NonConformanceCard
                        type="Major"
                        example={question.nonConformanceExamples.major}
                        color="border-orange-400"
                        icon={XCircle}
                      />
                      <NonConformanceCard
                        type="Critical"
                        example={question.nonConformanceExamples.critical}
                        color="border-red-400"
                        icon={XCircle}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Audit Tips */}
          {question.auditTips && question.auditTips.length > 0 && (
            <Collapsible open={isTipsOpen} onOpenChange={setIsTipsOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between hover:bg-yellow-50 border-yellow-300"
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <span>Auditor Tips & Best Practices</span>
                  </div>
                  {isTipsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Card className="mt-2 border-yellow-200">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {question.auditTips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
