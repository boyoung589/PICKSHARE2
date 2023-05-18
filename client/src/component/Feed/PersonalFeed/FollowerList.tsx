import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import feedApi from '../../../api/feed';
import { UserInfoData, followerListProps } from '../../../types/feedType';

export default function FollowerList({ followerNickname }: followerListProps) {
  const [userlist, setUserlist] = useState({
    id: 0,
    nickname: '',
    userImage: '',
    statusMessage: '',
  });

  useEffect(() => {
    const findFollow = async () => {
      await feedApi
        .userInfo(followerNickname)
        .then(({ data }: UserInfoData) => {
          setUserlist(data.data);
        });
    };
    findFollow().catch((err) => console.log(err));
  }, []);

  return (
    <Wrapper>
      <UserImage src={userlist.userImage} />
      <UserNick>{userlist.nickname}</UserNick>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
  margin: 7px 0;
`;
const UserImage = styled.img`
  width: 50px;
  height: 46px;
  border-radius: 100%;
  overflow: auto;
`;
const UserNick = styled.div`
  width: 100px;
  font-size: 1rem;
  text-align: left;
`;
