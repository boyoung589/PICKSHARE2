import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CommentRepository } from '../comment/comment.repository';
import { FeedModule } from '../feed/feed.module';
import { FeedService } from '../feed/feed.service';
import { HeartRepository } from '../heart/heart.repository';
import { UserModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { BoardController } from './board.controller';
import { BoardRepository } from './board.repository';
import { BoardService } from './board.service';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BoardRepository, UserRepository, HeartRepository, CommentRepository]),
    FeedModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [BoardController],
  providers: [BoardService, FeedService],
})
export class BoardModule {}
