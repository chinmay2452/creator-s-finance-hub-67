import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, Bell, Link as LinkIcon, Shield, Download, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const platformMap: Record<string, { platform: string; icon: string; color: string }> = {
  youtube: { platform: "YouTube", icon: "🎥", color: "bg-red-500/20 text-red-500" },
  instagram: { platform: "Instagram", icon: "📸", color: "bg-pink-500/20 text-pink-500" },
  tiktok: { platform: "TikTok", icon: "🎵", color: "bg-gray-900/20 text-gray-900" },
  snapchat: { platform: "Snapchat", icon: "👻", color: "bg-yellow-400/20 text-yellow-600" },
  facebook: { platform: "Facebook", icon: "📘", color: "bg-blue-600/20 text-blue-600" },
  linkedin: { platform: "LinkedIn", icon: "💼", color: "bg-blue-700/20 text-blue-700" },
  x: { platform: "X", icon: "✖️", color: "bg-black/20 text-black" },
};

const Settings = () => {
  const [linked, setLinked] = useState<Array<{ platform: string; accountId: string; displayName: string }>>([]);
  const navigate = useNavigate();

  const accounts = useMemo(() => {
    let selected: string[] = [];
    try {
      const prof = JSON.parse(localStorage.getItem("creatorProfile") || "{}");
      selected = Array.isArray(prof.platforms) ? prof.platforms : [];
    } catch (_e) {
      selected = [];
    }
    const base = selected.length ? selected.map((key) => platformMap[key]).filter(Boolean) : [platformMap.youtube, platformMap.instagram];
    const byPlatform = Object.fromEntries(linked.map((a) => [a.platform, a]));
    return base.map((p) => ({
      platform: p.platform,
      icon: p.icon,
      color: p.color,
      status: byPlatform[p.platform] ? "Connected" : "Disconnected",
      displayName: byPlatform[p.platform]?.displayName,
    }));
  }, [linked]);

  useEffect(() => {
    const raw = localStorage.getItem("linkedAccounts");
    setLinked(raw ? (JSON.parse(raw) as Array<{ platform: string; accountId: string; displayName: string }>) : []);
  }, []);

  const handleDisconnect = (platform: string) => {
    const next = linked.filter((a) => a.platform !== platform);
    localStorage.setItem("linkedAccounts", JSON.stringify(next));
    setLinked(next);
    toast({ title: `${platform} disconnected`, description: "Account link removed." });
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved! ✅",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleLogout = async () => {
    try { if (supabase) await supabase.auth.signOut(); } catch {}
    try {
      const raw = localStorage.getItem("creatorAuth");
      const a = raw ? JSON.parse(raw) : {};
      localStorage.setItem("creatorAuth", JSON.stringify({ ...a, loggedIn: false }));
    } catch {}
    navigate("/auth?mode=login");
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
            Settings ⚙️
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Management
                </CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Your Name" defaultValue="Creator Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="creator@example.com" defaultValue="creator@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself..." defaultValue="Digital creator & influencer" />
                  </div>
                  <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-secondary">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payment Received</Label>
                      <p className="text-sm text-muted-foreground">Get notified when you receive payments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monthly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive monthly earning summaries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Goal Achievements</Label>
                      <p className="text-sm text-muted-foreground">Celebrate when you reach your goals</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Insights</Label>
                      <p className="text-sm text-muted-foreground">Get AI-powered financial recommendations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-accent" />
                  Connected Accounts
                </CardTitle>
                <CardDescription>Manage your platform integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${account.color} flex items-center justify-center text-xl`}>
                            {account.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{account.platform}</p>
                            {account.displayName && <p className="text-xs text-muted-foreground">{account.displayName}</p>}
                            <Badge
                              variant={account.status === "Connected" ? "default" : "outline"}
                              className={account.status === "Connected" ? "bg-secondary/20 text-secondary" : ""}
                            >
                              {account.status}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => (account.status === "Connected" ? handleDisconnect(account.platform) : toast({ title: "Connect from Dashboard", description: "Use 'Connect Accounts' on the Dashboard to link." }))}
                          variant={account.status === "Connected" ? "outline" : "default"}
                          size="sm"
                          className={account.status === "Connected" ? "" : "bg-gradient-to-r from-primary to-secondary"}
                        >
                          {account.status === "Connected" ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                      {index < accounts.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Data & Security
                </CardTitle>
                <CardDescription>Manage your data and account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Download className="w-4 h-4" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2">
                    <User className="w-4 h-4" />
                    Logout
                  </Button>
                  <Separator />
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h4>
                    <Button
                      variant="destructive"
                      className="w-full justify-start gap-2 bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
