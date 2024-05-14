import { User } from 'src/modules/user/entities/repository/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Check,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
@Check(`"player_one" <> "player_two"`)
export class Match {
  @PrimaryGeneratedColumn('uuid')
  match_id: string;

  @Column()
  player_one: string;

  @Column()
  player_two: string;

  @Column({ default: true })
  player_one_turn: boolean;

  @Column({ nullable: true })
  match_winner: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  match_time: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player_one', referencedColumnName: 'user_id' })
  playerOneUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player_two', referencedColumnName: 'user_id' })
  playerTwoUser: User;

  @Check(`"match_winner" IN ("player_one", "player_two")`)
  winnerCheck: boolean;
}
