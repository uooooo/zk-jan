export type Choice = "rock" | "paper" | "scissors";
export type GameState = "setup" | "playing" | "finished";

export interface Player {
  id: number;
  name: string;
  choices: (Choice | null)[];
  isEliminated: boolean;
}

export interface RoundResult {
  winners: Player[];
  players: Player[];
  isTie: boolean;
  roundNumber: number;
}