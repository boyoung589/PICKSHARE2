import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordCheckDto } from './dto/passwordCheck.dto';
import { KakaoUserDto } from './dto/kakaoUser.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { FollowRepository } from '../follow/follow.repository';
import { HeartRepository } from '../heart/heart.repository';
import { BoardRepository } from '../board/board.repository';
import { CommentRepository } from '../comment/comment.repository';

@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(HeartRepository)
    private heartRepository: HeartRepository,
    @InjectRepository(FollowRepository)
    private followRepository: FollowRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  // 회원정보 수정
  async updateUserInfo(updateUser: UpdateUserDto, user: any): Promise<object> {
    const userInfo = await this.userRepository.findOne({ email: user.email });
    if (userInfo) {
      const updateUserInfo: object = { ...userInfo, ...updateUser };
      // console.log(updateUserInfo);
      await this.userRepository.save(updateUserInfo);
      // console.log(updateUserInfo);

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
    console.log(delHeart, 'deleteHeart');
    const delFollow: any = await this.followRepository.delete({ user_id: id });
    console.log(delFollow, 'deletefollow');
    const delBoard: any = await this.boardRepository.delete({ user_id: id });
    console.log(delBoard, 'deleteBoard');
    const userInfo = await this.userRepository.findOne({ email });
    // console.log(userInfo);
    //console.log(passwordDto)
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
    console.log(user, 'user');
    const { id, email } = user;
    // 삭제해야하는것: follow, heart, comment, board
    const delHeart: any = await this.heartRepository.delete({ user_id: id });
    console.log(delHeart, 'deleteHeart');
    const delFollow: any = await this.followRepository.delete({ user_id: id });
    console.log(delFollow, 'deletefollow');
    /*   const delComment: any = await this.commentRepository.delete({
      user_id: id,
    });
    console.log(delComment, 'deletecomment'); */
    const delBoard: any = await this.boardRepository.delete({ user_id: id });
    console.log(delBoard, 'deleteBoard');
    const userInfo: any = await this.userRepository.findOne({
      email,
    });

    if (userInfo) {
      await this.userRepository.remove(userInfo);
      return { message: 'kakao withdrawal success', statusCode: 200 };
    } else {
      return { message: 'withdrawal fail', statusCode: 400 };
    }
  }
}
