// battleship-board.entity.ts
import { Entity, PrimaryColumn, Column, Check, ManyToOne, JoinColumn, BeforeInsert, Repository } from 'typeorm';
import { ShipPiece } from './ship.entity';
import { Match } from 'src/modules/match/entities/database/match-table.entity';
import { User } from 'src/modules/user/entities/database/user-table.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Entity()
@Check(`"row_number" BETWEEN 0 AND 9`)
@Check(`"column_number" BETWEEN 0 AND 9`)
export class Board {
    constructor(
        @InjectRepository(Match)
        private matchRepository: Repository<Match>
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
        const match = await this.matchRepository.findOneBy({match_id: this.match_id});
        if (!match || (match.player_one !== this.user_id && match.player_two !== this.user_id)) {
            throw new Error('This user is not associated with this match id');
        }
    }
}