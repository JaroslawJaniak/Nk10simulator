import { useState } from "react";
import { binomialCoefficient } from "../utils/binomialCoefficient";
import { simulateDiceRolls } from "../utils/simulateDiceRolls";
import { howManySuccessfulRollsMinimum } from "../utils/howManySuccessfulRollsMinimum";
import { howManySuccessfulRollsStrict } from "../utils/howManySuccessfulRollsStrict";

type DifficultyButtonProps = {
  handleClick: () => void;
  text: string;
  className: string;
};

function DifficultyButton({
  handleClick,
  text,
  className,
}: DifficultyButtonProps) {
  return (
    <button type="button" onClick={handleClick} className={className}>
      {text}
    </button>
  );
}

const MIN = 1;
const MAX = 10;
const START = 5;

export default function PolaKlikane() {
  // Widoczne jest zawsze 10 pól; zapełnione na starcie 5.
  const [filled, setFilled] = useState(() =>
    // Używamy funkcji inicjalizującej, aby uniknąć ponownego obliczania przy każdym renderowaniu
    Array.from({ length: MAX }, (_, i) => i < START),
  );

  const [difficultyLevel, setDifficultyLevel] = useState(6);

  const [successNumber, setSuccessNumber] = useState(3);

  function updateDifficultyLevel(newDifficultyLevel: number) {
    setDifficultyLevel(Math.max(1, Math.min(10, newDifficultyLevel)));
  }

  function updateSuccessNumber(newSuccessNumber: number) {
    setSuccessNumber(Math.max(1, Math.min(10, newSuccessNumber)));
  }

  const diceNumber = filled.filter(Boolean).length;
  const diceRollsNk10 = simulateDiceRolls(100000, diceNumber, 1, 10); // Symulacja 10000 rzutów pulą diceNumber kości k10

  const handleClick = (index: number) => {
    setFilled((prev) => {
      const next = [...prev];

      if (next[index]) {
        // Kliknięto pełne pole
        const lastFilled = next.lastIndexOf(true);

        // Opróżnij tylko ostatnie pełne pole
        if (index !== lastFilled || diceNumber <= MIN) {
          return prev;
        }

        next[index] = false;
      } else {
        // Kliknięto puste pole
        const firstEmpty = next.indexOf(false);

        if (firstEmpty === -1 || diceNumber >= MAX) {
          return prev;
        }

        // Zapełnij pierwsze puste pole
        next[firstEmpty] = true;
      }

      return next;
    });
  };

  // const handleClick = (index: number) => {
  //   setFilled((prev) => {
  //     const next = [...prev]; // Tworzymy kopię tablicy filled, aby nie modyfikować stanu bezpośrednio

  //     if (next[index]) {
  //       // Pole pełne -> opróżnij (ale nie schodź poniżej minimum)
  //       // Pole pełne -> opróżnij (ale nie schodź poniżej minimum)
  //       const firstEmpty = next.indexOf(false); // Znajdź pierwsze puste pole
  //       if (diceNumber <= MIN ) return prev;
  //       next[firstEmpty-1] = false;
  //     } else {
  //       // Pole puste -> zapełnij kolejne puste pole po kolei (od lewej),
  //       // niezależnie od tego, które puste pole kliknięto
  //       const firstEmpty = next.indexOf(false);

  //       if (firstEmpty === -1) return prev;
  //       if (diceNumber >= MAX) return prev;
  //       next[firstEmpty] = true; // Zapełniamy pierwsze puste pole
  //     }
  //     return next;
  //   });
  // };
  // const handleClick = (index: number) => {
  //   setFilled((prev) => {
  //     const next = [...prev];
  //     if (next[index]) {
  //       // Pole pełne -> opróżnij (ale nie schodź poniżej minimum)
  //       if (diceNumber <= MIN) return prev;
  //       next[index] = false;
  //     } else {
  //       // Pole puste -> zapełnij (maksimum wynika z liczby pól)
  //       next[index] = true;
  //     }
  //     return next;
  //   });
  // };

  function probabilityOfStrictNumberSucessForNumberDice(
    difficultyLevel: number,
    diceNumber: number,
    successNumber: number,
  ): number {
    // Możesz dostosować tę funkcję według własnych potrzeb.
    return (
      (binomialCoefficient(diceNumber, successNumber) *
        Math.pow(11 - difficultyLevel, successNumber) *
        Math.pow(difficultyLevel - 1, diceNumber - successNumber)) /
      Math.pow(10, diceNumber)
    );
  }

  function probabilityOfMinimumNumberSuccessForNumberDice(
    difficultyLevel: number,
    diceNumber: number,
    successNumber: number,
  ): number {
    // Możesz dostosować tę funkcję według własnych potrzeb.
    let sum = 0;
    for (let k = successNumber; k <= diceNumber; k++) {
      sum += probabilityOfStrictNumberSucessForNumberDice(
        difficultyLevel,
        diceNumber,
        k,
      );
    }

    return sum;
  }

  return (
    <div className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-900 mt-4 mb-4 text-2xl">
      <style>{`
        .pole {
          aspect-ratio: 1;
          border-radius: 999px;
          cursor: pointer;
          
          background: transparent;
          
        }
        .pole:hover {  }
        .pole:active {  }
        .pole:focus-visible {  }
        .pole[aria-pressed="true"] {
          background: black;
        
        }
        .pole[aria-pressed="true"]:active {  }
        .pole[aria-disabled="true"] { cursor: not-allowed; }
        .pole[aria-disabled="true"]:hover { transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .pole { transition: none; }
        }
      `}</style>

      <div className="text-center mb-4 ">
        <div>Liczba sukcesów: {successNumber}</div>

        <DifficultyButton
          handleClick={() => updateSuccessNumber(successNumber - 1)}
          text="-1"
          className="text-black bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        />
        <DifficultyButton
          handleClick={() => updateSuccessNumber(successNumber + 1)}
          text="+1"
          className="text-black bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        />
      </div>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <div>Stopień trudności ST: {difficultyLevel}</div>

        <DifficultyButton
          handleClick={() => updateDifficultyLevel(difficultyLevel - 1)}
          text="-1"
          className="text-black bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        />
        <DifficultyButton
          handleClick={() => updateDifficultyLevel(difficultyLevel + 1)}
          text="+1"
          className="text-black bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded text-sm px-5 py-2.5  my-2  mr-2 w-24 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, lineHeight: 1, fontWeight: 700 }}>
          {diceNumber}
          <span style={{ fontSize: 24, fontWeight: 400, opacity: 0.6 }}>
            {" "}
            k {MAX}
          </span>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 16, opacity: 0.75 }}>
          Kliknij puste pole, aby je zapełnić. Kliknij pełne, aby je opróżnić.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
          gap: 32,
          width: "100%",
          maxWidth: 660,
          padding: "4px 0px 6px",
        }}
      >
        {filled.map((isFilled, i) => {
          const isLast = isFilled && diceNumber <= MIN;
          return (
            <button
              key={i}
              type="button"
              
              className="pole border  border-amber-300  mt-1 text-xxs text-gray-100 dark:text-white border border-black dark:border-gray-600"
              aria-pressed={isFilled}
              aria-disabled={isLast}
              aria-label={`Pole ${i + 1}: ${isFilled ? "pełne" : "puste"}`}
              title={
                isLast ? "Przynajmniej jedno pole musi być pełne" : undefined
              }
              onClick={() => handleClick(i)}
            >{i+1}</button>
          );
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <div>
          Prawdopodobieństwo wyrzucenia co najmniej {successNumber} sukcesów
          przy {diceNumber} kościach i stopniu trudności {difficultyLevel}:{" "}
          {probabilityOfMinimumNumberSuccessForNumberDice(
            difficultyLevel,
            diceNumber,
            successNumber,
          ).toFixed(4)}
        </div>
        <div>
          Prawdopodobieństwo wyrzucenia dokładnie {successNumber} sukcesów przy{" "}
          {diceNumber} kościach i stopniu trudności {difficultyLevel}:{" "}
          {probabilityOfStrictNumberSucessForNumberDice(
            difficultyLevel,
            diceNumber,
            successNumber,
          ).toFixed(4)}
        </div>
      </div>

      <h2>----------------------------------------------</h2>
      <h2>----------------------------------------------</h2>
      <h2>
        ({diceNumber}k{MAX} - ST: {difficultyLevel} - liczba oczekiwanych
        sukcesów: {successNumber} lub wiecej) - symulacja 10000 rzutów{" "}
        {diceNumber}k{MAX}:{" "}
        {howManySuccessfulRollsMinimum(
          diceRollsNk10,
          difficultyLevel,
          successNumber,
        )}
      </h2>
      <h2>
        Liczba udanych rzutów/do wszystkich rzutów:{" "}
        {howManySuccessfulRollsMinimum(
          diceRollsNk10,
          difficultyLevel,
          successNumber,
        ) / diceRollsNk10.length}
      </h2>
      <h2>----------------------------------------------</h2>
      <h2>----------------------------------------------</h2>
      <h2>
        ({diceNumber}k{MAX} - ST: {difficultyLevel} - liczba oczekiwanych
        sukcesów: {successNumber} i dokładnie tyle) - symulacja 10000 rzutów{" "}
        {diceNumber}k{MAX}:{" "}
        {howManySuccessfulRollsStrict(
          diceRollsNk10,
          difficultyLevel,
          successNumber,
        )}
      </h2>
      <h2>
        Liczba udanych rzutów/do wszystkich rzutów:{" "}
        {howManySuccessfulRollsStrict(
          diceRollsNk10,
          difficultyLevel,
          successNumber,
        ) / diceRollsNk10.length}
      </h2>
    </div>
  );
}
