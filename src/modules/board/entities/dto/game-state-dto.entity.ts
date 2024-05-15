import { Score } from './score-dto.entity';
import { ShipPiece } from '../util/ship-piece.entity';

export enum HitOrMiss {
  HIT = 'HIT',
  MISS = 'MISS',
}

export class OpponentSquareCurrentStateDTO {
  state: HitOrMiss | null;
}

export class YourSquareCurrentStateDTO {
  piece: ShipPiece;
  hit: boolean;
}

export class LayoutDTO {
  you: YourSquareCurrentStateDTO[][];
  opponent: OpponentSquareCurrentStateDTO[][];
}

export class GameStateDTO {
  layout: LayoutDTO;
  score: Score;
}
