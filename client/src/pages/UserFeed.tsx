import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import feedApi from '../api/feed';
import MainFeedList from '../component/Feed/MainFeed/MainFeedList';
import { useDispatch } from 'react-redux';
import Modal from '../component/Modal/Modal';
import {
  deleteBoardInfo,
  diaryOnAction,
  modalOnAction,
} from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import { defaultProfile } from '../img/Img';

import { RootState } from '../redux';
import {
  Feedlist,
  FollowerListType,
  FollowingListType,
  IOptions,
  UserInfoData,
} from '../types/feedType';
import { renderAction } from '../redux/actions';
import { Spinner } from '../common/spinner/Spinner';
import ScrollTopButton from '../component/ScrollTopButton/ScrollTopButton';

export default function UserFeed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userfeedlist, setUserFeedlist] = useState<Feedlist[] | null>([]);
  const [userlist, setUserlist] = useState({
    id: 0,
    nickname: '',
    userImage: '',
    statusMessage: '',
  });
  const [targetLoading, setTargetLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const target = useRef<HTMLDivElement>(null);
  let start = 0;
  let end = 8;
  const [follow, setFollow] = useState(false); //팔로우
  const { isModalOn } = useSelector(
    (modalReducer: RootState) => modalReducer.modalInfo
  );
  const { isRender } = useSelector(
    (renderReducer: RootState) => renderReducer.renderInfo
  );
  const { isLogin, accessToken, userInfo } = useSelector(
    (userReducer: RootState) => userReducer.userInfo
  );
  const path = window.location.pathname.split('/')[2];
  const [following, setFollowing] = useState<FollowingListType[]>([]);
  const [follower, setFollower] = useState<FollowerListType[]>([]);

  const writeNewDiary = () => {
    //새로 만들기
    dispatch(deleteBoardInfo());
    dispatch(diaryOnAction);
    navigate('/diary');
  };
  const handleFollow = async () => {
    if (isLogin === false) {
      alert('로그인이 필요한 서비스입니다');
    }
    await feedApi.postFollow(userlist.nickname, accessToken).then(() => {
      setFollow(true);
      dispatch(renderAction);
    });
  };

  const handleUnFollow = async () => {
    if (isLogin === false) {
      alert('로그인이 필요한 서비스입니다');
    }
    return await feedApi.deleteFollow(path, accessToken).then(() => {
      setFollow(false);
      dispatch(renderAction);
    });
  };

  const handleModalOn = () => {
    dispatch(modalOnAction);
  };

  const userfeedinfo = async () => {
    return feedApi.userInfo(path).then(({ data }: UserInfoData) => {
      setUserlist(data.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  };

  //유저가 팔로우하고 있는 다른 유저들의 목록 리턴
  const getFollowingList = async () => {
    await feedApi.getFollowingList(path).then((result) => {
      setFollowing(result.data);
    });
  };

  //유저를 팔로우하고 있는 다른 유저 목록 리턴
  const getFollowerList = async () => {
    await feedApi.getFollowerList(path).then((result) => {
      setFollower(result.data);
    });
  };

  //유저가 특정 닉네임을 팔로우하고있는지 아닌지 판별
  const searchFollower = async () => {
    await feedApi.searchFollow(path, accessToken).then((result) => {
      if (result.data) {
        setFollow(true);
      }
    });
  };

  useMemo(() => {
    userfeedinfo().catch((err) => console.log(err));
    if (isLogin === true) {
      searchFollower().catch((err) => console.log(err));
    }
    getFollowingList().catch((err) => console.log(err));
    getFollowerList().catch((err) => console.log(err));
  }, [follow]);

  //내 피드가져오기
  let myfeedFlag = 0;
  const myFeed = async () => {
    if (userfeedlist.length < end && myfeedFlag) return false;
    await feedApi.getMyFeed(accessToken, start, end).then((result) => {
      myfeedFlag = 1;
      setUserFeedlist((prev) => prev.concat(result.data));
    });
    start += 8;
    end += 8;
  };

  //유저들의 피드
  let flag = 0;
  const userPage = async (path: string) => {
    if (userfeedlist.length < end && flag) return false;
    await feedApi.getUserFeed(path, start, end).then((result) => {
      flag = 1;
      setUserFeedlist((prev) => prev.concat(result.data));
    });
    start += 8;
    end += 8;
  };
  useEffect(() => {
    if (userInfo.nickname === path) {
      myFeed().catch((err) => console.log(err));
    } else {
      userPage(path).catch((err) => console.log(err));
    }
  }, []);

  const disconnectFetch = (result: boolean, callback: IntersectionObserver) => {
    console.log('hi');
    if (!result) return () => callback.unobserve(target.current);
  };
  useEffect(() => {
    const options: IOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTargetLoading(entry.isIntersecting);
          setTimeout(() => {
            if (userInfo.nickname === path) {
              myFeed()
                .then((res) => disconnectFetch(res, io))
                .catch((err) => console.log(err));
            } else {
              userPage(path)
                .then((res) => disconnectFetch(res, io))
                .catch((err) => console.log(err));
            }
            setTargetLoading(false);
          }, 1000);
        }
      });
    }, options);

    if (target.current) {
      io.observe(target.current);
    }
  }, [path, isRender, target]);
  return (
    <UserWapper>
      <ScrollTopButton />
      <Div>
        <User>
          <div>
            <UserDiv>
              <>
                {userlist.userImage === 'nothing' ? (
                  <UserImg src={defaultProfile} />
                ) : (
                  <UserImg src={userlist.userImage} />
                )}
              </>
              {isLogin === true ? (
                //내 피드이면 안보이기
                userInfo.nickname === path ? (
                  <Block></Block>
                ) : follow === true ? (
                  //로그인o 팔로우o
                  <UserFollow onClick={handleUnFollow}>unfollow</UserFollow>
                ) : (
                  //로그인o 팔로우x
                  <UserFollow onClick={handleFollow}>follow</UserFollow>
                )
              ) : (
                //로그인x
                <UserFollow onClick={handleFollow}>follow</UserFollow>
              )}
            </UserDiv>
          </div>
          <UserInfo>
            <UserDescribe>
              <Content>
                {userlist.nickname ? <>{userlist.nickname}</> : null}
              </Content>
            </UserDescribe>
            <UserDescribe>
              <Content>{userlist.statusMessage}</Content>
            </UserDescribe>
            <UserDescribe>
              <div>
                <UserFollowInfo>게시물</UserFollowInfo>
                <UserFollowInfo>{userfeedlist.length}</UserFollowInfo>
              </div>
              <FolWrapper onClick={handleModalOn}>
                <UserFollowInfo>팔로잉</UserFollowInfo>
                <UserFollowInfo>{following.length}</UserFollowInfo>
              </FolWrapper>
              <FolWrapper onClick={handleModalOn}>
                <UserFollowInfo>팔로워</UserFollowInfo>
                <UserFollowInfo>{follower.length}</UserFollowInfo>
              </FolWrapper>
            </UserDescribe>
          </UserInfo>
        </User>
        {userInfo.nickname === path ? (
          <PlusButton>
            <button onClick={writeNewDiary}> + </button>
          </PlusButton>
        ) : (
          <PlusButton Hidden>
            <button> + </button>
          </PlusButton>
        )}
        <Feed>
          {isLoading || userfeedlist.length < 0 ? (
            <LoadingConatiner>
              <LoadingSpinner />
              <Loading>loading...</Loading>
            </LoadingConatiner>
          ) : null}
          {!isLoading && userfeedlist.length > 0 ? (
            userfeedlist.map((el) => (
              <MainFeedList {...el} key={el.id} isRender personalFeed />
            ))
          ) : !isLoading && userfeedlist.length === 0 ? (
            <Message>{userlist.nickname}님의 게시글이 없습니다</Message>
          ) : null}
        </Feed>
        {isModalOn ? (
          <Modal
            follower={follower}
            following={following}
            follow={follow}
            setFollow={setFollow}
          />
        ) : null}
      </Div>
      {targetLoading ? (
        <TargetContainer>
          <TargetSpinner />
        </TargetContainer>
      ) : null}
      <div ref={target} className="Target-Element"></div>
    </UserWapper>
  );
}
const TargetContainer = styled.div`
  width: 100%auto;
  height: 10%;
`;
const TargetSpinner = styled(Spinner)``;
const UserWapper = styled.div`
  width: 100%;
  min-height: 90vh;
`;
const Div = styled.div`
  padding: 10rem;
  @media screen and (max-width: 947px) {
    padding: 10rem 2rem;
  }
`;
const User = styled.div`
  display: flex;
  column-gap: 6rem;

  @media screen and (max-width: 947px) {
    flex-direction: column;
    margin: 0 auto;
  }
`;

