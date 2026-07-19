import { wheelPrizes } from '../data/admissionsFlowData';

export function selectWeightedPrize() {
  const total = wheelPrizes.reduce((sum, prize) => sum + prize.weight, 0);
  let random = Math.random() * total;
  for (const prize of wheelPrizes) {
    random -= prize.weight;
    if (random <= 0) return prize;
  }
  return wheelPrizes[0];
}
