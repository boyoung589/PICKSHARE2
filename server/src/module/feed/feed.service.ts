import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from '../board/board.entity';
import { BoardRepository } from '../board/board.repository';
import { User } from '../user/user.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  async getAllFeed(): Promise<Board[]> {
      return await this.boardRepository.createQueryBuilder('board')
        .select([
          'board.id AS id',
          'board.picture AS contentImg',
          'board.date AS date',
          'board.createdAt AS createdAt',
          'board.lock AS locked',
          'user.nickname AS nickname',
          'user.userImage As userImage',
          'COUNT(heart.user_id) AS heartNum'
        ])
        .innerJoin(
          'board.user', 'user'
          )
        .leftJoin(
          'board.hearts', 'heart'
        )
        .where('board.Lock = :lock', {lock: 'UNLOCK'})
        .groupBy('board.id')
        .orderBy('board.createdAt', 'DESC')
        .getRawMany()
  }

  async getUserFeed(nickname: string): Promise<Board[]> {
    const board = await this.getAllFeed();
    return board.filter((el) => el.nickname === nickname);
  }

  async getMyFeed(user: User): Promise<Board[]> {
    return this.boardRepository.find({
      where: {
        user_id: user.id,
      },
    });
  }

  async searchMineByDate(user: User, date: string): Promise<Board[]> {
    const searchedBoard = await this.getMyFeed(user);

    return searchedBoard.filter((el) => el.date === date);
  }

  async searchUsersByDate(nickname: string, date: string): Promise<Board[]> {
    const searchedBoard = await this.getUserFeed(nickname);
    return searchedBoard.filter((el) => el.date === date);
  }
}
