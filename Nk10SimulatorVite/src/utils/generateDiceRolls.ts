export function generateDiceRolls(
  numberOfDice: number,
  min: number,
  max: number,
): number[] {
  // Funkcja generująca losowe rzuty w puli kości np 3 kości k10 to  numberOfDice=3, min=1, max=10, jedna pula to 3 rzuty kością k10, czyli np [3, 7, 1]
  let rolls: number[] = [];

  for (let i = 0; i < numberOfDice; i++) {
    rolls.push(Math.floor(Math.random() * (max - min + 1)) + min); // Generujemy losowy rzut kością i dodajemy go do tablicy
  }

  return rolls; // Zwracamy tablicę z wynikami rzutów
}
