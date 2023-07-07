/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/singup-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
require('dotenv').config();

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private token: JwtService,
  ) {}

  async getEmailCheck(id: string): Promise<boolean> {
    const emailcheck = await this.userRepository.findOne({
      where: { email: id },
    });
    if (emailcheck) {
      return true;
    } else {
      return false;
    }
  }

  async getNicknameCheck(id: string): Promise<boolean> {
    const nicknamecheck = await this.userRepository.findOne({
      where: { nickname: id },
    });
    if (nicknamecheck) {
      return true;
    } else {
      return false;
    }
  }
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; statusCode: number }> {
    const findUser = await this.userRepository.findOne({
      where: { email: signUpDto.email },
    });
    if (findUser) {
      return { message: '이미 가입된 이메일입니다.', statusCode: 200 };
    } else {
      return this.userRepository.createUser(signUpDto);
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; data: object; statusCode: number }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const {
        id,
        email,
        nickname,
        userImage,
        statusMessage,
        loginMethod,
        created_at,
        updated_at,
      } = user;

      const accessToken = this.token.sign({
        id,
        email,
        nickname,
        userImage,
        statusMessage,
        loginMethod,
        created_at,
        updated_at,
      });

      return {
        message: 'login success',
        data: {
          accessToken: accessToken,
          loginMethod: loginMethod,
        },
        statusCode: 200,
      };
    } else {
      throw new UnauthorizedException('invalid user information');
    }
  }

  async kakaoLogin(authcode: string): Promise<{
    message: string;
    data?: object;
    statusCode?: number;
    accessToken?: string;
  }> {
    try {
      //토큰 받기
      //https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
      const tokenRequest = await axios.post(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&code=${authcode}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      //토큰 정보 보기
      const userInfoKakao = await axios.get(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${tokenRequest.data.access_token}`,
          },
        },
      );

      const { access_token } = tokenRequest.data;
      const { email } = userInfoKakao.data.kakao_account;

      const userInfo = await this.userRepository.findOne({
        where: { email },
      });
      if (!userInfo) {
        const user = await this.userRepository.kakaoCreateUser(email);
        const { data, message, statusCode } = user;
        const accessToken = this.token.sign({
          access_token,
          ...data,
        });

        return {
          data,
          statusCode,
          message,
          accessToken,
        };
      } else {
        const { email, nickname, userImage, statusMessage, loginMethod } =
          userInfo;
        if (userInfo.loginMethod === 2) {
          const accessToken = this.token.sign({
            access_token,
            email,
            nickname,
            userImage,
            statusMessage,
            loginMethod,
          });
          return {
            message: '로그인에 성공했습니다.',
            statusCode: 200,
            data: { email, nickname, userImage, statusMessage, loginMethod },
            accessToken,
          };
        }
        return { message: '일반 계정을 가지고 있습니다.', statusCode: 400 };
      }
    } catch (error) {
      return { message: '찾을 수 없는 인가코드입니다.', data: error };
    }
  }
  async getUserInfo(userNickname: string): Promise<{ data: object }> {
    const info = await this.userRepository.findOne({
      where: { nickname: userNickname },
    });

    if (!info) {
      throw new NotFoundException(`Can't find user nickname ${userNickname}`);
    }
    return {
      data: {
        id: info.id,
        nickname: info.nickname,
        userImage: info.userImage,
        statusMessage: info.statusMessage,
      },
    };
  }
}
