import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { CustomRepository } from '../typeorm-ex.decorator';

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, picture, pictureMethod, mood, lock, content, date } =
      createBoardDto;

    const board = this.create({
      title,
      user,
      picture,
      pictureMethod,
      mood,
      lock,
      content,
      date,
    });

    await this.save(board);
    return board;
  }
}
