import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/singup-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //중복검사(emailcheck)
  @Get('emailcheck/:id')
  emailCheck(@Param('id') id: string): Promise<boolean> {
    return this.userService.getEmailCheck(id);
  }

  //중복검사(nicknamecheck)
  @Get('/nicknamecheck/:id')
  nicknameCheck(@Param('id') id: string): Promise<boolean> {
    return this.userService.getNicknameCheck(id);
  }

  // 일반 회원가입
  @Post('/signup')
  signup(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.signUp(signUpDto);
  }

  // 일반 로그인
  @Post('/login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; data: object; statusCode: number }> {
    return this.userService.login(loginDto);
  }

  // 카카오 로그인 : 인가 코드 받기
  @Get('/kakao')
  kakaoAuth(
    @Req() req: any,
  ): Promise<{ message: string; data?: object; statusCode?: number }> {
    const authcode = req.headers.authcode.slice(6).split('&')[0];
    return this.userService.kakaoLogin(authcode);
  }

  // 로그아웃
  @Get('/logout')
  @UseGuards(AuthGuard())
  logout(@Req() req: any) {return}

  @Get('/userInfo')
  getUserInfo(
    @Query('userNickname') userNickname: string,
  ): Promise<{ data: object }> {
    return this.userService.getUserInfo(userNickname);
  }
}
