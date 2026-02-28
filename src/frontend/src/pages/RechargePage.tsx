import { useState, useEffect } from "react";
import { Loader2, Smartphone, CheckCircle2, Zap, Signal, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { OPERATORS, PLANS, type Plan } from "../data/plans";
import { useSubmitRecharge } from "../hooks/useQueries";

interface RechargeSuccess {
  phoneNumber: string;
  operator: string;
  plan: Plan;
  rechargeId: bigint;
}

function OperatorBtn({
  op,
  selected,
  onClick,
}: {
  op: (typeof OPERATORS)[number];
  selected: boolean;
  onClick: () => void;
}) {
  const colorClass =
    op.value === "Airtel"
      ? "op-airtel"
      : op.value === "Jio"
        ? "op-jio"
        : op.value === "Vi"
          ? "op-vi"
          : "op-bsnl";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? `${colorClass} scale-[1.02] shadow-lg`
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      <span className="text-xl leading-none">{op.icon}</span>
      <span className="font-display text-xs font-semibold tracking-wide">{op.label}</span>
      {selected && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary glow-teal-sm" />
      )}
    </button>
  );
}

function PlanCard({
  plan,
  selected,
  onClick,
}: {
  plan: Plan;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99] ${
        selected
          ? "plan-card-selected bg-primary/5"
          : "border-border bg-card hover:border-border/80 hover:bg-muted/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-xl font-bold text-foreground">
              ₹{plan.amount}
            </span>
            {plan.tag && (
              <Badge
                variant="secondary"
                className={`text-xs font-semibold ${
                  plan.tag === "Best Value"
                    ? "bg-accent/15 text-accent border-accent/30"
                    : "bg-primary/10 text-primary border-primary/30"
                }`}
              >
                {plan.tag}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-snug">{plan.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
            {plan.validity}
          </span>
          {selected && (
            <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
          )}
        </div>
      </div>
    </button>
  );
}

function SuccessScreen({
  data,
  onBack,
}: {
  data: RechargeSuccess;
  onBack: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] px-4 text-center transition-all duration-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDuration: "400ms" }}
    >
      {/* Pulse rings */}
      <div className="relative mb-8">
        <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        <span
          className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-ring"
          style={{ animationDelay: "0.3s" }}
        />
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 border border-primary/40 glow-teal">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Recharge Successful!</h2>
        <p className="text-muted-foreground text-sm">Your number has been recharged.</p>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-left space-y-3 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Mobile</span>
          <span className="font-display font-semibold text-foreground">{data.phoneNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Operator</span>
          <span className="font-display font-semibold text-foreground">{data.operator}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Plan</span>
          <span className="font-display font-semibold text-foreground">₹{data.plan.amount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Validity</span>
          <span className="font-display font-semibold text-foreground">{data.plan.validity}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Txn ID</span>
          <span className="font-mono text-xs text-muted-foreground">#{data.rechargeId.toString()}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-border">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Status</span>
          <Badge className="bg-success/15 text-success border-success/30 text-xs font-semibold">
            ✓ Success
          </Badge>
        </div>
      </div>

      <Button
        onClick={onBack}
        variant="outline"
        className="border-primary/40 text-primary hover:bg-primary/10 hover:text-primary font-semibold"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Recharge Another Number
      </Button>
    </div>
  );
}

export function RechargePage() {
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [successData, setSuccessData] = useState<RechargeSuccess | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const { mutate: submitRecharge, isPending } = useSubmitRecharge();

  const isPhoneValid = /^\d{10}$/.test(phone);
  const canSubmit = isPhoneValid && operator !== "" && selectedPlan !== null;

  function handleSubmit() {
    if (!canSubmit || !selectedPlan || !operator) return;

    submitRecharge(
      {
        phoneNumber: phone,
        operator,
        planName: `₹${selectedPlan.amount} - ${selectedPlan.description}`,
        amount: BigInt(selectedPlan.amount),
        validity: selectedPlan.validity,
      },
      {
        onSuccess: (id) => {
          setSuccessData({
            phoneNumber: phone,
            operator,
            plan: selectedPlan,
            rechargeId: id,
          });
        },
        onError: () => {
          toast.error("Recharge failed. Please try again.");
        },
      }
    );
  }

  function handleReset() {
    setPhone("");
    setOperator("");
    setSelectedPlan(null);
    setSuccessData(null);
  }

  if (successData) {
    return <SuccessScreen data={successData} onBack={handleReset} />;
  }

  return (
    <div
      className={`space-y-6 pb-6 transition-all duration-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">Instant Recharge</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Mobile Recharge
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Fast, secure, and reliable</p>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
          Mobile Number
        </Label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 10-digit mobile number"
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:border-primary/60 h-12 text-base"
            autoComplete="tel"
          />
          {phone.length === 10 && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
          )}
        </div>
        {phone.length > 0 && phone.length < 10 && (
          <p className="text-xs text-destructive">{10 - phone.length} more digits needed</p>
        )}
      </div>

      {/* Operator Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Signal className="h-4 w-4 text-primary" />
          Select Operator
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {OPERATORS.map((op) => (
            <OperatorBtn
              key={op.value}
              op={op}
              selected={operator === op.value}
              onClick={() => setOperator(op.value)}
            />
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Choose a Plan</Label>
        <div className="space-y-2.5">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              onClick={() => setSelectedPlan(plan)}
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <div>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          className="w-full h-12 font-display font-bold text-base tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all duration-200 glow-teal-sm"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : selectedPlan ? (
            `Recharge ₹${selectedPlan.amount} Now`
          ) : (
            "Select a Plan to Continue"
          )}
        </Button>
        {selectedPlan && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            This is a demo app — no real payment will be charged
          </p>
        )}
      </div>
    </div>
  );
}
