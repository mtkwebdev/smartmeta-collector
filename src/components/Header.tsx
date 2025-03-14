
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, PanelLeft, Import } from "lucide-react";

interface HeaderProps {
  onNewContract: () => void;
  onImport?: () => void;
}

const Header = ({ onNewContract, onImport }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`
      sticky top-0 z-10 transition-all duration-300 
      ${scrolled ? 'py-3 glass-morphism shadow-sm' : 'py-6 bg-transparent'}
    `}>
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <PanelLeft className="mr-3 text-accent" />
          <h1 className={`font-medium transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
            Smart Contract Metadata
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {onImport && (
            <Button 
              variant="outline" 
              onClick={onImport}
              className="flex items-center gap-2"
            >
              <Import size={16} />
              <span>Import</span>
            </Button>
          )}
          
          <Button 
            onClick={onNewContract}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90"
          >
            <Plus size={16} />
            <span>New Contract</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
