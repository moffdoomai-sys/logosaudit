
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/lib/firebase/audit-service';
import { FirebaseAuditFinding } from '@/lib/firebase/models';

export const dynamic = "force-dynamic";

// POST /api/audits/[id]/findings - Create or update finding
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const findingData: Partial<FirebaseAuditFinding> = await request.json();
    
    if (!findingData.questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    await AuditService.createOrUpdateFinding(
      params.id,
      findingData.questionId,
      findingData
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save finding:', error);
    return NextResponse.json(
      { error: 'Failed to save finding' },
      { status: 500 }
    );
  }
}
