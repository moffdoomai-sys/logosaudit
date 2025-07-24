

import { AuditQuestion } from './types';

// Default guidance for ISO 45001 questions without specific guidance
const getISO45001DefaultGuidance = (questionText: string, category: string) => ({
  evidenceGuidance: {
    documents: ['OH&S policies and procedures', 'Risk assessment documents', 'Safety management systems', 'Training records'],
    interviews: ['Safety officers', 'Workers representatives', 'Management team', 'Process operators'],
    observations: ['Workplace conditions', 'Safety practices', 'Hazard controls', 'Emergency procedures'],
    records: ['Incident reports', 'Safety monitoring data', 'Training records', 'Audit records']
  },
  nonConformanceExamples: {
    minor: {
      description: 'Minor gaps in OH&S implementation or documentation',
      impact: 'Limited impact on worker safety',
      example: 'Process generally followed but some documentation gaps or minor safety deviations'
    },
    major: {
      description: 'Significant gaps affecting OH&S effectiveness',
      impact: 'Worker safety may be compromised',
      example: 'Key safety processes missing or not systematically implemented'
    },
    critical: {
      description: 'Major safety failures or absence of critical controls',
      impact: 'High risk to worker health and safety',
      example: 'Critical safety controls not implemented or major system failure creating immediate danger'
    }
  },
  auditTips: [
    'Verify OH&S processes are documented and implemented as described',
    'Check for evidence of hazard identification and risk assessment',
    'Ensure workers are trained and competent in safety procedures',
    'Look for continuous improvement in safety performance'
  ]
});

