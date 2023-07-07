import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordCheckDto } from './dto/passwordCheck.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { FollowRepository } from '../follow/follow.repository';
import { HeartRepository } from '../heart/heart.repository';
import { BoardRepository } from '../board/board.repository';
import { CommentRepository } from '../comment/comment.repository';

@Injectable()
export class MypageService {
  constructor(
    private userRepository: UserRepository,
    private boardRepository: BoardRepository,
    private heartRepository: HeartRepository,
    private followRepository: FollowRepository,
    private commentRepository: CommentRepository,
  ) {}

  // 회원정보 수정
  async updateUserInfo(updateUser: UpdateUserDto, user: any): Promise<object> {
    const userInfo = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (userInfo) {
      const updateUserInfo: object = { ...userInfo, ...updateUser };
      await this.userRepository.save(updateUserInfo);
      return {
        message: 'update success',
        statusCode: 200,
        data: updateUserInfo,
      };
    } else {
      return { message: 'update fail', statusCode: 400 };
    }
  }

  // 회원 탈퇴
  async removeUserInfo(
    user: any,
    passwordDto: PasswordCheckDto,
  ): Promise<object> {
    const { id, email } = user;
    const delHeart: any = await this.heartRepository.delete({ user_id: id });
    const delFollow: any = await this.followRepository.delete({ user_id: id });
    const delBoard: any = await this.boardRepository.delete({ user_id: id });
    const userInfo = await this.userRepository.findOne({ where: { email } });

    const passwordComparison = await bcrypt.compare(
      passwordDto.password,
      userInfo.password,
    );
    if (passwordComparison && userInfo) {
      await this.userRepository.remove(userInfo);
      return { message: 'withdrawal success', statusCode: 200 };
    } else {
      return { message: 'withdrawal fail', statusCode: 400 }; // 올바르지 않은 비밀번호입니다.
    }
  }
  // 카카오 회원탈퇴
  async removeKakaoUserInfo(user: User): Promise<object> {
    const { id, email } = user;
    // 삭제해야하는것: follow, heart, comment, board
    const delHeart: any = await this.heartRepository.delete({ user_id: id });
    const delFollow: any = await this.followRepository.delete({ user_id: id });
    /*   const delComment: any = await this.commentRepository.delete({
      user_id: id,
    });
    console.log(delComment, 'deletecomment'); */
    const delBoard: any = await this.boardRepository.delete({ user_id: id });
    const userInfo: any = await this.userRepository.findOne({
      where: { email },
    });

    if (userInfo) {
      await this.userRepository.remove(userInfo);
      return { message: 'kakao withdrawal success', statusCode: 200 };
    } else {
      return { message: 'withdrawal fail', statusCode: 400 };
    }
  }
}
