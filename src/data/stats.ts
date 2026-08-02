export interface Stat {
  value: string;
  label: string;
}

// Highlight numbers the AI may surface as a [[ui:stat]] card. Single source of
// truth — the prompt advertises these and the parser validates against them.
export const STATS: Stat[] = [
  { value: "55,000+", label: "patients on the Raaz platform" },
  { value: "35,000+", label: "monthly active users" },
  { value: "200,000+", label: "calls/month handled" },
  { value: "120+", label: "orders/day across app, web & WhatsApp" },
  { value: "46%", label: "paid-ad attribution lift" },
  { value: "70%", label: "less consultation prep time" },
  { value: "40%", label: "faster GIS detection" },
  { value: "50%", label: "fraud losses cut at SuperPe" },
  { value: "50,000+", label: "transactions/day" },
];
