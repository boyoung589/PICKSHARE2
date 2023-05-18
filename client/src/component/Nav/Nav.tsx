import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { deleteUserInfo } from '../../redux/actions';

import theme from '../../styles/theme';
import { BiHome } from 'react-icons/bi';
import { FaBars } from 'react-icons/fa';
import { defaultProfile } from '../../img/Img';

import { RootState } from '../../redux';

const Nav = () => {
  const menuStyle = { textDecoration: 'none', color: '#3d3c3c' };
  const { isLogin, userInfo } = useSelector(
    (selector: RootState) => selector.userInfo
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);

  return (
    <>
      <Wrapper>
        <Logo onClick={() => navigate('/mainfeed')}>PICKSHARE</Logo>
        {isLogin === true ? (
          <>
            <NavList Menu={menu}>
              <Div>
                <NavLink
                  to="/mainfeed"
                  style={{
                    ...menuStyle,
                    fontSize: '1.7rem',
                  }}
                >
                  <BiHome />
                </NavLink>
              </Div>
              <Div>
                <Info>
                  <NavLink
                    to={`/feed/${userInfo.nickname}`}
                    style={{ ...menuStyle }}
                  >
                    <FeedDiv>
                      {userInfo.userImage === 'nothing' ? (
                        <Img src={defaultProfile} />
                      ) : (
                        <Img src={userInfo.userImage} />
                      )}
                    </FeedDiv>
                  </NavLink>
                  <FeedDiv>피드</FeedDiv>
                </Info>
              </Div>
              <Div Text>
                <NavLink to="/mypage" style={{ ...menuStyle }}>
                  회원정보
                </NavLink>
              </Div>
              <Div Text>
                <NavLink
                  onClick={() => dispatch(deleteUserInfo())}
                  to="/mainfeed"
                  style={{ ...menuStyle }}
                >
                  로그아웃
                </NavLink>
              </Div>
            </NavList>
          </>
        ) : (
          <>
            <NavList Menu={menu} InitialNav>
              <Div>
                <NavLink
                  to="/mainfeed"
                  style={{
                    ...menuStyle,
                    fontSize: '1.7rem',
                  }}
                >
                  <BiHome />
                </NavLink>
              </Div>
              <Div Text>
                <NavLink to="/login" style={{ ...menuStyle }}>
                  로그인
                </NavLink>
              </Div>
              <Div Text>
                <NavLink to="/signup" style={{ ...menuStyle }}>
                  회원가입
                </NavLink>
              </Div>
            </NavList>
          </>
        )}
        <MenuFabar href="#" onClick={() => setMenu(!menu)}>
          <FaBars
            style={{
              fontWeight: 'bolder',
              fontSize: '2rem',
              color: '#3d3c3c',
            }}
          />
        </MenuFabar>
      </Wrapper>
    </>
  );
};
export default Nav;

const Wrapper = styled.section`
  box-sizing: border-box;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: white;
  border-bottom: solid 0.8px #bbbbbb;
  box-shadow: 0 0px 10px #acafb345;
`;

const Logo = styled.section`
  margin-left: 1rem;
  font-weight: 900;
  width: 13rem;
  height: 2.6rem;
  background: linear-gradient(to right, #ee64c7, #8272eb, #d06be0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  margin-top: 5px;
  :hover {
    cursor: pointer;
  }
`;

const MenuFabar = styled.a`
  display: none;
  @media ${() => theme.deviceSize.tablet} {
    display: block;
    width: 100%;
    text-align: end;
    margin: 0.7rem;
    font-size: 1rem;
    padding: 0.6rem;
    margin-right: 0.5rem;
    :hover {
      cursor: pointer;
    }
  }
`;
const NavList = styled.section<{
  Menu?: boolean;
  InitialNav?: boolean;
}>`
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  border-radius: 10px 0 0 10px;
  @media ${() => theme.deviceSize.tablet} {
    width: 120px;
    height: ${(props) => (props.InitialNav ? '220px' : '290px')};
    flex: 0 auto;
    position: absolute;
    top: 4.7em;
    z-index: 1;
    flex-direction: column;
    background-color: #fffceb;
    animation: ${(props) =>
      props.Menu ? 'open 1s ease' : 'close 1s ease forwards'};
    @keyframes open {
      from {
        right: -100px;
      }
      to {
        right: 0px;
      }
    }
    @keyframes close {
      from {
        right: 0px;
      }
      to {
        right: -120px;
      }
    }
  }
`;
const Div = styled.div<{ Text?: boolean }>`
  margin: 0.7rem;
  height: 3.2rem;
  font-weight: bolder;
  padding: ${(props) => (props.Text ? '1.1rem 0.6rem' : '0.7rem 0.6rem')};
  :hover {
    cursor: pointer;
    background: #fee9f7;
    border-radius: 10px;
  }
`;

const Img = styled.img`
  border: solid gray 1px;
  height: 1.8rem;
  width: 2rem;
  border-radius: 50%;
  margin-right: 0.5rem;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 36px;
  padding-bottom: 5.6px;
  @media ${() => theme.deviceSize.tablet} {
    width: 5.1rem;
    padding-bottom: 0;
  }
`;

const FeedDiv = styled.div``;
