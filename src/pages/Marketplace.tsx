import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { MessageSquare, UserCircle } from "lucide-react";
import { useState } from "react";

type Freelancer = {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  price: number;
};

const freelancers: Freelancer[] = [
  { id: 1, name: "Aarav Mehta", role: "Video Editor", bio: "5+ years editing for tech and gaming channels", skills: ["Premiere Pro", "After Effects", "Color Grading"], price: 2500 },
  { id: 2, name: "Ananya Gupta", role: "Designer", bio: "Thumbnails and channel branding specialist", skills: ["Figma", "Photoshop", "Illustration"], price: 1800 },
  { id: 3, name: "Rohan Verma", role: "Content Manager", bio: "End-to-end campaign coordination and analytics", skills: ["Scheduling", "Analytics", "Copywriting"], price: 3200 },
  { id: 4, name: "Meera Iyer", role: "Motion Graphics", bio: "Animated intros and transitions for creators", skills: ["AE", "Cinema4D", "SFX"], price: 2800 },
];

const ChatBox = ({ name }: { name: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState("");
  return (
    <div className="space-y-3">
      <div className="glass-card p-3 rounded-lg max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Start a conversation with {name}</p>
        ) : (
          <div className="space-y-2">
            {messages.map((m, i) => (
              <div key={i} className="text-sm text-foreground">
                {m}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={() => { if (text.trim()) { setMessages((prev) => [...prev, text.trim()]); setText(""); } }} className="neon-glow">Send</Button>
      </div>
    </div>
  );
};

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Marketplace 🛒</h1>
          <p className="text-muted-foreground">Discover freelancers to power your content</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f, idx) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.05 }}>
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-background" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{f.name}</CardTitle>
                      <CardDescription>{f.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-3">{f.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {f.skills.map((s) => (
                      <span key={s} className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10">{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Starting at</span>
                    <span className="text-xl font-bold text-secondary">₹{f.price.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/10">
                        <DialogHeader>
                          <DialogTitle>Chat with {f.name}</DialogTitle>
                          <DialogDescription>Discuss scope, timelines, and pricing</DialogDescription>
                        </DialogHeader>
                        <ChatBox name={f.name} />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline">Hire</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Marketplace;

