import { RoundResult } from "@/types/game";
import { Card, CardContent } from "./ui/card";

interface RoundResultsProps {
  results: RoundResult[];
}

const getChoiceName = (choice: string | null): string => {
  if (!choice) return "Not selected";
  return {
    rock: "Rock",
    paper: "Paper",
    scissors: "Scissors",
  }[choice];
};

const RoundResults = ({ results }: RoundResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-2xl space-y-4">
      <h3 className="text-xl font-semibold mb-3">Round Results</h3>
      {results.map((result, index) => (
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
                  {getChoiceName(player.choices[result.roundNumber - 1])}
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
  );
};

export default RoundResults;