import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ContractCard, { ContractMetadata } from "@/components/ContractCard";
import ContractMetadataForm from "@/components/ContractMetadataForm";
import ContractForm from "@/components/ContractForm";
import ContractFileSelector from "@/components/ContractFileSelector";
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
    extension: "ERC-721",
    purpose: "Manages ownership of IP, assigns revenue shares",
    keyFunctions: ["Assigns ownership", "Records rights", "Facilitates transfers"],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-20"),
  },
  {
    id: "2",
    name: "RevenueSplit",
    extension: "ERC-20",
    purpose: "Automates revenue sharing among investors, creators, and stakeholders",
    keyFunctions: ["Distributes income", "Handles multiple revenue streams"],
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "3",
    name: "Investment",
    extension: "ERC-1155",
    purpose: "Enables tokenized film investment",
    keyFunctions: ["Tracks contributions", "Issues film-backed tokens", "Automates investor payouts"],
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-05-10"),
  },
  {
    id: "4",
    name: "Licensing",
    extension: "ERC-721",
    purpose: "Automates film licensing and royalty payments",
    keyFunctions: ["Issues licenses", "Enforces royalties on distribution"],
    createdAt: new Date("2023-04-12"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "5",
    name: "StreamingPayouts",
    extension: "ERC-20",
    purpose: "Connects to streaming platforms to process per-view revenue distribution",
    keyFunctions: ["Reads external streaming data", "Executes micropayments"],
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-07-05"),
  },
];

// Sample FilmRights contract metadata for the ContractDetails view
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

// Sample RevenueSplit contract metadata
const REVENUE_SPLIT_METADATA = {
  "title": "RevenueSplit",
  "version": "1.2.0",
  "description": "Smart contract for automating revenue distribution among stakeholders in film projects",
  "contractProperties": {
    "project": {
      "projectId": "string",
      "title": "string",
      "description": "string",
      "creationDate": "uint256",
      "totalRevenue": "uint256"
    },
    "stakeholders": {
      "address": "address",
      "name": "string",
      "sharePercentage": "uint256",
      "stakeholderType": "string",
      "paymentAddress": "address"
    },
    "revenueStreams": {
      "streamId": "uint256",
      "name": "string",
      "description": "string",
      "active": "bool",
      "revenueCap": "uint256"
    }
  },
  "events": {
    "RevenueReceived": {
      "amount": "uint256",
      "source": "string",
      "timestamp": "uint256"
    },
    "PaymentDistributed": {
      "recipient": "address",
      "amount": "uint256",
      "timestamp": "uint256",
      "success": "bool"
    },
    "StakeholderAdded": {
      "stakeholderAddress": "address",
      "name": "string",
      "percentage": "uint256",
      "timestamp": "uint256"
    }
  },
  "functions": {
    "addRevenue": "Function to add new revenue to the contract",
    "distributePayments": "Function to distribute payments to stakeholders",
    "addStakeholder": "Function to add a new stakeholder",
    "updateShares": "Function to update stakeholder shares",
    "getStakeholderBalance": "Function to check stakeholder balance",
    "withdrawFunds": "Function for stakeholders to withdraw their funds",
    "getRevenueHistory": "Function to view historical revenue data",
    "pauseDistributions": "Function to temporarily pause distributions"
  },
  "standards": ["ERC-20"],
  "dependencies": {
    "OpenZeppelin": ">=4.0.0",
    "Chainlink": ">=1.0.0"
  },
  "chainSupport": ["Ethereum", "Polygon", "Optimism"]
};

