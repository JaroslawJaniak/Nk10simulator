import { generateDiceRolls } from './generateDiceRolls';

export function simulateDiceRolls(
  numberOfSimulations: number,
  numberOfDice: number,
  min: number,
  max: number,
): number[][] {
  let simulationResults: number[][] = [];

  for (let i = 0; i < numberOfSimulations; i++) {
    simulationResults.push(generateDiceRolls(numberOfDice, min, max));
  }

  return simulationResults; // Zwracamy tablicę z wynikami symulacji rzutów kośćmi
}
