// Re-export audit data from both standards
export { auditData as iso9001Data } from './audit-data';
export { iso45001Data } from './iso45001-data';
export * from './types';

// Unified interface for both standards
export const unifiedAuditData = {
  'ISO 9001': () => import('./audit-data').then(m => m.auditData),
  'ISO 45001': () => import('./iso45001-data').then(m => m.iso45001Data),
};

export type AuditStandard = 'ISO 9001' | 'ISO 45001';

export const getAuditDataForStandard = async (standard: AuditStandard) => {
  const loader = unifiedAuditData[standard];
  return await loader();
};
