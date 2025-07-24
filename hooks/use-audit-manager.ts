
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateAuditData, AuditWithRelations } from '@/lib/firebase/models';

export function useAuditManager() {
  const [isCreatingAudit, setIsCreatingAudit] = useState(false);
  const [isLoadingAudits, setIsLoadingAudits] = useState(false);
  const router = useRouter();

  const createAudit = async (auditData: CreateAuditData): Promise<AuditWithRelations> => {
    setIsCreatingAudit(true);
    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(auditData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create audit');
      }

      const audit = await response.json();
      return audit;
    } catch (error) {
      console.error('Failed to create audit:', error);
      throw error;
    } finally {
      setIsCreatingAudit(false);
    }
  };

  const getAllAudits = async (): Promise<AuditWithRelations[]> => {
    setIsLoadingAudits(true);
    try {
      const response = await fetch('/api/audits');
      
      if (!response.ok) {
        throw new Error('Failed to fetch audits');
      }

      const audits = await response.json();
      return audits;
    } catch (error) {
      console.error('Failed to fetch audits:', error);
      throw error;
    } finally {
      setIsLoadingAudits(false);
    }
  };

  const getAuditById = async (auditId: string): Promise<AuditWithRelations | null> => {
    try {
      const response = await fetch(`/api/audits/${auditId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch audit');
      }

      const audit = await response.json();
      return audit;
    } catch (error) {
      console.error('Failed to fetch audit:', error);
      throw error;
    }
  };

  const updateAudit = async (auditId: string, updates: Partial<AuditWithRelations>): Promise<AuditWithRelations> => {
    try {
      const response = await fetch(`/api/audits/${auditId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update audit');
      }

      const audit = await response.json();
      return audit;
    } catch (error) {
      console.error('Failed to update audit:', error);
      throw error;
    }
  };

  const deleteAudit = async (auditId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/audits/${auditId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete audit');
      }
    } catch (error) {
      console.error('Failed to delete audit:', error);
      throw error;
    }
  };

  const saveFinding = async (auditId: string, finding: any): Promise<void> => {
    try {
      const response = await fetch(`/api/audits/${auditId}/findings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finding),
      });

      if (!response.ok) {
        throw new Error('Failed to save finding');
      }
    } catch (error) {
      console.error('Failed to save finding:', error);
      throw error;
    }
  };

  return {
    createAudit,
    getAllAudits,
    getAuditById,
    updateAudit,
    deleteAudit,
    saveFinding,
    isCreatingAudit,
    isLoadingAudits,
  };
}
