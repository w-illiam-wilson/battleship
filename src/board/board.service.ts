import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from './entities/board-table.entity';
import { SetupDTO } from './entities/setup-dto.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private matchRepository: Repository<Board>,
    private readonly clsService: ClsService
  ) { }

  async setupBoard(matchId, setup: SetupDTO): Promise<boolean[][]> {
    return this.validatePositions(setup)
    // return ""
    // const user_id = this.clsService.get("userId");
    // const player_two = opponent;
    // const newBoard = new Board();
    // for 

    // newMatch.player_one = player_one;
    //   newMatch.player_two = player_two;

    // const createdMatch = await this.matchRepository.save(newMatch);
    // return createdMatch.match_id;
  }

  validatePositions(setup: SetupDTO) {
    const positionArray: boolean[][] = Array.from({ length: 10 }, () => Array(10).fill(false));
    // positionArray[setup.A.x][setup.A.y] = true
    //A has five positions
    try {
      this.fillBoard(setup.A.position, setup.A.row, setup.A.column, positionArray, 5);
      // this.fillBoard(setup.B.position, setup.B.row, setup.B.column, positionArray, 4);
      // this.fillBoard(setup.C.position, setup.C.row, setup.C.column, positionArray, 4);
      // this.fillBoard(setup.D.position, setup.D.row, setup.D.column, positionArray, 3);
      // this.fillBoard(setup.E.position, setup.E.row, setup.E.column, positionArray, 2);
    } catch (e) {
      console.log(e)
      throw new HttpException('Ships overlap or go off the board in this setup', HttpStatus.BAD_REQUEST);
    }
    return positionArray
  }

  fillBoard(position: "DOWN" | "RIGHT", row: number, column: number, booleanArray: boolean[][], lengthOfBoat: number) {
    const maxRowPosition = booleanArray.length - 1; //9 for a 10x10 board
    const maxColumnPosition = booleanArray[0].length - 1; //9 for a 10x10 board

    console.log(maxRowPosition)
    console.log(maxColumnPosition)

    // Check if the starting position is within the bounds of the array
    if (row < 0 || row > maxRowPosition || column < 0 || column > maxColumnPosition) {
      throw new Error("Starting position is out of bounds")
    }

    if (position === "DOWN") {
      for (let i = row; i < lengthOfBoat; i++) {
        // Check if the position is within the bounds of the array
        if (i > maxRowPosition) {
          throw new Error("Reached the bottom edge of the array");
        }
        // Check if the position is already true
        if (booleanArray[i][column]) {
          throw new Error("Another boat is already in that space");
        }
        booleanArray[i][column] = true;
      }
    } else if (position === "RIGHT") {
      // Fill rightwards from the starting position
      for (let j = column; j < lengthOfBoat; j++) {
        // Check if the next position is within the bounds of the array
        if (j > maxColumnPosition) {
          throw new Error("Reached the right edge of the array");
        }
        // Check if the next position is already true
        if (booleanArray[row][j]) {
          throw new Error("Another boat is already in that space");
        }
        booleanArray[row][j] = true;
      }
    }
  }



}
