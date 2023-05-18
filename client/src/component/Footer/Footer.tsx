import styled from 'styled-components';

function Footer() {
  return (
    <>
      <Logo>PICKSHARE</Logo>
      <Container>
        <Div>
          <Title>ABOUT US</Title>
          <Content>
            <Alink
              href="https://github.com/soyoung931014/PICKSHARE"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'gray', fontWeight: 'bolder', fontSize: '1rem' }}
            >
              repository
            </Alink>
          </Content>
          <Content>
            <Alink
              href="https://github.com/soyoung931014/PICKSHARE/wiki"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'gray', fontWeight: 'bolder' }}
            >
              wiki
            </Alink>
          </Content>
        </Div>
        <Div Members>
          <Title>TEAM MEMBERS</Title>
          <Position>FullStack</Position>
          <Alink
            href="https://github.com/soyoung931014"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'gray', fontWeight: 'bolder', fontSize: '1rem' }}
          >
            박소영
          </Alink>

          <Alink
            href="https://github.com/boyoung589"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'gray', fontWeight: 'bolder', fontSize: '1rem' }}
          >
            양보영
          </Alink>
        </Div>
      </Container>
    </>
  );
}

export default Footer;
const Container = styled.div`
  box-shadow: 10 10px 0px #3c4a5645;
  width: 100vw;
  padding: 10px;
  display: flex;
`;

const Div = styled.div<{ Members?: boolean }>`
  width: ${(props) => (props.Members ? '180px' : '50%')};
  flex: ${(props) => (props.Members ? '0 1 auto' : '1 0 auto')};
`;

const Title = styled.p`
  margin-top: 12px;
  font-weight: 700;
  font-size: 23px;
  opacity: 0.5;
  width: 200px;
`;

const Alink = styled.a`
  text-decoration: none;
  margin-right: 1rem;
  opacity: 0.5;
  width: 4rem;
`;

const Position = styled.div`
  margin-top: 2px;
  margin-bottom: 2px;
  font-size: 18px;
  opacity: 0.5;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  font-weight: 600;
  width: 3rem;
`;
const Logo = styled.div`
  font-family: sans-serif;
  font-weight: 900;
  width: 12rem;
  height: 2.2rem;
  background: linear-gradient(to right, #ee64c7, #8272eb, #d06be0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 10px;
  font-size: 2rem;
  :hover {
    cursor: pointer;
  }
`;
const Content = styled.div`
  margin-top: 4px;
`;
