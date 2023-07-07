import React from 'react';
import { FaHeart } from 'react-icons/fa';
import styled from 'styled-components';
import { FaRegCommentDots } from 'react-icons/fa';
import SkeletonItem from './SkeletonItem';
const FeedCardSkeleton = () => {
  return (
    <Div>
      <ImgDiv>
        <Img></Img>
      </ImgDiv>
      <ContentDiv>
        <ContentRightDiv>
          <UserImg />
          <UserDiv>
            <UserNickname></UserNickname>
            <DateDiv></DateDiv>
          </UserDiv>
        </ContentRightDiv>
        <ContentLeftDiv>
          <HeartDiv>
            <HeartButton>
              <FilledHeart />
            </HeartButton>
          </HeartDiv>
          <CommentDiv>
            <CommentIcon />
          </CommentDiv>
        </ContentLeftDiv>
      </ContentDiv>
    </Div>
  );
};
const Div = styled.div`
  flex: 1 1 auto;
  background-color: white;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  border-radius: 1rem;
  margin-bottom: 10px;
  background: #f3f0f0;
  transition: all 3s linear 6s;

  @media screen and (min-width: 840px) {
    width: 48%;
    flex: 0 auto;
    margin: 1%;
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
const Img = styled(SkeletonItem)`
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
const UserImg = styled(SkeletonItem)`
  border-radius: 100%;
  flex-shrink: 0;
  margin: 0.6rem 0;
  width: 2.9rem;
  height: 3rem;
  background-color: #d3d0d0;
`;
const UserDiv = styled.div`
  width: 90%;
  margin: 1%;
  display: flex;
  height: 44px;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;
const UserNickname = styled(SkeletonItem)`
  font-size: 20px;
  font-weight: 400;
  background-color: #d3d0d0;
  height: 20px;
  flex: 1 0 auto;
`;

const DateDiv = styled(SkeletonItem)`
  width: 80px;
  background-color: #d3d0d0;
  font-size: 70%;
  height: 20px;
  margin-top: 2px;
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
`;
const CommentDiv = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
`;

const FilledHeart = styled(FaHeart)`
  color: #d3d0d0;
  height: 50px;
  width: 43px;
`;
const CommentIcon = styled(FaRegCommentDots)`
  height: 50px;
  width: 43px;
  color: #d3d0d0;
`;

export default FeedCardSkeleton;
