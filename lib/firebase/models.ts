// Audit related types
export interface CreateAuditData {
  name: string;
  description?: string;
  standard: string;
  scope?: string[];
  objectives?: string[];
  criteria?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  status?: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Audit {
  id: string;
  name: string;
  description?: string;
  standard: string;
  scope?: string[];
  objectives?: string[];
  criteria?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Finding {
  id: string;
  auditId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category?: string;
  evidence?: string[];
  recommendations?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Document {
  id: string;
  auditId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date | string;
  uploadedBy?: string;
}

export interface AuditWithRelations extends Audit {
  findings?: Finding[];
  documents?: Document[];
}

// Alias for Document type (some files might use FirebaseDocument instead of Document)
export type FirebaseDocument = Document;
