import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import feedApi from '../api/feed';
import MainFeedList from '../component/Feed/MainFeed/MainFeedList';
import { BiSearch } from 'react-icons/bi';
import { debounce } from 'debounce';
import { useSelector, useDispatch } from 'react-redux';
import { deleteBoardInfo, diaryOnAction, renderAction } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import { feedBG } from '../img/Img';
import { RootState } from '../redux';
import { Feedlist, IOptions } from '../types/feedType';
import FeedCardSkeleton from '../common/skeleton/FeedCardSkeleton';
import { Spinner } from '../common/spinner/Spinner';

export default function MainFeed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedlist, setFeedlist] = useState<Feedlist[] | null>([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchOn, setSearchOn] = useState(false);
  const [orderingH, setOrderingH] = useState(false);

  const [targetLoading, setTargetLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const target = useRef<HTMLDivElement>(null);

  let start = 0;
  let end = 8;
  const { userInfo, isLogin } = useSelector(
    (userReducer: RootState) => userReducer.userInfo
  );
  const { isRender } = useSelector(
    (renderReducer: RootState) => renderReducer.renderInfo
  );
  const handleSearchInput = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchOn(true);
      setSearchInput(e.target.value);
    },
    300
  );

  const writeNewDiary = () => {
    //새로 만들기
    dispatch(deleteBoardInfo());
    dispatch(diaryOnAction);
    navigate('/diary');
  };

  const selectFeed = () => {
    dispatch(renderAction);
  };
  const sortFeedByRecent = () => {
    setIsLoading(true);
    if (orderingH) {
      setOrderingH(false);
      setFeedlist([]);
      dispatch(renderAction);
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  const sortFeedByHeart = () => {
    if (!orderingH) {
      setOrderingH(true);
      setFeedlist([]);
      dispatch(renderAction);
    }
  };

  const getUserFeed = async (searchNickname: string) => {
    return await feedApi
      .getUserFeed(searchNickname, start, end)
      .then((result) => {
        setFeedlist((prev) => prev.concat(result.data));
        start += 8;
        end += 8;
      });
  };

  const getUserFeedH = async (searchNickname: string) => {
    setTargetLoading(true);
    return await feedApi
      .getUserFeed(searchNickname, start, end)
      .then((result) => {
        result.data.sort((a, b) => {
          return b.heartNum - a.heartNum;
        });
        setFeedlist((prev) => prev.concat(result.data));
        start += 8;
        end += 8;
      });
  };

  const getMainFeedH = async () => {
    await feedApi.getMainFeedH(start, end).then((result) => {
      setFeedlist((prev) => prev.concat(result.data));
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      start += 8;
      end += 8;
    });
  };
  const getMainFeed = async () => {
    return await feedApi
      .getMainFeed(start, end)
      .then((result) => {
        setFeedlist((prev) => prev.concat(result.data));
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        start += 8;
        end += 8;
      })
      .then((res) => console.log(res));
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
            if (orderingH === false && searchOn === false) {
              getMainFeed().catch((err) => console.log(err));
            } else if (orderingH === true && searchOn === false) {
              getMainFeedH().catch((err) => console.log(err));
            } else if (orderingH === false && searchOn === true) {
              getUserFeed(searchInput).catch((err) => console.log(err));
            } else {
              getUserFeedH(searchInput).catch((err) => console.log(err));
            }
            setTargetLoading(false);
          }, 1000);
        }
      });
    }, options);

    if (target.current) {
      io.observe(target.current);
    }
  }, [isRender, target]);

  useEffect(() => {
    if (orderingH === false && searchOn === false) {
      getMainFeed().catch((err) => console.log(err));
    } else if (orderingH === true && searchOn === false) {
      getMainFeedH().catch((err) => console.log(err));
    } else if (orderingH === false && searchOn === true) {
      getUserFeed(searchInput).catch((err) => console.log(err));
    } else {
      getUserFeedH(searchInput).catch((err) => console.log(err));
    }
    setTimeout(() => setIsLoading(false), 1000);
    if (userInfo?.nickname === 'nothing') {
      alert('닉네임을 변경해주세요');
      navigate('/mypage');
    }
  }, []);

  return (
    <Container>
      <Wrapper>
        <Div>
          <UpperDiv>
            <ButtonDiv>
              <Button onClick={() => sortFeedByRecent()} className="left">
                최신순
              </Button>
              <Line></Line>
              <Button onClick={() => sortFeedByHeart()}>인기순</Button>
            </ButtonDiv>
            <UpperRightDiv>
              <form onSubmit={selectFeed}>
                <SearchBar>
                  <SearchInput
                    name="searchBar"
                    type={'text'}
                    placeholder="유저 검색"
                    onChange={handleSearchInput}
                  />
                  <SearchIcon type="button" onClick={selectFeed}>
                    <BiSearch size={'1.7rem'} />
                  </SearchIcon>
                </SearchBar>
              </form>
              <PlusButton onClick={writeNewDiary}> + </PlusButton>
            </UpperRightDiv>
          </UpperDiv>
          <Feed onClick={!isLogin ? () => console.log('클릭') : null}>
            {!isLoading &&
              feedlist.map((el) => (
                <MainFeedList {...el} key={el.id} isRender />
              ))}
            {isLoading &&
              new Array(8).fill(1).map((_, i) => <FeedCardSkeleton key={i} />)}
            <div ref={target} className="Target-Element"></div>
          </Feed>
        </Div>
      </Wrapper>
      {targetLoading ? (
        <TargetContainer>
          <TargetSpinner />
        </TargetContainer>
      ) : null}
    </Container>
  );
}
const TargetContainer = styled.div`
  width: 100%auto;
  height: 10%;
`;
const TargetSpinner = styled(Spinner)``;
const Container = styled.div`
  background-image: url(${feedBG});
  background-size: cover;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const Div = styled.div`
  width: 100%;
  margin-top: 3em;
