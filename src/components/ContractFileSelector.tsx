
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileUp, File, Plus, Upload, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// Sample file data
const SAMPLE_FILES = [
  { id: "1", name: "Film_Rights_Template.pdf", type: "pdf", size: "245 KB", date: "2023-05-20" },
  { id: "2", name: "Investment_Agreement.docx", type: "docx", size: "156 KB", date: "2023-06-15" },
  { id: "3", name: "Revenue_Split_Contract.pdf", type: "pdf", size: "320 KB", date: "2023-04-10" },
  { id: "4", name: "Licensing_Terms.xlsx", type: "xlsx", size: "180 KB", date: "2023-07-05" },
  { id: "5", name: "Contract_Amendment.pdf", type: "pdf", size: "125 KB", date: "2023-08-01" },
];

interface ContractFileSelectorProps {
  onCancel: () => void;
  onNext: (file: any) => void;
  contractName?: string;
}

const ContractFileSelector = ({ onCancel, onNext, contractName }: ContractFileSelectorProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("browse");
  
  const filteredFiles = SAMPLE_FILES.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      toast({
        title: "File uploaded",
        description: `${files[0].name} has been uploaded successfully.`
      });
    }
  };
  
  const handleNext = () => {
    if (activeTab === "browse" && selectedFile) {
      onNext(selectedFile);
    } else if (activeTab === "upload" && uploadedFile) {
      onNext({ 
        id: "new",
        name: uploadedFile.name,
        type: uploadedFile.type.split('/')[1],
        size: `${Math.round(uploadedFile.size / 1024)} KB`,
        date: new Date().toISOString().split('T')[0],
        file: uploadedFile
      });
    } else {
      toast({
        title: "No file selected",
        description: "Please select or upload a file to continue.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto border animate-scale-in">
      <CardHeader>
        <div className="flex items-center mb-4">
          <Button 
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="mr-2 -ml-2"
          >
            <ArrowLeft size={16} />
          </Button>
          <CardTitle className="text-xl">
            Select File for {contractName || "Contract Deployment"}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="browse">
              <File className="mr-2 h-4 w-4" />
              Browse Files
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-12 bg-muted/50 py-2 px-3 text-sm font-medium">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Date</div>
              </div>
              
              {filteredFiles.length > 0 ? (
                <div className="max-h-[320px] overflow-y-auto">
                  {filteredFiles.map((file) => (
                    <button
                      key={file.id}
                      className={cn(
                        "grid grid-cols-12 py-3 px-3 text-sm w-full text-left hover:bg-accent/5 transition-colors border-t",
                        selectedFile?.id === file.id && "bg-accent/10 hover:bg-accent/10"
                      )}
                      onClick={() => handleFileSelect(file)}
                    >
                      <div className="col-span-5 flex items-center gap-2">
                        <FileType type={file.type} />
                        {file.name}
                      </div>
                      <div className="col-span-2 text-muted-foreground">.{file.type}</div>
                      <div className="col-span-2 text-muted-foreground">{file.size}</div>
                      <div className="col-span-3 text-muted-foreground">{file.date}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No files found matching your search
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/10">
              <div className="mb-4">
                <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
              </div>
              <p className="mb-2 text-sm text-muted-foreground">
                Drag and drop a file here, or click to browse
              </p>
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.docx,.xlsx,.doc,.xls"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Select File
              </Button>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-background rounded border text-left flex items-center">
                  <FileType type={uploadedFile.name.split('.').pop() || ""} />
                  <div className="ml-2 flex-1 truncate">
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(uploadedFile.size / 1024)} KB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-muted/30 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="bg-accent hover:bg-accent/90"
          disabled={(activeTab === "browse" && !selectedFile) || (activeTab === "upload" && !uploadedFile)}
        >
          Next
          <ArrowRight size={16} className="ml-1.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const FileType = ({ type }: { type: string }) => {
  let icon;
  let colorClass;
  
  switch (type.toLowerCase()) {
    case 'pdf':
      icon = <FileIcon className="text-red-500" />;
      colorClass = "bg-red-100 text-red-500";
      break;
    case 'docx':
    case 'doc':
      icon = <FileIcon className="text-blue-500" />;
      colorClass = "bg-blue-100 text-blue-500";
      break;
    case 'xlsx':
    case 'xls':
      icon = <FileIcon className="text-green-500" />;
      colorClass = "bg-green-100 text-green-500";
      break;
    default:
      icon = <FileIcon className="text-gray-500" />;
      colorClass = "bg-gray-100 text-gray-500";
  }
  
  return (
    <div className={`p-1.5 rounded ${colorClass} w-8 h-8 flex items-center justify-center`}>
      {icon}
    </div>
  );
};

// Simple file icon component
const FileIcon = ({ className }: { className?: string }) => (
  <svg 
    className={cn("h-4 w-4", className)}
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export default ContractFileSelector;
