import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowRepository } from './follow.repository';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from '../user/user.repository';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FollowRepository, UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}