// Sample Investment contract metadata
const INVESTMENT_METADATA = {
  "title": "Investment",
  "version": "1.3.0",
  "description": "Smart contract for tokenized investment in film and media projects",
  "contractProperties": {
    "project": {
      "projectId": "string",
      "title": "string",
      "description": "string",
      "goal": "uint256",
      "minimumInvestment": "uint256",
      "deadline": "uint256"
    },
    "token": {
      "name": "string",
      "symbol": "string",
      "totalSupply": "uint256",
      "decimals": "uint8"
    },
    "investorInfo": {
      "address": "address",
      "amount": "uint256",
      "tokens": "uint256",
      "investmentDate": "uint256",
      "claimedReturns": "uint256"
    }
  },
  "events": {
    "InvestmentReceived": {
      "investor": "address",
      "amount": "uint256",
      "tokens": "uint256",
      "timestamp": "uint256"
    },
    "GoalReached": {
      "totalAmount": "uint256",
      "numberOfInvestors": "uint256",
      "timestamp": "uint256"
    },
    "ReturnDistributed": {
      "investor": "address",
      "amount": "uint256",
      "timestamp": "uint256"
    }
  },
  "functions": {
    "invest": "Function to make an investment in the project",
    "withdrawInvestment": "Function to withdraw investment if goal not met",
    "distributeReturns": "Function to distribute returns to investors",
    "getTotalInvestment": "Function to check total investment raised",
    "getInvestorInfo": "Function to get information about an investor",
    "claimTokens": "Function for investor to claim their tokens",
    "projectStatus": "Function to check status of funding goals",
    "extendDeadline": "Function to extend the investment deadline"
  },
  "standards": ["ERC-1155"],
  "dependencies": {
    "OpenZeppelin": ">=4.0.0",
    "Chainlink": ">=1.0.0"
  },
  "chainSupport": ["Ethereum", "Polygon", "Avalanche"]
};

// Sample Licensing contract metadata
const LICENSING_METADATA = {
  "title": "Licensing",
  "version": "1.1.0",
  "description": "Smart contract for automating film licensing agreements and royalty payments",
  "contractProperties": {
    "content": {
      "contentId": "string",
      "title": "string",
      "description": "string",
      "contentType": "string",
      "contentHash": "bytes32"
    },
    "licenseTerms": {
      "licenseId": "uint256",
      "licensee": "address",
      "licenseType": "string",
      "startDate": "uint256",
      "endDate": "uint256",
      "territories": "string[]",
      "royaltyRate": "uint256"
    },
    "usageReporting": {
      "reportId": "uint256",
      "usageAmount": "uint256",
      "reportDate": "uint256",
      "verified": "bool"
    }
  },
  "events": {
    "LicenseIssued": {
      "licenseId": "uint256",
      "licensee": "address",
      "contentId": "string",
      "timestamp": "uint256"
    },
    "RoyaltyPaid": {
      "licensee": "address",
      "licensor": "address",
      "amount": "uint256",
      "timestamp": "uint256"
    },
    "LicenseTransferred": {
      "licenseId": "uint256",
      "from": "address",
      "to": "address",
      "timestamp": "uint256"
    }
  },
  "functions": {
    "issueLicense": "Function to issue a new license to a licensee",
    "renewLicense": "Function to renew an existing license",
    "reportUsage": "Function for licensees to report content usage",
    "calculateRoyalties": "Function to calculate royalties based on usage",
    "payRoyalties": "Function to pay royalties to licensor",
    "verifyUsage": "Function to verify reported usage data",
    "transferLicense": "Function to transfer a license to another entity",
    "getLicenseStatus": "Function to check status of a license"
  },
  "standards": ["ERC-721"],
  "dependencies": {
    "OpenZeppelin": ">=4.0.0",
    "Chainlink": ">=1.0.0"
  },
  "chainSupport": ["Ethereum", "Polygon", "Arbitrum"]
};

// Sample StreamingPayouts contract metadata
const STREAMING_PAYOUTS_METADATA = {
  "title": "StreamingPayouts",
  "version": "1.0.0",
  "description": "Smart contract for automated per-view revenue distribution from streaming platforms",
  "contractProperties": {
    "content": {
      "contentId": "string",
      "title": "string",
      "type": "string",
      "duration": "uint256",
      "streamRate": "uint256"
    },
    "platformConnection": {
      "platformId": "string",
      "apiEndpoint": "string",
      "apiKey": "bytes32",
      "active": "bool"
    },
    "beneficiary": {
      "address": "address",
      "role": "string",
      "sharePercentage": "uint256",
      "minimumPayout": "uint256"
    }
  },
  "events": {
    "StreamDataReceived": {
      "platform": "string",
      "contentId": "string",
      "views": "uint256",
      "revenue": "uint256",
      "timestamp": "uint256"
    },
    "PayoutProcessed": {
      "beneficiary": "address",
      "amount": "uint256",
      "timestamp": "uint256"
    },
    "PlatformAdded": {
      "platformId": "string",
      "apiEndpoint": "string",
      "timestamp": "uint256"
    }
  },
  "functions": {
    "addStreamingPlatform": "Function to connect to a streaming platform",
    "updateStreamingRates": "Function to update per-view payout rates",
    "fetchStreamingData": "Function to fetch view count data from platforms",
    "processPayout": "Function to process payouts to beneficiaries",
    "addBeneficiary": "Function to add a new beneficiary",
    "getStreamingStatistics": "Function to get streaming statistics",
    "calculateRevenue": "Function to calculate revenue based on views",
    "withdrawFunds": "Function for beneficiaries to withdraw funds"
  },
  "standards": ["ERC-20"],
  "dependencies": {
    "OpenZeppelin": ">=4.0.0",
    "Chainlink": ">=1.0.0"
  },
  "chainSupport": ["Ethereum", "Polygon", "Base"]
};

