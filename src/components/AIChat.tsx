import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary neon-glow flex items-center justify-center animate-float"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bot className="w-6 h-6 text-background" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <div className="glass-card rounded-2xl p-4 neon-glow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Money Buddy</h3>
                    <p className="text-xs text-muted-foreground">Always here to help 🤖</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                <div className="glass-card p-3 rounded-lg">
                  <p className="text-sm text-foreground">
                    Hey! 👋 I'm your AI Money Buddy. I can help you:
                  </p>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Track your income sources</li>
                    <li>• Forecast future earnings</li>
                    <li>• Optimize your financial strategy</li>
                    <li>• Answer money questions</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-background/50"
                />
                <Button size="icon" className="neon-glow">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
