
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuditState, AuditFinding, AuditProgress, ScoreWeights, AuditQuestion, AuditScope, SectionProgress } from '@/lib/types';
import { ISO9001_QUESTIONS, buildQuestionHierarchy } from '@/lib/audit-data';
import { ISO9001_SECTIONS } from '@/lib/section-data';

const SCORE_WEIGHTS: ScoreWeights = {
  'compliant': 100,
  'minor-nc': 75,
  'major-nc': 50,
  'critical-nc': 0,
  'not-assessed': 0
};

// Non-conformance response templates
export const NON_CONFORMANCE_RESPONSES = {
  'minor-nc': [
    'Minor documentation gap identified - procedure exists but lacks specific detail',
    'Training records incomplete for some personnel - no impact on competency demonstrated',
    'Minor procedural deviation observed - corrective action implemented immediately',
    'Documentation not fully current - content accurate but revision date overdue',
    'Minor calibration delay - equipment still within acceptable tolerance'
  ],
  'major-nc': [
    'Systematic failure in process implementation affecting multiple areas',
    'Required procedure not implemented as documented - significant deviation observed',
    'Critical training not completed for key personnel affecting process effectiveness',
    'Management review process not conducted as required - missing key elements',
    'Internal audit program not covering all required areas systematically'
  ],
  'critical-nc': [
    'Immediate risk to public health and safety - process control failure',
    'Complete absence of required safety procedures in critical operations',
    'Contamination risk not controlled - potential for public health impact',
    'Emergency response procedures not established for critical scenarios',
    'Regulatory compliance failure with immediate enforcement implications'
  ]
};

interface AuditStore extends AuditState {
  // Actions
  toggleQuestionOmission: (questionId: string) => void;
  updateFinding: (questionId: string, finding: Partial<AuditFinding>) => void;
  updateAuditInfo: (info: Partial<AuditState['auditInfo']>) => void;
  updateAuditScope: (scope: Partial<AuditScope>) => void;
  resetAudit: () => void;
  getProgress: () => AuditProgress;
  getActiveQuestions: () => any[];
  getFilteredQuestions: () => any[];
  getSectionProgress: (sectionId: string) => SectionProgress;
  exportAuditData: () => string;
  importAuditData: (data: string) => boolean;
}

const initialState: AuditState = {
  questions: buildQuestionHierarchy(ISO9001_QUESTIONS),
  omittedQuestions: new Set(),
  findings: {},
  auditScope: {
    selectedSections: new Set(['section-4', 'section-5', 'section-6', 'section-7', 'section-8', 'section-9', 'section-10']),
    customScope: false
  },
  auditInfo: {
    auditTitle: '',
    auditDate: new Date().toISOString().split('T')[0],
    auditor: '',
    facility: ''
  }
};

