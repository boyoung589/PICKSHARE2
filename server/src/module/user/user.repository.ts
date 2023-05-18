import { Repository } from 'typeorm';
import { SignUpDto } from './dto/singup-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomRepository } from '../typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  // 일반 회원가입(DB생성 및 저장)
  async createUser(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; statusCode: number }> {
    const { email, password, nickname } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      email,
      password: hashedPassword,
      nickname,
      userImage: 'nothing',
      statusMessage: 'nothing',
      loginMethod: 1,
      currentHashedRefreshToken: null,
    });

    try {
      await this.save(user);
      return { message: `${email} signup success`, statusCode: 201 };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async kakaoCreateUser(email: string): Promise<{
    message: string;
    data: object;
    statusCode: number;
  }> {
    const user = this.create({
      email: email,
      password: 'null',
      nickname: 'kakao 로그인',
      userImage: 'nothing',
      statusMessage: 'nothing',
      loginMethod: 2,
    });

    try {
      await this.save(user);
      const {
        email,
        password,
        nickname,
        userImage,
        statusMessage,
        loginMethod,
      } = user;

      return {
        message: `${email} 회원가입 성공했습니다`,
        data: {
          email,
          nickname,
          userImage,
          statusMessage,
          loginMethod,
        },
        statusCode: 201,
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
