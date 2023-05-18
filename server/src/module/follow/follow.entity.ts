import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //유저가 팔로우하고 있는 다른 유저의 아이디
  @Column()
  followingNickname: string;

  //유저 아이디
  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.follows)
  @JoinColumn({ name: 'user_id' })
  user: User;

}
