import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { UserRepository } from '../user/user.repository';
import { BoardRepository } from '../board/board.repository';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      CommentRepository,
      UserRepository,
      BoardRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
