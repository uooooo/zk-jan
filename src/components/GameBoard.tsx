import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Choice, GameState, Player, RoundResult } from "@/types/game";
import RoundResults from "./RoundResults";
import ChoiceSelector from "./ChoiceSelector";

const TOTAL_ROUNDS = 5;

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "You", choices: Array(TOTAL_ROUNDS).fill(null), isEliminated: false },
    { id: 2, name: "Player 2", choices: Array(TOTAL_ROUNDS).fill(null), isEliminated: false },
    { id: 3, name: "Player 3", choices: Array(TOTAL_ROUNDS).fill(null), isEliminated: false },
  ]);
  const [gameState, setGameState] = useState<GameState>("setup");
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);

  const handleChoice = (roundIndex: number, choice: Choice) => {
    setPlayers(prev =>
      prev.map(player =>
        player.id === 1
          ? {
              ...player,
              choices: player.choices.map((c, i) => (i === roundIndex ? choice : c))
            }
          : player
      )
    );
  };

  const determineWinner = (gamePlayers: Player[], roundIndex: number): RoundResult => {
    const activePlayers = gamePlayers.filter(p => !p.isEliminated);
    const choices: Choice[] = ["rock", "paper", "scissors"];
    
    // Generate AI choices for computer players if they haven't been set yet
    const playersWithChoices = activePlayers.map(player => 
      player.id === 1 
        ? player 
        : {
            ...player,
            choices: player.choices.map((c, i) => 
              i === roundIndex ? choices[Math.floor(Math.random() * choices.length)] : c
            )
          }
    );

    const currentChoices = playersWithChoices.map(p => p.choices[roundIndex]);
    const allSameChoice = currentChoices.every(c => c === currentChoices[0]);
    
    if (allSameChoice) {
      return {
        winners: playersWithChoices,
        players: playersWithChoices,
        isTie: true,
        roundNumber: roundIndex + 1
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
        if (player.id !== opponent.id && player.choices[roundIndex] && opponent.choices[roundIndex]) {
          if (winningCombos[player.choices[roundIndex]!] === opponent.choices[roundIndex]) {
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
      roundNumber: roundIndex + 1
    };
  };

  const startGame = () => {
    const hasAllChoices = players[0].choices.every(choice => choice !== null);
    if (!hasAllChoices) {
      toast.error("Please select your moves for all rounds!");
      return;
    }

    setGameState("playing");
    playNextRound();
  };

  const playNextRound = () => {
    const roundResult = determineWinner(players, currentRound - 1);
    setRoundResults(prev => [...prev, roundResult]);

    // Update players with AI choices
    const updatedPlayers = players.map(player => {
      if (player.id !== 1) {
        const choices: Choice[] = ["rock", "paper", "scissors"];
        return {
          ...player,
          choices: player.choices.map((c, i) => 
            i === currentRound - 1 ? choices[Math.floor(Math.random() * choices.length)] : c
          )
        };
      }
      return player;
    });
    setPlayers(updatedPlayers);

    if (currentRound === TOTAL_ROUNDS || roundResult.winners.length === 1) {
      setGameState("finished");
    } else {
      const winnerIds = roundResult.winners.map(w => w.id);
      setPlayers(prev =>
        prev.map(player => ({
          ...player,
          isEliminated: !winnerIds.includes(player.id)
        }))
      );
      setCurrentRound(prev => prev + 1);
    }

    if (roundResult.isTie) {
      toast("It's a tie!");
    } else {
      const winnerNames = roundResult.winners.map(w => w.name).join(", ");
      toast(`${winnerNames} won round ${currentRound}!`);
    }
  };

  const playAgain = () => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      choices: Array(TOTAL_ROUNDS).fill(null),
      isEliminated: false
    })));
    setGameState("setup");
    setCurrentRound(1);
    setRoundResults([]);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-game-purple mb-2">
          {gameState === "setup" ? "Choose Your Moves" : `Round ${currentRound} of ${TOTAL_ROUNDS}`}
        </h2>
        <p className="text-gray-600">
          {gameState === "setup" && "Select your moves for all rounds"}
          {gameState === "playing" && "Game in progress..."}
          {gameState === "finished" && "Game Over!"}
        </p>
      </div>

      {gameState === "setup" && (
        <div className="space-y-8">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <ChoiceSelector
              key={i}
              roundNumber={i + 1}
              selectedChoices={players[0].choices}
              onChoiceSelect={handleChoice}
            />
          ))}
        </div>
      )}

      <RoundResults results={roundResults} />

      <div className="mt-8">
        {gameState === "setup" && (
          <Button
            onClick={startGame}
            className="bg-game-purple hover:bg-game-pink text-white px-8 py-4 text-lg"
          >
            Start Game
          </Button>
        )}
        {gameState === "playing" && (
          <Button
            onClick={playNextRound}
            className="bg-game-blue hover:bg-game-purple text-white px-8 py-4 text-lg"
          >
            Next Round
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