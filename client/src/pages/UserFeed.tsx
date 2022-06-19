/*eslint-disable*/

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Nav from '../component/Nav/Nav';
import feedBG from '../img/feedBG.jpg';
import feedApi from '../api/feed';
import MainFeedList from '../component/Feed/MainFeed/MainFeedList';
import { useDispatch } from 'react-redux';
import Modal from '../component/Modal/Modal';
import { modalOnAction } from '../redux/actions';

const UserWapper = styled.div`
  width: 100vw;
  height: 100% + 150px;
  background-image: url(${feedBG});
  background-size: cover;
  background-attachment: scroll;
`;
const Div = styled.div`
  margin: 150px;
  border: blue dotted 3px;
  /* min-width: 35rem; */
  min-width: 21rem;
`;
const User = styled.div`
  border: red solid 1px;
  display: grid;
  margin: 0.6rem 4.5rem;
  margin-right: 4.5rem;
  grid-template-columns: 1fr 1fr 1fr;
`;

const UserDiv = styled.div`
  border: green solid 1px;
`;

const UserImg = styled.img`
  border: #020f0f solid 3px;
  position: relative;
  border-radius: 100%;
  width: 178px;
  height: 178px;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
`;
const UserFollow = styled.button`
  border: orangered dotted 1px;
  background-color: white;
  position: absolute;
  border-radius: 20px;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  width: 94px;
  height: 37px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  left: 21rem;
  top: 25.5rem;
  &:hover {
    cursor: pointer;
  }
`;
const UserInfo = styled.div`
  margin-left: 0.7rem;
`;
const UserDescribe = styled.div`
  border: peachpuff solid 1.5px;
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
  border: paleturquoise solid 1px;
  margin: 0.5rem;
  margin-left: 1rem;
  width: 200px;
`;
const UserFollowInfo = styled.div`
  border: red solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;
const Feed = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(20rem, auto));
`;

export default function UserFeed() {
  const dispatch = useDispatch();
  const [userfeedlist, setUserFeedlist]: any[] = useState({
    id: '',
    contentImg: '',
    date: '',
    nickname: '',
    userImage: '',
    heartNum: 0,
    commentNum: 0,
    lock: '',
  });

  const [userlist, setUserlist]: any[] = useState({
    nickname: '',
    userImage: '',
    statusMessage: '',
  });

  const [render, setRender] = useState(false);

  const [follow, setFollow] = useState(false); //팔로우
  const { isModalOn } = useSelector(
    (modalReducer: any) => modalReducer.modalInfo
  );
  console.log('이즈 모달 온', isModalOn);

  const { isLogin, accessToken, userInfo } = useSelector(
    (userReducer: any) => userReducer.userInfo
  );
  const [counts, setCounts] = useState(0);

  const path = window.location.pathname.split('/')[2];

  const [following, setFollowing]: any[] = useState({
    id: '',
    followingNickname: '',
    followerNickname: '',
  });

  const [follower, setFollower]: any[] = useState({
    id: '',
    user_id: '',
    followerNickname: '',
  });

  const searchShareHandler = (value: {}) => {
    if (!value) {
      setUserFeedlist([]);
      return;
    }
  };

  const handleFollow = async () => {
    if (isLogin === false) {
      alert('로그인이 필요한 서비스입니다');
    }
    return await feedApi.postFollow(userlist.nickname, accessToken).then(() => {
      setFollow(true);
      setRender(!render);
    });
  };

  const handleUnFollow = async () => {
    if (isLogin === false) {
      alert('로그인이 필요한 서비스입니다');
    }
    return await feedApi
      .deleteFollow(userlist.nickname, accessToken)
      .then(() => {
        setFollow(false);
        setRender(!render);
      });
  };

  const handleModalOn = () => {
    dispatch(modalOnAction);
    console.log('모달 바뀌나', isModalOn);
  };

  useMemo(() => {
    const userfeedinfo = async () => {
      return await feedApi.userInfo(path).then((result) => {
        setUserlist(result.data.data);
      });
    };

    userfeedinfo();

    if (isLogin === true) {
      feedApi.searchFollow(path, accessToken).then((result) => {
        if (result.data) {
          setFollow(true);
        }
      });
    }

    const getFollowingList = async () => {
      return await feedApi.getFollowingList(path).then((result) => {
        setFollowing(result.data);
      });
    };

    getFollowingList();

    const getFollowerList = async () => {
      return await feedApi.getFollowerList(path).then((result) => {
        console.log('팔로워', result.data);
        setFollower(result.data);
      });
    };
    getFollowerList();

    const countFeed = () => {
      return setCounts(userfeedlist.length);
    };
    countFeed();

    console.log('패스', path);
  }, [follow]);

  useEffect(() => {
    //내 피드가져오기
    const myFeed = async () => {
      return await feedApi.getMyFeed(accessToken)
      .then((result) => {
        console.log('데이터 전', result)
        console.log('내피드', result.data)
        console.log(typeof(result.data))
        setUserFeedlist(result.data);
        console.log('내피드리스트',userfeedlist)
      })
    }

    //유저들의 피드
    const userPage = async () => {
      return await feedApi.getUserFeed(path).then((result) => {
        setUserFeedlist(result.data);
      });
    };
    console.log('유저페이지 유저인포',userInfo)
    if(userInfo.nickname === path){
      myFeed();
    } else{
      userPage();
    }
  }, [render]);

  return (
    <UserWapper>
      <Nav />
      <Div>
        <div>UserFeed</div>
        <User>
          <div>
            <UserDiv>
              <UserImg src={userlist.userImage} />
              {isLogin === true ? (
                follow === true ? (
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
              <Content>{userlist.nickname}</Content>
            </UserDescribe>
            <UserDescribe>
              <Content>{userlist.statusMessage}</Content>
            </UserDescribe>
            <UserDescribe>
              <div>
                <UserFollowInfo>게시물</UserFollowInfo>
                <UserFollowInfo>{counts}</UserFollowInfo>
              </div>
              <div>
                <UserFollowInfo onClick={handleModalOn}>팔로잉</UserFollowInfo>
                <UserFollowInfo>{following.length}</UserFollowInfo>
              </div>
              <div>
                <UserFollowInfo onClick={handleModalOn}>팔로워</UserFollowInfo>
                <UserFollowInfo>{follower.length}</UserFollowInfo>
              </div>
            </UserDescribe>
          </UserInfo>
        </User>
        <Feed>
          {userfeedlist.id === ''
            ? `${userlist.nickname}님의 피드가 없습니다`
            : userfeedlist.map((el: any) => (
                <MainFeedList
                  {...el}
                  key={el.id}
                  render={render}
                  setRender={setRender}
                />
              ))}
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
    </UserWapper>
  );
}
