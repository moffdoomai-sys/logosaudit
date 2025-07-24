
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { DocumentService } from '@/lib/firebase/document-service';

export const dynamic = "force-dynamic";

// POST /api/documents/upload - Upload document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const auditId = formData.get('auditId') as string;
    const uploadedBy = formData.get('uploadedBy') as string;
    const isoStandard = formData.get('isoStandard') as 'ISO9001' | 'ISO45001';

    if (!file || !auditId || !uploadedBy || !isoStandard) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      );
    }

    const document = await DocumentService.uploadDocument(
      file,
      auditId,
      uploadedBy,
      isoStandard
    );

    // Convert Firebase Timestamps to serializable format
    const serializedDocument = {
      ...document,
      createdAt: document.createdAt instanceof Date ? document.createdAt.toISOString() : document.createdAt?.toDate?.()?.toISOString(),
      updatedAt: document.updatedAt instanceof Date ? document.updatedAt.toISOString() : document.updatedAt?.toDate?.()?.toISOString(),
    };

    return NextResponse.json(serializedDocument, { status: 201 });
  } catch (error) {
    console.error('Failed to upload document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
