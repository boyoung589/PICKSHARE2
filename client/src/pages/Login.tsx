/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';
import { addUserInfo, deleteUserInfo } from '../redux/actions/index';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import background from '../img/feedBG.jpg';
import pickshareLogo from '../img/pickshare.png';
import loginApi from '../api/login';
import Index from '../component/Index/Index';
import SubIndex from '../component/Index/SubIndex';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${background});
`;

const Book = styled.div`
  height: 100vh;
  width: 90vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 1em;
  position: relative;
  left: 8rem;
  @media screen and (max-width: 891px) {
    width: 100vw;
    position: none;
    left: 0rem;
    padding-left: 0em;
  }
`;
const Left = styled.div`
  display: flex;
  align-items: flex-end;
  width: 32rem;
  height: 85vh;
  padding-left: 1em;
  background-color: white;
  border-radius: 30px 20px 20px 30px;
  box-shadow: 10px 10px 30px #3c4a5645;
  border-right: #b1b0b0 solid 2px;
  @media screen and (max-width: 1190px) {
    display: none;
  }
`;

const Right = styled.div`
  border-radius: 20px 30px 30px 20px;
  width: 32rem;
  height: 85vh;
  background-color: white;
  padding-left: 1em;
  box-shadow: 30px 10px 10px #3c4a5645;
  border-left: #b1b0b0 solid 2px;
  @media screen and (max-width: 1190px) {
    width: 32rem;
  }
  @media screen and (max-width: 891px) {
    width: 100vw;
    height: 100vh;
    border-radius: 0px;
    padding-left: 0em;
  }
`;

const SubTags = styled.div`
  display: flex;
  justify-content: center;
  height: 3.2rem;
  box-shadow: 15px 10px 15px #3c4a5645;

  @media screen and (min-width: 892px) {
    display: none;
  }
`;

/// 세부사항

const Img = styled.img`
  width: 8em;
  height: 23em;
  position: relative;
  left: -15px;
  bottom: 10px;
`;
const LoginBox = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
`;
const Title = styled.div`
  font-size: 2rem;
  font-weight: 900;
  margin-top: 2.5rem;
  background: linear-gradient(to right, #a396f8, #d06be0, #fd40c8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 35vw;
  height: 50vh;
  box-sizing: border-box;
  @media screen and (max-width: 891px) {
    width: 60vw;
  }
  @media screen and (max-width: 513px) {
    width: 90vw;
  }
`;
const InputBox = styled.div<{ button?: any }>`
  height: 3.3rem;
  margin-top: ${(props) => (props.button ? '2rem' : '0')};
  box-sizing: border-box;
`;
const Message = styled.div`
  width: 100vw;
  height: 1.7rem;
  padding-top: 3px;
  box-sizing: border-box;
  font-size: 15px;
  position: relative;
  color: #ff8686;
`;
const Input = styled.input`
  height: 3rem;
  width: 18rem;
  border-radius: 30px;
  box-sizing: border-box;
  box-shadow: 0 3px 5px #3c4a5645;
  text-decoration: none;
  font-size: large;
  outline: none;
  padding: 0 1em;
  border: 0;
  box-sizing: border-box;
  opacity: 0.6;
`;
const Button = styled.button`
  width: 18rem;
  height: 3rem;
  border-radius: 30px;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 5px 14px #3c4a5645;
  text-decoration: none;
  font-size: large;
  background: linear-gradient(to right, #a396f8, #d06be0, #fd40c8);
  cursor: pointer;
  font-size: large;
  font-weight: bold;
  color: white;
`;
const ButtonKakao = styled.button`
  width: 18rem;
  height: 3rem;
  border-radius: 30px;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 5px 14px #3c4a5645;
  text-decoration: none;
  font-size: large;
  font-weight: bold;
  color: #4e4d4d;
  background-color: #fdf772;
  cursor: pointer;
  margin-top: 0.7rem;
`;
const Div = styled.div`
  height: 2rem;
  width: 20rem;
  border-top: solid purple 1px;
  opacity: 0.3;
  font-size: 0.9rem;
  margin-top: 0.7rem;
  padding: 0.7rem 0rem;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;
const BoxMessage = styled.div`
  display: flex;
  text-align: center;
