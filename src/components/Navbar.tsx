import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Navbar = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-white/10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
            <span className="text-lg font-bold text-background">F</span>
          </div>
          <h1 className="text-xl font-bold text-gradient">FundFluence</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative hover:bg-white/10"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-foreground" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse-glow"></span>
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <User className="w-4 h-4 text-background" />
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
};
