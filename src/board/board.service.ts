import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from './entities/board-table.entity';
import { SetupDTO } from './entities/setup-dto.entity';
import { ShipInfo, ShipPiece } from './entities/ship.entity';
import { Match } from 'src/match/entities/match-table.entity';
import { OpponentBoard, OpponentSquareCurrentState, ViewableBoard, YourBoard, YourSquareCurrentState } from './entities/viewable-board-dto.entity';
import { MissileDTO } from './entities/fire-dto.entity';
import { Scores } from './entities/score-dto.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly clsService: ClsService
  ) { }

  async fireMissile(matchId, missile: MissileDTO): Promise<OpponentBoard | string> {
    const scores = await this.getScores(matchId);
    if (scores.you == 18 || scores.opponent == 18) {
      throw new HttpException("Game has already finished", HttpStatus.FORBIDDEN)
    }
    if (!await this.isYourTurn(matchId)) {
      throw new HttpException("It's not your turn", HttpStatus.FORBIDDEN)
    }
    const userId = this.clsService.get("userId");
    await this.boardRepository
      .createQueryBuilder()
      .update(Board)
      .set({ hit: true })
      .where(`board.match_id = '${matchId}' and board.user_id != '${userId}' and board.row_number = ${missile.row} and board.column_number = ${missile.column}`)
      .execute();
    if (await this.youWon(matchId)) {
      return "You won!"
    }
    await this.switchTurns(matchId)
    return await this.getOpponentBoard(matchId)

  }

  async getBoards(matchId): Promise<ViewableBoard> {
    const viewableBoard: ViewableBoard = {
      you: await this.getYourBoard(matchId),
      opponent: await this.getOpponentBoard(matchId)
    }
    return viewableBoard;
  }

  async setupBoard(matchId, setup: SetupDTO): Promise<YourBoard> {
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

    return await this.getYourBoard(matchId);
  }

  private async youWon(matchId) {
    if ((await this.getScores(matchId)).you === 18) {
      const matchInfo = await this.matchRepository.createQueryBuilder('match')
      .select('*')
      .where(`match.match_id = '${matchId}'`)
      .getRawOne();

      matchInfo.match_winner = this.clsService.get("userId")

      await this.matchRepository.save(matchInfo)
      return true;
    }
    return false;
  }

  private async getScores(matchId): Promise<Scores> {
    const userId = this.clsService.get("userId");
    const results = await this.boardRepository
      .createQueryBuilder('board')
      .select('board.user_id', 'user_id')
      .addSelect('18 - COUNT(*)', 'score')
      .where(`board.match_id = '${matchId}'`)
      .andWhere('board.hit = false and board.piece is NOT NULL')
      .groupBy('board.user_id')
      .getRawMany();
    let opponentScore: number = results.find(result => result.user_id === userId)?.score;
    let yourScore: number = results.find(result => result.user_id !== userId)?.score;
    if (!yourScore) {
      yourScore = 18
    }
    if (!opponentScore) {
      yourScore = 18
    }
    return {
      you: yourScore,
      opponent: opponentScore
    }
  }

  private async switchTurns(matchId: string) {
    const matchInfo = await this.matchRepository.createQueryBuilder('match')
    .select('*')
    .where(`match.match_id = '${matchId}'`)
    .getRawOne();

    matchInfo.player_one_turn = !matchInfo.player_one_turn
    await this.matchRepository.save(matchInfo)
  }

  private async isYourTurn(matchId: string): Promise<boolean> {
    // return true;
    const userId = this.clsService.get("userId");
    const playerTurn = await this.matchRepository.createQueryBuilder('match')
      .select(`CASE WHEN match.player_one_turn = true THEN match.player_one WHEN match.player_one_turn != true THEN match.player_two END`, 'player_turn')
      .where(`match.match_id = '${matchId}'`)
      .getRawOne();
    return playerTurn.player_turn === userId
  }

  private async getYourBoard(matchId: string): Promise<YourBoard> {
    const userId = this.clsService.get("userId");
    const board: YourSquareCurrentState[][] = Array.from({ length: 10 }, () => Array(10).fill({ piece: null, hit: false }));

    const rows = await this.boardRepository.createQueryBuilder('board')
      .select('board.row_number', 'row_number')
      .addSelect('board.column_number', 'column_number')
      .addSelect('board.piece', 'piece')
      .addSelect('board.hit', 'hit')
      .where(`board.match_id = '${matchId}' and board.user_id = '${userId}'`)
      .orderBy("row_number", "ASC")
      .addOrderBy("column_number", "ASC")
      .getRawMany();
    if (rows.length != 100) {
      throw new HttpException("Your board is not setup yet", HttpStatus.NOT_FOUND);
    }

    rows.forEach((square, index) => {
      const yourSquare = new YourSquareCurrentState()
      yourSquare.piece = square.piece;
      yourSquare.hit = square.hit;
      board[square.row_number][square.column_number] = yourSquare;
    })
    return {
      table: board,
      score: (await this.getScores(matchId)).you
    };
  }

  private async getOpponentBoard(matchId: string): Promise<OpponentBoard> {
    const userId = this.clsService.get("userId");
    const board: OpponentSquareCurrentState[][] = Array.from({ length: 10 }, () => Array(10).fill({ state: null }));

    const rows = await this.boardRepository.createQueryBuilder('board')
      .select('board.row_number', 'row_number')
      .addSelect('board.column_number', 'column_number')
      .addSelect(`CASE WHEN board.hit = true AND board.piece IS NOT NULL THEN 'HIT' WHEN board.hit = true AND board.piece IS NULL THEN 'MISS' ELSE NULL END`, 'state')
      .where(`board.match_id = '${matchId}' and board.user_id != '${userId}'`)
      .getRawMany();

    if (rows.length != 100) {
      throw new HttpException("Opponent's board not setup yet", HttpStatus.NOT_FOUND);
    }

    rows.forEach((square, index) => {
      const yourSquare = new OpponentSquareCurrentState()
      yourSquare.state = square.state;
      board[square.row_number][square.column_number] = yourSquare;
    })
    return {
      table: board,
      score: (await this.getScores(matchId)).opponent
    };
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
