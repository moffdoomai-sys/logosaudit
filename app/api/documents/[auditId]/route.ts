
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/firebase/document-service';

export const dynamic = "force-dynamic";

// GET /api/documents/[auditId] - Get documents for audit
export async function GET(
  request: NextRequest,
  { params }: { params: { auditId: string } }
) {
  try {
    const documents = await DocumentService.getDocumentsByAudit(params.auditId);

    // Convert Firebase Timestamps to serializable format
    const serializedDocuments = documents.map(doc => ({
      ...doc,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : doc.updatedAt?.toDate?.()?.toISOString(),
    }));

    return NextResponse.json(serializedDocuments);
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
