export interface Plan {
  id: string;
  amount: number;
  validity: string;
  description: string;
  tag?: string;
}

export const OPERATORS = [
  { value: "Airtel", label: "Airtel", icon: "🔴" },
  { value: "Jio", label: "Jio", icon: "🔵" },
  { value: "Vi", label: "Vi", icon: "🟣" },
  { value: "BSNL", label: "BSNL", icon: "🟢" },
] as const;

export type OperatorValue = (typeof OPERATORS)[number]["value"];

export const PLANS: Plan[] = [
  {
    id: "plan-199",
    amount: 199,
    validity: "28 days",
    description: "Unlimited calls + 1.5GB/day",
    tag: "Popular",
  },
  {
    id: "plan-299",
    amount: 299,
    validity: "28 days",
    description: "Unlimited calls + 2GB/day",
    tag: "Best Value",
  },
  {
    id: "plan-399",
    amount: 399,
    validity: "56 days",
    description: "Unlimited calls + 1.5GB/day",
  },
  {
    id: "plan-599",
    amount: 599,
    validity: "84 days",
    description: "Unlimited calls + 2GB/day",
    tag: "Long Term",
  },
];
