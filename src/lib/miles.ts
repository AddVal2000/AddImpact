export function calculateMiles(transactionAmountKes: number): number {
  return Math.ceil(transactionAmountKes * 0.01);
}
