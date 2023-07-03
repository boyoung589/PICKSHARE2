import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import feedApi from '../../../api/feed';
import { useSelector } from 'react-redux';
import { FaRegCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import boardApi from '../../../api/board';
import {
  addBoardInfo,
  deleteBoardInfo,
  diaryOffAction,
} from '../../../redux/actions';
import { RootState } from '../../../redux';
import { MainFeedListProps } from '../../../types/feedType';
import { defaultProfile } from '../../../img/Img';

export default function MainFeedList({
  id,
  contentImg,
  userImage,
  nickname,
  date,
  heartNum,
  commentNum,
  title,
  isRender,
  personalFeed,
}: MainFeedListProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogin, accessToken, userInfo } = useSelector(
    (userReducer: RootState) => userReducer.userInfo
  );

  const [heart, setHeart] = useState(false);
  const [heartNumChV, setHeartNumChV] = useState(false);
  const [hearNumRen, setHeartNumRen] = useState(false);

  const heartNumState = heartNumChV
    ? Number(heartNum) - 1
    : Number(heartNum) + 1;

  const debounce = (cb: (arg: boolean) => void, delay: number) => {
    let timer: string | number | NodeJS.Timeout;
    return (arg: boolean) => {
      clearTimeout(timer);
      timer = setTimeout(() => cb(arg), delay);
    };
  };
  const heartValue = useCallback(
    debounce(async (heart: boolean) => {
      if (!heart) return await feedApi.postHeart(userInfo, id, accessToken);
      else return await feedApi.deleteHeart(userInfo, id, accessToken);
    }, 1000),
    []
  );
  const heartChangeButton = () => {
    setHeart((pre) => !pre);
    setHeartNumRen((pre) => !pre);
    heartValue(heart);
  };

  const moveToUsersFeed = (e: string) => {
    navigate(`/feed/${e}`);
  };

  const clickWithOutLoggedin = () => {
    alert('로그인이 필요한 서비스 입니다');
    navigate('/login');
  };

  const isDiaryOffHandler = () => {
    dispatch(diaryOffAction);
  };

  const moveToViewBoard = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    dispatch(deleteBoardInfo());
    const target = e.target as HTMLImageElement;

    const targetId = target.id;
    await boardApi.getBoardById(Number(targetId)).then((result) => {
      dispatch(addBoardInfo(result.data));
      isDiaryOffHandler();
      navigate('/diary', {
        state: {
          fromMainFeedList: true,
        },
      });
    });
  };

  useMemo(() => {
    if (isLogin) {
      const getHeart = async () => {
        //하트 기록이 있는지 서치, 하트가 있으면, 하트 트루, 없 false
        await feedApi.getHeart(id, accessToken).then((result) => {
          if (result.data === 1) {
            setHeart(true);
            setHeartNumChV(true);
          } else {
            setHeart(false);
          }
        });
      };
      getHeart().catch((err) => console.log(err));
    }
  }, [isRender]);
  const urlSlice = window.location.pathname.split('/')[2];

  useEffect(() => {
    return;
  }, [isRender]);

  return (
    <Div>
      <ImgDiv>
        <Img
          src={contentImg}
          id={`${id}`}
          onClick={(e) => moveToViewBoard(e)}
        />
      </ImgDiv>
      <ContentDiv>
        <ContentRightDiv>
          {userImage === 'nothing' ? (
            <UserImg src={defaultProfile} />
          ) : (
            <UserImg src={userImage} />
          )}
          <UserDiv>
            {isLogin && userInfo.nickname === urlSlice ? (
              //로그인 상태인지 아닌지
              //내 피드일 때 타이틀 아닐 때 닉네임
              <Title>{title}</Title>
            ) : (
              <UserNickname
                Personal={personalFeed ? true : false}
                className="nickname"
                onClick={() => moveToUsersFeed(nickname)}
              >
                {nickname}
              </UserNickname>
            )}
            <DateDiv Personal={personalFeed ? true : false}>{date}</DateDiv>
          </UserDiv>
        </ContentRightDiv>
        <ContentLeftDiv>
          <HeartDiv>
            <HeartButton
              onClick={isLogin ? heartChangeButton : clickWithOutLoggedin}
            >
              {heart ? <FilledHeart /> : <OutLineHeart />}
              <Num>{!hearNumRen ? heartNum : heartNumState}</Num>
            </HeartButton>
          </HeartDiv>
          <CommentDiv>
            <CommentIcon />
            <Num>{commentNum}</Num>
          </CommentDiv>
        </ContentLeftDiv>
      </ContentDiv>
    </Div>
  );
}

const Div = styled.div`
  flex: 1 1 auto;
  background-color: white;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  border-radius: 1rem;
  margin-bottom: 10px;
  &:hover {
    cursor: pointer;
    border: solid violet 2px;
  }
  @media screen and (min-width: 840px) {
    width: 48%;
    flex: 0 auto;
    margin: 1%;
    &:hover {
      scale: 1.02;
    }
  }
  @media screen and (min-width: 900px) {
    width: 31%;
  }
  @media screen and (min-width: 1400px) {
    width: 23%;
  }
`;
const ImgDiv = styled.div`
  box-sizing: border-box;
  overflow: hidden;
  aspect-ratio: 262 / 252.46;
`;
const Img = styled.img`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 1rem 1rem 0 0;
`;
const ContentDiv = styled.div`
  margin: 0 1rem;
  display: grid;
  grid-template-columns: 4fr 2fr;
`;
const ContentRightDiv = styled.div`
  display: flex;
  overflow: hidden;
  place-items: center;
`;
const UserImg = styled.img`
  border-radius: 100%;
  margin: 0.6rem 0;
  width: 2.9rem;
  height: 3rem;
`;
const UserDiv = styled.div`
  margin-left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  top: 2px;
`;
const UserNickname = styled.div<{ Personal?: boolean }>`
  display: ${(props) => (props.Personal ? 'none' : 'block')};
  font-size: 20px;
  font-weight: 400;
  width: 200px;
  color: #5b5959;
  &:hover {
    cursor: pointer;
    color: violet;
  }
  @media screen and (min-width: 900px) and (max-width: 1058px) {
    font-size: 15px;
  }
  @media screen and (max-width: 900px) {
    font-size: 23px;
  }
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;
const DateDiv = styled.div<{ Personal?: boolean }>`
  display: ${(props) => (props.Personal ? 'none' : 'block')};
  width: 90px;
  color: gray;
  font-size: 70%;

  @media screen and (min-width: 900px) and (max-width: 1058px) {
    font-size: 12px;
  }
`;
const ContentLeftDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  align-items: center;
  font-size: 27px;
  column-gap: 2px;
`;
const HeartDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const HeartButton = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;
const CommentDiv = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
`;
const Num = styled.div`
  font-size: 23px;
  width: 23px;
  margin: 0 5px;
  position: relative;
  top: 3px;
  color: #464545;
`;

const OutLineHeart = styled(FaRegHeart)`
  color: pink;
  font-weight: 600;
  height: 30px;
  width: 30px;
  animation-name: beat;
  animation-duration: 1s;
  animation-iteration-count: 1;
  @keyframes beat {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.6);
    }
  }
`;

const FilledHeart = styled(FaHeart)`
  color: pink;
  height: 30px;
  width: 30px;
  animation-name: beat;
  animation-duration: 1s;
  animation-iteration-count: 1;
`;
const CommentIcon = styled(FaRegCommentDots)`
  height: 30px;
  width: 30px;
  color: gray;
`;
