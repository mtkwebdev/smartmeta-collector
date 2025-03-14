
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractFormFieldsProps {
  contractType: "FilmRights" | "RevenueSplit" | "Investment" | "Licensing" | "StreamingPayouts" | "Custom";
  onChange: (data: any) => void;
  initialData?: any;
}

export const CONTRACT_TYPE_CONFIGS = {
  FilmRights: {
    title: "Film Rights Contract",
    description: "Manages ownership of IP, assigns revenue shares",
    fields: [
      { name: "contentTitle", label: "Content Title", type: "text", required: true },
      { name: "rightsOwner", label: "Rights Owner", type: "text", required: true },
      { name: "transferable", label: "Transferable Rights", type: "checkbox" },
      { name: "exclusivity", label: "Exclusivity Terms", type: "textarea" },
      { name: "licenseDuration", label: "License Duration (in months)", type: "number" },
    ]
  },
  RevenueSplit: {
    title: "Revenue Split Contract",
    description: "Automates revenue sharing among investors, creators, and stakeholders",
    fields: [
      { name: "projectTitle", label: "Project Title", type: "text", required: true },
      { name: "stakeholders", label: "Stakeholders", type: "array", itemLabel: "Stakeholder" },
      { name: "percentages", label: "Distribution Percentages", type: "array", itemLabel: "Percentage" },
      { name: "paymentFrequency", label: "Payment Frequency", type: "select", 
        options: ["Weekly", "Monthly", "Quarterly", "Yearly"] },
      { name: "minimumThreshold", label: "Minimum Payment Threshold", type: "number" },
    ]
  },
  Investment: {
    title: "Investment Contract",
    description: "Enables tokenized film investment",
    fields: [
      { name: "projectName", label: "Project Name", type: "text", required: true },
      { name: "fundingGoal", label: "Funding Goal", type: "number", required: true },
      { name: "tokenSymbol", label: "Token Symbol", type: "text" },
      { name: "returnRate", label: "Return Rate (%)", type: "number" },
      { name: "investmentDeadline", label: "Investment Deadline", type: "date" },
      { name: "minimumInvestment", label: "Minimum Investment", type: "number" },
    ]
  },
  Licensing: {
    title: "Licensing Contract",
    description: "Automates film licensing and royalty payments",
    fields: [
      { name: "contentName", label: "Content Name", type: "text", required: true },
      { name: "licensorName", label: "Licensor Name", type: "text", required: true },
      { name: "licensingTerritories", label: "Licensing Territories", type: "array", itemLabel: "Territory" },
      { name: "royaltyPercentage", label: "Royalty Percentage", type: "number", required: true },
      { name: "licenseTerms", label: "License Terms", type: "textarea" },
    ]
  },
  StreamingPayouts: {
    title: "Streaming Payouts Contract",
    description: "Connects to streaming platforms to process per-view revenue distribution",
    fields: [
      { name: "contentName", label: "Content Name", type: "text", required: true },
      { name: "platforms", label: "Streaming Platforms", type: "array", itemLabel: "Platform" },
      { name: "payoutRate", label: "Payout Rate per View", type: "number", required: true },
      { name: "beneficiaries", label: "Beneficiaries", type: "array", itemLabel: "Beneficiary" },
      { name: "distributionRules", label: "Distribution Rules", type: "textarea" },
    ]
  },
  Custom: {
    title: "Custom Contract",
    description: "Create a custom smart contract",
    fields: [
      { name: "contractName", label: "Contract Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "customFields", label: "Custom Fields", type: "array", itemLabel: "Field" },
      { name: "functionalities", label: "Functionalities", type: "array", itemLabel: "Function" },
    ]
  }
};

const ContractFormFields = ({ contractType, onChange, initialData = {} }: ContractFormFieldsProps) => {
  const [formData, setFormData] = useState(initialData);
  const [arrayFields, setArrayFields] = useState<Record<string, string[]>>(() => {
    const fields: Record<string, string[]> = {};
    
    // Initialize array fields from config
    const config = CONTRACT_TYPE_CONFIGS[contractType];
    config.fields.forEach(field => {
      if (field.type === "array") {
        fields[field.name] = initialData[field.name] || [];
      }
    });
    
    return fields;
  });
  
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  
  const handleInputChange = (fieldName: string, value: any) => {
    const updatedData = { ...formData, [fieldName]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };
  
  const handleAddArrayItem = (fieldName: string) => {
    if (!newItems[fieldName]?.trim()) return;
    
    const updatedItems = [...(arrayFields[fieldName] || []), newItems[fieldName]];
    const updatedArrayFields = { ...arrayFields, [fieldName]: updatedItems };
    
    setArrayFields(updatedArrayFields);
    setNewItems({ ...newItems, [fieldName]: "" });
    
    // Update the main form data
    const updatedData = { ...formData, [fieldName]: updatedItems };
    setFormData(updatedData);
    onChange(updatedData);
  };
  
  const handleRemoveArrayItem = (fieldName: string, index: number) => {
    const updatedItems = [...arrayFields[fieldName]];
    updatedItems.splice(index, 1);
    
    const updatedArrayFields = { ...arrayFields, [fieldName]: updatedItems };
    setArrayFields(updatedArrayFields);
    
    // Update the main form data
    const updatedData = { ...formData, [fieldName]: updatedItems };
    setFormData(updatedData);
    onChange(updatedData);
  };
  
  const config = CONTRACT_TYPE_CONFIGS[contractType];
  
  return (
    <div className="space-y-6 py-4">
      <div className="bg-muted/40 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium">{config.title}</h3>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {config.fields.map((field) => {
          const key = `${contractType}-${field.name}`;
          
          if (field.type === "textarea") {
            return (
              <div key={key} className="col-span-1 md:col-span-2">
                <Label htmlFor={field.name} className="mb-2 block text-muted-foreground">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                  className="min-h-[100px]"
                />
              </div>
            );
          }
          
          if (field.type === "checkbox") {
            return (
              <div key={key} className="flex items-center space-x-2">
                <input
                  id={field.name}
                  name={field.name}
                  type="checkbox"
                  checked={!!formData[field.name]}
                  onChange={(e) => handleInputChange(field.name, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <Label htmlFor={field.name} className="text-muted-foreground">
                  {field.label}
                </Label>
              </div>
            );
          }
          
          if (field.type === "select") {
            return (
              <div key={key}>
                <Label htmlFor={field.name} className="mb-2 block text-muted-foreground">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  required={field.required}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          
          if (field.type === "array") {
            return (
              <div key={key} className="col-span-1 md:col-span-2">
                <Label htmlFor={field.name} className="mb-2 block text-muted-foreground">
                  {field.label}
                </Label>
                
                <div className="space-y-2 mb-2">
                  {arrayFields[field.name]?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="bg-background border rounded-md px-3 py-2 flex-1">
                        {item}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveArrayItem(field.name, index)}
                        className="h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    id={`new-${field.name}`}
                    value={newItems[field.name] || ""}
                    onChange={(e) => setNewItems({ ...newItems, [field.name]: e.target.value })}
                    placeholder={`Add ${field.itemLabel || 'item'}`}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem(field.name);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddArrayItem(field.name)}
                    className="bg-accent hover:bg-accent/90"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            );
          }
          
          return (
            <div key={key}>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                label={field.label}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                required={field.required}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractFormFields;
