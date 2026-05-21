export const SEVERITY = {
  MILD: "Mild",
  MODERATE: "Moderate",
  SEVERE: "Severe",
} as const;

export type Severity = typeof SEVERITY[keyof typeof SEVERITY];