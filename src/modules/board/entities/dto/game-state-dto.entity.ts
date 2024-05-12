import { Score } from "./score-dto.entity";
import { ShipPiece } from "./ship.entity"

export enum HitOrMiss {
    HIT = 'HIT',
    MISS = 'MISS',
}

export class OpponentSquareCurrentState {
    state: HitOrMiss | null
}

export class YourSquareCurrentState {
    piece: ShipPiece;
    hit: boolean;
}

export class LayoutDTO {
    you: YourSquareCurrentState[][]
    opponent: OpponentSquareCurrentState[][]
}


export class GameStateDTO {
    layout: LayoutDTO;
    score: Score;
}