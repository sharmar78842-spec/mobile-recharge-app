import { useState, useEffect } from "react";
import { Search, Clock, Smartphone, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRechargeHistory } from "../hooks/useQueries";
import type { Recharge } from "../backend.d";

function RechargeCard({ recharge, index }: { recharge: Recharge; index: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(t);
  }, [index]);

  const date = new Date(Number(recharge.date) / 1_000_000); // nanoseconds → ms
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const opColorClass =
    recharge.operator === "Airtel"
      ? "op-airtel"
      : recharge.operator === "Jio"
        ? "op-jio"
        : recharge.operator === "Vi"
          ? "op-vi"
          : "op-bsnl";

  const opIcon =
    recharge.operator === "Airtel"
      ? "🔴"
      : recharge.operator === "Jio"
        ? "🔵"
        : recharge.operator === "Vi"
          ? "🟣"
          : "🟢";

  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 space-y-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-base ${opColorClass}`}
          >
            {opIcon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-foreground text-lg">
                ₹{recharge.amount.toString()}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${opColorClass}`}
              >
                {recharge.operator}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
              {recharge.planName}
            </p>
          </div>
        </div>
        <Badge className="shrink-0 bg-success/15 text-success border-success/30 text-xs font-semibold capitalize">
          ✓ {recharge.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
        <div className="flex items-center gap-1.5">
          <Smartphone className="h-3.5 w-3.5" />
          <span className="font-mono">{recharge.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {formattedDate} · {formattedTime}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Validity: <span className="text-foreground font-medium">{recharge.validity}</span>
        </span>
        <span className="font-mono text-muted-foreground">#{recharge.id.toString()}</span>
      </div>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg bg-muted" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24 bg-muted" />
              <Skeleton className="h-3 w-40 bg-muted" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full bg-muted" />
          </div>
          <Skeleton className="h-3 w-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function HistoryPage() {
  const [searchPhone, setSearchPhone] = useState("");
  const [queryPhone, setQueryPhone] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const { data: history, isLoading, isFetching, refetch } = useGetRechargeHistory(queryPhone);

  function handleSearch() {
    if (/^\d{10}$/.test(searchPhone)) {
      setQueryPhone(searchPhone);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  const isPhoneValid = /^\d{10}$/.test(searchPhone);
  const hasSearched = queryPhone.length === 10;
  const isEmpty = hasSearched && !isLoading && !isFetching && (!history || history.length === 0);

  return (
    <div
      className={`space-y-5 pb-6 transition-all duration-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
          <Clock className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent tracking-wide">Recharge History</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Past Recharges</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all your recharge transactions</p>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={handleKeyDown}
              placeholder="Enter 10-digit mobile number"
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/60 h-11 text-base"
              autoComplete="tel"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={!isPhoneValid || isFetching}
            className="h-11 px-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
          >
            {isFetching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        {searchPhone.length > 0 && searchPhone.length < 10 && (
          <p className="text-xs text-destructive">{10 - searchPhone.length} more digits needed</p>
        )}
      </div>

      {/* Results */}
      {!hasSearched ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl border border-border bg-muted/30 flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display font-semibold text-foreground">Search Your History</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-[220px]">
            Enter a mobile number above to view recharge history
          </p>
        </div>
      ) : isLoading || isFetching ? (
        <HistorySkeleton />
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl border border-border bg-muted/30 flex items-center justify-center mb-4">
            <Clock className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-display font-semibold text-foreground">No Recharges Found</p>
          <p className="text-sm text-muted-foreground mt-1">
            No recharge history for{" "}
            <span className="font-mono text-foreground">{queryPhone}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{history?.length}</span> recharge
              {history && history.length !== 1 ? "s" : ""} found for{" "}
              <span className="font-mono text-primary">{queryPhone}</span>
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          {history?.map((r, i) => (
            <RechargeCard key={r.id.toString()} recharge={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
