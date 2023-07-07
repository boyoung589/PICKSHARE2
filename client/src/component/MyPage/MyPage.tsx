/*eslint-disable*/
import React, { useState, useRef, Ref } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { addUserInfo, deleteUserInfo } from '../../redux/actions/index';

import ErrorLoadingPage from '../../pages/ErrorLoadingPage';

import signupApi from '../../api/signup';
import mypageApi from '../../api/mypage';

import styled from 'styled-components';
import homeIndex from '../../img/homeIndex.png';
import edit from '../../img/edit.jpg';

import { RootState } from '../../redux';
import { IMyPageData } from '../../types/mypageType';
import { defaultProfile } from '../../img/Img';

const AWS = require('aws-sdk/dist/aws-sdk-react-native');

function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isLogin,
    userInfo: { email, loginMethod, nickname, statusMessage, userImage },
    accessToken,
  } = useSelector((selector: RootState) => selector.userInfo);

  const [updateProfile, setUpdateProfile] = useState(false);
  const [withdraw, setWithdraw] = useState(false);

  // 👉 프로필 수정 파트
  const inputNickname: Ref<HTMLInputElement> = useRef();
  const statusmessage: Ref<HTMLInputElement> = useRef();

  const [loading, setLoading] = useState(false); // 회원정보 삭제시 로딩페이지 분기
  const [nicknamecheckMessage, setNicknameCheckMessage] = useState('');
  const [nicknameValidate, setNicknameValidate] = useState(false);
  // 수정할 유저정보
  const [updateUserInfo, setUpdateUserInfo] = useState({
    email,
    nickname,
    statusMessage,
    userImage,
  });

  const updateInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateUserInfo({ ...updateUserInfo, [e.target.name]: e.target.value });
  };

  const hadleNicknameValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInfo(e);

    if (e.target.value.length === 1 || e.target.value.length > 20) {
      setNicknameCheckMessage('닉네임은 2~20자 이내입니다.');
      setNicknameValidate(false); // 닉네임유효성 결과 통과
    } else {
      setNicknameCheckMessage('');
      setNicknameValidate(true);
    }
  };
  const [nicknamecheck, setNicknameCheck] = useState(nickname);

  // 이미지 편집
  const file: Ref<HTMLInputElement> = useRef();

  //닉네임 중복검사
  const nicknameCheck = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { nickname } = updateUserInfo;
    if (nicknameValidate === true && inputNickname.current.value !== '') {
      try {
        await signupApi.nicknamecheck(nickname).then((res) => {
          if (res.data === false) {
            setNicknameCheckMessage('사용할 수 있는 닉네임입니다.');
            setNicknameCheck(nickname); // 나중에 수정완료 버튼을 누를 시  e.target.value과 nicknamecheck의 정보가 일치하는지를 확인
          } else {
            setNicknameCheckMessage('이미 사용중인 닉네임입니다');
          }
        });
      } catch (error) {
        alert('중복검사 실패했습니다.');
        console.log(error);
      }
    } else {
      alert('닉네임 조건을 충족시켜주세요');
    }
  };

  // 수정완료
  const updateFinish = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { nickname, statusMessage, userImage } = updateUserInfo;
    if (inputNickname.current.value === '') {
      updateUserInfo.nickname = inputNickname.current.placeholder;
    }
    if (nickname !== nicknamecheck && inputNickname.current.value !== '') {
      alert('중복검사를 시행해주세요');
      return;
    } else {
      try {
        await mypageApi
          .patch(nickname, statusMessage, userImage, accessToken)
          .then((res: IMyPageData) => {
            const { data } = res.data;
            void dispatch(addUserInfo(data, accessToken));
            alert('수정이 완료되었습니다.');
            setUpdateProfile(!updateProfile);
            setUpdateProfile(true);
            setNicknameCheckMessage('');
            setWithdraw(!withdraw);
          });
      } catch (error) {
        alert('회원정보 수정에 실패했습니다');
        console.log(error);
      }
    }
  };

  // 👉 탈퇴하기
  const inputPassword: Ref<HTMLInputElement> = useRef();
  const inputPasswordCheck: Ref<HTMLInputElement> = useRef();
  const [passwordValue, setPasswordValue] = useState({
    password: '',
    passwordCheck: '',
  });

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue({ ...passwordValue, [e.target.name]: e.target.value });
  };

  //탈퇴하기 버튼
  const withdrawl = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loginMethod === 1) {
      setWithdraw(!withdraw);
      if (withdraw === true) {
        const { password, passwordCheck } = passwordValue;
        if (password !== passwordCheck || password === '') {
          alert('비밀번호를 확인해주세요');
          return;
        } else {
          try {
            if (
              !window.confirm(
                '정말 탈퇴하시겠습니까? 탈퇴한 계정의 데이터는 복구가 불가합니다.'
              )
            ) {
              return;
            } else {
              await mypageApi
                .userRemove(passwordCheck, accessToken)
                .then((res) => {
                  if (res.data.statusCode === 200) {
                    void dispatch(deleteUserInfo());
                    setLoading(!loading);
                    setTimeout(() => {
                      alert('계정이 삭제되었습니다.');
                      navigate('/mainfeed');
                      return;
                    }, 2000);
                  } else {
                    alert('탈퇴에 실패했습니다. 비밀번호를 확인해주세요');
                  }
                });
            }
          } catch (error) {
            alert('회원 탈퇴에 실패했습니다. 다시 한번 시도해 주세요');
            console.log(error);
          }
        }
      }
    } else if (loginMethod === 2) {
      if (
        !window.confirm(
          '정말 탈퇴하시겠습니까? 탈퇴한 계정의 데이터는 복구가 불가합니다.'
        )
      ) {
        return;
      } else {
        try {
          await mypageApi.userRemoveKakao(accessToken).then((res) => {
            if (res.data.statusCode === 200) {
              void dispatch(deleteUserInfo());
              setLoading(!loading);
              setTimeout(() => {
                alert('계정이 삭제되었습니다.');
                navigate('/mainfeed');
                return;
              }, 2000);
            }
          });
        } catch (error) {
          if (error) {
            console.log(error);
            alert('회원 탈퇴에 실패했습니다. 다시 한번 시도해 주세요');
            return;
          }
        }
      }
    }
  };

  //* aws-프로필 이미지 연결 *//
  AWS.config.update({
    region: `${process.env.REACT_APP_AWS_REGION}`, // congito IdentityPoolId 리전을 문자열로 입력하기. 아래 확인 (Ex. "ap-northeast-2")
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: `${process.env.REACT_APP_AWS_IMG_ID}`, // cognito 인증 풀에서 받아온 키를 문자열로 입력하기. (Ex. "ap-northeast-2...")
    }),
  });

  const firstImgHandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files[0]; // 업로드된 파일 객체

    if (!imageFile) {
      return setUpdateUserInfo({
        ...updateUserInfo,
        [e.target.name]: 'nothing',
      });
    }
    setUpdateUserInfo({ ...updateUserInfo, [e.target.name]: imageFile });

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: 'profileimage-pickshare', // 업로드할 대상 버킷명 문자열로 작성.
        Key: imageFile.name, //업로드할 파일명
        Body: imageFile, // 업로드할 파일 객체
      },
    });

    const promise = upload.promise();

    await promise.then(
      function (data: { Location: any }) {
        setUpdateUserInfo({
          ...updateUserInfo,
          [e.target.name]: data.Location,
        });
      },
      function (err: any) {
        console.log(err, '사진등록 실패');
      }
    );
  };

  //console.log(userImage); // 디비에 저장된 정보
  //임시 저장소 (디비에 저장된 정보와 비교해서 프로필 이미지 수정할때 보여줄것임)
  const preUserImage: string = updateUserInfo.userImage;
  return (
    <>
      {isLogin === false && loading ? (
        <ErrorLoadingPage text="deleting..." />
      ) : isLogin === false ? (
        <>
          <ErrorLoadingPage />
        </>
      ) : (
        <Wrapper>
          <Book>
            <Left Visible={withdraw}>
              {updateProfile === true && withdraw === false ? (
                <>
                  <Form Left>
                    <Div>
                      <Profile>
                        {userImage === 'nothing' ? (
                          <>
                            <Img src={defaultProfile} />
                          </>
                        ) : userImage !== preUserImage ? (
                          <Img src={preUserImage} />
                        ) : (
                          <>
                            <Img src={userImage} />
                          </>
                        )}
                      </Profile>
                      <label htmlFor="imgUpload">
                        <Edit src={edit} />
                      </label>
                    </Div>
                    <Message Left>상태메세지</Message>
                    <Input
                      Status
                      type="text"
                      ref={statusmessage}
                      name="statusMessage"
                      placeholder={statusMessage}
                      onChange={updateInfo}
                    />
                    <InputProfile
                      type="file"
                      id="imgUpload"
                      ref={file}
                      accept="image"
                      onChange={firstImgHandle}
                      name="userImage"
                    ></InputProfile>
                  </Form>
                </>
              ) : (
                <>
                  <Form Left>
                    <Div>
                      <Profile>
                        {userImage === 'nothing' ? (
                          <>
                            <Img src={defaultProfile} />
                          </>
                        ) : (
                          <>
                            <Img src={userImage} />
                          </>
                        )}
                      </Profile>
                    </Div>
                    <StatusMessage>{statusMessage}</StatusMessage>
                  </Form>
                </>
              )}
            </Left>
            <Right>
              <UpdateProfileBox>
                {updateProfile === true && withdraw === false ? (
                  <>
                    <Title>프로필 수정</Title>
                    <Form UpdateProfile>
                      <BoxMessage>
                        <Message UpdateProfile>이메일</Message>
                      </BoxMessage>
                      <InputBox>
                        <Box>
                          <Input
                            ref={inputNickname}
                            value={email}
                            disabled
                            style={{ color: '#F548CC', fontWeight: 'bolder' }}
                          />
                        </Box>
                      </InputBox>
                      <BoxMessage>
                        <Message UpdateProfile>닉네임</Message>
                      </BoxMessage>
                      <InputBox>
                        <Box>
                          <Input
                            Check
                            type="text"
                            ref={inputNickname}
                            name="nickname"
                            placeholder={nickname}
                            onChange={hadleNicknameValidation}
                          />
                          <CheckButton onClick={nicknameCheck}>
                            중복검사
                          </CheckButton>
                        </Box>
                        <NicknameCheckMessage>
                          {nicknamecheckMessage}
                        </NicknameCheckMessage>
                      </InputBox>
                      <InputBox button>
                        <Box>
                          <Button
                            onClick={() => {
                              setUpdateProfile(!updateProfile);
                              setNicknameCheckMessage('');
                              setNicknameCheck('');
                              setUpdateUserInfo({
                                ...updateUserInfo,
                                userImage: userImage,
                              });
                            }}
                          >
                            취소
                          </Button>
                          <Button onClick={updateFinish}>수정완료</Button>
                        </Box>
                      </InputBox>
                    </Form>
                  </>
                ) : updateProfile === false && withdraw === true ? (
                  <>
                    <Title>회원탈퇴 </Title>
                    <Form>
                      <BoxMessage>
                        <Message UpdateProfile>비밀번호</Message>
                      </BoxMessage>
                      <InputBox>
                        <Box>
                          <Input
                            ref={inputPassword}
                            name="password"
                            type="text"
                            onChange={handlePassword}
                          />
                        </Box>
                      </InputBox>
                      <BoxMessage>
                        <Message UpdateProfile>비밀번호 확인</Message>
                      </BoxMessage>
                      <InputBox>
                        <Box>
                          <Input
                            ref={inputPasswordCheck}
                            type="text"
                            name="passwordCheck"
                            onChange={handlePassword}
                          />
                        </Box>
                      </InputBox>
                      <InputBox button>
                        <Box>
                          <Button
                            Return
                            MyPageButton
                            onClick={() => {
                              setWithdraw(!withdraw);
                            }}
                          >
                            되돌아가기
                          </Button>
                          <Button onClick={withdrawl}>탈퇴하기</Button>
                        </Box>
                      </InputBox>
                    </Form>
                  </>
                ) : (
                  <>
                    <Title>마이페이지</Title>
                    <Form MyPageMenu>
                      <Box>
                        <Button
                          MyPageButton
                          onClick={() => {
                            setUpdateProfile(!updateProfile);
                          }}
                        >
                          프로필수정
                        </Button>
                      </Box>
                      <Box>
                        <Button MyPageButton onClick={withdrawl}>
                          탈퇴하기
                        </Button>
                      </Box>
                    </Form>
                  </>
                )}
              </UpdateProfileBox>
            </Right>
            <Index>
              <TagHome
                src={homeIndex}
                onClick={() => {
                  navigate('/mainfeed', { replace: true });
                }}
              ></TagHome>
            </Index>
          </Book>
        </Wrapper>
      )}
    </>
  );
}

