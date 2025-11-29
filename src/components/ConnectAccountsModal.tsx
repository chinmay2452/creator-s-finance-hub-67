import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const platformMap: Record<string, { name: string; icon: string; color: string }> = {
  youtube: { name: "YouTube", icon: "🎥", color: "from-red-500 to-red-600" },
  instagram: { name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-600" },
  tiktok: { name: "TikTok", icon: "🎵", color: "from-gray-900 to-gray-700" },
  snapchat: { name: "Snapchat", icon: "👻", color: "from-yellow-400 to-yellow-500" },
  facebook: { name: "Facebook", icon: "📘", color: "from-blue-600 to-blue-700" },
  linkedin: { name: "LinkedIn", icon: "💼", color: "from-blue-700 to-blue-800" },
  x: { name: "X", icon: "✖️", color: "from-black to-gray-700" },
};

type FormState = {
  username?: string;
  email?: string;
  password?: string;
  channelId?: string;
  clientId?: string;
  keyId?: string;
  keySecret?: string;
};

export const ConnectAccountsModal = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [submitting, setSubmitting] = useState(false);
  const platforms = useMemo(() => {
    try {
      const p = JSON.parse(localStorage.getItem("creatorProfile") || "{}");
      const picked: string[] = Array.isArray(p.platforms) ? p.platforms : [];
      const list = picked.map((key) => platformMap[key]).filter(Boolean);
      return list.length ? list : [platformMap.youtube, platformMap.instagram];
    } catch {
      return [platformMap.youtube, platformMap.instagram];
    }
  }, []);

  const displayFields = useMemo(() => {
    switch (selected) {
      case "YouTube":
        return [
          { key: "email", label: "Email or Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
          { key: "channelId", label: "Channel ID (optional)", type: "text", required: false },
        ];
      case "Instagram":
        return [
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ];
      case "TikTok":
        return [
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ];
      case "X":
        return [
          { key: "username", label: "Handle", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ];
      case "Snapchat":
        return [
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ];
      case "Facebook":
        return [
          { key: "email", label: "Email", type: "email", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ];
      case "LinkedIn":
        return [
          { key: "email", label: "Email", type: "email", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ];
      case "Razorpay":
        return [
          { key: "keyId", label: "Key ID", type: "text", required: true },
          { key: "keySecret", label: "Key Secret", type: "password", required: true },
        ];
      case "PayPal":
        return [
          { key: "email", label: "Account Email", type: "email", required: true },
          { key: "clientId", label: "Client ID", type: "text", required: true },
        ];
      default:
        return [];
    }
  }, [selected]);

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setForm({});
      setSubmitting(false);
    }
  }, [open]);

  const handleSelect = (name: string) => {
    setSelected(name);
  };

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selected) return;
    const requiredMissing = displayFields.some((f) => f.required && !String(form[f.key as keyof FormState] || "").trim());
    if (requiredMissing) {
      toast({ title: "Missing required fields", description: "Please fill in all required details." });
      return;
    }
    setSubmitting(true);
    try {
      const displayName = (form.username || form.email || selected) as string;
      const existingRaw = localStorage.getItem("linkedAccounts");
      const existing = existingRaw ? (JSON.parse(existingRaw) as Array<{ platform: string; accountId: string; displayName: string }>) : [];
      const accountId = `${selected.toLowerCase()}-${Date.now()}`;
      const next = existing
        .filter((a) => a.platform !== selected)
        .concat([{ platform: selected, accountId, displayName }]);
      localStorage.setItem("linkedAccounts", JSON.stringify(next));
      toast({ title: `${selected} connected`, description: `${displayName} linked successfully.` });
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="neon-glow">
          Connect Accounts
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Connect Your Accounts</DialogTitle>
          <DialogDescription>Link your income sources to track everything in one place</DialogDescription>
        </DialogHeader>

        <AnimatePresence initial={false} mode="wait">
          {!selected ? (
            <motion.div
              key="platforms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4 mt-4"
            >
              {platforms.map((platform, index) => (
                <motion.div key={platform.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Button
                    onClick={() => handleSelect(platform.name)}
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center text-2xl`}>
                      {platform.icon}
                    </div>
                    <span className="font-medium">{platform.name}</span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Linking</span>
                  <span className="font-semibold">{selected}</span>
                </div>
                <Button variant="ghost" onClick={() => setSelected(null)}>Back</Button>
              </div>
              <div className="space-y-3">
                {displayFields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label>{f.label}</Label>
                    <Input
                      type={f.type as string}
                      value={String(form[f.key as keyof FormState] || "")}
                      onChange={(e) => handleChange(f.key as keyof FormState, e.target.value)}
                      placeholder={f.label}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleSubmit} disabled={submitting} className="bg-gradient-to-r from-primary to-secondary">
                  {submitting ? "Connecting..." : "Connect"}
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
