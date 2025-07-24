
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/lib/firebase/audit-service';
import { CreateAuditData } from '@/lib/firebase/models';

export const dynamic = "force-dynamic";

// GET /api/audits - Fetch all audits
export async function GET() {
  try {
    const audits = await AuditService.getAllAudits();
    
    // Convert Firebase Timestamps to serializable format
    const serializedAudits = audits.map(audit => ({
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
    }));

    return NextResponse.json(serializedAudits);
  } catch (error) {
    console.error('Failed to fetch audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}

// POST /api/audits - Create new audit
export async function POST(request: NextRequest) {
  try {
    const auditData: CreateAuditData = await request.json();
    
    const audit = await AuditService.createAudit(auditData);

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

    return NextResponse.json(serializedAudit, { status: 201 });
  } catch (error) {
    console.error('Failed to create audit:', error);
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 500 }
    );
  }
}
