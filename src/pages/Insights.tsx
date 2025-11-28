import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Target, AlertCircle, Sparkles } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FinanceIntelAgent } from "@/agents/FinanceIntel";
import { MockDataProvider } from "@/tools/MockDataProvider";

const growthData = [
  { month: "Jul", growth: 5 },
  { month: "Aug", growth: 12 },
  { month: "Sep", growth: 8 },
  { month: "Oct", growth: 15 },
  { month: "Nov", growth: 22 },
  { month: "Dec", growth: 18 },
  { month: "Jan", growth: 28 },
];

const categoryData = [
  { category: "Sponsorships", amount: 12500 },
  { category: "Brand Deals", amount: 8200 },
  { category: "Freelancing", amount: 15000 },
  { category: "Affiliate", amount: 3500 },
];

type Forecast = { d30: number; d90: number; d365: number };
const Insights = () => {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [risk, setRisk] = useState<string[]>([]);
  const [tax, setTax] = useState<{ taxableIncome: number; estimatedTax: number; deductions: number } | null>(null);
  const agent = useMemo(() => new FinanceIntelAgent(new MockDataProvider()), []);
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
            Insights 📊
          </h1>
          <p className="text-muted-foreground">AI-powered analytics and recommendations</p>
        </motion.div>

        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{forecast ? `~${Math.round((forecast.d90 / forecast.d30 - 1) * 100)}%` : "+28%"}</div>
                <p className="text-sm text-muted-foreground mt-2">Month over month increase</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Best Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{risk.length ? `Risk: ${risk[0]}` : "YouTube"}</div>
                <p className="text-sm text-muted-foreground mt-2">Highest revenue source</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-accent" />
                  AI Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{tax ? `${Math.round((1 - tax.estimatedTax / Math.max(1, tax.taxableIncome)) * 100)}%` : "94%"}</div>
                <p className="text-sm text-muted-foreground mt-2">Prediction accuracy</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Growth Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Growth Trend Analysis 📈</CardTitle>
              <CardDescription>Month-over-month growth percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--secondary))", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Revenue by Category 💼</CardTitle>
              <CardDescription>Performance breakdown across income types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Recommendations 🤖
              </CardTitle>
              <CardDescription>Personalized insights to maximize your income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Forecast Snapshot</p>
                    <p className="text-sm text-muted-foreground">30d: ₹{forecast ? Math.round(forecast.d30).toLocaleString() : "—"}, 90d: ₹{forecast ? Math.round(forecast.d90).toLocaleString() : "—"}, 1y: ₹{forecast ? Math.round(forecast.d365).toLocaleString() : "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                  <Target className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Tax Estimation</p>
                    <p className="text-sm text-muted-foreground">Taxable: ₹{tax ? Math.round(tax.taxableIncome).toLocaleString() : "—"}; Est. Tax: ₹{tax ? Math.round(tax.estimatedTax).toLocaleString() : "—"}; Deductions: ₹{tax ? Math.round(tax.deductions).toLocaleString() : "—"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Risky Months</p>
                    <p className="text-sm text-muted-foreground">{risk.length ? risk.join(", ") : "No risks detected"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Insights;
        {/* Run AI Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <Button
            onClick={async () => {
              const res = await agent.run({ userId: "demo" });
              const d = res.data as { forecast: Forecast; tax: { taxableIncome: number; estimatedTax: number; deductions: number }; risk: string[] };
              setForecast(d.forecast);
              setTax(d.tax);
              setRisk(d.risk);
            }}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            Run AI Insights
          </Button>
        </motion.div>
