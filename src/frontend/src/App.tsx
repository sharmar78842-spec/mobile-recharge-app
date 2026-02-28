import { useState } from "react";
import { Zap, Clock } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { RechargePage } from "./pages/RechargePage";
import { HistoryPage } from "./pages/HistoryPage";

type Tab = "recharge" | "history";

const TABS: { id: Tab; label: string; Icon: typeof Zap }[] = [
  { id: "recharge", label: "Recharge", Icon: Zap },
  { id: "history", label: "History", Icon: Clock },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("recharge");

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              QuickCharge
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1 border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Demo Mode
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-md px-4 pt-5">
        {activeTab === "recharge" ? <RechargePage /> : <HistoryPage />}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto max-w-md flex">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                activeTab === id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === id && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full bg-primary glow-teal-sm" />
              )}
              <Icon className="h-5 w-5" />
              <span className="font-display tracking-wide">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-3 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster
        toastOptions={{
          style: {
            background: "oklch(0.18 0.028 260)",
            border: "1px solid oklch(0.28 0.03 260)",
            color: "oklch(0.96 0.008 240)",
          },
        }}
      />
    </div>
  );
}
