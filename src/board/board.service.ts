import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from './entities/board-table.entity';
import { SetupDTO } from './entities/setup-dto.entity';
import { ShipInfo, ShipPiece } from './entities/ship.entity';
import { Match } from 'src/match/entities/match-table.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly clsService: ClsService
  ) { }

  async setupBoard(matchId, setup: SetupDTO): Promise<ShipPiece[][]> {
    const userId = this.clsService.get("userId");
    if (await this.isBoardSetup(matchId, userId)) {
      throw new HttpException("Your board has already been setup", HttpStatus.CONFLICT)
    }
    const battleshipBoard = this.fillBoard(setup);
    const boardPieces: Board[] = []
    battleshipBoard.forEach((row, rowNumber) => {
      row.forEach((_, columnNumber) => {
        const newBoardPiece = new Board(this.matchRepository);
        newBoardPiece.match_id = matchId;
        newBoardPiece.user_id = userId;
        newBoardPiece.row_number = rowNumber;
        newBoardPiece.column_number = columnNumber;
        newBoardPiece.piece = battleshipBoard[rowNumber][columnNumber];
        boardPieces.push(newBoardPiece)
      })
    });
    try {
      await this.boardRepository.save(boardPieces)
    } catch (e) {
      throw new HttpException("Match id isn't correct or isn't assigned to your user", HttpStatus.BAD_REQUEST)
    }
   
    return battleshipBoard;
  }

  private async isBoardSetup(matchId: string, userId: string): Promise<boolean> {
    const countPiecesPlaced = await this.boardRepository.createQueryBuilder('board')
      .where('board.match_id = :matchId', { matchId })
      .andWhere('board.user_id = :userId', { userId })
      .andWhere('board.piece IS NOT NULL')
      .getCount();
    return countPiecesPlaced === Object.keys(ShipPiece).length
  }

  private fillBoard(setup: SetupDTO) {
    const positionArray: ShipPiece[][] = Array.from({ length: 10 }, () => Array(10).fill(null));
    try {
      this.placeShip(setup.A.position, setup.A.row, setup.A.column, positionArray, ShipInfo.A);
      this.placeShip(setup.B.position, setup.B.row, setup.B.column, positionArray, ShipInfo.B);
      this.placeShip(setup.C.position, setup.C.row, setup.C.column, positionArray, ShipInfo.C);
      this.placeShip(setup.D.position, setup.D.row, setup.D.column, positionArray, ShipInfo.D);
      this.placeShip(setup.E.position, setup.E.row, setup.E.column, positionArray, ShipInfo.E);
    } catch (e) {
      throw new HttpException('Ships overlap or go off the board in this setup', HttpStatus.BAD_REQUEST);
    }
    return positionArray;
  }

  private placeShip(position: "DOWN" | "RIGHT", row: number, column: number, boatArray: ShipPiece[][], ship: any) {
    const shipLength = ship.length;
    const shipName = ship.name; 

    const maxRowPosition = boatArray.length - 1; //9 for a 10x10 board
    const maxColumnPosition = boatArray[0].length - 1; //9 for a 10x10 board

    // Check if the starting position is within the bounds of the array
    if (row < 0 || row > maxRowPosition || column < 0 || column > maxColumnPosition) {
      throw new Error("Starting position is out of bounds")
    }

    let boatPosition = 1;
    if (position === "DOWN") {
      for (let i = row; i < row + shipLength; i++) {
        // Check if the position is within the bounds of the array
        if (i > maxRowPosition) {
          throw new Error("Reached the bottom edge of the array");
        }
        // Check if the position is already true
        if (boatArray[i][column]) {
          throw new Error("Another boat is already in that space");
        }
        boatArray[i][column] = ShipPiece[`${shipName}${boatPosition}`];
        boatPosition += 1;
      }
    } else if (position === "RIGHT") {
      // Fill rightwards from the starting position
      for (let j = column; j < column + shipLength; j++) {
        // Check if the next position is within the bounds of the array
        if (j > maxColumnPosition) {
          throw new Error("Reached the right edge of the array");
        }
        // Check if the next position is already true
        if (boatArray[row][j]) {
          throw new Error("Another boat is already in that space");
        }
        boatArray[row][j] = ShipPiece[`${shipName}${boatPosition}`];;
        boatPosition += 1;
      }
    }
  }



}
