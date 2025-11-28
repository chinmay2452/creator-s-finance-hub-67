import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Send, Mic, TrendingUp, DollarSign, Clock, Target } from "lucide-react";
import { useState } from "react";
import { askGemini } from "@/agents/GeminiClient.ts";
import { MockDataProvider } from "@/tools/MockDataProvider";

const suggestions = [
  { icon: DollarSign, text: "Show my income summary", color: "text-primary" },
  { icon: TrendingUp, text: "Predict next month earnings", color: "text-secondary" },
  { icon: Clock, text: "Pending payments?", color: "text-accent" },
  { icon: Target, text: "Can I afford a new camera?", color: "text-primary" },
];

const initialMessages = [
  {
    role: "assistant",
    content: "Hey Creator! 👋 I'm your AI Money Buddy. I can help track earnings, predict income, and make smart financial decisions. What would you like to know?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  },
];

const AIBuddy = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const mock = new MockDataProvider();
      const incomeData = mock.getIncomeData();

      const aiText = await askGemini(input, incomeData);

      const aiResponse = {
        role: "assistant",
        content: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong while thinking. Try again!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    setIsTyping(false);
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Money Buddy 🤖</h1>
          <p className="text-muted-foreground">Your intelligent financial assistant</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="glass-card h-[calc(100vh-250px)] flex flex-col">
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary to-secondary text-background"
                          : "glass-card"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs mt-1 text-muted-foreground">{msg.timestamp}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="glass-card rounded-2xl px-4 py-3 flex gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </CardContent>

              {messages.length === 1 && (
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        onClick={() => handleSuggestion(s.text)}
                        className="glass-card px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-primary/10"
                      >
                        <s.icon className={`w-4 h-4 ${s.color}`} />
                        {s.text}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-border">
                <div className="flex gap-3">
                  <Input
                    placeholder="Ask me anything about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-background/50"
                  />

                  <Button size="icon" variant="outline">
                    <Mic className="w-4 h-4" />
                  </Button>

                  <Button onClick={handleSend} className="bg-gradient-to-r from-primary to-secondary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIBuddy;