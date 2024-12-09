import { cn } from "@/lib/utils";
import { 
  CircleDot, 
  Circle, 
  Scissors 
} from "lucide-react";

type Choice = "rock" | "paper" | "scissors";

interface GameChoiceProps {
  choice: Choice;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const choiceIcons = {
  rock: CircleDot,
  paper: Circle,
  scissors: Scissors,
};

const GameChoice = ({ choice, selected, onClick, disabled }: GameChoiceProps) => {
  const Icon = choiceIcons[choice];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-6 rounded-full transition-all transform hover:scale-110",
        "bg-gradient-to-br shadow-lg",
        selected ? "from-game-purple to-game-pink ring-4 ring-game-blue" : "from-game-blue to-game-purple opacity-70",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        selected && "animate-bounce"
      )}
    >
      <Icon className="w-12 h-12 text-white" />
    </button>
  );
};

export default GameChoice;