import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import feedApi from '../api/feed';
import MainFeedList from '../component/Feed/MainFeed/MainFeedList';
import { BiSearch } from 'react-icons/bi';
import { debounce } from 'debounce';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteBoardInfo,
  diaryOnAction,
  heartOffAction,
  heartOnAction,
  renderAction,
  searchOnAction,
} from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import { feedBG } from '../img/Img';
import { RootState } from '../redux';
import { Feedlist, IOptions } from '../types/feedType';
import FeedCardSkeleton from '../common/skeleton/FeedCardSkeleton';
import { Spinner } from '../common/spinner/Spinner';

export type MainFeedProps = {
  search: boolean;
  setSearch: (search: boolean) => void;
  heart: boolean;
  setHeart: (heart: boolean) => void;
};
export default function MainFeed() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [feedlist, setFeedlist] = useState<Feedlist[] | null>([]);

  const [searchInput, setSearchInput] = useState(''); // searchInput
  // const [search, setSearch] = useState(false);
  // const [heart, setheart] = useState(false);

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
  const { searchState, heartState } = useSelector(
    (orderReducer: RootState) => orderReducer.orderInfo
  );

  useEffect(() => {
    setFeedlist([]);
    console.log(heartState, searchState, '새로고침 최초 렌덜잉');
    console.log('첫유즈이펙', 'search', searchState, 'heart', heartState);
    if (heartState === false && searchState === false) {
      console.log('전체 최신순');
      getMainFeed().catch((err) => console.log(err));
    } else if (heartState === true && searchState === false) {
      console.log('전체 인기순');
      getMainFeedH().catch((err) => console.log(err));
    } else if (heartState === false && searchState === true) {
      console.log('검색대상 최신순');
      getUserFeed(searchInput).catch((err) => console.log(err));
    } else {
      console.log('검색대상 인기순');
      getUserFeedH(searchInput).catch((err) => console.log(err));
    }
    setTimeout(() => setIsLoading(false), 2000);
    if (userInfo?.nickname === 'nothing') {
      alert('닉네임을 변경해주세요');
      navigate('/mypage');
    }
  }, [isRender]);
  /*  console.log(heart, search, 'hohohoho'); */

  useEffect(() => {
    console.log(heartState, searchState, '타겟의 setTimouout0');
    const options: IOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    console.log(heartState, searchState, '타겟');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTargetLoading(entry.isIntersecting);
          console.log(heartState, searchState, '타겟의 setTimouout1');
          setTimeout(() => {
            console.log(heartState, searchState, '타겟의 setTimouout2');
            if (heartState === false && searchState === false) {
              console.log('최신순');
              getMainFeed().catch((err) => console.log(err));
            } else if (heartState === true && searchState === false) {
              console.log('인기순');
              getMainFeedH().catch((err) => console.log(err));
            } else if (heartState === false && searchState === true) {
              getUserFeed(searchInput)
                .then((res) => disconnectFetch(res, io))
                .catch((err) => console.log(err));
            } else {
              getUserFeedH(searchInput).catch((err) => console.log(err));
            }
            setTargetLoading(false);
          }, 2000);
        }
      });
    }, options);

    if (target.current) {
      io.observe(target.current);
    }
  }, [target]);

  const handleSearchInput = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // setSearchOn(true);
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
    dispatch(searchOnAction);
    // setSearch(true);
    console.log('유저검색클릭', heartState, searchState);
    dispatch(renderAction);
  };

  const sortFeedByRecent = () => {
    // setHeart(false);
    dispatch(heartOffAction);
    console.log('최신순클릭', heartState, searchState);
    dispatch(renderAction);
  };

  const sortFeedByHeart = () => {
    // setHeart(true);
    dispatch(heartOnAction);
    console.log('인기순클릭', heartState, searchState);
    dispatch(renderAction);
  };

  let flag = 0;
  const getUserFeed = async (searchNickname: string) => {
    console.log('getUserFeed');
    console.log('search', searchState, 'heart', heartState);
    if (flag && feedlist.length < 8) return false;
    await feedApi.getUserFeed(searchNickname, start, end).then((result) => {
      flag = 1;
      setFeedlist((prev) => prev.concat(result.data));
    });
    start += 8;
    end += 8;
    return true;
  };
  console.log(feedlist, 'feedlist');

  const getUserFeedH = async (searchNickname: string) => {
    console.log('getUserFeedH');
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
    console.log('getMainFeedH');
    console.log(start, end);
    await feedApi.getMainFeedH(start, end).then((result) => {
      setFeedlist((prev) => prev.concat(result.data));
      start += 8;
      end += 8;
    });
  };
  const getMainFeed = async () => {
    console.log('getMainFeed');
    return await feedApi.getMainFeed(start, end).then((result) => {
      setFeedlist((prev) => prev.concat(result.data));
      start += 8;
      end += 8;
    });
  };

  const disconnectFetch = (result: boolean, callback: IntersectionObserver) => {
    console.log('✅');
    console.log(result, '디스커넥트 리졸트');
    if (!result) return () => callback.disconnect();
  };

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
              <form>
                <SearchBar>
                  <SearchInput
                    name="searchBar"
                    type={'text'}
                    placeholder="유저 검색"
                    onChange={(e) => handleSearchInput(e)}
                  />
                  <SearchIcon type="button" onClick={selectFeed}>
                    <BiSearch size={'1.7rem'} />
                  </SearchIcon>
                </SearchBar>
              </form>
              <PlusButton onClick={writeNewDiary}> + </PlusButton>
            </UpperRightDiv>
          </UpperDiv>
          <Feed>
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
