import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Download, Filter, Search, Mail, Upload, Calendar } from "lucide-react";
import { runIncomeSync } from "@/lib/api";
import { useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { runParseEmail } from "@/lib/api";
import { IncomeAggregatorAgent } from "@/agents/IncomeAggregator";
import { MockDataProvider } from "@/tools/MockDataProvider";

const mockEarnings = [
  { id: 1, platform: "YouTube", brand: "TechCorp", amount: 2500, status: "Received", date: "2025-01-15", category: "Sponsorship" },
  { id: 2, platform: "Instagram", brand: "Fashion Brand", amount: 1800, status: "Pending", date: "2025-01-20", category: "Brand Deal" },
  { id: 3, platform: "Freelancing", brand: "StartupXYZ", amount: 3200, status: "Received", date: "2025-01-10", category: "Project" },
  { id: 4, platform: "YouTube", brand: "Gaming Co", amount: 4500, status: "Received", date: "2025-01-05", category: "Sponsorship" },
  { id: 5, platform: "Brand Deals", brand: "Beauty Inc", amount: 2100, status: "Pending", date: "2025-01-25", category: "Campaign" },
];

type AggregatorTotals = { byPlatform: Record<string, number>; total: number; pending: number };

const Earnings = () => {
  const [emailText, setEmailText] = useState("");
  const [extractedData, setExtractedData] = useState<{ brand: string; amount: number; dueDate: string; status: string } | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [totals, setTotals] = useState<AggregatorTotals | null>(null);
  const agent = useMemo(() => new IncomeAggregatorAgent(new MockDataProvider()), []);

  const handleExtractEmail = async () => {
    const res = await runParseEmail({ emailText, userId: "demo_user" });
    const parsed = res?.data as { brand?: string; amount?: number; dueDate?: string; status?: string; confidence: number };
    setExtractedData(
      parsed && (parsed.amount || parsed.brand || parsed.dueDate)
        ? {
            brand: parsed.brand || "Unknown",
            amount: parsed.amount || 0,
            dueDate: parsed.dueDate || "Unknown",
            status: parsed.status || "Pending",
          }
        : null,
    );
    if (parsed?.confidence && parsed.confidence >= 0.98) {
      toast({ title: "Email Parsed Successfully! 📧", description: "AI high-confidence extraction" });
    } else if (parsed?.confidence && parsed.confidence >= 0.8) {
      toast({ title: "Email Parsed", description: "AI medium-confidence extraction" });
    } else {
      toast({ title: "Low Confidence", description: "Try refining the email content" });
    }
  };

  const handleGenerateSummary = async () => {
    const res = await agent.run("recent");
    const t = (res.data as { entries: unknown; totals: AggregatorTotals }).totals;
    setTotals(t);
    setSummary(res.text);
    toast({ title: "AI Summary Ready ✅", description: "Aggregated earnings across platforms" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 mt-16 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Earnings 💰
          </h1>
          <p className="text-muted-foreground">Track and manage all your income streams</p>
        </motion.div>

        {/* Email Income Extractor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Email Income Extractor 🔍
              </CardTitle>
              <CardDescription>
                Paste your brand deal email to automatically extract payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your email content here..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                />
                <Button onClick={handleExtractEmail} className="bg-gradient-to-r from-primary to-secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Parse Email
                </Button>

                {extractedData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">Brand Name</p>
                      <p className="font-semibold text-foreground">{extractedData.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold text-secondary">${extractedData.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-semibold text-foreground">{extractedData.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className="bg-accent/20 text-accent">
                        {extractedData.status}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Income Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card className="glass-card border-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                AI Income Summary 🤖
              </CardTitle>
              <CardDescription>Aggregated totals and pending amounts across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Button onClick={handleGenerateSummary} className="bg-gradient-to-r from-secondary to-primary">Generate Summary</Button>
              </div>
              {summary && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <p className="text-sm text-foreground">{summary}</p>
                  </div>
                  {totals && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-secondary">${totals.total.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-accent">${totals.pending.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground">Top Platform</p>
                        <p className="text-2xl font-bold text-primary">{Object.entries(totals.byPlatform).sort((a,b)=>b[1]-a[1])[0]?.[0] || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex flex-wrap gap-4"
        >
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search earnings..." className="pl-10 bg-card/50" />
            </div>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-card/50">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="freelancing">Freelancing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-card/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-secondary">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const res = await runIncomeSync({ userId: "demo_user", since: new Date(Date.now() - 6*60*60*1000).toISOString() });
              toast({ title: "Income Sync Triggered", description: `Synced ${res?.data?.saved?.length ?? 0} records` });
            }}
            className="gap-2"
          >
            Sync Screenshots
          </Button>
        </motion.div>

        {/* Earnings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Detailed Earnings</CardTitle>
              <CardDescription>Complete history of all payments and deals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Brand/Client</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEarnings.map((earning, index) => (
                    <motion.tr
                      key={earning.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>{earning.date}</TableCell>
                      <TableCell>
                        <span className="font-medium">{earning.platform}</span>
                      </TableCell>
                      <TableCell>{earning.brand}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{earning.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-secondary">${earning.amount}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={earning.status === "Received" ? "default" : "outline"}
                          className={earning.status === "Received" ? "bg-secondary/20 text-secondary" : "bg-accent/20 text-accent"}
                        >
                          {earning.status}
                        </Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Earnings;
