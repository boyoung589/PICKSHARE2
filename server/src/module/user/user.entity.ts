import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoginMethod } from './user-state.union';
import { Board } from '../board/board.entity';
import { Follow } from '../follow/follow.entity';
import { Comment } from '../comment/comment.entity';
import { Heart } from '../heart/heart.entity';
import { Exclude } from 'class-transformer'; // refreshToken때문(민감한 정보 제외해주기위해)

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password?: string;

  @Column()
  nickname: string;

  @Column()
  userImage: string;

  @Column()
  statusMessage: string;

  @Column()
  loginMethod: LoginMethod;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];

  @OneToMany(() => Follow, (follow) => follow.user)
  @JoinColumn()
  follows: Follow[];

  @OneToMany(() => Heart, (heart) => heart.user)
  @JoinColumn()
  hearts: Heart[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @JoinColumn()
  comments: Comment[];
}
