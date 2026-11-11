/**
 * Reusable formatting helpers for learning duration and metrics
 */

export function formatMinutesToHours(totalMinutes: number): string {
  const safeMins = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMins / 60);
  const mins = safeMins % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
