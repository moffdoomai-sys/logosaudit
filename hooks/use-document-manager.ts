
'use client';

import { useState } from 'react';
import { FirebaseDocument } from '@/lib/firebase/models';

export function useDocumentManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  const uploadDocument = async (
    file: File,
    auditId: string,
    uploadedBy: string,
    isoStandard: 'ISO9001' | 'ISO45001'
  ): Promise<FirebaseDocument> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('auditId', auditId);
      formData.append('uploadedBy', uploadedBy);
      formData.append('isoStandard', isoStandard);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      const document = await response.json();
      return document;
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentsByAudit = async (auditId: string): Promise<FirebaseDocument[]> => {
    setIsLoadingDocuments(true);
    try {
      const response = await fetch(`/api/documents/${auditId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const documents = await response.json();
      return documents;
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      throw error;
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const deleteDocument = async (auditId: string, documentId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/documents/${auditId}/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      throw error;
    }
  };

  const getDocumentById = async (auditId: string, documentId: string): Promise<FirebaseDocument | null> => {
    try {
      const response = await fetch(`/api/documents/${auditId}/${documentId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch document');
      }

      const document = await response.json();
      return document;
    } catch (error) {
      console.error('Failed to fetch document:', error);
      throw error;
    }
  };

  return {
    uploadDocument,
    getDocumentsByAudit,
    deleteDocument,
    getDocumentById,
    isUploading,
    isLoadingDocuments,
  };
}
