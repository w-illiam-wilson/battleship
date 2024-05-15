import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Board } from '../entities/repository/board.entity';
import { Heading, ShipPositionDTO, SetupDTO } from '../entities/dto/setup-dto.entity';
import { ShipPiece } from '../entities/util/ship-piece.entity';
import { BoardRepository } from '../repositories/board.repository';
import { MatchRepository } from 'src/modules/match/repositories/match.repository';
import { MAX_COLUMN_POSITION, MAX_ROW_POSITION, SHIP_LENGTH } from '../board.constants';

@Injectable()
export class SetupBoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly matchRepository: MatchRepository,
    private readonly clsService: ClsService,
  ) {}

  async setupBoard(matchId, setup: SetupDTO) {
    const userId = this.clsService.get('userId');
    if (await this.isBoardSetup(matchId, userId)) {
      throw new HttpException(
        'Your board has already been setup',
        HttpStatus.CONFLICT,
      );
    };

    const boardArray = this.placeShips(setup);

    const databaseArray: Board[] = [];
    boardArray.forEach((row, rowNumber) => {
      row.forEach((_, columnNumber) => {
        const newBoardPiece = new Board(
          this.boardRepository,
          this.matchRepository,
        );

        newBoardPiece.match_id = matchId;
        newBoardPiece.user_id = userId;
        newBoardPiece.row_number = rowNumber;
        newBoardPiece.column_number = columnNumber;
        newBoardPiece.piece = boardArray[rowNumber][columnNumber];

        databaseArray.push(newBoardPiece);
      });
    });

    try {
      await this.boardRepository.save(databaseArray);
    } catch (e) {
      throw new HttpException(
        "Match id isn't correct or isn't assigned to your user",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async isBoardSetup(
    matchId: string,
    userId: string,
  ): Promise<boolean> {
    const countPiecesPlaced = await this.boardRepository.getPiecesPlacedOnBoardByMatchIdUserId(matchId, userId);
    return countPiecesPlaced === Object.keys(ShipPiece).length;
  }

  private placeShips(setup: SetupDTO) {
    const shipArray: ShipPiece[][] = Array.from({ length: 10 }, () =>
      Array(10).fill(null),
    );

    try {
      setup.ships.forEach((ship) => this.placeShip(ship, shipArray))
    } catch (e) {
      throw new HttpException(
        'Ships overlap or go off the board in this setup',
        HttpStatus.BAD_REQUEST,
      );
    }

    return shipArray;
  }

  private placeShip(
    ship: ShipPositionDTO,
    shipArray: ShipPiece[][]
  ) {
    const shipLength = SHIP_LENGTH[ship.ship];
    const row = ship.row;
    const column = ship.column;
    const position = ship.position;
    const shipName = ship.ship;

    if (
      row < 0 ||
      row > MAX_ROW_POSITION ||
      column < 0 ||
      column > MAX_COLUMN_POSITION
    ) {
      throw new Error('Starting position is out of bounds');
    }

    let boatPosition = 1;
    if (position === Heading.DOWN) {
      for (let i = row; i < row + shipLength; i++) {
        if (i > MAX_ROW_POSITION) {
          throw new Error('Reached the bottom edge of the array');
        }
        if (shipArray[i][column]) {
          throw new Error('Another boat is already in that space');
        }
        shipArray[i][column] = ShipPiece[`${shipName}${boatPosition}`];
        boatPosition += 1;
      }
    } else if (position === Heading.RIGHT) {
      for (let j = column; j < column + shipLength; j++) {
        if (j > MAX_COLUMN_POSITION) {
          throw new Error('Reached the right edge of the array');
        }
        if (shipArray[row][j]) {
          throw new Error('Another boat is already in that space');
        }
        shipArray[row][j] = ShipPiece[`${shipName}${boatPosition}`];
        boatPosition += 1;
      }
    }
  }
}
