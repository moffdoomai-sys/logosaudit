
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

// Generic Firestore service functions
export class FirestoreService {
  // Create document
  static async create<T extends Record<string, any>>(
    collectionName: string,
    data: T
  ): Promise<DocumentReference> {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef;
  }

  // Get document by ID
  static async getById<T>(
    collectionName: string,
    id: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    return null;
  }

  // Get documents with query
  static async query<T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  // Update document
  static async update(
    collectionName: string,
    id: string,
    data: Partial<DocumentData>
  ): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  // Delete document
  static async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  // Get all documents from collection
  static async getAll<T>(
    collectionName: string,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = [];
    
    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }
    
    return this.query<T>(collectionName, constraints);
  }

  // Get documents by field value
  static async getByField<T>(
    collectionName: string,
    field: string,
    value: any
  ): Promise<T[]> {
    return this.query<T>(collectionName, [where(field, '==', value)]);
  }

  // Convert Firestore Timestamp to Date
  static timestampToDate(timestamp: any): Date {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  }

  // Convert Date to Firestore Timestamp
  static dateToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }
}
