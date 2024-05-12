import { ShipPiece } from "./ship.entity"

export class OpponentSquareCurrentState {
    state: "HIT" | "MISS" | null
}

export class YourSquareCurrentState {
    piece: ShipPiece;
    hit: boolean;
}

export class Layout {
    you: YourSquareCurrentState[][]
    opponent: OpponentSquareCurrentState[][]
}

export class Score {
    you: number
    opponent: number
}

export class GameState {
    layout: Layout;
    score: Score;
}

export class GameStateRequest {
    matchId: string;
    layout: boolean;
    score: boolean;
    you: boolean;
    opponent: boolean;

    constructor({ matchId, layout = false, score = false, you = false, opponent = false }: Partial<GameStateRequest>) {
        this.matchId = matchId;
        this.layout = layout;
        this.score = score;
        this.you = you;
        this.opponent = opponent;
    }
}