export const useAuditStore = create<AuditStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      toggleQuestionOmission: (questionId: string) => {
        set((state) => {
          const newOmitted = new Set(state.omittedQuestions);
          if (newOmitted.has(questionId)) {
            newOmitted.delete(questionId);
          } else {
            newOmitted.add(questionId);
          }
          return { omittedQuestions: newOmitted };
        });
      },

      updateFinding: (questionId: string, finding: Partial<AuditFinding>) => {
        set((state) => {
          // Get current finding to preserve existing data
          const currentFinding = state.findings[questionId] || {
            questionId,
            score: 'not-assessed',
            notes: '',
            evidenceNotes: '',
            timestamp: new Date()
          };

          // Merge new finding data with current, preserving all fields
          const updatedFinding = {
            ...currentFinding,
            ...finding,
            questionId, // Ensure questionId is always set
            timestamp: new Date() // Update timestamp on any change
          };

          return {
            findings: {
              ...state.findings,
              [questionId]: updatedFinding
            }
          };
        });
      },

      updateAuditInfo: (info: Partial<AuditState['auditInfo']>) => {
        set((state) => ({
          auditInfo: { ...state.auditInfo, ...info }
        }));
      },

      updateAuditScope: (scope: Partial<AuditScope>) => {
        set((state) => ({
          auditScope: { 
            ...state.auditScope, 
            ...scope,
            selectedSections: scope.selectedSections ? new Set(scope.selectedSections) : state.auditScope.selectedSections
          }
        }));
      },

      resetAudit: () => {
        set(initialState);
      },

      getActiveQuestions: () => {
        const state = get();
        const allQuestions: any[] = [];
        
        const addQuestions = (questions: any[]) => {
          questions.forEach(q => {
            if (!state.omittedQuestions.has(q.id)) {
              allQuestions.push(q);
              if (q.children) {
                addQuestions(q.children);
              }
            }
          });
        };
        
        addQuestions(state.questions);
        return allQuestions;
      },

      getFilteredQuestions: () => {
        const state = get();
        const activeQuestions = get().getActiveQuestions();
        
        // If no sections selected, return all questions
        if (state.auditScope.selectedSections.size === 0) {
          return activeQuestions;
        }
        
        // Filter questions based on selected sections
        return activeQuestions.filter(q => {
          const sectionNumber = q.clause.split('.')[0];
          const sectionId = `section-${sectionNumber}`;
          return state.auditScope.selectedSections.has(sectionId);
        });
      },

      getSectionProgress: (sectionId: string): SectionProgress => {
        const state = get();
        const sectionNumber = sectionId.replace('section-', '');
        const activeQuestions = get().getActiveQuestions();
        
        const sectionQuestions = activeQuestions.filter(q => {
          const questionSectionNumber = q.clause.split('.')[0];
          return questionSectionNumber === sectionNumber;
        });
        
        const totalQuestions = sectionQuestions.length;
        const omittedQuestions = sectionQuestions.filter(q => state.omittedQuestions.has(q.id)).length;
        
        let assessedQuestions = 0;
        let totalScore = 0;
        let maxPossibleScore = 0;
        
        sectionQuestions.forEach(q => {
          const finding = state.findings[q.id];
          if (finding && finding.score !== 'not-assessed') {
            assessedQuestions++;
            totalScore += SCORE_WEIGHTS[finding.score];
          }
          maxPossibleScore += SCORE_WEIGHTS.compliant;
        });
        
        const completionPercentage = totalQuestions > 0 ? (assessedQuestions / totalQuestions) * 100 : 0;
        const sectionScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
        
        return {
          sectionId,
          totalQuestions,
          assessedQuestions,
          omittedQuestions,
          completionPercentage,
          sectionScore
        };
      },

      getProgress: (): AuditProgress => {
        const state = get();
        const filteredQuestions = get().getFilteredQuestions();
        const totalQuestions = filteredQuestions.length;
        const omittedCount = filteredQuestions.filter(q => state.omittedQuestions.has(q.id)).length;
        const activeCount = filteredQuestions.length - omittedCount;
        
        let assessedCount = 0;
        let totalScore = 0;
        let maxPossibleScore = 0;
        const scoreBreakdown: Record<string, number> = {
          'compliant': 0,
          'minor-nc': 0,
          'major-nc': 0,
          'critical-nc': 0,
          'not-assessed': 0
        };

        filteredQuestions.forEach(q => {
          if (!state.omittedQuestions.has(q.id)) {
            const finding = state.findings[q.id];
            if (finding && finding.score !== 'not-assessed') {
              assessedCount++;
              totalScore += SCORE_WEIGHTS[finding.score];
              scoreBreakdown[finding.score]++;
            } else {
              scoreBreakdown['not-assessed']++;
            }
            maxPossibleScore += SCORE_WEIGHTS.compliant;
          }
        });

        const completionPercentage = activeCount > 0 ? (assessedCount / activeCount) * 100 : 0;
        const overallScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

        // Calculate section progress for selected sections
        const sectionProgress: SectionProgress[] = Array.from(state.auditScope.selectedSections).map(sectionId => 
          get().getSectionProgress(sectionId)
        );

        return {
          totalQuestions,
          assessedQuestions: assessedCount,
          omittedQuestions: omittedCount,
          activeQuestions: activeCount,
          completionPercentage,
          scoreBreakdown,
          overallScore,
          sectionProgress
        };
      },

      exportAuditData: () => {
        const state = get();
        return JSON.stringify({
          auditInfo: state.auditInfo,
          auditScope: {
            ...state.auditScope,
            selectedSections: Array.from(state.auditScope.selectedSections)
          },
          omittedQuestions: Array.from(state.omittedQuestions),
          findings: state.findings,
          exportDate: new Date().toISOString()
        }, null, 2);
      },

      importAuditData: (data: string): boolean => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            auditInfo: parsed.auditInfo || state.auditInfo,
            auditScope: parsed.auditScope ? {
              ...parsed.auditScope,
              selectedSections: new Set(parsed.auditScope.selectedSections || [])
            } : state.auditScope,
            omittedQuestions: new Set(parsed.omittedQuestions || []),
            findings: parsed.findings || {}
          }));
          return true;
        } catch {
          return false;
        }
      },

    }),
    {
      name: 'iso9001-audit-store',
      partialize: (state) => ({
        auditInfo: state.auditInfo,
        auditScope: {
          ...state.auditScope,
          selectedSections: Array.from(state.auditScope.selectedSections)
        },
        omittedQuestions: Array.from(state.omittedQuestions),
        findings: state.findings
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (Array.isArray(state.omittedQuestions)) {
            state.omittedQuestions = new Set(state.omittedQuestions);
          }
          if (state.auditScope && Array.isArray(state.auditScope.selectedSections)) {
            state.auditScope.selectedSections = new Set(state.auditScope.selectedSections);
          }
        }
      }
    }
  )
);
