export class GameStateRequest {
  matchId: string;
  layout: boolean;
  score: boolean;
  you: boolean;
  turn: boolean;
  opponent: boolean;

  constructor({
    matchId,
    layout = false,
    score = false,
    you = false,
    opponent = false,
    turn = false,
  }: Partial<GameStateRequest>) {
    this.matchId = matchId;
    this.layout = layout;
    this.score = score;
    this.turn = turn;
    this.you = you;
    this.opponent = opponent;
  }
}
