import { useState } from "react";
import GameChoice from "./GameChoice";
import { Button } from "./ui/button";
import { toast } from "sonner";

type Choice = "rock" | "paper" | "scissors";
type GameState = "choosing" | "waiting" | "result";

interface Player {
  id: number;
  name: string;
  choice: Choice | null;
}

interface GameResult {
  winner: Player | null;
  players: Player[];
  isTie: boolean;
}

const GameBoard = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "あなた", choice: null },
    { id: 2, name: "プレイヤー2", choice: null },
    { id: 3, name: "プレイヤー3", choice: null },
  ]);
  const [gameState, setGameState] = useState<GameState>("choosing");
  const [result, setResult] = useState<GameResult | null>(null);

  const handleChoice = (choice: Choice) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === 1 ? { ...player, choice } : player
      )
    );
  };

  const determineWinner = (gamePlayers: Player[]): GameResult => {
    // シミュレートされた対戦相手の選択を生成
    const choices: Choice[] = ["rock", "paper", "scissors"];
    const playersWithChoices = gamePlayers.map(player => 
      player.id === 1 
        ? player 
        : { ...player, choice: choices[Math.floor(Math.random() * choices.length)] }
    );

    // 全員が同じ手を出した場合は引き分け
    const allSameChoice = playersWithChoices.every(p => p.choice === playersWithChoices[0].choice);
    if (allSameChoice) {
      return { winner: null, players: playersWithChoices, isTie: true };
    }

    // 勝者を決定
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
    const winners = playerScores.filter(ps => ps.score === maxScore);

    return {
      winner: winners.length === 1 ? winners[0].player : null,
      players: playersWithChoices,
      isTie: winners.length > 1,
    };
  };

  const handleSubmit = () => {
    if (!players[0].choice) {
      toast.error("手を選んでください！");
      return;
    }

    setGameState("waiting");
    setTimeout(() => {
      const gameResult = determineWinner(players);
      setResult(gameResult);
      setGameState("result");
      
      if (gameResult.isTie) {
        toast("引き分けです！");
      } else if (gameResult.winner) {
        toast(`${gameResult.winner.name}の勝ちです！`);
      }
    }, 1500);
  };

  const playAgain = () => {
    setPlayers(prev => prev.map(player => ({ ...player, choice: null })));
    setGameState("choosing");
    setResult(null);
  };

  const getChoiceInJapanese = (choice: Choice | null): string => {
    if (!choice) return "未選択";
    const choices = {
      rock: "グー",
      paper: "パー",
      scissors: "チョキ",
    };
    return choices[choice];
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-3xl font-bold text-game-purple mb-8">
        {gameState === "choosing" && "手を選んでください"}
        {gameState === "waiting" && "相手の手を待っています..."}
        {gameState === "result" && (result?.isTie ? "引き分け！" : `${result?.winner?.name}の勝ち！`)}
      </h2>
      
      <div className="flex gap-6 flex-wrap justify-center">
        {(["rock", "paper", "scissors"] as Choice[]).map((choice) => (
          <GameChoice
            key={choice}
            choice={choice}
            selected={players[0].choice === choice}
            onClick={() => handleChoice(choice)}
            disabled={gameState !== "choosing"}
          />
        ))}
      </div>

      {result && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">対戦結果</h3>
          {result.players.map(player => (
            <div key={player.id} className="mb-2">
              <span className="font-medium">{player.name}: </span>
              <span className={player.id === result.winner?.id ? "text-game-pink font-bold" : ""}>
                {getChoiceInJapanese(player.choice)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        {gameState === "choosing" && (
          <Button 
            onClick={handleSubmit}
            className="bg-game-purple hover:bg-game-pink text-white px-8 py-4 text-lg"
          >
            決定
          </Button>
        )}
        {gameState === "result" && (
          <Button 
            onClick={playAgain}
            className="bg-game-blue hover:bg-game-purple text-white px-8 py-4 text-lg"
          >
            もう一度遊ぶ
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameBoard;