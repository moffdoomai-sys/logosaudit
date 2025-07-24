// Multi-Audit Management Types
export interface User {
  id: string;
  email: string;
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interviewee {
  id: string;
  auditId: string;
  name: string;
  jobTitle: string;
  department?: string;
  email?: string;
}

export interface AuditMetadata {
  id: string;
  title: string;
  dateStarted: Date;
  dateCompleted?: Date;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  companyName: string;
  companyAddress: string;
  leadAuditorId: string;
  leadAuditor?: User;
  isoStandard: 'ISO9001' | 'ISO45001';
  selectedSections: string[];
  customScope: boolean;
  completionPercentage: number;
  overallScore?: number;
  createdAt: Date;
  updatedAt: Date;
  interviewees?: Interviewee[];
}

export interface NewAuditData {
  title: string;
  companyName: string;
  companyAddress: string;
  leadAuditorName: string;
  leadAuditorEmail: string;
  leadAuditorTitle?: string;
  isoStandard: 'ISO9001' | 'ISO45001';
  interviewees: {
    name: string;
    jobTitle: string;
    department?: string;
    email?: string;
  }[];
  selectedSections: string[];
  customScope: boolean;
}

// Original audit execution types (preserved for existing audit flow)
export interface EvidenceGuidance {
  documents: string[];
  interviews: string[];
  observations: string[];
  records: string[];
}

export interface NonConformanceExample {
  description: string;
  impact: string;
  example: string;
}

export interface NonConformanceExamples {
  minor: NonConformanceExample;
  major: NonConformanceExample;
  critical: NonConformanceExample;
}

export interface AuditQuestion {
  id: string;
  parentId?: string;
  clause: string;
  text: string;
  isParent: boolean;
  children?: AuditQuestion[];
  category: string;
  isoStandard: 'ISO9001' | 'ISO45001';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  industryContext?: string;
  evidenceGuidance?: EvidenceGuidance;
  nonConformanceExamples?: NonConformanceExamples;
  auditTips?: string[];
}

export interface AuditFinding {
  questionId: string;
  score: 'compliant' | 'minor-nc' | 'major-nc' | 'critical-nc' | 'not-assessed';
  notes: string;
  evidenceNotes: string;
  timestamp: Date;
}

export interface ISOSection {
  id: string;
  number: string;
  title: string;
  description: string;
  questionCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  industryRelevance: string;
  isoStandard: 'ISO9001' | 'ISO45001';
}

// Backward compatibility
export interface ISO9001Section extends ISOSection {}

// ISO Standard definitions
export interface ISOStandard {
  id: 'ISO9001' | 'ISO45001';
  name: string;
  fullName: string;
  description: string;
  version: string;
  sections: ISOSection[];
}

export interface AuditTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  recommendedFor: string[];
}

export interface AuditScope {
  selectedSections: Set<string>;
  template?: string;
  customScope: boolean;
}

export interface AuditState {
  currentAuditId?: string;
  questions: AuditQuestion[];
  omittedQuestions: Set<string>;
  findings: Record<string, AuditFinding>;
  auditScope: AuditScope;
  auditInfo: {
    auditTitle: string;
    auditDate: string;
    auditor: string;
    facility: string;
  };
}

export interface ScoreWeights {
  compliant: number;
  'minor-nc': number;
  'major-nc': number;
  'critical-nc': number;
  'not-assessed': number;
}

export interface SectionProgress {
  sectionId: string;
  totalQuestions: number;
  assessedQuestions: number;
  omittedQuestions: number;
  completionPercentage: number;
  sectionScore: number;
}

export interface AuditProgress {
  totalQuestions: number;
  assessedQuestions: number;
  omittedQuestions: number;
  activeQuestions: number;
  completionPercentage: number;
  scoreBreakdown: Record<string, number>;
  overallScore: number;
  sectionProgress: SectionProgress[];
}

// Dashboard types
export interface DashboardStats {
  totalAudits: number;
  activeAudits: number;
  completedAudits: number;
  averageScore: number;
  recentAudits: AuditMetadata[];
}