export default MyPage;

const Wrapper = styled.div`
  width: 100%;
  height: 60rem;
  background-image: url('https://profileimage-pickshare.s3.ap-northeast-2.amazonaws.com/feedBG.jpg');
`;

const Book = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  padding-top: 70px;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
`;
const Left = styled.div<{ Visible?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 511px;
  height: 800px;
  padding-left: 1em;
  background-color: white;
  border-radius: 30px 20px 20px 30px;
  box-shadow: 10px 10px 30px #3c4a5645;
  border-right: #b1b0b0 solid 2px;
  @media screen and (max-width: 1200px) {
    position: relative;
    left: 260px;
    top: 20rem;
    width: 0px;
    height: 0px;
    display: ${(props) => (props.Visible ? 'none' : 'flex')};
  }
`;

const Right = styled.div`
  height: 800px;
  width: 511px;
  flex-shrink: 0;
  background-color: white;
  padding-left: 1em;
  border-radius: 20px 30px 30px 20px;
  box-shadow: 30px 10px 10px #3c4a5645;
  border-left: #b1b0b0 solid 2px;
`;
const Index = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  margin-top: 10px;
`;
const TagHome = styled.img`
  width: 7rem;
  height: 4.5rem;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
`;

/// 세부사항

const Img = styled.img`
  border: solid #bbbabe 3px;
  padding: 0.5rem;
  box-sizing: border-box;
  flex: 1 0 auto;
  height: 16rem;
  border-radius: 100%;
