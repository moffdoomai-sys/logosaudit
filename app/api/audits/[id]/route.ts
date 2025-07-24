
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/lib/firebase/audit-service';

export const dynamic = "force-dynamic";

// GET /api/audits/[id] - Fetch single audit
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await AuditService.getAuditById(params.id);

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Convert Firebase Timestamps to serializable format
    const serializedAudit = {
      ...audit,
      dateStarted: audit.dateStarted instanceof Date ? audit.dateStarted.toISOString() : audit.dateStarted?.toDate?.()?.toISOString(),
      dateCompleted: audit.dateCompleted instanceof Date ? audit.dateCompleted.toISOString() : audit.dateCompleted?.toDate?.()?.toISOString(),
      createdAt: audit.createdAt instanceof Date ? audit.createdAt.toISOString() : audit.createdAt?.toDate?.()?.toISOString(),
      updatedAt: audit.updatedAt instanceof Date ? audit.updatedAt.toISOString() : audit.updatedAt?.toDate?.()?.toISOString(),
      leadAuditor: audit.leadAuditor ? {
        ...audit.leadAuditor,
        createdAt: audit.leadAuditor.createdAt instanceof Date ? audit.leadAuditor.createdAt.toISOString() : audit.leadAuditor.createdAt?.toDate?.()?.toISOString(),
        updatedAt: audit.leadAuditor.updatedAt instanceof Date ? audit.leadAuditor.updatedAt.toISOString() : audit.leadAuditor.updatedAt?.toDate?.()?.toISOString(),
      } : null,
      interviewees: audit.interviewees?.map(interviewee => ({
        ...interviewee,
        createdAt: interviewee.createdAt instanceof Date ? interviewee.createdAt.toISOString() : interviewee.createdAt?.toDate?.()?.toISOString(),
        updatedAt: interviewee.updatedAt instanceof Date ? interviewee.updatedAt.toISOString() : interviewee.updatedAt?.toDate?.()?.toISOString(),
      })) || [],
      findings: audit.findings?.map(finding => ({
        ...finding,
        timestamp: finding.timestamp instanceof Date ? finding.timestamp.toISOString() : finding.timestamp?.toDate?.()?.toISOString(),
        createdAt: finding.createdAt instanceof Date ? finding.createdAt.toISOString() : finding.createdAt?.toDate?.()?.toISOString(),
        updatedAt: finding.updatedAt instanceof Date ? finding.updatedAt.toISOString() : finding.updatedAt?.toDate?.()?.toISOString(),
      })) || [],
      omittedQuestions: audit.omittedQuestions?.map(omitted => ({
        ...omitted,
        omittedAt: omitted.omittedAt instanceof Date ? omitted.omittedAt.toISOString() : omitted.omittedAt?.toDate?.()?.toISOString(),
        createdAt: omitted.createdAt instanceof Date ? omitted.createdAt.toISOString() : omitted.createdAt?.toDate?.()?.toISOString(),
        updatedAt: omitted.updatedAt instanceof Date ? omitted.updatedAt.toISOString() : omitted.updatedAt?.toDate?.()?.toISOString(),
      })) || []
    };

    return NextResponse.json(serializedAudit);
  } catch (error) {
    console.error('Failed to fetch audit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit' },
      { status: 500 }
    );
  }
}

// PATCH /api/audits/[id] - Update audit
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    
    await AuditService.updateAudit(params.id, updates);
    
    // Fetch and return updated audit
    const audit = await AuditService.getAuditById(params.id);
    
    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Convert Firebase Timestamps to serializable format
    const serializedAudit = {
      ...audit,
      dateStarted: audit.dateStarted instanceof Date ? audit.dateStarted.toISOString() : audit.dateStarted?.toDate?.()?.toISOString(),
      dateCompleted: audit.dateCompleted instanceof Date ? audit.dateCompleted.toISOString() : audit.dateCompleted?.toDate?.()?.toISOString(),
      createdAt: audit.createdAt instanceof Date ? audit.createdAt.toISOString() : audit.createdAt?.toDate?.()?.toISOString(),
      updatedAt: audit.updatedAt instanceof Date ? audit.updatedAt.toISOString() : audit.updatedAt?.toDate?.()?.toISOString(),
      leadAuditor: audit.leadAuditor ? {
        ...audit.leadAuditor,
        createdAt: audit.leadAuditor.createdAt instanceof Date ? audit.leadAuditor.createdAt.toISOString() : audit.leadAuditor.createdAt?.toDate?.()?.toISOString(),
        updatedAt: audit.leadAuditor.updatedAt instanceof Date ? audit.leadAuditor.updatedAt.toISOString() : audit.leadAuditor.updatedAt?.toDate?.()?.toISOString(),
      } : null,
      interviewees: audit.interviewees?.map(interviewee => ({
        ...interviewee,
        createdAt: interviewee.createdAt instanceof Date ? interviewee.createdAt.toISOString() : interviewee.createdAt?.toDate?.()?.toISOString(),
        updatedAt: interviewee.updatedAt instanceof Date ? interviewee.updatedAt.toISOString() : interviewee.updatedAt?.toDate?.()?.toISOString(),
      })) || []
    };

    return NextResponse.json(serializedAudit);
  } catch (error) {
    console.error('Failed to update audit:', error);
    return NextResponse.json(
      { error: 'Failed to update audit' },
      { status: 500 }
    );
  }
}

// DELETE /api/audits/[id] - Delete audit
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await AuditService.deleteAudit(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete audit:', error);
    return NextResponse.json(
      { error: 'Failed to delete audit' },
      { status: 500 }
    );
  }
}
