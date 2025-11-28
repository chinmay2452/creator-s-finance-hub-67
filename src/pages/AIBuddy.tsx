import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Send, Mic, TrendingUp, DollarSign, Clock, Target } from "lucide-react";
import { useState } from "react";

const suggestions = [
  { icon: DollarSign, text: "Show my income summary", color: "text-primary" },
  { icon: TrendingUp, text: "Predict next month earnings", color: "text-secondary" },
  { icon: Clock, text: "Pending payments?", color: "text-accent" },
  { icon: Target, text: "Can I afford a new camera?", color: "text-primary" },
];

const initialMessages = [
  {
    role: "assistant",
    content: "Hey Creator! 👋 I'm your AI Money Buddy. I can help you track earnings, predict income, and make smart financial decisions. What would you like to know?",
    timestamp: "10:30 AM"
  },
];

const AIBuddy = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        role: "assistant",
        content: "Based on your current earnings trajectory and historical data, I predict your income for next month will be around $28,450 with a confidence of 94%. This represents a 24.5% increase from this month! 📈",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    handleSend();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 mt-16 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            AI Money Buddy 🤖
          </h1>
          <p className="text-muted-foreground">Your intelligent financial assistant</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card h-[calc(100vh-250px)] flex flex-col">
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-primary to-secondary text-background'
                            : 'glass-card'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-background/70' : 'text-muted-foreground'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="glass-card rounded-2xl px-4 py-3">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>

                {/* Suggestion Chips */}
                {messages.length === initialMessages.length && (
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          onClick={() => handleSuggestion(suggestion.text)}
                          className="glass-card px-4 py-2 rounded-full text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
                        >
                          <suggestion.icon className={`w-4 h-4 ${suggestion.color}`} />
                          {suggestion.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-6 border-t border-border">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ask me anything about your finances..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-background/50"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="shrink-0"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSend}
                      className="shrink-0 bg-gradient-to-r from-primary to-secondary"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Quick Insights Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Insights 💡</h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-foreground">Total Balance</p>
                      <p className="text-2xl font-bold text-primary">$45,231</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                      <p className="text-sm font-medium text-foreground">This Month</p>
                      <p className="text-2xl font-bold text-secondary">$12,450</p>
                    </div>
                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <p className="text-sm font-medium text-foreground">Pending</p>
                      <p className="text-2xl font-bold text-accent">$3,280</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Active Goals</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">New Camera</span>
                          <span className="text-sm text-secondary">41%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Editor Budget</span>
                          <span className="text-sm text-primary">68%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIBuddy;
