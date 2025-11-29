import { useEffect, useState } from "react";
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
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(roles[0].value);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    if (m === "login") setMode("login");
  }, []);

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const canContinue = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      role.trim() !== "" &&
      username.trim() !== "" &&
      password.trim() !== ""
    );
  };

  const finish = async () => {
    const profile = { name, phone, email, role, platforms: selectedPlatforms, username };
    try { localStorage.setItem("creatorProfile", JSON.stringify(profile)); } catch {}
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, phone, role, platforms: selectedPlatforms, username } } });
      if (error && !error.message.toLowerCase().includes("already")) throw error;
      const userId = data?.user?.id || null;
      if (userId) {
        await supabase.from("profiles").upsert({ user_id: userId, name, phone, email, role, platforms: selectedPlatforms, username }, { onConflict: "user_id" });
      }
    } catch {}
    try { localStorage.setItem("creatorAuth", JSON.stringify({ username, password, loggedIn: false })); } catch {}
    setMode("login");
    setStep(1);
  };

  const login = async () => {
    setError("");
    try {
      let ok = false;
      try {
        let emailToUse = loginUsername;
        if (!/^[^@]+@[^@]+$/.test(loginUsername)) {
          const { data: rows } = await supabase.from("profiles").select("email").eq("username", loginUsername).limit(1);
          emailToUse = rows?.[0]?.email || loginUsername;
        }
        const { error } = await supabase.auth.signInWithPassword({ email: emailToUse, password: loginPassword });
        if (error) throw error;
        ok = true;
      } catch (_se) {
        const raw = localStorage.getItem("creatorAuth");
        if (raw) {
          const a = JSON.parse(raw);
          if (a.username === loginUsername && a.password === loginPassword) ok = true;
        }
      }
      if (ok) {
        const raw = localStorage.getItem("creatorAuth");
        const a = raw ? JSON.parse(raw) : { username: loginUsername, password: loginPassword };
        localStorage.setItem("creatorAuth", JSON.stringify({ ...a, loggedIn: true }));
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("An error occurred");
    }
  };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mt-16 p-8 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-6 flex items-center gap-3">
              <Button variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>Sign Up</Button>
              <Button variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>Login</Button>
            </div>

            {mode === "signup" && step === 1 && (
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
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" />
                </div>
                <div className="pt-2 flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!canContinue()} className="neon-glow">Continue</Button>
                </div>
              </div>
            )}

            {mode === "signup" && step === 2 && (
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

            {mode === "login" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="l-username">Username</Label>
                  <Input id="l-username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} placeholder="Your username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="l-password">Password</Label>
                  <Input id="l-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Your password" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="pt-2 flex justify-end">
                  <Button onClick={login} className="neon-glow">Login</Button>
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