`;

function Login(props: any) {
  const navigate = useNavigate();

  const { userInfoToStore, initialUserInfoToStore } = props;
  useEffect(() => {
    initialUserInfoToStore();
  }, []);

  const inputEmail: any = useRef();
  const inputpassword: any = useRef();

  const [userInfo, setUserInfo] = useState({ email: '', password: '' });
  const [emailcheckMessage, setEmailCheckMessage] =
    useState('이메일을 입력해주세요');
  const [passwordMessage, setPasswordMessage] =
    useState('비밀번호를 입력해주세요');

  const handleUserInfo = (e: any) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  //이메일 중복검사 필터
  const emailRegExp =
    /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
  //비밀번호 중복검사 필터
  const passwordRegExp = /^[a-zA-z0-9]{4,12}$/;

  //이메일 유효성검사
  const emailValidation = (e: any) => {
    handleUserInfo(e);
    if (emailRegExp.test(e.target.value) === false) {
      setEmailCheckMessage('올바른 이메일을 입력해주세요.');
    } else {
      setEmailCheckMessage('');
    }
  };
  //비밀번호 유효성검사
  const passwordValidation = (e: any) => {
    handleUserInfo(e);
    if (passwordRegExp.test(e.target.value) === false) {
      setPasswordMessage('영문 대소문자와 숫자 4-12자리로 입력해야합니다.');
    } else {
      setPasswordMessage('');
    }
  };
  // 로그인
  const Login = async (e: any) => {
    e.preventDefault();
    if (emailRegExp.test(userInfo.email) === false) {
      inputEmail.current.focus();
      return;
    }
    if (passwordRegExp.test(userInfo.password) === false) {
      inputpassword.current.focus();
      return;
    }
    if (userInfo) {
      try {
        await loginApi.login(userInfo).then((res) => {
          const { accessToken, loginMethod } = res.data.data; //refreshToken
          if (accessToken) {
            void tokenVerification(accessToken);
          } else {
            console.log('토큰이 없습니다.');
          }
        });
      } catch (error) {
        alert(
          '아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요'
        );
      }
    }
  };

  // 토큰 검증 후 유저 정보 불러오는 함수
  const tokenVerification = async (token: string) => {
    try {
      await loginApi.token(token).then((res) => {
        const { userInfo } = res.data.data;
        if (userInfo) {
          userInfoToStore(userInfo, token);
          navigate('/mainfeed', { replace: true });
        } else {
          console.log('로그인 실패');
        }
      });
    } catch (error) {
      console.log('error');
    }
  };

  const handleKakaoLogin = (e: any) => {
    e.preventDefault();
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CODE}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT}&response_type=code&state=kakao`;
  };

  return (
    <Wrapper>
      <Book>
        <Left>
          <Img src={pickshareLogo} />
        </Left>
        <Right>
          <SubIndex />
          <LoginBox>
            <Title>Log in to your account</Title>
            <Form>
              <InputBox>
                <Box>
                  <Input
                    type="text"
                    ref={inputEmail}
                    name="email"
                    placeholder="이메일"
                    onChange={emailValidation}
                  />
                </Box>
              </InputBox>
              <BoxMessage>
                <Message>{emailcheckMessage}</Message>
              </BoxMessage>
              <InputBox>
                <Box>
                  <Input
                    type="password"
                    ref={inputpassword}
                    autoComplete="off"
                    name="password"
                    placeholder="비밀번호"
                    onChange={passwordValidation}
                  />
                </Box>
              </InputBox>
              <BoxMessage>
                <Message>{passwordMessage}</Message>
              </BoxMessage>
              <InputBox button>
                <Box>
                  <Button onClick={Login}>SignIn</Button>
                </Box>
                <Box>
                  <Div>SNS 계정으로 편하게 시작하기</Div>
                </Box>
              </InputBox>
              <InputBox button>
                <Box>
                  <ButtonKakao onClick={handleKakaoLogin}>kakao</ButtonKakao>
                </Box>
              </InputBox>
            </Form>
          </LoginBox>
        </Right>
        <Index />
      </Book>
    </Wrapper>
  );
}

const mapStateToProps = (state: object) => {
  return {
    user: state,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    userInfoToStore: (userInfo: object, token: string) => {
      dispatch(addUserInfo(userInfo, token));
    },
    initialUserInfoToStore: () => {
      dispatch(deleteUserInfo());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
