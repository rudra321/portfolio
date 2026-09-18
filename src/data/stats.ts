export interface Stat {
  value: string;
  label: string;
}

// Canonical floors for numbers that keep growing. Bump a value here and every
// mention updates with it — site prose, chat knowledge, and stat cards all
// template from this object. Values are bare floors; add "+" at use sites.
export const METRICS = {
  patients: "55,000",
  mau: "35,000",
  callsPerMonth: "200,000",
  ordersPerDay: "120",
} as const;

// Highlight numbers the AI may surface as a [[ui:stat]] card. Single source of
// truth — the prompt advertises these and the parser validates against them.
export const STATS: Stat[] = [
  { value: `${METRICS.patients}+`, label: "patients on the Raaz platform" },
  { value: `${METRICS.mau}+`, label: "monthly active users" },
  { value: `${METRICS.callsPerMonth}+`, label: "calls/month handled" },
  { value: `${METRICS.ordersPerDay}+`, label: "orders/day across app, web & WhatsApp" },
  { value: "46%", label: "paid-ad attribution lift" },
  { value: "10-15 min", label: "consultation prep, down from 30" },
  { value: "40%", label: "faster GIS detection" },
];
