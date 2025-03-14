
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MetadataFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
  textarea?: boolean;
  className?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  helpText?: string;
}

const MetadataField = ({
  label,
  name,
  placeholder,
  initialValue = "",
  textarea = false,
  className,
  required = false,
  onChange,
  helpText,
}: MetadataFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className={cn("space-y-2 group transition-all duration-300", className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={name}
          className={cn(
            "text-sm font-medium transition-all duration-200",
            isFocused ? "text-accent" : "text-muted-foreground"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      
      {textarea ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(
            "input-transition resize-none min-h-[100px]",
            isFocused ? "border-accent ring-2 ring-accent/10" : ""
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />
      ) : (
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(
            "input-transition",
            isFocused ? "border-accent ring-2 ring-accent/10" : ""
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />
      )}
      
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default MetadataField;
