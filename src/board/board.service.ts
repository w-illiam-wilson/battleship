import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from './entities/board-table.entity';
import { SetupDTO } from './entities/setup-dto.entity';
import { Ship, ShipPiece } from './entities/ship.enum';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private matchRepository: Repository<Board>,
    private readonly clsService: ClsService
  ) { }

  async setupBoard(matchId, setup: SetupDTO): Promise<ShipPiece[][]> {
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
    const positionArray: ShipPiece[][] = Array.from({ length: 10 }, () => Array(10).fill(null));
    // positionArray[setup.A.x][setup.A.y] = true
    //A has five positions
    try {
      this.fillBoard(setup.A.position, setup.A.row, setup.A.column, positionArray, Ship.A);
      this.fillBoard(setup.B.position, setup.B.row, setup.B.column, positionArray, Ship.B);
      this.fillBoard(setup.C.position, setup.C.row, setup.C.column, positionArray, Ship.C);
      this.fillBoard(setup.D.position, setup.D.row, setup.D.column, positionArray, Ship.D);
      this.fillBoard(setup.E.position, setup.E.row, setup.E.column, positionArray, Ship.E);
    } catch (e) {
      console.log(e)
      throw new HttpException('Ships overlap or go off the board in this setup', HttpStatus.BAD_REQUEST);
    }
    return positionArray
  }

  private fillBoard(position: "DOWN" | "RIGHT", row: number, column: number, boatArray: ShipPiece[][], ship: any) {
    const shipLength = ship.length;
    const shipName = ship.name; 

    const maxRowPosition = boatArray.length - 1; //9 for a 10x10 board
    const maxColumnPosition = boatArray[0].length - 1; //9 for a 10x10 board

    // Check if the starting position is within the bounds of the array
    if (row < 0 || row > maxRowPosition || column < 0 || column > maxColumnPosition) {
      throw new Error("Starting position is out of bounds")
    }
    console.log(position)

    let boatPosition = 1;
    if (position === "DOWN") {
      for (let i = row; i < row + shipLength; i++) {
        console.log(i)
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
        console.log(j)
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
      console.log(position)
    }
  }



}
