import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { Board } from './entities/database/board-table.entity';
import { SetupDTO } from './entities/dto/setup-dto.entity';
import { Match } from 'src/modules/match/entities/database/match-table.entity';
import { OpponentSquareCurrentState, GameState, YourSquareCurrentState, Layout, Score, GameStateRequest } from './entities/dto/game-state-dto';
import { MissileDTO } from './entities/dto/missile-dto.entity';
import { SetupBoardService } from './services/setup-board.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private readonly clsService: ClsService,

    private readonly setupBoardService: SetupBoardService,
  ) { }

  async setupBoard(matchId: string, setup: SetupDTO): Promise<GameState> {
    await this.setupBoardService.setupBoard(matchId, setup);
    return this.getGameState(new GameStateRequest({matchId: matchId, layout: true, you: true}))
  }

  async fireMissile(matchId, missile: MissileDTO): Promise<GameState> {
    const scores = await this.getScores(matchId);
    try {
      await this.getGameState(new GameStateRequest({matchId: matchId, layout: true, opponent: true}))
    } catch {
      throw new HttpException("Boards haven't been set up yet", HttpStatus.FORBIDDEN)
    }
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
    return await this.getGameState(new GameStateRequest({matchId: matchId, layout: true, opponent: true}))
  }


  async getGameState(gameStateRequest: GameStateRequest): Promise<GameState> {
    const {matchId, layout, score, you, opponent} = gameStateRequest;
    const gameState = new GameState();
    if (layout) {
      gameState.layout = new Layout();
      if (you) {
        gameState.layout.you = (await this.getYourBoard(matchId)).you
      }
      if (opponent) {
        gameState.layout.opponent = (await this.getOpponentBoard(matchId)).opponent
      }
    }
    if (score) {
      gameState.score = new Score();
      const scores = await this.getScores(matchId);
      console.log(scores)
      if (you) {
        gameState.score.you = scores.you
      }
      if (opponent) {
        gameState.score.opponent = scores.opponent
      }
    }
    return gameState;
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

  private async getScores(matchId): Promise<Score> {
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

  private async isYourTurn(matchId: string): Promise<boolean> {
    // return true;
    const userId = this.clsService.get("userId");
    const playerTurn = await this.matchRepository.createQueryBuilder('match')
      .select(`CASE WHEN match.player_one_turn = true THEN match.player_one WHEN match.player_one_turn != true THEN match.player_two END`, 'player_turn')
      .where(`match.match_id = '${matchId}'`)
      .getRawOne();
    return playerTurn.player_turn === userId
  }

  async getYourBoard(matchId: string): Promise<Layout> {
    const userId = this.clsService.get("userId");
    const board: YourSquareCurrentState[][] = Array.from({ length: 10 }, () => Array(10).fill({ piece: null, hit: false }));
    const layout: Layout = new Layout()
    layout.you = board;

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
    return layout;
  }

  private async getOpponentBoard(matchId: string): Promise<Layout> {
    const userId = this.clsService.get("userId");
    const board: OpponentSquareCurrentState[][] = Array.from({ length: 10 }, () => Array(10).fill({ state: null }));
    const layout: Layout = new Layout()
    layout.opponent = board;

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
    return layout;
  }



}
