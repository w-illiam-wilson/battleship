import { Exclude } from 'class-transformer';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryColumn()
    user_id: string;

    @Column()
    @Exclude()
    salt: string;

    @Column()
    @Exclude()
    password: string;
}