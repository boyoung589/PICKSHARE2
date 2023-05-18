import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Heart } from '../heart/heart.entity';
import { User } from '../user/user.entity';
import { Lock, Mood, PictureMethod } from './board-state.union';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({default: 'https://profileimage-pickshare.s3.ap-northeast-2.amazonaws.com/profileImg.png'})
  picture: string;

  @Column()
  pictureMethod: PictureMethod;

  @Column({default: true})
  mood: Mood = 0;

  @Column({default: true})
  lock: Lock = 'UNLOCK';

  @Column()
  content: string;

  @Column()
  date: string;

  @Column()
  user_id: number;

  @Column()
  nickname: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.boards, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Heart, (heart) => heart.board)
  hearts: Heart;

  @OneToMany(() => Comment, (comment) => comment.board)
  comments: Comment[];
}
