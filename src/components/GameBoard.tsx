import { useState } from "react";
import GameChoice from "./GameChoice";
import { Button } from "./ui/button";
import { toast } from "sonner";

type Choice = "rock" | "paper" | "scissors";
type GameState = "choosing" | "waiting" | "result";

const GameBoard = () => {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [gameState, setGameState] = useState<GameState>("choosing");
  const [result, setResult] = useState<string>("");

  const handleChoice = (choice: Choice) => {
    setSelectedChoice(choice);
  };

  const handleSubmit = () => {
    if (!selectedChoice) {
      toast.error("Please select a choice first!");
      return;
    }

    setGameState("waiting");
    // Simulate opponent's choice
    setTimeout(() => {
      const choices: Choice[] = ["rock", "paper", "scissors"];
      const opponentChoice = choices[Math.floor(Math.random() * choices.length)];
      
      let gameResult = "";
      if (selectedChoice === opponentChoice) {
        gameResult = "It's a tie!";
      } else if (
        (selectedChoice === "rock" && opponentChoice === "scissors") ||
        (selectedChoice === "paper" && opponentChoice === "rock") ||
        (selectedChoice === "scissors" && opponentChoice === "paper")
      ) {
        gameResult = "You win!";
      } else {
        gameResult = "You lose!";
      }
      
      setResult(gameResult);
      setGameState("result");
      toast(gameResult);
    }, 1500);
  };

  const playAgain = () => {
    setSelectedChoice(null);
    setGameState("choosing");
    setResult("");
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-3xl font-bold text-game-purple mb-8">
        {gameState === "choosing" && "Choose your move"}
        {gameState === "waiting" && "Waiting for opponent..."}
        {gameState === "result" && result}
      </h2>
      
      <div className="flex gap-6 flex-wrap justify-center">
        {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
          <GameChoice
            key={choice}
            choice={choice}
            selected={selectedChoice === choice}
            onClick={() => handleChoice(choice)}
            disabled={gameState !== "choosing"}
          />
        ))}
      </div>

      <div className="mt-8">
        {gameState === "choosing" && (
          <Button 
            onClick={handleSubmit}
            className="bg-game-purple hover:bg-game-pink text-white px-8 py-4 text-lg"
          >
            Submit Choice
          </Button>
        )}
        {gameState === "result" && (
          <Button 
            onClick={playAgain}
            className="bg-game-blue hover:bg-game-purple text-white px-8 py-4 text-lg"
          >
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameBoard;