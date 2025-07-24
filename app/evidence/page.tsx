
// @ts-nocheck
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Image, 
  Video,
  File,
  Camera,
  Mic,
  Link,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

const EvidenceTypeCard = ({ icon: Icon, title, description, color, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const EvidenceItem = ({ evidence, onView, onDelete }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{evidence.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{evidence.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {evidence.type}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {evidence.clause}
                </Badge>
                <span className="text-xs text-gray-500">{evidence.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onView(evidence)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(evidence.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function EvidencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceList, setEvidenceList] = useState([
    {
      id: '1',
      title: 'Water Quality Monitoring Procedure',
      description: 'Standard operating procedure for daily water quality testing',
      type: 'Document',
      clause: '8.5',
      date: '2024-01-15',
      size: '2.3 MB'
    },
    {
      id: '2',
      title: 'Treatment Plant Inspection Photos',
      description: 'Visual evidence of equipment condition and maintenance',
      type: 'Images',
      clause: '7.1',
      date: '2024-01-14',
      size: '15.7 MB'
    },
    {
      id: '3',
      title: 'Operator Training Records',
      description: 'Certification and competency records for treatment operators',
      type: 'Document',
      clause: '7.2',
      date: '2024-01-10',
      size: '1.8 MB'
    }
  ]);

  const evidenceTypes = [
    {
      icon: FileText,
      title: 'Documents',
      description: 'Procedures, policies, records, certificates',
      color: 'bg-blue-500',
      type: 'document'
    },
    {
      icon: Image,
      title: 'Photos',
      description: 'Equipment photos, facility images, visual evidence',
      color: 'bg-green-500',
      type: 'photo'
    },
    {
      icon: Video,
      title: 'Videos',
      description: 'Process recordings, training videos, demonstrations',
      color: 'bg-purple-500',
      type: 'video'
    },
    {
      icon: Mic,
      title: 'Audio',
      description: 'Interview recordings, verbal explanations',
      color: 'bg-orange-500',
      type: 'audio'
    },
    {
      icon: Link,
      title: 'Links',
      description: 'External references, online resources, databases',
      color: 'bg-cyan-500',
      type: 'link'
    },
    {
      icon: File,
      title: 'Other Files',
      description: 'Spreadsheets, presentations, technical drawings',
      color: 'bg-gray-500',
      type: 'other'
    }
  ];

  const handleUploadType = (type: string) => {
    setShowUploadModal(true);
    // In a real implementation, this would open the appropriate upload interface
    console.log(`Opening upload interface for: ${type}`);
  };

  const handleViewEvidence = (evidence: any) => {
    // In a real implementation, this would open the evidence viewer
    console.log('Viewing evidence:', evidence);
    alert(`Viewing: ${evidence.title}\n\nThis is a placeholder. In the full implementation, this would open the evidence file or display detailed information.`);
  };

  const handleDeleteEvidence = (id: string) => {
    if (confirm('Are you sure you want to delete this evidence item?')) {
      setEvidenceList(prev => prev.filter(item => item.id !== id));
    }
  };

  const filteredEvidence = evidenceList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Evidence Management
        </h1>
        <p className="text-gray-600">
          Collect, organize, and manage audit evidence
        </p>
      </motion.div>

      {/* Upload Evidence Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Evidence</span>
            </CardTitle>
            <CardDescription>
              Select the type of evidence you want to upload or link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceTypes.map((type, index) => (
                <motion.div
                  key={type.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <EvidenceTypeCard
                    {...type}
                    onClick={() => handleUploadType(type.type)}
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Evidence Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Evidence Collection Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Best Practices:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Ensure evidence is relevant to specific ISO 9001 clauses</li>
                  <li>• Include clear descriptions and context</li>
                  <li>• Date and timestamp all evidence</li>
                  <li>• Maintain confidentiality and data protection</li>
                  <li>• Verify authenticity and accuracy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Water Utility Specific:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Water quality test results and lab reports</li>
                  <li>• Operator certification and training records</li>
                  <li>• Equipment calibration and maintenance logs</li>
                  <li>• Incident reports and corrective actions</li>
                  <li>• Customer complaint and response records</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Evidence Library</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search evidence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedType === 'document' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('document')}
                >
                  Documents
                </Button>
                <Button
                  variant={selectedType === 'images' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('images')}
                >
                  Images
                </Button>
                <Button
                  variant={selectedType === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType('video')}
                >
                  Videos
                </Button>
              </div>
            </div>

            {/* Evidence List */}
            <div className="space-y-4">
              {filteredEvidence.map((evidence, index) => (
                <motion.div
                  key={evidence.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <EvidenceItem
                    evidence={evidence}
                    onView={handleViewEvidence}
                    onDelete={handleDeleteEvidence}
                  />
                </motion.div>
              ))}
            </div>

            {filteredEvidence.length === 0 && (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No evidence found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedType !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start by uploading your first piece of evidence.'}
                </p>
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Evidence
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Evidence Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{evidenceList.length}</div>
              <div className="text-sm text-gray-600">Total Evidence Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <File className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {evidenceList.filter(e => e.type === 'Document').length}
              </div>
              <div className="text-sm text-gray-600">Documents</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Image className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {evidenceList.filter(e => e.type === 'Images').length}
              </div>
              <div className="text-sm text-gray-600">Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Download className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {evidenceList.reduce((acc, e) => acc + parseFloat(e.size.split(' ')[0]), 0).toFixed(1)} MB
              </div>
              <div className="text-sm text-gray-600">Total Size</div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Placeholder Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Upload className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Implementation Note</h3>
                <p className="text-yellow-800 text-sm">
                  This is a placeholder interface for evidence management. In the full implementation, this would include:
                </p>
                <ul className="text-yellow-800 text-sm mt-2 space-y-1">
                  <li>• File upload functionality with drag-and-drop support</li>
                  <li>• Integration with cloud storage services</li>
                  <li>• Document viewer for PDFs, images, and other file types</li>
                  <li>• Evidence linking to specific audit questions</li>
                  <li>• Secure access controls and audit trails</li>
                  <li>• Export capabilities for audit reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