`;
const UpperDiv = styled.div`
  display: flex;
  padding: 0 1%;
  justify-content: space-evenly;
`;
const ButtonDiv = styled.div`
  display: flex;
  width: 120px;
  flex: 1 0 auto;
  text-align: center;
  margin-left: 0.9em;
`;

const Button = styled.button`
  font-family: sans-serif;
  border-radius: 10px;
  flex-shrink: 0;
  margin-right: 0.5rem;
  font-size: 1rem;
  padding: 5px 7px;
  text-align: center;
  font-weight: 650;
  opacity: 0.8;
  background: linear-gradient(to right, #ee64c7, #8272eb, #d06be0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  &:hover {
    cursor: pointer;
    border-bottom: solid gray 2px;
  }
`;
const UpperRightDiv = styled.div`
  display: flex;
  margin: 0.5em;
`;
const SearchBar = styled.div`
  border-radius: 30rem;
  display: flex;
  box-shadow: 4px 4px 4px rgb(0, 0, 0, 0.25);
  overflow: hidden;
  background-color: white;
`;
const SearchInput = styled.input`
  outline: none;
  border: 0;
  height: 2rem;
  padding-left: 15px;
  &::placeholder {
    font-style: italic;
    text-align: center;
  }
`;
const SearchIcon = styled.button`
  background-color: white;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-left: 0.3rem;
  &:hover {
    cursor: pointer;
  }
`;
const PlusButton = styled.button`
  background-color: #c4c4c4;
  border-radius: 100%;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-left: 0.5em;
  font-size: 1.8rem;
  text-align: center;
  font-weight: 400;
  &:hover {
    cursor: pointer;
    background-color: #fee9f7;
  }
`;
const Feed = styled.div`
  // 전체피드
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 12px;
  @media screen and (min-width: 840px) {
    padding: 0px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }
`;
const Line = styled.div`
  border: solid gray 1px;
  height: 2rem;
  margin-top: 8px;
  margin-right: 7px;
  opacity: 0.6;
`;
