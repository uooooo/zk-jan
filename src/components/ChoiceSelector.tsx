// src/components/ChoiceSelector.tsx
import { Choice } from "@/types/game";
import GameChoice from "./GameChoice";

interface ChoiceSelectorProps {
  roundNumber: number;
  selectedChoices: (Choice | null)[];
  onChoiceSelect: (round: number, choice: Choice) => void;
  disabled?: boolean;
}

const ChoiceSelector = ({
  roundNumber,
  selectedChoices,
  onChoiceSelect,
  disabled
}: ChoiceSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Round {roundNumber}</h3>
      <div className="flex gap-6 flex-wrap justify-center">
        {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
          <GameChoice
            key={choice}
            choice={choice}
            selected={selectedChoices[roundNumber - 1] === choice}
            onClick={() => onChoiceSelect(roundNumber - 1, choice)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default ChoiceSelector;




// import { Choice } from "@/types/game";
// import GameChoice from "./GameChoice";

// interface ChoiceSelectorProps {
//   roundNumber: number;
//   selectedChoices: (Choice | null)[];
//   onChoiceSelect: (round: number, choice: Choice) => void;
//   disabled?: boolean;
// }

// const ChoiceSelector = ({
//   roundNumber,
//   selectedChoices,
//   onChoiceSelect,
//   disabled
// }: ChoiceSelectorProps) => {
//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-semibold">Round {roundNumber}</h3>
//       <div className="flex gap-6 flex-wrap justify-center">
//         {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
//           <GameChoice
//             key={choice}
//             choice={choice}
//             selected={selectedChoices[roundNumber - 1] === choice}
//             onClick={() => onChoiceSelect(1, roundNumber - 1, choice)}
//             disabled={disabled}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChoiceSelector;