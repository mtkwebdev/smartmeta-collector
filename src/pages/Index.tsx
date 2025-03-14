import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ContractCard, { ContractMetadata } from "@/components/ContractCard";
import ContractMetadataForm from "@/components/ContractMetadataForm";
import ContractForm from "@/components/ContractForm";
import ContractDetails from "@/components/ContractDetails";
import { CONTRACT_TYPE_CONFIGS } from "@/components/ContractFormFields";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data
const SAMPLE_CONTRACTS: ContractMetadata[] = [
  {
    id: "1",
    name: "FilmRights",
    extension: "",
    purpose: "Manages ownership of IP, assigns revenue shares",
    keyFunctions: ["Assigns ownership", "Records rights", "Facilitates transfers"],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "2",
    name: "RevenueSplit",
    extension: "",
    purpose: "Automates revenue sharing among investors, creators, and stakeholders",
    keyFunctions: ["Distributes income", "Handles multiple revenue streams"],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "3",
    name: "Investment",
    extension: "",
    purpose: "Enables tokenized film investment",
    keyFunctions: ["Tracks contributions", "Issues film-backed tokens", "Automates investor payouts"],
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    id: "4",
    name: "Licensing",
    extension: "",
    purpose: "Automates film licensing and royalty payments",
    keyFunctions: ["Issues licenses", "Enforces royalties on distribution"],
    createdAt: new Date("2023-04-12"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "5",
    name: "StreamingPayouts",
    extension: "",
    purpose: "Connects to streaming platforms to process per-view revenue distribution",
    keyFunctions: ["Reads external streaming data", "Executes micropayments"],
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-07-05"),
  },
];

// Sample Film Rights contract metadata for the ContractDetails view
const FILM_RIGHTS_METADATA = {
  "title": "FilmRights",
  "version": "1.0.0",
  "description": "Smart contract for managing film IP ownership and revenue share distribution",
  "contractProperties": {
    "film": {
      "filmId": "string",
      "title": "string",
      "description": "string",
      "creationDate": "uint256",
      "contentHash": "bytes32"
    },
    "rightsOwnership": {
      "primaryRightsHolder": "address",
      "transferable": "bool",
      "licensingEnabled": "bool",
      "territorialRestrictions": "string[]"
    },
    "revenueShares": {
      "stakeholder": "address",
      "sharePercentage": "uint256",
      "stakeholderRole": "string",
      "lockupPeriod": "uint256",
      "vestingSchedule": "uint256[]"
    }
  },
  "events": {
    "RightsTransferred": {
      "previousOwner": "address",
      "newOwner": "address",
      "transferDate": "uint256"
    },
    "RevenueDistributed": {
      "totalAmount": "uint256",
      "distributionDate": "uint256",
      "recipients": "address[]",
      "amounts": "uint256[]"
    },
    "LicenseGranted": {
      "licenseId": "uint256",
      "licensee": "address",
      "licenseType": "string",
      "startDate": "uint256",
      "endDate": "uint256",
      "territorialScope": "string[]"
    }
  },
  "functions": {
    "registerFilm": "Function to register a new film's IP",
    "transferRights": "Function to transfer ownership rights",
    "assignRevenueShare": "Function to assign percentage of revenue to stakeholders",
    "distributeRevenue": "Function to distribute revenue according to shares",
    "grantLicense": "Function to grant usage license to third parties",
    "revokeLicense": "Function to revoke previously granted licenses",
    "getRightsOwner": "Function to query the current rights owner",
    "getStakeholderShares": "Function to query revenue share allocation"
  },
  "standards": ["ERC-721", "ERC-1155"],
  "dependencies": {
    "OpenZeppelin": ">=4.0.0",
    "Chainlink": ">=1.0.0"
  },
  "chainSupport": ["Ethereum", "Polygon", "Binance Smart Chain"]
};

const Index = () => {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<ContractMetadata[]>(SAMPLE_CONTRACTS);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFull, setIsCreatingFull] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewContract, setViewContract] = useState<ContractMetadata | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.keyFunctions.some(fn => fn.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && contract.extension.includes(activeTab);
  });

  const handleSaveMetadata = (data: Omit<ContractMetadata, "id" | "createdAt" | "updatedAt">) => {
    const newContract: ContractMetadata = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setContracts(prev => [...prev, newContract]);
    setIsCreating(false);
    toast({
      title: "Contract deployed",
      description: `${data.name} has been deployed successfully.`,
    });
  };
  
  const handleDeployContract = (data: any) => {
    const { name, purpose, extension, keyFunctions, type } = data;
    
    const newContract: ContractMetadata = {
      id: Date.now().toString(),
      name: name || type,
      extension: extension || "",
      purpose: purpose || CONTRACT_TYPE_CONFIGS[type].description,
      keyFunctions: keyFunctions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      contractData: data,
    };
    
    setContracts(prev => [...prev, newContract]);
    setIsCreatingFull(false);
    toast({
      title: "Contract deployed",
      description: `${newContract.name} has been deployed successfully.`,
    });
  };

  const handleView = (id: string) => {
    const contract = contracts.find(c => c.id === id);
    if (contract) {
      if (contract.name === "FilmRights" && !contract.contractData) {
        setViewContract({
          ...contract,
          contractData: FILM_RIGHTS_METADATA
        });
      } else {
        setViewContract(contract);
      }
    }
  };

  const getUniqueExtensions = () => {
    const extensions = contracts.map(c => c.extension).filter(ext => ext !== "");
    return Array.from(new Set(extensions));
  };

  if (isCreatingFull) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <ContractForm
            onSave={handleDeployContract}
            onCancel={() => setIsCreatingFull(false)}
          />
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <ContractMetadataForm
            onSave={handleSaveMetadata}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onNewContract={() => setIsCreatingFull(true)} />
      
      <main className="container py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-semibold">Smart Contract Collection</h1>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button 
              onClick={() => setIsCreatingFull(true)}
              className="whitespace-nowrap"
            >
              <Rocket size={16} className="mr-1.5" />
              Deploy Contract
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            {getUniqueExtensions().map(ext => (
              <TabsTrigger key={ext} value={ext}>{ext}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {filteredContracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-xl font-medium text-muted-foreground mb-4">No contracts found</h3>
            <Button 
              onClick={() => setIsCreatingFull(true)}
              className="bg-accent hover:bg-accent/90"
            >
              <Rocket size={16} className="mr-1.5" />
              Deploy your first contract
            </Button>
          </div>
        )}
      </main>
      
      <Dialog open={!!viewContract} onOpenChange={(open) => !open && setViewContract(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {viewContract?.name}
            </DialogTitle>
          </DialogHeader>
          
          {viewContract && (
            viewContract.contractData ? (
              <ContractDetails contractData={viewContract.contractData} />
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Purpose</h3>
                  <p>{viewContract.purpose}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Key Functions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {viewContract.keyFunctions.map((func, index) => (
                      <li key={index}>{func}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Deployed: {new Date(viewContract.createdAt).toLocaleDateString()}</span>
                  <span>Last updated: {new Date(viewContract.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
