import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus, Camera, Users, Laptop, TrendingUp, Target } from "lucide-react";

const goals = [
  {
    id: 1,
    icon: Camera,
    title: "Buy New Camera",
    target: 45000,
    current: 18450,
    category: "Equipment",
    status: "In Progress",
    color: "primary"
  },
  {
    id: 2,
    icon: Users,
    title: "Hire Video Editor",
    target: 10000,
    current: 6800,
    category: "Team",
    status: "On Track",
    color: "secondary"
  },
  {
    id: 3,
    icon: Laptop,
    title: "Upgrade Studio Setup",
    target: 25000,
    current: 8500,
    category: "Equipment",
    status: "In Progress",
    color: "accent"
  },
  {
    id: 4,
    icon: TrendingUp,
    title: "Monthly Revenue Goal",
    target: 20000,
    current: 12450,
    category: "Income",
    status: "On Track",
    color: "primary"
  },
];

const Goals = () => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return "bg-secondary";
    if (percentage >= 40) return "bg-primary";
    return "bg-accent";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 mt-16 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Goals 🎯
            </h1>
            <p className="text-muted-foreground">Track your financial milestones and dreams</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-secondary gap-2">
            <Plus className="w-4 h-4" />
            Create New Goal
          </Button>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {goals.map((goal, index) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const Icon = goal.icon;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card className="glass-card hover:neon-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br from-${goal.color}/20 to-${goal.color}/10`}>
                          <Icon className={`w-6 h-6 text-${goal.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-1">{goal.title}</CardTitle>
                          <CardDescription>{goal.category}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          goal.status === "On Track"
                            ? "bg-secondary/20 text-secondary border-secondary/30"
                            : "bg-primary/20 text-primary border-primary/30"
                        }`}
                      >
                        {goal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Ring */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-bold text-foreground">{percentage}%</span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                        <div className="ml-6 text-center">
                          <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-primary/20 relative">
                            <div
                              className="absolute inset-0 rounded-full border-4 border-transparent"
                              style={{
                                borderTopColor: `hsl(var(--${goal.color}))`,
                                transform: `rotate(${(percentage / 100) * 360}deg)`,
                                transition: "transform 1s ease-out",
                              }}
                            />
                            <span className="text-lg font-bold z-10">{percentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Amount Details */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current</p>
                          <p className="text-lg font-bold text-secondary">₹{goal.current.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Target</p>
                          <p className="text-lg font-bold text-foreground">₹{goal.target.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Remaining */}
                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground">
                          ₹{(goal.target - goal.current).toLocaleString()} remaining to reach your goal
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline & Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Goal Timeline & Milestones
              </CardTitle>
              <CardDescription>Track your progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline */}
                <div className="relative pl-8 space-y-6">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
                  
                  <div className="relative">
                    <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-secondary border-4 border-background" />
                    <div className="glass-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">Camera Fund - 41% Complete</p>
                        <span className="text-xs text-muted-foreground">Jan 2025</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Added ₹2,500 from YouTube sponsorship</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    <div className="glass-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">Editor Budget - 68% Complete</p>
                        <span className="text-xs text-muted-foreground">Dec 2024</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Monthly savings on track</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-accent border-4 border-background" />
                    <div className="glass-card p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">Studio Setup Started</p>
                        <span className="text-xs text-muted-foreground">Nov 2024</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Goal created with initial contribution</p>
                    </div>
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

export default Goals;