const iso45001Questions: AuditQuestion[] = [
  // Clause 4: Context of the Organization
  {
    id: 'iso45001-q4-1',
    clause: '4.1',
    text: 'Has the organization determined external and internal issues relevant to its purpose and strategic direction that affect its ability to achieve the intended results of its OH&S management system?',
    isParent: true,
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'high',
    industryContext: 'Critical for understanding workplace hazards, regulatory requirements, and safety culture factors',
    evidenceGuidance: {
      documents: [
        'OH&S policy and strategic documents',
        'Hazard identification and risk assessment',
        'Legal and regulatory requirements register',
        'Organizational context analysis',
        'Stakeholder analysis documentation'
      ],
      interviews: [
        'OH&S manager',
        'Senior management',
        'Worker representatives',
        'Regulatory compliance officers'
      ],
      observations: [
        'Workplace hazard assessment processes',
        'Safety culture indicators',
        'Management commitment to OH&S',
        'Worker participation activities'
      ],
      records: [
        'Context review records',
        'Management review minutes',
        'Risk assessment reports',
        'Legal compliance reports'
      ]
    },
    nonConformanceExamples: {
      minor: {
        description: 'Some internal or external issues identified but analysis incomplete',
        impact: 'Potential gaps in OH&S understanding',
        example: 'Organization has identified key safety issues but documentation lacks detail on impact assessment'
      },
      major: {
        description: 'Limited identification of internal and external OH&S issues',
        impact: 'OH&S management may not address key workplace risks',
        example: 'Only basic safety issues identified without systematic analysis of their impact on worker safety'
      },
      critical: {
        description: 'No systematic identification or analysis of internal and external OH&S issues',
        impact: 'High risk of uncontrolled workplace hazards and safety failures',
        example: 'No documented process for identifying organizational context or OH&S strategic issues'
      }
    },
    auditTips: [
      'Look for evidence of systematic workplace hazard scanning',
      'Check if issues are regularly reviewed and updated',
      'Verify linkage between identified issues and OH&S system design',
      'Assess if both internal capabilities and external factors are considered'
    ]
  },
  {
    id: 'iso45001-q4-2',
    clause: '4.1',
    text: 'Are these OH&S issues documented and regularly reviewed for changes?',
    isParent: false,
    parentId: 'iso45001-q4-1',
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'medium',
    industryContext: 'Essential for maintaining current awareness of changing workplace conditions and safety requirements'
  },
  {
    id: 'iso45001-q4-3',
    clause: '4.2',
    text: 'Has the organization determined the workers and other interested parties that are relevant to the OH&S management system?',
    isParent: true,
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'high',
    industryContext: 'Fundamental for understanding worker needs, regulatory expectations, and community safety concerns',
    evidenceGuidance: {
      documents: [
        'Worker consultation and participation procedures',
        'Interested parties register',
        'Community engagement plans',
        'Regulatory requirements documentation',
        'Union agreements and safety committees'
      ],
      interviews: [
        'Worker representatives',
        'Union representatives',
        'Community liaison officers',
        'Regulatory affairs personnel'
      ],
      observations: [
        'Worker consultation processes',
        'Safety committee meetings',
        'Community engagement activities',
        'Regulatory interaction processes'
      ],
      records: [
        'Worker consultation records',
        'Safety committee minutes',
        'Community consultation documentation',
        'Regulatory compliance reports'
      ]
    },
    auditTips: [
      'Verify all relevant worker groups are considered',
      'Check if requirements are specific and actionable',
      'Look for evidence of meaningful worker participation',
      'Assess if external stakeholder needs are addressed'
    ]
  },
  {
    id: 'iso45001-q4-4',
    clause: '4.2',
    text: 'Are the needs and expectations of workers and other interested parties determined and monitored?',
    isParent: false,
    parentId: 'iso45001-q4-3',
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'medium',
    industryContext: 'Important for maintaining worker satisfaction and regulatory compliance'
  },
  {
    id: 'iso45001-q4-5',
    clause: '4.3',
    text: 'Has the organization determined the scope of its OH&S management system?',
    isParent: true,
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Defines the boundaries and applicability of the occupational health and safety management system',
    evidenceGuidance: {
      documents: [
        'OH&S management system scope statement',
        'OH&S manual or equivalent',
        'Process documentation',
        'Site location descriptions',
        'Organizational charts'
      ],
      interviews: [
        'OH&S manager',
        'Senior management',
        'Site managers',
        'Process owners'
      ],
      observations: [
        'Actual operations covered',
        'Workplace boundaries and activities',
        'OH&S process implementation',
        'Organizational structure'
      ],
      records: [
        'Scope review records',
        'Management review minutes',
        'OH&S performance data',
        'Audit records'
      ]
    },
    auditTips: [
      'Verify scope covers all workplace hazards',
      'Check if all locations and activities are addressed',
      'Ensure scope considers worker and stakeholder needs',
      'Look for justification of any exclusions'
    ]
  },
  {
    id: 'iso45001-q4-6',
    clause: '4.3',
    text: 'Is the scope documented, maintained, and available to interested parties?',
    isParent: false,
    parentId: 'iso45001-q4-5',
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'medium',
    industryContext: 'Ensures transparency and clear communication of OH&S system coverage'
  },
  {
    id: 'iso45001-q4-7',
    clause: '4.4',
    text: 'Has the organization established, implemented, maintained and continually improved an OH&S management system including the processes needed and their interactions?',
    isParent: true,
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Core requirement for systematic occupational health and safety management',
    evidenceGuidance: {
      documents: [
        'OH&S process maps and flowcharts',
        'OH&S process documentation',
        'OH&S manual',
        'Procedure documents',
        'Work instructions'
      ],
      interviews: [
        'OH&S process owners',
        'OH&S manager',
        'Department managers',
        'Safety representatives'
      ],
      observations: [
        'OH&S process implementation',
        'Process interactions',
        'Safety system operation',
        'Control activities'
      ],
      records: [
        'OH&S process performance data',
        'Process review records',
        'Improvement records',
        'Training records'
      ]
    },
    auditTips: [
      'Verify all required OH&S processes are established',
      'Check process interactions are understood',
      'Look for evidence of continual improvement',
      'Assess process effectiveness in preventing incidents'
    ]
  },
  {
    id: 'iso45001-q4-8',
    clause: '4.4',
    text: 'Are OH&S process interactions, sequence, and criteria for operation and control determined?',
    isParent: false,
    parentId: 'iso45001-q4-7',
    category: 'Context of Organization',
    isoStandard: 'ISO45001',
    riskLevel: 'high',
    industryContext: 'Essential for coordinated safety operations and effective process management'
  },

  // Clause 5: Leadership and Worker Participation
  {
    id: 'iso45001-q5-1',
    clause: '5.1',
    text: 'Does top management demonstrate leadership and commitment with respect to the OH&S management system?',
    isParent: true,
    category: 'Leadership',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Essential for establishing safety culture and organizational commitment to worker health and safety',
    evidenceGuidance: {
      documents: [
        'OH&S policy statement',
        'Management review records',
        'Strategic planning documents',
        'Resource allocation records',
        'Communication materials'
      ],
      interviews: [
        'Top management',
        'OH&S manager',
        'Department heads',
        'Worker representatives'
      ],
      observations: [
        'Management engagement in safety activities',
        'Resource provision decisions',
        'Communication of safety importance',
        'Management review meetings'
      ],
      records: [
        'Management review minutes',
        'Safety communications',
        'Resource allocation decisions',
        'OH&S performance reviews'
      ]
    },
    auditTips: [
      'Look for active management participation in safety activities',
      'Check for adequate resource provision for OH&S',
      'Verify OH&S policy integration with business strategy',
      'Assess management communication of safety importance'
    ]
  },
  {
    id: 'iso45001-q5-2',
    clause: '5.2',
    text: 'Has the organization established an OH&S policy that is appropriate to the purpose and context of the organization?',
    isParent: true,
    category: 'Leadership',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Fundamental for establishing organizational commitment to worker health and safety',
    evidenceGuidance: {
      documents: [
        'OH&S policy document',
        'Policy communication materials',
        'Management review records',
        'Training materials',
        'Website and public communications'
      ],
      interviews: [
        'Top management',
        'OH&S manager',
        'Workers at all levels',
        'Department heads'
      ],
      observations: [
        'Policy display and communication',
        'Policy implementation in practice',
        'Worker awareness of policy',
        'Management commitment demonstration'
      ],
      records: [
        'Policy approval records',
        'Communication records',
        'Training attendance records',
        'Policy review records'
      ]
    },
    auditTips: [
      'Verify policy is current and relevant',
      'Check policy is communicated to all workers',
      'Look for evidence policy guides decision-making',
      'Assess if policy reflects organizational values'
    ]
  },
  {
    id: 'iso45001-q5-3',
    clause: '5.3',
    text: 'Has the organization established, implemented and maintained organizational roles, responsibilities and authorities for the OH&S management system?',
    isParent: true,
    category: 'Leadership',
    isoStandard: 'ISO45001',
    riskLevel: 'high',
    industryContext: 'Critical for ensuring clear accountability and effective OH&S governance',
    evidenceGuidance: {
      documents: [
        'Organizational charts',
        'Job descriptions',
        'Responsibility matrices',
        'Delegation of authority documents',
        'Committee terms of reference'
      ],
      interviews: [
        'Management team',
        'OH&S personnel',
        'Department heads',
        'Worker representatives'
      ],
      observations: [
        'Decision-making processes',
        'Authority exercise',
        'Responsibility fulfillment',
        'Committee operations'
      ],
      records: [
        'Appointment records',
        'Training records',
        'Performance evaluations',
        'Committee minutes'
      ]
    },
    auditTips: [
      'Verify roles and responsibilities are clearly defined',
      'Check authorities are appropriate and understood',
      'Look for evidence of accountability measures',
      'Assess competence for assigned roles'
    ]
  },
  {
    id: 'iso45001-q5-4',
    clause: '5.4',
    text: 'Has the organization established and maintained processes for consultation and participation of workers at all applicable levels and functions?',
    isParent: true,
    category: 'Leadership',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Fundamental requirement for worker engagement and effective OH&S management',
    evidenceGuidance: {
      documents: [
        'Worker consultation procedures',
        'Participation processes',
        'Committee structures',
        'Communication protocols',
        'Feedback mechanisms'
      ],
      interviews: [
        'Worker representatives',
        'Union representatives',
        'Management team',
        'OH&S committees'
      ],
      observations: [
        'Consultation meetings',
        'Worker participation activities',
        'Feedback processes',
        'Decision-making involvement'
      ],
      records: [
        'Consultation meeting minutes',
        'Worker feedback records',
        'Participation evidence',
        'Communication records'
      ]
    },
    auditTips: [
      'Verify meaningful worker participation exists',
      'Check consultation is timely and effective',
      'Look for evidence of worker input influence',
      'Assess accessibility of participation processes'
    ]
  },

  // Clause 6: Planning
  {
    id: 'iso45001-q6-1',
    clause: '6.1.1',
    text: 'When planning for the OH&S management system, has the organization considered the issues, requirements and scope determined in clause 4 and determined the risks and opportunities that need to be addressed?',
    isParent: true,
    category: 'Planning',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Essential for systematic identification and management of workplace risks and opportunities',
    evidenceGuidance: {
      documents: [
        'Risk assessment methodology',
        'Hazard identification procedures',
        'Risk register',
        'Opportunity identification process',
        'Risk treatment plans'
      ],
      interviews: [
        'Risk managers',
        'OH&S specialists',
        'Process owners',
        'Worker representatives'
      ],
      observations: [
        'Risk assessment processes',
        'Hazard identification activities',
        'Risk control implementation',
        'Opportunity development'
      ],
      records: [
        'Risk assessment records',
        'Hazard reports',
        'Control effectiveness data',
        'Opportunity implementation records'
      ]
    },
    auditTips: [
      'Verify systematic approach to risk identification',
      'Check integration with organizational context',
      'Look for evidence of opportunity consideration',
      'Assess risk treatment effectiveness'
    ]
  },
  {
    id: 'iso45001-q6-2',
    clause: '6.1.2',
    text: 'Has the organization established and maintained processes for the ongoing hazard identification and assessment of OH&S risks?',
    isParent: true,
    category: 'Planning',
    isoStandard: 'ISO45001',
    riskLevel: 'critical',
    industryContext: 'Core requirement for identifying and controlling workplace hazards',
    evidenceGuidance: {
      documents: [
        'Hazard identification procedures',
        'Risk assessment methodologies',
        'Job safety analyses',
        'Change management procedures',
        'Incident investigation procedures'
      ],
      interviews: [
        'Safety officers',
        'Workers',
        'Supervisors',
        'Technical specialists'
      ],
      observations: [
        'Workplace hazard identification',
        'Risk assessment activities',
        'Worker participation in identification',
        'Hazard reporting systems'
      ],
      records: [
        'Hazard identification records',
        'Risk assessment reports',
        'Job safety analysis records',
        'Change impact assessments'
      ]
    },
    auditTips: [
      'Verify hazard identification covers all activities',
      'Check worker participation in identification',
      'Look for systematic assessment methodology',
      'Assess frequency and triggers for review'
    ]
  }
];

