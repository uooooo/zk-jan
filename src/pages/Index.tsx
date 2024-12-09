import GameBoard from "@/components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto py-12">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-game-blue via-game-purple to-game-pink text-transparent bg-clip-text">
          Rock Paper Scissors
        </h1>
        <GameBoard />
      </div>
    </div>
  );
};

export default Index;