`;
const UpdateProfileBox = styled.div`
  height: 750px;
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
const Form = styled.form<{
  Left?: boolean;
  UpdateProfile?: boolean;
  MyPageMenu?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${(props) => (props.Left ? 'center' : null)};
  width: 359px;
  height: 472px;
  @media screen and (max-width: 1200px) {
    margin-top: ${(props) => (props.Left ? '120px' : '0px')};
    position: relative;
    top: ${(props) =>
      props.UpdateProfile ? '200px' : props.MyPageMenu ? '160px' : '10px'};
  }
`;
const InputBox = styled.div<{ button?: any }>`
  height: 3.3rem;
  margin-top: ${(props) => (props.button ? '1rem' : '0')};
  position: relative;
  top: ${(props) => (props.button ? '-10px' : '-11px')};
`;
const Message = styled.div<{ UpdateProfile?: boolean; Left?: boolean }>`
  height: 1.7rem;
  width: 100px;
  padding: 15px 0;
  font-size: 15px;
  opacity: 0.5;
  margin-bottom: 20px;
  position: relative;
  right: ${(props) => (props.Left ? '115px' : '105px')};

  @media screen and (max-width: 1200px) {
    top: ${(props) => (props.Left ? '-91px' : '-15px')};
    margin-bottom: 10px;
  }
`;
const Input = styled.input<{ Check?: boolean; Status?: boolean }>`
  height: 3rem;
  width: ${(props) => (props.Check ? '82%' : props.Status ? '350px' : '98%')};
  border-radius: 30px;
  box-shadow: 0 3px 5px #3c4a5645;
  text-decoration: none;
  font-size: large;
  outline: none;
  padding: 0 1em;
  border: 0;
  opacity: 0.6;
  font-weight: bolder;
  margin-bottom: 10px;
  @media screen and (max-width: 1200px) {
    position: relative;
    right: ${(props) => (props.Status ? '-6px' : '0px')};
    top: ${(props) =>
      props.Status ? '-89px' : props.Check ? '-155px' : '-153px'};
  }
`;
const Button = styled.button<{ MyPageButton?: any; Return?: any }>`
  width: ${(props) => (props.MyPageButton ? '20rem' : '12rem')};
  width: ${(props) => (props.Return ? '12rem' : null)};
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
  margin: 0.1rem;
  @media screen and (max-width: 1200px) {
    position: relative;
    top: -150px;
  }
`;

const CheckButton = styled.button`
  height: 3rem;
  background: linear-gradient(to right, #a396f8, #d06be0, #fd40c8);
  box-shadow: 0 5px 14px #3c4a5645;
  box-sizing: border-box;
  color: white;
  border-radius: 10px;
  margin: 0.1rem;
  margin-left: 0.2rem;
  padding: 0.1rem;
  @media screen and (max-width: 1200px) {
    position: relative;
    top: -154px;
  }
`;

const Div = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 20rem;
  height: 22rem;
`;

const Box = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  @media screen and (max-width: 1200px) {
    position: relative;
    top: 150px;
  }
`;
const BoxMessage = styled.div`
  display: flex;
  margin-left: 5.3rem;
  align-items: center;
  text-align: center;
  padding-right: 7rem;
`;
const Profile = styled.div`
  width: 15rem;
  height: 20rem;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;
const Edit = styled.img`
  width: 6rem;
  height: 5rem;
  position: relative;
  bottom: 5.5rem;
  left: 3rem;
  border-radius: 100%;
  margin: 0;
  padding: 0;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;
const StatusMessage = styled.div`
  font-weight: bolder;
  font-size: 1.3rem;
  color: #5f5e5e;
  @media screen and (max-width: 1200px) {
    position: relative;
    top: -40px;
  }
`;

// input file(프로필 변경태그, 이 부분 숨김)
const InputProfile = styled.input`
  visibility: hidden;
`;
const NicknameCheckMessage = styled.div`
  margin-left: 90px;
  font-size: 15px;
  position: relative;
  top: -6px;
  color: tomato;
`;
