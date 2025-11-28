import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { EarningsChart } from "@/components/EarningsChart";
import { IncomeDistribution } from "@/components/IncomeDistribution";
import { ForecastCard } from "@/components/ForecastCard";
import { TransactionsTable } from "@/components/TransactionsTable";
import { AIChat } from "@/components/AIChat";
import { ConnectAccountsModal } from "@/components/ConnectAccountsModal";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { DollarSign, TrendingUp, Clock, Grid3x3 } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            Welcome back, Creator! 👋
          </h1>
          <p className="text-muted-foreground">{today}</p>
          <div className="mt-4">
            <ConnectAccountsModal />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value="$45,231"
            icon={DollarSign}
            trend="12.5%"
            trendUp={true}
            delay={0.1}
          />
          <StatCard
            title="This Month"
            value="$12,450"
            icon={TrendingUp}
            trend="8.2%"
            trendUp={true}
            delay={0.2}
          />
          <StatCard
            title="Pending Payments"
            value="$3,280"
            icon={Clock}
            delay={0.3}
          />
          <StatCard
            title="Income Sources"
            value="8"
            icon={Grid3x3}
            trend="2 new"
            trendUp={true}
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <EarningsChart />
          </div>
          <div>
            <IncomeDistribution />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionsTable />
          </div>
          <div>
            <ForecastCard />
          </div>
        </div>

        <UpgradeBanner />

        <footer className="mt-12 py-6 text-center border-t border-white/10">
          <p className="text-sm text-muted-foreground italic">
            "Turn your influence into income — intelligently." ✨
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 FundFluence. Empowering creators worldwide.
          </p>
        </footer>
      </main>

      <AIChat />
    </div>
  );
};

export default Index;
