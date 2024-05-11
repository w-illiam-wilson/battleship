import { ShipPiece } from "./ship.entity"

export class OpponentSquareCurrentState {
    state: "HIT" | "MISS" | null
}

export class YourSquareCurrentState {
    piece: ShipPiece;
    hit: boolean;
}

export class OpponentBoard {
    score: number;
    table: OpponentSquareCurrentState[][]
} 

export class YourBoard {
    score: number;
    table: YourSquareCurrentState[][]
} 

export class ViewableBoard {
    you: YourBoard
    opponent: OpponentBoard
}