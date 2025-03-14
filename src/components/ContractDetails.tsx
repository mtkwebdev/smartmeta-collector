
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Film, Key, Share, List, ArrowRight, CheckCheck, Scroll, Code, Globe } from "lucide-react";

interface ContractDetailProps {
  contractData: any;
}

const ContractDetails = ({ contractData }: ContractDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!contractData) return null;
  
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
            <Film className="h-5 w-5 text-accent" />
            {contractData.title}
          </CardTitle>
          <CardDescription className="text-base mt-1">
            {contractData.description}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="py-4 space-y-4">
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties" className="py-4 space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="film">
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-accent" />
                    <span>Film Properties</span>
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
                      {Object.entries(contractData.contractProperties?.film || {}).map(([key, type]) => (
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
              
              <AccordionItem value="rightsOwnership">
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-accent" />
                    <span>Rights Ownership</span>
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
                      {Object.entries(contractData.contractProperties?.rightsOwnership || {}).map(([key, type]) => (
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
              
              <AccordionItem value="revenueShares">
                <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <Share className="h-4 w-4 text-accent" />
                    <span>Revenue Shares</span>
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
                      {Object.entries(contractData.contractProperties?.revenueShares || {}).map(([key, type]) => (
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
            </Accordion>
          </TabsContent>
          
          <TabsContent value="events" className="py-4">
            <div className="space-y-4">
              {Object.entries(contractData.events || {}).map(([eventName, eventData]) => (
                <Card key={eventName}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCheck className="h-4 w-4 text-accent" />
                      {eventName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="functions" className="py-4">
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
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ContractDetails;