const Index = () => {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<ContractMetadata[]>(SAMPLE_CONTRACTS);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFull, setIsCreatingFull] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewContract, setViewContract] = useState<ContractMetadata | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContractForDeployment, setSelectedContractForDeployment] = useState<ContractMetadata | null>(null);
  const [showFileSelector, setShowFileSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  
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
    // If deploying from an existing contract template
    if (selectedContractForDeployment) {
      toast({
        title: "Contract deployed from template",
        description: `New deployment based on ${selectedContractForDeployment.name} has been initiated with file: ${selectedFile?.name}.`,
      });
      setSelectedContractForDeployment(null);
      setIsCreatingFull(false);
      setSelectedFile(null);
      return;
    }
    
    // Regular contract deployment
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
    setSelectedFile(null);
    toast({
      title: "Contract deployed",
      description: `${newContract.name} has been deployed successfully with file: ${selectedFile?.name}.`,
    });
  };

  const handleView = (id: string) => {
    const contract = contracts.find(c => c.id === id);
    if (contract) {
      let contractData;
      
      switch(contract.name) {
        case "FilmRights":
          contractData = FILM_RIGHTS_METADATA;
          break;
        case "RevenueSplit":
          contractData = REVENUE_SPLIT_METADATA;
          break;
        case "Investment":
          contractData = INVESTMENT_METADATA;
          break;
        case "Licensing":
          contractData = LICENSING_METADATA;
          break;
        case "StreamingPayouts":
          contractData = STREAMING_PAYOUTS_METADATA;
          break;
        default:
          contractData = null;
      }
      
      if (contractData && !contract.contractData) {
        setViewContract({
          ...contract,
          contractData
        });
      } else {
        setViewContract(contract);
      }
    }
  };
  
  const handleDeploy = (id: string) => {
    const contract = contracts.find(c => c.id === id);
    if (contract) {
      setSelectedContractForDeployment(contract);
      setShowFileSelector(true);
    }
  };

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    setShowFileSelector(false);
    setIsCreatingFull(true);
  };

  const getUniqueExtensions = () => {
    const extensions = contracts.map(c => c.extension).filter(ext => ext !== "");
    return Array.from(new Set(extensions));
  };

  // Handle direct "Deploy Contract" button click
  const handleNewContractDeploy = () => {
    setSelectedContractForDeployment(null);
    setShowFileSelector(true);
  };

  if (showFileSelector) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <ContractFileSelector
            onCancel={() => {
              setShowFileSelector(false);
              setSelectedContractForDeployment(null);
            }}
            onNext={handleFileSelect}
            contractName={selectedContractForDeployment?.name}
          />
        </div>
      </div>
    );
  }

  if (isCreatingFull) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <ContractForm
            onSave={handleDeployContract}
            onCancel={() => {
              setIsCreatingFull(false);
              setSelectedContractForDeployment(null);
              setSelectedFile(null);
            }}
            initialData={selectedContractForDeployment?.contractData}
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
      <Header onNewContract={handleNewContractDeploy} />
      
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
              onClick={handleNewContractDeploy}
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
                onDeploy={handleDeploy}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-xl font-medium text-muted-foreground mb-4">No contracts found</h3>
            <Button 
              onClick={handleNewContractDeploy}
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
              <ContractDetails 
                contractData={viewContract.contractData}
                contractId={viewContract.id}
              />
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
