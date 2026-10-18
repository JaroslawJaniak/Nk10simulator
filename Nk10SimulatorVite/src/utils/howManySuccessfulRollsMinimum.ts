import { isSuccessfulRollMinimum } from './isSuccessfulRollMinimum';

export function howManySuccessfulRollsMinimum(
  simulateRolls: number[][],
  targetValue: number,
  numberOfSuccesses: number,
): number {
  // Funkcja zliczająca liczbę udanych rzutów
  const successfulRolls = simulateRolls.filter((rolls) =>
    isSuccessfulRollMinimum(rolls, targetValue, numberOfSuccesses),
  ); // Filtrujemy rzuty, które są udane
  return successfulRolls.length;
}
