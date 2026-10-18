import { isSuccessfulRollStrict } from "./isSuccessfulRollStrict";

export function howManySuccessfulRollsStrict(
  simulateRolls: number[][],
  targetValue: number,
  numberOfSuccesses: number,
): number {
  // Funkcja zliczająca liczbę udanych rzutów
  const successfulRolls = simulateRolls.filter((rolls) =>
    isSuccessfulRollStrict(rolls, targetValue, numberOfSuccesses),
  ); // Filtrujemy rzuty, które są udane
  return successfulRolls.length;
}
