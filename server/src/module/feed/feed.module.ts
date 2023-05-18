import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { BoardRepository } from '../board/board.repository';
import { PassportModule } from '@nestjs/passport';
import { HeartRepository } from '../heart/heart.repository';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BoardRepository, HeartRepository,UserRepository]),
    UserModule,
    CommentModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [FeedService],
  controllers: [FeedController],
  exports: [FeedService]
})
export class FeedModule {}
