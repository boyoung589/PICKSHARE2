import { Module } from '@nestjs/common';
import { MypageService } from './mypage.service';
import { MypageController } from './mypage.controller';
import { UserRepository } from '../user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { BoardRepository } from '../board/board.repository';
import { HeartRepository } from '../heart/heart.repository';
import { FollowRepository } from '../follow/follow.repository';
import { CommentRepository } from '../comment/comment.repository';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      BoardRepository,
      HeartRepository,
      FollowRepository,
      CommentRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [MypageService],
  controllers: [MypageController],
})
export class MypageModule {}
