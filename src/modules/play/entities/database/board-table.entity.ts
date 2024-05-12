// battleship-board.entity.ts
import { Entity, PrimaryColumn, Column, Check, ManyToOne, JoinColumn, BeforeInsert, Repository, AfterUpdate } from 'typeorm';
import { ShipPiece } from '../dto/ship.entity';
import { Match } from 'src/modules/match/entities/database/match-table.entity';
import { User } from 'src/modules/user/entities/database/user-table.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Entity()
@Check(`"row_number" BETWEEN 0 AND 9`)
@Check(`"column_number" BETWEEN 0 AND 9`)
export class Board {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>,
        // @InjectRepository(Board)
        // private boardRepository: Repository<Board>,
    ) { }

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
        const match = await this.matchRepository.findOneBy({ match_id: this.match_id });
        if (!match || (match.player_one !== this.user_id && match.player_two !== this.user_id)) {
            throw new Error('This user is not associated with this match id');
        }
    }

    @AfterUpdate()
    async afterUpdate() {
        console.log("after update")
        const match = await this.matchRepository.findOneBy({ match_id: this.match_id });
        match.player_one_turn = !match.player_one_turn;
        await this.matchRepository.save(match);
    }


    // async checkWinnerAfterUpdate() {
    //     const results = await this.boardRepository
    //         .createQueryBuilder('board')
    //         .select('board.user_id', 'user_id')
    //         .addSelect('18 - COUNT(*)', 'score')
    //         .where(`board.match_id = '${this.match_id}'`)
    //         .andWhere('board.hit = false and board.piece is NOT NULL')
    //         .groupBy('board.user_id')
    //         .getRawMany();
    //     let opponentScore: number = results.find(result => result.user_id === this.user_id)?.score;
    //     let yourScore: number = results.find(result => result.user_id !== this.user_id)?.score;
    //     if (!yourScore) {
    //         yourScore = 18
    //     }
    //     if (!opponentScore) {
    //         yourScore = 18
    //     }
    //     console.log({
    //         you: yourScore,
    //         opponent: opponentScore
    //     })
    //     return {
    //         you: yourScore,
    //         opponent: opponentScore
    //     }
    // }
}