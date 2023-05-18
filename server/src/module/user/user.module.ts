import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TokenService } from '../token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), //UseGuards때문
    TypeOrmExModule.forCustomRepository([UserRepository]),
    JwtModule.register({
      secret: process.env.SECRET || process.env.REFRESH, // 토큰을 생성하기 위해
      signOptions: {
        expiresIn: 600 * 600,
      },
    }),
  ],
  providers: [UserService, TokenService, PassportModule],
  controllers: [UserController],
})
export class UserModule {}
