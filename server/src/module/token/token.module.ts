//토큰 검증만 가능한 모듈 (토큰 생성은 user모듈에 있음)

import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from '../user/user.repository';
import { TokenController } from './token.controller';
import { TypeOrmExModule } from '../typeorm-ex.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmExModule.forCustomRepository([UserRepository]),
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService, PassportModule],
})
export class TokenModule {}
