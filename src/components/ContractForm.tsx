import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ContractFormFields, { CONTRACT_TYPE_CONFIGS } from "./ContractFormFields";
import { ContractMetadata } from "./ContractCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useIntersectionObserver } from "./animations";
import { cn } from "@/lib/utils";

interface ContractFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  className?: string;
}

const ContractForm = ({
  onSave,
  onCancel,
  initialData,
  className,
}: ContractFormProps) => {
  const { toast } = useToast();
  const [ref, isVisible] = useIntersectionObserver();
  const [activeTab, setActiveTab] = useState<keyof typeof CONTRACT_TYPE_CONFIGS>(
    initialData?.type || "FilmRights"
  );
  const [formData, setFormData] = useState<Record<string, any>>(initialData || {});
  const [confirmCancel, setConfirmCancel] = useState(false);
  
  const handleContractTypeChange = (type: string) => {
    setActiveTab(type as keyof typeof CONTRACT_TYPE_CONFIGS);
    
    // Keep only the metadata fields when changing contract type
    const { name, purpose, extension, keyFunctions } = formData;
    setFormData({ 
      name, 
      purpose, 
      extension, 
      keyFunctions,
      type
    });
  };
  
  const handleFieldsChange = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const config = CONTRACT_TYPE_CONFIGS[activeTab];
    const requiredFields = config.fields
      .filter(field => field.required)
      .map(field => field.name);
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Add contract type and metadata
    const contractData = {
      ...formData,
      type: activeTab,
      // Add metadata for contract card
      name: formData.name || config.title,
      purpose: formData.purpose || config.description,
      extension: ".sol",
      keyFunctions: formData.keyFunctions || [],
    };
    
    onSave(contractData);
    
    toast({
      title: "Contract saved",
      description: "Your contract has been saved successfully.",
    });
  };
  
  const handleCancel = () => {
    // Check if there are unsaved changes
    if (Object.keys(formData).length > 0) {
      setConfirmCancel(true);
    } else {
      onCancel();
    }
  };
  
  return (
    <>
      <Card 
        className={cn("w-full max-w-3xl mx-auto border animate-scale-in", className)} 
        ref={ref as any}
      >
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <div className="flex items-center mb-4">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel} 
                className="mr-2 -ml-2"
              >
                <ArrowLeft size={16} />
              </Button>
              <CardTitle className="text-xl">
                {initialData ? "Edit Contract" : "Create New Contract"}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={handleContractTypeChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
                {(Object.keys(CONTRACT_TYPE_CONFIGS) as Array<keyof typeof CONTRACT_TYPE_CONFIGS>).map((type) => (
                  <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                    {type.replace(/([A-Z])/g, " $1").trim()}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {(Object.keys(CONTRACT_TYPE_CONFIGS) as Array<keyof typeof CONTRACT_TYPE_CONFIGS>).map((type) => (
                <TabsContent key={type} value={type} className="mt-0">
                  <ContractFormFields
                    contractType={type}
                    onChange={handleFieldsChange}
                    initialData={formData}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-3 bg-muted/30 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90"
            >
              <Save size={16} className="mr-1.5" />
              Save Contract
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
          </DialogHeader>
          <p>
            You have unsaved changes. Are you sure you want to discard them?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmCancel(false)}
            >
              Continue Editing
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmCancel(false);
                onCancel();
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractForm;
