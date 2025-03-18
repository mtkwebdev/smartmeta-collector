
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FilePdf, FileSpreadsheet, Eye, Download } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'excel';
  createdAt: Date;
  size: string;
}

interface ContractDocumentsProps {
  contractId: string;
  onViewDocument: (documentId: string) => void;
}

const ContractDocuments = ({ contractId, onViewDocument }: ContractDocumentsProps) => {
  // Mock documents - in a real app, these would be fetched from an API
  const [documents] = useState<Document[]>([
    {
      id: "doc1",
      name: "FilmRights_Metadata.pdf",
      type: "pdf",
      createdAt: new Date("2023-05-15"),
      size: "245 KB"
    },
    {
      id: "doc2",
      name: "FilmRights_Agreement.docx",
      type: "word",
      createdAt: new Date("2023-06-20"),
      size: "128 KB"
    },
    {
      id: "doc3",
      name: "Revenue_Distribution.xlsx",
      type: "excel",
      createdAt: new Date("2023-07-10"),
      size: "89 KB"
    }
  ]);

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FilePdf className="h-5 w-5 text-red-500" />;
      case 'word':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    }
  };

  const getDocumentTypeBadge = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">PDF</Badge>;
      case 'word':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Word</Badge>;
      case 'excel':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Excel</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Associated Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                {getDocumentIcon(doc.type)}
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.createdAt.toLocaleDateString()}</span>
                    <span>•</span>
                    {getDocumentTypeBadge(doc.type)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewDocument(doc.id)}
                  className="flex items-center gap-1"
                >
                  <Eye size={16} /> View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Download size={16} /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractDocuments;
