import { Injectable } from '@nestjs/common';
import { Board } from '../board/board.entity';
import { BoardRepository } from '../board/board.repository';
import { User } from '../user/user.entity';

@Injectable()
export class FeedService {
  constructor(
    private boardRepository: BoardRepository,
  ) {}

  async getAllFeed(start: number, end: number): Promise<Board[]> {
      const result =  await this.boardRepository.createQueryBuilder('board')
        .select([
          'board.id AS id',
          'board.picture AS contentImg',
          'board.date AS date',
          'board.createdAt AS createdAt',
          'board.lock AS locked',
          'user.nickname AS nickname',
          'user.userImage As userImage',
          'COUNT(heart.user_id) AS heartNum',
          'COUNT(comment.board_id) AS commentNum',
        ])
        .innerJoin(
          'board.user', 'user'
          )
        .leftJoin(
          'board.hearts', 'heart'
        )
        .leftJoin(
          'board.comments', 'comment'
        )
        .where('board.Lock = :lock', {lock: 'UNLOCK'})
        .groupBy('board.id')
        .orderBy('board.date', 'DESC')
        .getRawMany()
    
        const data = result.slice(start, end);
        return data;
  }
  async getAllFeedH(start: number, end: number): Promise<Board[]> {
    const result =  await this.boardRepository.createQueryBuilder('board')
      .select([
        'board.id AS id',
        'board.picture AS contentImg',
        'board.date AS date',
        'board.createdAt AS createdAt',
        'board.lock AS locked',
        'user.nickname AS nickname',
        'user.userImage As userImage',
        'COUNT(heart.user_id) AS heartNum',
        'COUNT(comment.board_id) AS commentNum',
      ])
      .innerJoin(
        'board.user', 'user'
        )
      .leftJoin(
        'board.hearts', 'heart'
      )
      .leftJoin(
        'board.comments', 'comment'
      )
      .where('board.Lock = :lock', {lock: 'UNLOCK'})
      .groupBy('board.id')
      .orderBy('heartNum', 'DESC')
      .getRawMany()
  const data = result.slice(start, end);
  return data;
}

  async getUserFeed(nickname: string, start:number, end: number): Promise<Board[]> {
    const board = await this.getAllFeed(start, end);
    return board.filter((el) => el.nickname === nickname);
  }

  async getMyFeed(user: User, start:number, end:number): Promise<Board[]> {
    const result =  await this.boardRepository.createQueryBuilder('board')
    .select([
      'board.id AS id',
      'board.picture AS contentImg',
      'board.date AS date',
      'board.createdAt AS createdAt',
      'board.title AS title',
      'board.lock AS locked',
      'user.nickname AS nickname',
      'user.userImage As userImage',
      'COUNT(heart.user_id) AS heartNum',
      'COUNT(comment.board_id) AS commentNum',
    ])
    .innerJoin(
      'board.user', 'user'
      )
    .leftJoin(
      'board.hearts', 'heart'
    )
    .leftJoin(
      'board.comments', 'comment'
    )
    .where('board.user = :user', {user: user.id})
    .groupBy('board.id')
    .orderBy('board.date', 'DESC')
    .getRawMany()

    const data = result.slice(start, end);
    return data;
  }

}
