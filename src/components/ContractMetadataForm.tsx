
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MetadataField from "./MetadataField";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import { ContractMetadata } from "./ContractCard";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getAnimationProps, getStaggeredDelay, useIntersectionObserver } from "./animations";

interface ContractMetadataFormProps {
  initialData?: Partial<ContractMetadata>;
  onSave: (data: Omit<ContractMetadata, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  className?: string;
}

const ContractMetadataForm = ({
  initialData,
  onSave,
  onCancel,
  className,
}: ContractMetadataFormProps) => {
  const { toast } = useToast();
  const [ref, isVisible] = useIntersectionObserver();
  const [keyFunctions, setKeyFunctions] = useState<string[]>(initialData?.keyFunctions || []);
  const [newKeyFunction, setNewKeyFunction] = useState("");
  const [showKeyFunctionInput, setShowKeyFunctionInput] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    extension: initialData?.extension || "",
    purpose: initialData?.purpose || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddKeyFunction = () => {
    if (newKeyFunction.trim()) {
      setKeyFunctions(prev => [...prev, newKeyFunction.trim()]);
      setNewKeyFunction("");
      setShowKeyFunctionInput(false);
    }
  };

  const handleRemoveKeyFunction = (index: number) => {
    setKeyFunctions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.extension) {
      toast({
        title: "Required fields missing",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    onSave({
      ...formData,
      keyFunctions,
    });
    
    toast({
      title: "Contract metadata saved",
      description: "Your contract metadata has been saved successfully.",
    });
  };

  const handleCancel = () => {
    if (formData.name || formData.purpose || keyFunctions.length > 0) {
      setConfirmCancel(true);
    } else {
      onCancel();
    }
  };

  return (
    <>
      <Card 
        className={cn("max-w-2xl mx-auto border animate-scale-in", className)} 
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
                {initialData?.id ? "Edit Contract Metadata" : "New Contract Metadata"}
              </CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div {...getAnimationProps(isVisible, getStaggeredDelay(0))}>
                <MetadataField
                  label="Contract Name"
                  name="name"
                  placeholder="e.g., FilmRights"
                  initialValue={formData.name}
                  onChange={(value) => handleChange("name", value)}
                  required
                  helpText="The name of your smart contract"
                />
              </div>
              
              <div {...getAnimationProps(isVisible, getStaggeredDelay(1))}>
                <MetadataField
                  label="Extension"
                  name="extension"
                  placeholder="e.g., .sol"
                  initialValue={formData.extension}
                  onChange={(value) => handleChange("extension", value)}
                  required
                  helpText="The file extension of your smart contract"
                />
              </div>
            </div>
            
            <div {...getAnimationProps(isVisible, getStaggeredDelay(2))}>
              <MetadataField
                label="Purpose"
                name="purpose"
                placeholder="e.g., Manages ownership of IP, assigns revenue shares"
                initialValue={formData.purpose}
                onChange={(value) => handleChange("purpose", value)}
                textarea
                helpText="Describe what this contract does"
              />
            </div>
            
            <div {...getAnimationProps(isVisible, getStaggeredDelay(3))}>
              <label className="text-sm font-medium text-muted-foreground block mb-2">
                Key Functions
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {keyFunctions.map((func, index) => (
                  <div 
                    key={index}
                    className="bg-secondary flex items-center px-3 py-1.5 rounded-md text-sm group"
                  >
                    <span>{func}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveKeyFunction(index)}
                      className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                
                {showKeyFunctionInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newKeyFunction}
                      onChange={(e) => setNewKeyFunction(e.target.value)}
                      placeholder="Enter function"
                      className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 input-transition"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddKeyFunction();
                        } else if (e.key === "Escape") {
                          setShowKeyFunctionInput(false);
                          setNewKeyFunction("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddKeyFunction}
                      className="h-8"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowKeyFunctionInput(false);
                        setNewKeyFunction("");
                      }}
                      className="h-8"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKeyFunctionInput(true)}
                    className="h-8"
                  >
                    <Plus size={14} className="mr-1" /> Add Function
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Add the key functions this contract implements
              </p>
            </div>
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
              Save Metadata
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

export default ContractMetadataForm;
