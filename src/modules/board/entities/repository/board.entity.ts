// battleship-board.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  Check,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  Repository,
  AfterUpdate,
} from 'typeorm';
import { ShipPiece } from '../dto/ship.entity';
import { Match } from 'src/modules/match/entities/repository/match.entity';
import { User } from 'src/modules/user/entities/repository/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Entity()
@Check(`"row_number" BETWEEN 0 AND 9`)
@Check(`"column_number" BETWEEN 0 AND 9`)
export class Board {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
  ) {}

  @PrimaryColumn('uuid')
  match_id: string;

  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn('int')
  row_number: number;

  @PrimaryColumn('int')
  column_number: number;

  @Column({ type: 'enum', enum: ShipPiece, nullable: true, default: null })
  piece: ShipPiece;

  @Column({ type: 'boolean', default: false })
  hit: boolean;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id', referencedColumnName: 'match_id' })
  matchHistory: Match;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' })
  user: User;

  @BeforeInsert()
  async checkBattleshipBoardPlayersInsert() {
    // Ensures user can only update board for the board associated with the match
    const match = await this.matchRepository.findOneBy({
      match_id: this.match_id,
    });
    if (
      !match ||
      (match.player_one !== this.user_id && match.player_two !== this.user_id)
    ) {
      throw new Error('This user is not associated with this match id');
    }
  }

  @AfterUpdate()
  async switchTurns() {
    const match = await this.matchRepository.findOneBy({
      match_id: this.match_id,
    });
    match.player_one_turn = !match.player_one_turn;
    await this.matchRepository.save(match);
  }

  @AfterUpdate()
  async checkWinnerAfterUpdate() {
    const results = await this.boardRepository
      .createQueryBuilder('board')
      .select('board.user_id', 'user_id')
      .addSelect('18 - COUNT(*)', 'score')
      .where(`board.match_id = '${this.match_id}'`)
      .andWhere('board.hit = false and board.piece is NOT NULL')
      .groupBy('board.user_id')
      .getRawMany();
    const yourScore: number = results.find(
      (result) => result.user_id === this.user_id,
    )?.score;

    if (Number(yourScore) == 17) {
      const boardPiece = await this.boardRepository.findOneBy({
        match_id: this.match_id,
        user_id: this.user_id,
        row_number: this.row_number,
        column_number: this.column_number,
      });
      if (boardPiece.piece) {
        //user just hit final piece
        const match = await this.matchRepository.findOneBy({
          match_id: this.match_id,
        });

        if (match.player_one == this.user_id) {
          match.match_winner = match.player_two;
        } else {
          match.match_winner = match.player_one;
        }

        await this.matchRepository.save(match);
      }
    }
  }
}
