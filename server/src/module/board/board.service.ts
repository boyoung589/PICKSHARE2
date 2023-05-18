import { Injectable, NotFoundException } from '@nestjs/common';
import { Lock } from './board-state.union';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { UserRepository } from '../user/user.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from '../user/user.entity';
import { HeartRepository } from '../heart/heart.repository';
import { CommentRepository } from '../comment/comment.repository';

@Injectable()
export class BoardService {
  constructor(
    private boardRepository: BoardRepository,
    private userRepository: UserRepository, // private을 사용하지 않으면 다른 컴포넌트에서 해당 값을 수정할 수 있다.
    private heartRepository: HeartRepository,
    private commentRepository: CommentRepository,
  ) {}

  async findBoardByPic(picture: string): Promise<Board[]>{
    const query = await this.boardRepository.find({
      where: {
        picture,
      }
    })
    return query;
  }

  // READ(/:id)
  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({where:{id}});
    if (!found) {
      throw new NotFoundException(`Can't find Board id ${id}`);
    }
    return found;
  }

  // CREATE
  async createBoard(createBoardDto: CreateBoardDto, user): Promise<Board> {
    const { title, picture, pictureMethod, mood, lock, content, date } =
      createBoardDto;

    const board = this.boardRepository.create({
      title,
      picture,
      pictureMethod,
      mood,
      lock,
      content,
      date,
      user_id: user.id,
      nickname: user.nickname,
    });
    await this.boardRepository.save(board);
    return board;
  }

  // DELETE(/:id)
  async deleteBoard(user: User, id: number): Promise<void> {
    await this.heartRepository.delete({board_id: id});
    await this.commentRepository.delete({board_id: id});
    
    const result = await this.boardRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board-id ${id}`);
    }
  }

  // UPDATE(/:id)
  // 공개 or 비공개
  async lockBoard(id: number, lock: Lock): Promise<Board> {
    const board = await this.getBoardById(id);
    board.lock = lock;
    await this.boardRepository.save(board);
    return board;
  }

  // board update
  async editBoard(id: number, user: User, createBoardDto:CreateBoardDto): Promise<Board> {
    // 보드 아이디로 보드 레파지토리에서 보드 정보를 가져온 후 유저아이디랑 같은지 확인하고
    // 같으면 정보 수정해서 저장
    const board = await this.boardRepository.findOne({
      where: {
        id, 
        "user_id": user.id
      }
    })
    if(!board){
      throw new NotFoundException(`Can't find Board-id ${id}`);
    }
    const updateBoard = {...board, ...createBoardDto};
    await this.boardRepository.save(updateBoard);
    return await this.boardRepository.findOne({
      where: {
        id
      }
    });
  }
}
