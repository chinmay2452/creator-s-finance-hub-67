import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

const roles = [
  { value: "influencer", label: "Influencer" },
  { value: "freelance-editor", label: "Freelance Editor" },
  { value: "designer", label: "Designer" }
];

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "snapchat", label: "Snapchat" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X (Twitter)" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
];

const Auth = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>(roles[0].value);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const navigate = useNavigate();

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const canContinue = () => {
    return name.trim() !== "" && email.trim() !== "" && phone.trim() !== "" && role.trim() !== "" && password.trim().length >= 6;
  };

  const finish = async () => {
    const authEmail = email.trim();
    const authPassword = password.trim();
    let userId: string | null = null;
    const signUp = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (signUp.error && signUp.error.message?.toLowerCase().includes("already")) {
      const signIn = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (signIn.error) {
        alert(`Login failed: ${signIn.error.message}`);
        return;
      }
      userId = signIn.data.user?.id || null;
    } else {
      userId = signUp.data.user?.id || null;
    }
    if (!userId) {
      alert("Authentication failed or Supabase not configured. Saving local profile.");
    }
    const profile = { name, phone, email, role, platforms: selectedPlatforms };
    try {
      await supabase.from("profiles").upsert({ user_id: userId, display_name: name, goals: profile }, { onConflict: "user_id" });
    } catch {}
    try {
      localStorage.setItem("creatorProfile", JSON.stringify(profile));
    } catch {}
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mt-16 p-8 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
              <p className="text-muted-foreground">Create your account to continue</p>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canContinue()} className="neon-glow">Continue</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Select your platforms</h2>
                  <p className="text-sm text-muted-foreground">Choose all platforms you use</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((p) => (
                    <label key={p.value} className="flex items-center gap-3 rounded-md border border-white/10 p-3 hover:bg-white/5">
                      <Checkbox checked={selectedPlatforms.includes(p.value)} onCheckedChange={() => togglePlatform(p.value)} />
                      <span className="text-sm text-foreground">{p.label}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={finish} className="neon-glow">Finish</Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Auth;

