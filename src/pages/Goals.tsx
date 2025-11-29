import * as React from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Plus, Camera, Users, Laptop, TrendingUp, Target } from "lucide-react";

const defaultGoals = [
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

const iconMap = { camera: Camera, users: Users, laptop: Laptop, trending: TrendingUp } as const;

const Goals = () => {
  const [open, setOpen] = React.useState(false);
  type Goal = {
    id: number;
    title: string;
    target: number;
    current: number;
    category: string;
    status: string;
    color: "primary" | "secondary" | "accent";
    iconKey?: keyof typeof iconMap;
    icon?: React.ComponentType<unknown>;
  };
  const [goals, setGoals] = React.useState<Goal[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("creatorGoals") || "null");
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (_e) { void 0; }
    return defaultGoals;
  });
  const [newGoal, setNewGoal] = React.useState<Omit<Goal, "id">>({
    title: "",
    target: 0,
    current: 0,
    category: "Equipment",
    status: "In Progress",
    color: "primary",
    iconKey: "camera",
  });

  const saveGoals = (list: Goal[]) => {
    setGoals(list);
    try { localStorage.setItem("creatorGoals", JSON.stringify(list)); } catch (_e) { void 0; }
  };

  const addGoal = () => {
    if (!newGoal.title || newGoal.target <= 0) return;
    const g = { id: Date.now(), ...newGoal };
    const next = [...goals, g];
    saveGoals(next);
    setOpen(false);
    setNewGoal({ title: "", target: 0, current: 0, category: "Equipment", status: "In Progress", color: "primary", iconKey: "camera" });
  };
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary gap-2">
              <Plus className="w-4 h-4" />
              Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10">
              <DialogHeader>
                <DialogTitle>Create Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={newGoal.title} onChange={(e) => setNewGoal((s) => ({ ...s, title: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target (₹)</Label>
                    <Input id="target" type="number" value={newGoal.target} onChange={(e) => setNewGoal((s) => ({ ...s, target: Number(e.target.value) }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current">Current (₹)</Label>
                    <Input id="current" type="number" value={newGoal.current} onChange={(e) => setNewGoal((s) => ({ ...s, current: Number(e.target.value) }))} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newGoal.category} onValueChange={(v) => setNewGoal((s) => ({ ...s, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Team">Team</SelectItem>
                        <SelectItem value="Income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={newGoal.status} onValueChange={(v) => setNewGoal((s) => ({ ...s, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Track">On Track</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select value={newGoal.color} onValueChange={(v) => setNewGoal((s) => ({ ...s, color: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="accent">Accent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select value={newGoal.iconKey} onValueChange={(v) => setNewGoal((s) => ({ ...s, iconKey: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={addGoal} className="bg-gradient-to-r from-primary to-secondary">Add Goal</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {goals.map((goal, index) => {
            const safeTarget = Number(goal.target) || 0;
            const safeCurrent = Number(goal.current) || 0;
            const percentage = safeTarget > 0 ? Math.max(0, Math.min(100, Math.round((safeCurrent / safeTarget) * 100))) : 0;
            const Icon = goal.icon ?? iconMap[goal.iconKey ?? "camera"] ?? Camera;
            const colorKey = (goal.color === "secondary" || goal.color === "accent") ? goal.color : "primary";
            const colorClasses: Record<string, { wrap: string; icon: string }> = {
              primary: { wrap: "from-primary/20 to-primary/10", icon: "text-primary" },
              secondary: { wrap: "from-secondary/20 to-secondary/10", icon: "text-secondary" },
              accent: { wrap: "from-accent/20 to-accent/10", icon: "text-accent" },
            };
            const cc = colorClasses[colorKey];

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
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${cc.wrap}`}>
                          <Icon className={`w-6 h-6 ${cc.icon}`} />
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
