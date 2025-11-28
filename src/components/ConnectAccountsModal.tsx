import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const platforms = [
  { name: "YouTube", icon: "🎥", color: "from-red-500 to-red-600" },
  { name: "Instagram", icon: "📸", color: "from-pink-500 to-purple-600" },
  { name: "Razorpay", icon: "💳", color: "from-blue-500 to-blue-600" },
  { name: "PayPal", icon: "💰", color: "from-blue-400 to-blue-500" },
];

export const ConnectAccountsModal = () => {
  const [open, setOpen] = useState(false);

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
          <DialogDescription>
            Link your income sources to track everything in one place
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
