import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BoardModule } from '../board/board.module';
import { UserModule } from '../user/user.module';
import { HeartController } from './heart.controller';
import { HeartRepository } from './heart.repository';
import { HeartService } from './heart.service';
import { TypeOrmExModule } from '../typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([HeartRepository]), 
    UserModule,
    BoardModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [HeartController],
  providers: [HeartService]
})
export class HeartModule {}