const UserDiv = styled.div`
  margin-left: 15px;
  @media screen and (max-width: 947px) {
    margin-left: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const Message = styled.div`
  font-weight: bold;
  color: #6a6a6a;
`;
const UserImg = styled.img`
  position: relative;
  border-radius: 100%;
  width: 178px;
  height: 178px;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  @media screen and (max-width: 947px) {
    margin-bottom: 30px;
    width: 200px;
    height: 200px;
    left: 30px;
    flex-shrink: 0;
  }
  @media screen and (max-width: 370px) {
    left: 10px;
  }
`;
const UserFollow = styled.button`
  background-color: white;
  position: relative;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  width: 94px;
  height: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  top: -50px;
  left: 6em;
  &:hover {
    cursor: pointer;
    background: #fee7f4;
  }
  @media screen and (max-width: 947px) {
    top: 4rem;
    left: -3rem;
  }
`;
const UserInfo = styled.div`
  @media screen and (max-width: 947px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const UserDescribe = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  border-radius: 1rem;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  width: 261px;
  height: 40px;
  background-color: white;
  margin: 1rem;
`;
const Content = styled.div`
  margin: 0.5rem;
  margin-left: 1rem;
  width: 200px;
  padding-top: 7px;
  font-weight: 700;
  color: #494949;
`;
const UserFollowInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4px;
  font-weight: 700;
  color: #494949;
  &:hover {
    cursor: pointer;
  }
`;
const Feed = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 840px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    min-height: 35vh;
  }
`;
const PlusButton = styled.div<{ Hidden?: any }>`
  visibility: ${(props) => (props.Hidden ? 'hidden' : 'visible')};
  display: flex;
  justify-content: right;
  margin: 1rem 0;
  button {
    background-color: #c4c4c4;
    border-radius: 100%;
    width: 2rem;
    height: 2rem;
    margin-left: 0.3rem;
    font-size: 1.8rem;
    text-align: center;
    font-weight: 400;
    &:hover {
      cursor: pointer;
      background: #fee7f4;
    }
  }
`;
const FolWrapper = styled.div`
  &:hover {
    background: #fee7f4;
    cursor: pointer;
    border-radius: 20px;
    scale: 1.1;
  }
`;
const Block = styled.div`
  @media screen and (max-width: 947px) {
    width: 57px;
  }
`;
const Loading = styled.div`
  justify-content: center;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bolder;
  width: 100%;
  margin-top: 5px;
  background: linear-gradient(to right, #8272eb, #d06be0, #fd40c8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: text 1s infinite linear alternate;
  @keyframes text {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const LoadingSpinner = styled(Spinner)`
  width: 80px;
  height: 80px;
`;
const LoadingConatiner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
