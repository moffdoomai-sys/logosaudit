
// @ts-nocheck
import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch,
  runTransaction,
  getDocs
} from 'firebase/firestore';
import { db } from './config';
import { FirestoreService } from './firestore';
import { COLLECTIONS } from './collections';
import { 
  FirebaseAudit, 
  FirebaseUser, 
  FirebaseInterviewee, 
  AuditWithRelations,
  CreateAuditData,
  FirebaseAuditFinding,
  FirebaseOmittedQuestion
} from './models';

export class AuditService {
  // Create new audit with all related data
  static async createAudit(auditData: CreateAuditData): Promise<AuditWithRelations> {
    // First, check if user exists outside of transaction (queries can't be used in transactions)
    const usersRef = collection(db, COLLECTIONS.USERS);
    const userQuery = query(usersRef, where('email', '==', auditData.leadAuditorEmail));
    const userSnapshot = await getDocs(userQuery);
    
    return runTransaction(db, async (transaction) => {
      let leadAuditor: FirebaseUser;
      
      if (userSnapshot.empty) {
        // Create new user
        const newUserRef = doc(collection(db, COLLECTIONS.USERS));
        const userData: FirebaseUser = {
          uid: '', // Will be set during authentication
          email: auditData.leadAuditorEmail,
          name: auditData.leadAuditorName,
          title: auditData.leadAuditorTitle,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        transaction.set(newUserRef, userData);
        leadAuditor = { ...userData, id: newUserRef.id };
      } else {
        const userDoc = userSnapshot.docs[0];
        leadAuditor = { id: userDoc.id, ...userDoc.data() } as FirebaseUser;
      }

      // Create audit
      const auditRef = doc(collection(db, COLLECTIONS.AUDITS));
      const audit: FirebaseAudit = {
        title: auditData.title,
        dateStarted: Timestamp.now(),
        status: 'IN_PROGRESS',
        companyName: auditData.companyName,
        companyAddress: auditData.companyAddress,
        leadAuditorId: leadAuditor.id!,
        leadAuditorEmail: leadAuditor.email,
        isoStandard: auditData.isoStandard,
        selectedSections: auditData.selectedSections,
        customScope: auditData.customScope,
        completionPercentage: 0,
        hasDocuments: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      transaction.set(auditRef, audit);

      // Create interviewees
      const interviewees: FirebaseInterviewee[] = [];
      for (const intervieweeData of auditData.interviewees) {
        const intervieweeRef = doc(collection(db, COLLECTIONS.INTERVIEWEES));
        const interviewee: FirebaseInterviewee = {
          auditId: auditRef.id,
          name: intervieweeData.name,
          jobTitle: intervieweeData.jobTitle,
          department: intervieweeData.department,
          email: intervieweeData.email,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        transaction.set(intervieweeRef, interviewee);
        interviewees.push({ ...interviewee, id: intervieweeRef.id });
      }

      return {
        ...audit,
        id: auditRef.id,
        leadAuditor,
        interviewees,
        findings: [],
        omittedQuestions: [],
        documents: []
      };
    });
  }

  // Get all audits with basic relations
  static async getAllAudits(): Promise<AuditWithRelations[]> {
    const audits = await FirestoreService.getAll<FirebaseAudit>(
      COLLECTIONS.AUDITS, 
      'dateStarted', 
      'desc'
    );

    // Get lead auditors and counts
    const auditPromises = audits.map(async (audit) => {
      const [leadAuditor, interviewees, findingsCount, omittedCount] = await Promise.all([
        FirestoreService.getById<FirebaseUser>(COLLECTIONS.USERS, audit.leadAuditorId),
        FirestoreService.getByField<FirebaseInterviewee>(COLLECTIONS.INTERVIEWEES, 'auditId', audit.id),
        this.getAuditFindingsCount(audit.id!),
        this.getOmittedQuestionsCount(audit.id!)
      ]);

      return {
        ...audit,
        leadAuditor,
        interviewees,
        _count: {
          findings: findingsCount,
          omittedQuestions: omittedCount
        }
      } as AuditWithRelations & { _count: { findings: number; omittedQuestions: number } };
    });

    return Promise.all(auditPromises);
  }

  // Get single audit with all relations
  static async getAuditById(auditId: string): Promise<AuditWithRelations | null> {
    const audit = await FirestoreService.getById<FirebaseAudit>(COLLECTIONS.AUDITS, auditId);
    if (!audit) return null;

    const [leadAuditor, interviewees, findings, omittedQuestions] = await Promise.all([
      FirestoreService.getById<FirebaseUser>(COLLECTIONS.USERS, audit.leadAuditorId),
      FirestoreService.getByField<FirebaseInterviewee>(COLLECTIONS.INTERVIEWEES, 'auditId', auditId),
      FirestoreService.getByField<FirebaseAuditFinding>(COLLECTIONS.AUDIT_FINDINGS, 'auditId', auditId),
      FirestoreService.getByField<FirebaseOmittedQuestion>(COLLECTIONS.OMITTED_QUESTIONS, 'auditId', auditId)
    ]);

    return {
      ...audit,
      leadAuditor,
      interviewees,
      findings,
      omittedQuestions
    };
  }

  // Update audit
  static async updateAudit(auditId: string, updates: Partial<FirebaseAudit>): Promise<void> {
    await FirestoreService.update(COLLECTIONS.AUDITS, auditId, updates);
  }

  // Delete audit and all related data
  static async deleteAudit(auditId: string): Promise<void> {
    const batch = writeBatch(db);

    // Delete audit
    const auditRef = doc(db, COLLECTIONS.AUDITS, auditId);
    batch.delete(auditRef);

    // Delete related data
    const [interviewees, findings, omittedQuestions] = await Promise.all([
      FirestoreService.getByField<FirebaseInterviewee>(COLLECTIONS.INTERVIEWEES, 'auditId', auditId),
      FirestoreService.getByField<FirebaseAuditFinding>(COLLECTIONS.AUDIT_FINDINGS, 'auditId', auditId),
      FirestoreService.getByField<FirebaseOmittedQuestion>(COLLECTIONS.OMITTED_QUESTIONS, 'auditId', auditId)
    ]);

    // Add deletes to batch
    [...interviewees, ...findings, ...omittedQuestions].forEach((item) => {
      if (item.id) {
        const collectionName = 'auditId' in item && 'questionId' in item && 'score' in item 
          ? COLLECTIONS.AUDIT_FINDINGS 
          : 'auditId' in item && 'questionId' in item && 'reason' in item
          ? COLLECTIONS.OMITTED_QUESTIONS
          : COLLECTIONS.INTERVIEWEES;
        
        const docRef = doc(db, collectionName, item.id);
        batch.delete(docRef);
      }
    });

    await batch.commit();
  }

  // Helper methods
  private static async getAuditFindingsCount(auditId: string): Promise<number> {
    const findings = await FirestoreService.getByField<FirebaseAuditFinding>(
      COLLECTIONS.AUDIT_FINDINGS, 
      'auditId', 
      auditId
    );
    return findings.length;
  }

  private static async getOmittedQuestionsCount(auditId: string): Promise<number> {
    const omitted = await FirestoreService.getByField<FirebaseOmittedQuestion>(
      COLLECTIONS.OMITTED_QUESTIONS, 
      'auditId', 
      auditId
    );
    return omitted.length;
  }

  // Finding management
  static async createOrUpdateFinding(
    auditId: string, 
    questionId: string, 
    findingData: Partial<FirebaseAuditFinding>
  ): Promise<void> {
    // Check if finding exists
    const existingFindings = await FirestoreService.query<FirebaseAuditFinding>(
      COLLECTIONS.AUDIT_FINDINGS,
      [where('auditId', '==', auditId), where('questionId', '==', questionId)]
    );

    if (existingFindings.length > 0) {
      // Update existing
      await FirestoreService.update(COLLECTIONS.AUDIT_FINDINGS, existingFindings[0].id!, findingData);
    } else {
      // Create new
      await FirestoreService.create(COLLECTIONS.AUDIT_FINDINGS, {
        auditId,
        questionId,
        notes: '',
        evidenceNotes: '',
        timestamp: Timestamp.now(),
        ...findingData
      });
    }
  }

  // Question omission management
  static async toggleQuestionOmission(auditId: string, questionId: string, reason?: string): Promise<void> {
    const existingOmitted = await FirestoreService.query<FirebaseOmittedQuestion>(
      COLLECTIONS.OMITTED_QUESTIONS,
      [where('auditId', '==', auditId), where('questionId', '==', questionId)]
    );

    if (existingOmitted.length > 0) {
      // Remove omission
      await FirestoreService.delete(COLLECTIONS.OMITTED_QUESTIONS, existingOmitted[0].id!);
    } else {
      // Add omission
      await FirestoreService.create(COLLECTIONS.OMITTED_QUESTIONS, {
        auditId,
        questionId,
        reason,
        omittedAt: Timestamp.now()
      });
    }
  }
}
