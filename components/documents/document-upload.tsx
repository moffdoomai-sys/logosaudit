
// @ts-nocheck
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileText,
  Image as ImageIcon,
  FileImage
} from 'lucide-react';
import { useDocumentManager } from '@/hooks/use-document-manager';
import { FirebaseDocument } from '@/lib/firebase/models';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  auditId: string;
  isoStandard: 'ISO9001' | 'ISO45001';
  uploadedBy: string;
  onUploadComplete?: (document: FirebaseDocument) => void;
  onUploadStart?: () => void;
}

const ACCEPTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'image/jpeg': '.jpg,.jpeg',
  'image/png': '.png',
  'image/gif': '.gif'
};

const FILE_TYPE_ICONS: Record<string, any> = {
  'application/pdf': FileText,
  'text/plain': FileText,
  'image/jpeg': ImageIcon,
  'image/png': ImageIcon,
  'image/gif': ImageIcon,
};

export default function DocumentUpload({
  auditId,
  isoStandard,
  uploadedBy,
  onUploadComplete,
  onUploadStart
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<FirebaseDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument, isUploading } = useDocumentManager();
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return `Unsupported file type: ${file.type}. Please upload PDF, text, or image files.`;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File size too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum size is 10MB.`;
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setError(null);
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setError(null);
    onUploadStart?.();

    try {
      const uploadPromises = selectedFiles.map(file => 
        uploadDocument(file, auditId, uploadedBy, isoStandard)
      );

      const documents = await Promise.all(uploadPromises);
      
      setUploadedDocuments(prev => [...prev, ...documents]);
      setSelectedFiles([]);
      
      documents.forEach(doc => {
        onUploadComplete?.(doc);
      });

      toast({
        title: 'Documents uploaded successfully',
        description: `${documents.length} document(s) uploaded and queued for analysis.`,
      });

    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your documents. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (file: File) => {
    const IconComponent = FILE_TYPE_ICONS[file.type] || FileImage;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload relevant documents for AI-powered analysis and ISO clause matching. 
          Supported formats: PDF, Text, and Images (max 10MB each).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* File Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, TXT, JPG, PNG, GIF (max 10MB each)
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Selected Files</h4>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              onClick={uploadFiles} 
              disabled={isUploading || selectedFiles.length === 0}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {selectedFiles.length} File(s)
                </>
              )}
            </Button>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading documents...</span>
            </div>
            <Progress value={undefined} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Documents will be analyzed in the background after upload.
            </p>
          </div>
        )}

        {/* Recently Uploaded */}
        {uploadedDocuments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recently Uploaded</h4>
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{doc.originalName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {doc.analysisStatus === 'PENDING' && 'Queued for Analysis'}
                        {doc.analysisStatus === 'PROCESSING' && 'Analyzing...'}
                        {doc.analysisStatus === 'COMPLETED' && 'Analysis Complete'}
                        {doc.analysisStatus === 'FAILED' && 'Analysis Failed'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
