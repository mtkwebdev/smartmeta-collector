
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Eye, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "./animations";

export interface ContractMetadata {
  id: string;
  name: string;
  extension: string;
  purpose: string;
  keyFunctions: string[];
  createdAt: Date;
  updatedAt: Date;
  contractData?: any;
}

interface ContractCardProps {
  contract: ContractMetadata;
  onView?: (id: string) => void;
  onDeploy?: (id: string) => void;
  className?: string;
}

const ContractCard = ({
  contract,
  onView,
  onDeploy,
  className,
}: ContractCardProps) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });
  
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        setShowActions(true);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <Card 
      ref={ref as any}
      className={cn(
        "overflow-hidden hover-scale transition-all duration-300 border",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className="mb-2 bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
            {contract.extension}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(contract.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-balance text-xl tracking-tight">
          {contract.name}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {contract.purpose}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <Separator className="my-2" />
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Key Functions:</p>
          <div className="flex flex-wrap gap-1">
            {contract.keyFunctions.map((func, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-background">
                {func}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={cn(
        "bg-muted/50 gap-2 transition-all duration-300 overflow-hidden",
        showActions ? "max-h-16 py-3" : "max-h-0 py-0"
      )}>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onView?.(contract.id)}
          className="h-8 px-2"
        >
          <Eye size={16} className="mr-1" /> View
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onDeploy?.(contract.id)}
          className="h-8 px-2"
        >
          <Rocket size={16} className="mr-1" /> Deploy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContractCard;
