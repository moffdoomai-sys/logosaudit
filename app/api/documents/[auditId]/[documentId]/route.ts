
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/firebase/document-service';

export const dynamic = "force-dynamic";

// DELETE /api/documents/[auditId]/[documentId] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { auditId: string; documentId: string } }
) {
  try {
    await DocumentService.deleteDocument(params.documentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}

// GET /api/documents/[auditId]/[documentId] - Get document details
export async function GET(
  request: NextRequest,
  { params }: { params: { auditId: string; documentId: string } }
) {
  try {
    const document = await DocumentService.getDocumentById(params.documentId);

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Convert Firebase Timestamps to serializable format
    const serializedDocument = {
      ...document,
      createdAt: document.createdAt instanceof Date ? document.createdAt.toISOString() : document.createdAt?.toDate?.()?.toISOString(),
      updatedAt: document.updatedAt instanceof Date ? document.updatedAt.toISOString() : document.updatedAt?.toDate?.()?.toISOString(),
    };

    return NextResponse.json(serializedDocument);
  } catch (error) {
    console.error('Failed to fetch document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}
