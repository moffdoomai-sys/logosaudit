
export const COLLECTIONS = {
  USERS: 'users',
  AUDITS: 'audits',
  INTERVIEWEES: 'interviewees',
  AUDIT_FINDINGS: 'auditFindings',
  OMITTED_QUESTIONS: 'omittedQuestions',
  DOCUMENTS: 'documents',
  DOCUMENT_REFERENCES: 'documentReferences'
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
