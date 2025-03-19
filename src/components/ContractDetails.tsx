
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Film, Key, Share, List, ArrowRight, CheckCheck, Scroll, Code, Globe, FileText, Info, Coins, Wallet, Tag, Radio } from "lucide-react";
import ContractDocuments from "./ContractDocuments";

interface ContractDetailProps {
  contractData: any;
  contractId: string;
}

const ContractDetails = ({ contractData, contractId }: ContractDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewingDocumentId, setViewingDocumentId] = useState<string | null>(null);
  
  if (!contractData) return null;
  
  const handleViewDocument = (documentId: string) => {
    setViewingDocumentId(documentId);
    setActiveTab("document");
  };
  
  // Render appropriate icon based on contract title
  const renderContractIcon = () => {
    switch(contractData.title) {
      case "FilmRights":
        return <Film className="h-5 w-5 text-accent" />;
      case "RevenueSplit":
        return <Share className="h-5 w-5 text-accent" />;
      case "Investment":
        return <Wallet className="h-5 w-5 text-accent" />;
      case "Licensing":
        return <Tag className="h-5 w-5 text-accent" />;
      case "StreamingPayouts":
        return <Radio className="h-5 w-5 text-accent" />;
      default:
        return <Film className="h-5 w-5 text-accent" />;
    }
  };

  // Generate appropriate features and use cases based on contract type
  const getContractFeatures = () => {
    switch(contractData.title) {
      case "FilmRights":
        return {
          features: [
            "Manages ownership of film IP rights on the blockchain",
            "Handles revenue share distribution among stakeholders",
            "Provides licensing functionality for third parties",
            "Supports multiple blockchain standards and networks"
          ],
          useCases: [
            "Independent filmmakers establishing transparent IP rights",
            "Studios managing revenue shares with investors and talents",
            "Streamlined licensing process for distributors",
            "Automatic payment splits based on revenue allocation"
          ]
        };
      case "RevenueSplit":
        return {
          features: [
            "Automates revenue distribution to multiple stakeholders",
            "Supports various revenue streams and payment schedules",
            "Provides transparent accounting and distribution records",
            "Enables dynamic adjustment of stakeholder shares"
          ],
          useCases: [
            "Film production companies distributing profits to investors",
            "Music rights management across multiple platforms",
            "Digital content creator revenue sharing with collaborators",
            "Cross-border royalty distributions with minimal fees"
          ]
        };
      case "Investment":
        return {
          features: [
            "Tokenizes film investment opportunities for fractional ownership",
            "Enables transparent tracking of investment allocations",
            "Automates return distributions based on revenue performance",
            "Provides liquidity for traditionally illiquid film investments"
          ],
          useCases: [
            "Independent film funding through tokenized investments",
            "Fan-based funding for creator-driven projects",
            "Portfolio diversification for media investors",
            "Secondary market trading of film investment shares"
          ]
        };
      case "Licensing":
        return {
          features: [
            "Automates licensing agreements through smart contracts",
            "Enforces royalty payments based on usage reports",
            "Manages territorial rights and restrictions",
            "Enables transferable and time-bound licenses"
          ],
          useCases: [
            "Film distribution across multiple territories",
            "Licensing content to streaming platforms with automated payments",
            "Managing music synchronization rights for films",
            "Sublicensing management with royalty tracking"
          ]
        };
      case "StreamingPayouts":
        return {
          features: [
            "Connects to streaming platform APIs for usage data",
            "Processes micropayments based on per-view metrics",
            "Distributes revenue to multiple stakeholders in real-time",
            "Provides detailed analytics on streaming performance"
          ],
          useCases: [
            "Creator payments based on actual streaming metrics",
            "Real-time revenue splits for collaborative content",
            "Cross-platform revenue aggregation and distribution",
            "Transparent reporting for stakeholders on content performance"
          ]
        };
      default:
        return {
          features: [],
          useCases: []
        };
    }
  };
  
  const { features, useCases } = getContractFeatures();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-accent/20 text-accent hover:bg-accent/30 transition-colors">
              v{contractData.version}
            </Badge>
            {contractData.standards?.map((standard: string) => (
              <Badge key={standard} className="bg-muted text-muted-foreground">
                {standard}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-2xl flex items-center gap-2">
            {renderContractIcon()}
            {contractData.title}
          </CardTitle>
          <CardDescription className="text-base mt-1">
            {contractData.description}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="document" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">What This Contract Does</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{contractData.description}</p>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Key Features:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Primary Use Cases:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Standards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contractData.standards?.map((standard: string) => (
                      <Badge key={standard} variant="secondary">
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Chain Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {contractData.chainSupport?.map((chain: string) => (
                      <Badge key={chain} variant="outline">
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="metadata" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contract Metadata</CardTitle>
                <CardDescription>Technical details about the contract structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Properties</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(contractData.contractProperties || {}).map(([sectionName, properties]) => (
                        <AccordionItem key={sectionName} value={sectionName}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center gap-2">
                              {sectionName === "film" || sectionName === "content" ? (
                                <Film className="h-4 w-4 text-accent" />
                              ) : sectionName === "rightsOwnership" || sectionName === "licenseTerms" ? (
                                <Key className="h-4 w-4 text-accent" />
                              ) : sectionName === "revenueShares" || sectionName === "stakeholders" ? (
                                <Share className="h-4 w-4 text-accent" />
                              ) : sectionName === "token" || sectionName === "project" ? (
                                <Coins className="h-4 w-4 text-accent" />
                              ) : sectionName === "beneficiary" || sectionName === "investorInfo" ? (
                                <Wallet className="h-4 w-4 text-accent" />
                              ) : sectionName === "platformConnection" || sectionName === "usageReporting" ? (
                                <Radio className="h-4 w-4 text-accent" />
                              ) : (
                                <List className="h-4 w-4 text-accent" />
                              )}
                              <span>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Property</TableHead>
                                  <TableHead>Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(properties as object).map(([key, type]) => (
                                  <TableRow key={key}>
                                    <TableCell className="font-medium">{key}</TableCell>
                                    <TableCell>
                                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                        {type as string}
                                      </code>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Events</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(contractData.events || {}).map(([eventName, eventData]) => (
                        <AccordionItem key={eventName} value={eventName}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center gap-2">
                              <CheckCheck className="h-4 w-4 text-accent" />
                              <span>{eventName}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Parameter</TableHead>
                                  <TableHead>Type</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(eventData as object).map(([param, type]) => (
                                  <TableRow key={param}>
                                    <TableCell className="font-medium">{param}</TableCell>
                                    <TableCell>
                                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                        {type as string}
                                      </code>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Functions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(contractData.functions || {}).map(([funcName, description]) => (
                        <Card key={funcName} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Code className="h-4 w-4 text-accent" />
                              {funcName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-muted-foreground">
                            {description as string}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="document" className="py-4">
            {viewingDocumentId ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      Document Viewer
                    </CardTitle>
                    <CardDescription>
                      Viewing metadata from document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-4 bg-muted/10">
                      <pre className="text-sm overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(contractData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <ContractDocuments 
                contractId={contractId} 
                onViewDocument={handleViewDocument} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="details" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Dependencies</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Library</TableHead>
                          <TableHead>Version</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(contractData.dependencies || {}).map(([lib, version]) => (
                          <TableRow key={lib}>
                            <TableCell className="font-medium">{lib}</TableCell>
                            <TableCell>{version as string}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Implementation Details</h3>
                    <p className="text-sm">
                      {contractData.title === "FilmRights" && "This contract implements the ERC-721 and ERC-1155 standards to represent film rights as non-fungible tokens."}
                      {contractData.title === "RevenueSplit" && "This contract implements the ERC-20 standard to handle fungible token transfers for revenue sharing."}
                      {contractData.title === "Investment" && "This contract implements the ERC-1155 standard to represent investment shares as semi-fungible tokens."}
                      {contractData.title === "Licensing" && "This contract implements the ERC-721 standard to represent unique licenses as non-fungible tokens."}
                      {contractData.title === "StreamingPayouts" && "This contract implements the ERC-20 standard and oracle connections to process streaming data."}
                      {" It leverages OpenZeppelin's secure implementation of these standards and uses Chainlink for oracle data."}
                    </p>
                    
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Technical Features:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        {contractData.standards?.includes("ERC-721") && <li>Compliant with ERC-721 token standard</li>}
                        {contractData.standards?.includes("ERC-1155") && <li>Compliant with ERC-1155 token standard</li>}
                        {contractData.standards?.includes("ERC-20") && <li>Compliant with ERC-20 token standard</li>}
                        <li>Access control mechanisms for rights management</li>
                        {(contractData.title === "RevenueSplit" || contractData.title === "StreamingPayouts") && 
                          <li>Revenue distribution through on-chain calculation</li>}
                        {contractData.title === "Licensing" && 
                          <li>Licensing functionality with time-based controls</li>}
                        <li>Cross-chain compatibility for multiple networks</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ContractDetails;
