// lib/section-data.ts

export interface SectionData {
  id: string;
  title: string;
  description: string;
  category: string;
  standardId?: string;
  number: string;
  questionCount: number;
  riskLevel: string;
  industryRelevance: string;
}

export interface Standard {
  id: string;
  name: string;
  description: string;
}

export interface AuditTemplate {
  id: string;
  name: string;
  description: string;
  sections: string[];
  recommendedFor: string[];
}

// Section data with all required properties
export const sectionData: SectionData[] = [
  {
    id: "brand-identity",
    title: "Brand Identity",
    description: "Logo design, color palette, typography",
    category: "visual",
    standardId: "iso9001",
    number: "4",
    questionCount: 12,
    riskLevel: "high",
    industryRelevance: "Critical for brand consistency and recognition"
  },
  {
    id: "brand-messaging",
    title: "Brand Messaging", 
    description: "Voice, tone, key messages",
    category: "content",
    standardId: "iso9001",
    number: "5",
    questionCount: 8,
    riskLevel: "medium",
    industryRelevance: "Important for communication effectiveness"
  },
  {
    id: "brand-application",
    title: "Brand Application",
    description: "How brand is applied across touchpoints",
    category: "implementation",
    standardId: "iso9001",
    number: "6",
    questionCount: 15,
    riskLevel: "high",
    industryRelevance: "Essential for consistent brand experience"
  }
];

// Standards data
export const standards: Standard[] = [
  {
    id: "iso9001",
    name: "ISO 9001:2015",
    description: "Quality Management Systems"
  },
  {
    id: "iso45001",
    name: "ISO 45001:2018", 
    description: "Occupational Health and Safety Management Systems"
  },
  {
    id: "iso14001",
    name: "ISO 14001:2015",
    description: "Environmental Management Systems"
  }
];

// ISO Standards constant (required export)
export const ISO_STANDARDS = standards;

// Audit Templates with recommendedFor property
export const AUDIT_TEMPLATES: AuditTemplate[] = [
  {
    id: "basic-brand-audit",
    name: "Basic Brand Audit",
    description: "Comprehensive brand assessment",
    sections: ["brand-identity", "brand-messaging", "brand-application"],
    recommendedFor: [
      "Initial brand assessment",
      "Brand consistency evaluation",
      "Marketing alignment review"
    ]
  },
  {
    id: "comprehensive-audit",
    name: "Comprehensive ISO 9001 Audit",
    description: "Full system assessment covering all sections",
    sections: ["brand-identity", "brand-messaging", "brand-application"],
    recommendedFor: [
      "Annual management review",
      "Certification preparation",
      "Complete system evaluation"
    ]
  },
  {
    id: "leadership-focus",
    name: "Leadership & Management Focus",
    description: "Focus on leadership and organizational context",
    sections: ["brand-identity", "brand-messaging"],
    recommendedFor: [
      "Management system maturity assessment",
      "Leadership effectiveness review",
      "Strategic alignment evaluation"
    ]
  }
];

// Export ISO9001_SECTIONS for compatibility
export const ISO9001_SECTIONS = sectionData;

// Missing function exports (required by your components)
export const getSectionById = (id: string): SectionData | undefined => {
  return sectionData.find(section => section.id === id);
};

export const getStandardById = (id: string): Standard | undefined => {
  return standards.find(standard => standard.id === id);
};

export const getSectionsByStandard = (standardId: string): SectionData[] => {
  return sectionData.filter(section => section.standardId === standardId);
};

// Default export
export default {
  sectionData,
  standards,
  AUDIT_TEMPLATES,
  ISO9001_SECTIONS,
  ISO_STANDARDS,
  getSectionById,
  getStandardById,
  getSectionsByStandard
};