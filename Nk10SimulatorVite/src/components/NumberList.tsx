import React from "react";
import { useState } from "react";
import { useEffect } from "react";

interface NumberListProps {}

const NumberList: React.FC<NumberListProps> = () => {
  const [min, setMin] = useState<number>(1); // Minimalna liczba
  const [max, setMax] = useState<number>(49); // Maksymalna liczba
  const [size, setSize] = useState<number>(6); // Rozmiar listy
  const [betsSize, setBetsSize] = useState<number>(10000); // Rozmiar zakładu
  const [numbers, setNumbers] = useState<number[]>(
    generateRandomList(size, min, max),
  ); // Generowanie losowej listy bazowej (przykładowo liczby od 1 do 10)

  const [k10min, setK10Min] = useState<number>(1); // Minimalna liczba kości k10
  const [k10max, setK10Max] = useState<number>(10); // Maksymalna liczba kości k10
  const [numberOfDice, setNumberOfDice] = useState<number>(3); // Liczba kości
  const [testDificultyValue, setTestDificultyValue] = useState<number>(5); // Trudność testu

  function isSuccessfulRoll(
    rolls: number[],
    targetValue: number,
    numberOfSuccesses: number,
  ): boolean {
    // Funkcja sprawdzająca, czy rzut pulą kości jest udany
    const successfulRolls = rolls.filter((roll) => roll >= targetValue); // Filtrujemy rzuty, które są większe lub równe wartości docelowej
    return successfulRolls.length >= numberOfSuccesses; // Zwracamy true, jeśli istnieje przynajmniej jeden udany rzut, w przeciwnym razie false ew ustalamy liczbe udanych rzutów, które muszą być większe lub równe wartości docelowej
  }

  function howManySuccessfulRolls(
    simulateRolls: number[][],
    targetValue: number,
    numberOfSuccesses: number,
  ): number {
    // Funkcja zliczająca liczbę udanych rzutów
    const successfulRolls = simulateRolls.filter((rolls) =>
      isSuccessfulRoll(rolls, targetValue, numberOfSuccesses),
    ); // Filtrujemy rzuty, które są udane
    return successfulRolls.length;
  }

  

  function generateDiceRolls(
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

  function simulateDiceRolls(
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

  const diceRolls4k10 = simulateDiceRolls(1000, 4, 1, 10); // Symulacja 10 rzutów pulą 4 kości k10
  const diceRolls3k10 = simulateDiceRolls(1000, 3, 1, 10); // Symulacja 10 rzutów pulą 3 kości k10
  const diceRolls2k10 = simulateDiceRolls(1000, 2, 1, 10); // Symulacja 10 rzutów pulą 2 kości k10
  const diceRolls1k10 = simulateDiceRolls(1000, 1, 1, 10); // Symulacja 10 rzutów pulą 1 kości k10

  function generateRandomList(
    size: number,
    min: number,
    max: number,
  ): number[] {
    let numbers = new Set<number>();
    while (numbers.size < size) {
      numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(numbers);
  }
  // const [numbers, setNumbers] = useState<number[]>(generateRandomList(6, 1, 49)); // Generowanie losowej listy bazowej (przykładowo liczby od 1 do 10)
  //setNumbers(generateRandomList(6, 1, 49)); // Generowanie losowej listy bazowej (przykładowo liczby od 1 do 10)

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNumbers(generateRandomList(6, 1, 49)); // Generowanie losowej listy bazowej (przykładowo liczby od 1 do 10)
  //   }, 100000); // co 10 sekundę

  //   return () => clearInterval(interval); // czyszczenie interwału po odmontowaniu komponentu
  // }, []);

  function generateBetsList(betsSize: number) {
    let betList: number[][] = []; // Lista do przechowywania zakładów
    for (let i = 0; i < betsSize; i++) {
      betList.push(generateRandomList(size, min, max)); // Dodajemy nowy zakład do listy,zakład jest generowany za pomocą funkcji generateRandomList
    }
    return betList;
  }

  const betsList = generateBetsList(betsSize); // Generowanie zakładów
  //console.log(betsList); // Wyświetlenie zakładów w konsoli

  function countCommonNumbers(list1: number[], list2: number[]) {
    // Funkcja zliczająca wspólne liczby w dwóch listach
    let set1 = new Set(list1);
    let set2 = new Set(list2);
    let commonCount = 0;

    set1.forEach((num) => {
      if (set2.has(num)) {
        commonCount++;
      }
    });

    return commonCount;
  }

  const howManyMultipltes = (baseNumbers: number[]) => {
    let result: number[] = []; // Tablica do przechowywania wyników
    betsList.forEach((bet) => {
      let commonCount = countCommonNumbers(bet, baseNumbers);
      result.push(commonCount); // Dodajemy wynik do tablicy
    });
    return result;
  };

  const numberOfWinningBets = (baseNumbers: number[]) => {
    let result: number = 0;

    for (let i = 3; i <= baseNumbers.length; i++) {
      result += howManyMultipltes(baseNumbers).filter(
        (count) => count === i,
      ).length;
    }

    return result;
  };
  const totalReward = (baseNumbers: number[]) => {
    let reward: number = 0;

    for (let i = 3; i <= baseNumbers.length; i++) {
      if (i === 3) {
        reward +=
          howManyMultipltes(baseNumbers).filter((count) => count === i).length *
          10;
      } else if (i === 4) {
        reward +=
          howManyMultipltes(baseNumbers).filter((count) => count === i).length *
          100;
      } else if (i === 5) {
        reward +=
          howManyMultipltes(baseNumbers).filter((count) => count === i).length *
          3500;
      } else if (i === 6) {
        reward +=
          howManyMultipltes(baseNumbers).filter((count) => count === i).length *
          2000000;
      }
    }

    return reward;
  };

  // Obliczenie liczby wartości występujących dokładnie 3 razy
  //let result = countExactTriplets(baseList);
  //console.log("Liczba ciągów o dokładnie 3 takich samych liczbach:", result);

  return (
    <>
      <div className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-900">
        <h1>Generator rzutów kośćmi</h1>

        <h2>Otrzymane wyniki: </h2>
        <h2>{isSuccessfulRoll([6, 7, 1], 5, 3) ? "Tak" : "Nie"}</h2>

        {/* <h2>
          {diceRolls.map(
            (rolls: number[], index: React.Key | null | undefined) => (
              <div key={index} style={{ marginRight: "8px" }}>
                {rolls.join(", ")}
              </div>
            ),
          )}
        </h2> */}

        <h2>----------------------------------------------</h2>
        <h2>test 4k10/5/3min: </h2>
        <h2>
          Liczba udanych rzutów/do wszystkich rzutów:{" "}
          {howManySuccessfulRolls(diceRolls4k10, testDificultyValue, 4) /
            diceRolls4k10.length}
        </h2>
        <h2>
          Liczba udanych rzutów:{" "}
          {howManySuccessfulRolls(diceRolls4k10, testDificultyValue, 4)}
        </h2>
        <h2>----------------------------------------------</h2>
        <h2>test 3k10/5/3min: </h2>
        <h2>
          Liczba udanych rzutów/do wszystkich rzutów:{" "}
          {howManySuccessfulRolls(diceRolls3k10, testDificultyValue, 3) /
            diceRolls3k10.length}
        </h2>
        <h2>
          Liczba udanych rzutów:{" "}
          {howManySuccessfulRolls(diceRolls3k10, testDificultyValue, 3)}
        </h2>

        <h2>----------------------------------------------</h2>
        <h2>test 2k10/5/3min: </h2>
        <h2>
          Liczba udanych rzutów/do wszystkich rzutów:{" "}
          {howManySuccessfulRolls(diceRolls2k10, testDificultyValue, 1) /
            diceRolls2k10.length}
        </h2>
        <h2>
          Liczba udanych rzutów:{" "}
          {howManySuccessfulRolls(diceRolls2k10, testDificultyValue, 1)}
        </h2>

        <h2>----------------------------------------------</h2>
        <h2>test 1k10/5/1min: </h2>
        <h2>
          Liczba udanych rzutów/do wszystkich rzutów:{" "}
          {howManySuccessfulRolls(diceRolls1k10, testDificultyValue, 1) /
            diceRolls1k10.length}
        </h2>
        <h2>
          Liczba udanych rzutów:{" "}
          {howManySuccessfulRolls(diceRolls1k10, testDificultyValue, 1)}
        </h2>
      </div>
      <form>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Country
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="street-address"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    id="street-address"
                    name="street-address"
                    type="text"
                    autoComplete="street-address"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="region"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    id="region"
                    name="region"
                    type="text"
                    autoComplete="address-level1"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    id="postal-code"
                    name="postal-code"
                    type="text"
                    autoComplete="postal-code"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-900">
        <h1>Generator zakładów Lotto</h1>
        <h2>
          - <span>{size}</span> liczb z zakresu od <span>{min}</span> do{" "}
          <span>{max}</span> -
        </h2>
        <h2>Wylosowane liczby: </h2>
        <h2>
          {numbers.map((num: number, index: React.Key | null | undefined) => (
            <span key={index} style={{ marginRight: "8px" }}>
              {num}
            </span>
          ))}
        </h2>
        <button onClick={() => setNumbers(generateRandomList(size, min, max))}>
          Generuj nowe liczby
        </button>
        <h2>Liczba zakładów: {betsList.length}</h2>
        <h3>Pierwszy zakład</h3>
        <div>
          {betsList[0].map(
            (num: number, index: React.Key | null | undefined) => (
              <span key={index} style={{ marginRight: "8px" }}>
                {num}
              </span>
            ),
          )}
        </div>
        <h2>Liczba wygranych zakładów: {numberOfWinningBets(numbers)}</h2>
        <h2>
          Ratio: {(numberOfWinningBets(numbers) / betsList.length).toFixed(2)}
        </h2>
        <h3>Koszt:</h3>
        <span style={{ fontWeight: "bold" }}>{betsList.length * 3}PLN</span>
        <h3>Wygrana:</h3>
        <span style={{ fontWeight: "bold" }}>{totalReward(numbers)}PLN</span>
        <h2>
          Ratio wygranej:{" "}
          {Number((totalReward(numbers) / (betsList.length * 3)).toFixed(2)) *
            100}
          % wkładu
        </h2>
        <h2>Wyniki - 3/6:</h2>{" "}
        <span style={{ fontWeight: "bold" }}>
          {
            howManyMultipltes(numbers).filter((count) => count === 3).length
          }{" "}
        </span>
        <div hidden={true}>
          {howManyMultipltes(numbers).map(
            (count: number, index: React.Key | null | undefined) =>
              count === 3 ? (
                <span key={index} style={{ marginRight: "8px" }}>
                  Zakład {typeof index === "number" ? index + 1 : 1}: {count}
                </span>
              ) : null,
          )}
        </div>
        <h2>Wyniki - 4/6:</h2>
        <span style={{ fontWeight: "bold" }}>
          {
            howManyMultipltes(numbers).filter((count) => count === 4).length
          }{" "}
        </span>
        <div hidden={true}>
          {howManyMultipltes(numbers).map(
            (count: number, index: React.Key | null | undefined) =>
              count === 4 ? (
                <span key={index} style={{ marginRight: "8px" }}>
                  Zakład {typeof index === "number" ? index + 1 : 1}: {count}
                </span>
              ) : null,
          )}
        </div>
        <h2>Wyniki - 5/6:</h2>
        <span style={{ fontWeight: "bold" }}>
          {
            howManyMultipltes(numbers).filter((count) => count === 5).length
          }{" "}
        </span>
        <div>
          {howManyMultipltes(numbers).map(
            (count: number, index: React.Key | null | undefined) =>
              count === 5 ? (
                <span key={index} style={{ marginRight: "8px" }}>
                  Zakład {typeof index === "number" ? index + 1 : 1}: {count}
                </span>
              ) : null,
          )}
        </div>
        <h2>Wyniki - 6/6:</h2>
        <span style={{ fontWeight: "bold" }}>
          {
            howManyMultipltes(numbers).filter((count) => count === 6).length
          }{" "}
        </span>
        <div>
          {howManyMultipltes(numbers).map(
            (count: number, index: React.Key | null | undefined) =>
              count === 6 ? (
                <span key={index} style={{ marginRight: "8px" }}>
                  Zakład {typeof index === "number" ? index + 1 : 1}: {count}
                </span>
              ) : null,
          )}
        </div>
      </div>
      {/* <div>
        {betsList.map((bet: number[], index: React.Key | null | undefined) => (
          <div key={index} style={{ marginRight: "8px" }}>
            {" "}
            <span style={{ fontWeight: "bold" }}>
              Zakład {typeof index === "number" ? index + 1 : 1}:{" "}
            </span>
            {bet.map((num: number, index: React.Key | null | undefined) => (
              <span key={index} style={{ marginRight: "8px" }}>
                {num}
              </span>
            ))}
          </div>
        ))}
      </div> */}
    </>
  );
};

export default NumberList;
