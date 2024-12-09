import { useState } from "react";
import GameChoice from "./GameChoice";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";

type Choice = "rock" | "paper" | "scissors";
type GameState = "setup" | "choosing" | "waiting" | "result" | "finished";

interface Player {
  id: number;
  name: string;
  choice: Choice | null;
  isEliminated: boolean;
}

interface RoundResult {
  winners: Player[];
  players: Player[];
  isTie: boolean;
  roundNumber: number;
}

const TOTAL_ROUNDS = 5;

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "You", choice: null, isEliminated: false },
    { id: 2, name: "Player 2", choice: null, isEliminated: false },
    { id: 3, name: "Player 3", choice: null, isEliminated: false },
  ]);
  const [gameState, setGameState] = useState<GameState>("choosing");
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const handleChoice = (choice: Choice) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === 1 ? { ...player, choice } : player
      )
    );
  };

  const determineWinner = (gamePlayers: Player[]): RoundResult => {
    const activePlayers = gamePlayers.filter(p => !p.isEliminated);
    const choices: Choice[] = ["rock", "paper", "scissors"];
    
    const playersWithChoices = activePlayers.map(player => 
      player.id === 1 
        ? player 
        : { ...player, choice: choices[Math.floor(Math.random() * choices.length)] }
    );

    const allSameChoice = playersWithChoices.every(p => p.choice === playersWithChoices[0].choice);
    if (allSameChoice) {
      return { 
        winners: playersWithChoices, 
        players: playersWithChoices, 
        isTie: true, 
        roundNumber: currentRound 
      };
    }

    const winningCombos = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };

    const playerScores = playersWithChoices.map(player => {
      let score = 0;
      playersWithChoices.forEach(opponent => {
        if (player.id !== opponent.id && player.choice && opponent.choice) {
          if (winningCombos[player.choice] === opponent.choice) {
            score++;
          }
        }
      });
      return { player, score };
    });

    const maxScore = Math.max(...playerScores.map(ps => ps.score));
    const winners = playerScores
      .filter(ps => ps.score === maxScore)
      .map(ps => ps.player);

    return {
      winners,
      players: playersWithChoices,
      isTie: winners.length > 1,
      roundNumber: currentRound
    };
  };

  const handleSubmit = () => {
    if (!players[0].choice) {
      toast.error("Please select your move!");
      return;
    }

    setGameState("waiting");
    setTimeout(() => {
      const roundResult = determineWinner(players);
      setRoundResults(prev => [...prev, roundResult]);

      if (currentRound === TOTAL_ROUNDS || roundResult.winners.length === 1) {
        setGameState("finished");
      } else {
        // Eliminate losing players
        const winnerIds = roundResult.winners.map(w => w.id);
        setPlayers(prev => 
          prev.map(player => ({
            ...player,
            choice: null,
            isEliminated: player.isEliminated || !winnerIds.includes(player.id)
          }))
        );
        setCurrentRound(prev => prev + 1);
        setGameState("choosing");
      }

      if (roundResult.isTie) {
        toast("It's a tie!");
      } else {
        const winnerNames = roundResult.winners.map(w => w.name).join(", ");
        toast(`${winnerNames} won round ${currentRound}!`);
      }
    }, 1500);
  };

  const playAgain = () => {
    setPlayers(prev => prev.map(player => ({ 
      ...player, 
      choice: null, 
      isEliminated: false 
    })));
    setGameState("choosing");
    setCurrentRound(1);
    setRoundResults([]);
  };

  const getChoiceName = (choice: Choice | null): string => {
    if (!choice) return "Not selected";
    return {
      rock: "Rock",
      paper: "Paper",
      scissors: "Scissors",
    }[choice];
  };

  const activePlayers = players.filter(p => !p.isEliminated);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-game-purple mb-2">
          Round {currentRound} of {TOTAL_ROUNDS}
        </h2>
        <p className="text-gray-600">
          {gameState === "choosing" && "Choose your move"}
          {gameState === "waiting" && "Waiting for other players..."}
          {gameState === "finished" && "Game Over!"}
        </p>
      </div>
      
      <div className="flex gap-6 flex-wrap justify-center">
        {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
          <GameChoice
            key={choice}
            choice={choice}
            selected={players[0].choice === choice}
            onClick={() => handleChoice(choice)}
            disabled={gameState !== "choosing" || players[0].isEliminated}
          />
        ))}
      </div>

      {roundResults.length > 0 && (
        <div className="w-full max-w-2xl space-y-4">
          <h3 className="text-xl font-semibold mb-3">Round Results</h3>
          {roundResults.map((result, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2">Round {result.roundNumber}</h4>
                {result.players.map(player => (
                  <div key={player.id} className="mb-2">
                    <span className="font-medium">{player.name}: </span>
                    <span className={
                      result.winners.some(w => w.id === player.id) 
                        ? "text-game-pink font-bold" 
                        : ""
                    }>
                      {getChoiceName(player.choice)}
                    </span>
                  </div>
                ))}
                <div className="mt-2 text-sm text-gray-600">
                  {result.isTie 
                    ? "Tie - All players advance" 
                    : `Winner${result.winners.length > 1 ? 's' : ''}: ${result.winners.map(w => w.name).join(', ')}`
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        {gameState === "choosing" && activePlayers.length > 1 && (
          <Button 
            onClick={handleSubmit}
            className="bg-game-purple hover:bg-game-pink text-white px-8 py-4 text-lg"
          >
            Submit
          </Button>
        )}
        {gameState === "finished" && (
          <div className="text-center">
            <div className="mb-4 text-xl font-bold">
              {roundResults[roundResults.length - 1].isTie 
                ? `Game ended in a tie between ${roundResults[roundResults.length - 1].winners.map(w => w.name).join(', ')}!`
                : `${roundResults[roundResults.length - 1].winners[0].name} wins the game!`
              }
            </div>
            <Button 
              onClick={playAgain}
              className="bg-game-blue hover:bg-game-purple text-white px-8 py-4 text-lg"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;