// Add similar patterns for other sections...
// This is a representative sample of ISO 45001 questions

// Add default guidance for questions without specific guidance
export const iso45001QuestionsWithGuidance: AuditQuestion[] = iso45001Questions.map(question => {
  if (!question.evidenceGuidance || !question.nonConformanceExamples || !question.auditTips) {
    const defaultGuidance = getISO45001DefaultGuidance(question.text, question.category);
    return {
      ...question,
      evidenceGuidance: question.evidenceGuidance || defaultGuidance.evidenceGuidance,
      nonConformanceExamples: question.nonConformanceExamples || defaultGuidance.nonConformanceExamples,
      auditTips: question.auditTips || defaultGuidance.auditTips
    };
  }
  return question;
});

// Function to build question hierarchy for ISO 45001
export function buildISO45001QuestionHierarchy(questions: AuditQuestion[]): AuditQuestion[] {
  const processedQuestions = questions.map(question => {
    if (question.isParent) {
      const children = questions.filter(q => q.parentId === question.id);
      return {
        ...question,
        children: children.length > 0 ? children : undefined
      };
    }
    return question;
  });

  // Filter out child questions from main array as they're now nested
  return processedQuestions.filter(q => !q.parentId);
}

// Create a hierarchy of parent-child relationships
export const ISO45001_QUESTIONS = buildISO45001QuestionHierarchy(iso45001QuestionsWithGuidance);

export default ISO45001_QUESTIONS;
