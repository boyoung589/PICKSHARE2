// /*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import feedApi from '../../../api/feed';
import { RootState } from '../../../redux';
import { UserInfoData, followingListProps } from '../../../types/feedType';

export default function FollowingList({
  followingNickname,
  setFollow,
}: followingListProps) {
  const { isLogin, accessToken } = useSelector(
    (userReducer: RootState) => userReducer.userInfo
  );
  const [userlist, setUserlist] = useState({
    id: 0,
    nickname: '',
    userImage: '',
    statusMessage: '',
  });
  const handleUnFollow = async () => {
    if (isLogin === false) {
      alert('로그인이 필요한 서비스입니다');
    }
    await feedApi.deleteFollow(followingNickname, accessToken).then(() => {
      setFollow(false);
    });
  };

  useEffect(() => {
    const findFollow = async () => {
      await feedApi
        .userInfo(followingNickname)
        .then(({ data }: UserInfoData) => {
          setUserlist(data.data);
        });
    };
    findFollow().catch((err) => console.log(err));
  }, []);
  //useMemo()
  return (
    <Wrapper>
      <UserImage src={userlist.userImage} />
      <UserNick>{userlist.nickname}</UserNick>
      <FollowButton onClick={handleUnFollow}>unfollow</FollowButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;
const UserImage = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 100%;
  overflow: hidden;
`;
const UserNick = styled.div``;
const FollowButton = styled.button`
  background-color: white;
  border-radius: 20px;
  width: 94px;
  height: 37px;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  &:hover {
    cursor: pointer;
  }
`;
