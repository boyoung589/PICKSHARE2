/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

@Injectable()
export class TokenService extends PassportStrategy(Strategy) {
  //PassportStrategy사용이유: JWT Strategy를 사용하기 위해 (passport-jwt Node.js package)
  constructor(
    private userRepository: UserRepository, // 유효성 검사 후 데이터베이스(UserRepository)에서 데이터를 찾기 위해
  ) {
    super({
      secretOrKey: process.env.SECRET, //토큰 유효한지 체크하기 위해 사용()
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // 토큰 검증
  async validate(payload) {
    const { email, access_token, loginMethod } = payload;

    try {
      if (loginMethod === 2) {
        const findKakaoEmail = await axios.get(
          'https://kapi.kakao.com/v2/user/me',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );

        if (findKakaoEmail) {
          const user: User = await this.userRepository.findOne({
            where: { email: findKakaoEmail.data.kakao_account.email },
          });
          return user;
        } else {
          throw new UnauthorizedException('토큰 만료');
        }
      } else {
        const user: User = await this.userRepository.findOne({
          where: { email },
        });
        if (!user) {
          throw new UnauthorizedException('유저 없음');
        }
        return user;
      }
    } catch (error) {
      if (error.response.status === 401) {
        return { message: '토큰 만료', data: error.response.status };
      }
    }
  }

  async userInfo(
    req,
  ): Promise<{ message: string; data: object; statusCode: number }> {
    const {
      id,
      email,
      nickname,
      userImage,
      statusMessage,
      loginMethod,
      created_at,
      updated_at,
    } = await req.user;
    return {
      message: 'login success',
      data: {
        userInfo: {
          id,
          email,
          nickname,
          userImage,
          statusMessage,
          loginMethod,
          created_at,
          updated_at,
        },
      },
      statusCode: 200,
    };
  }
}
