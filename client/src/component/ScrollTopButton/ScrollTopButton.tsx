import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ScrollTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleShowButton);
    return () => {
      window.removeEventListener('scroll', handleShowButton);
    };
  }, []);
  return (
    showButton && (
      <Container className="scroll__container">
        <Button id="top" onClick={scrollToTop} type="button">
          {' '}
          Top
        </Button>
      </Container>
    )
  );
};

export default ScrollTopButton;

const Container = styled.div`
  position: fixed;
  right: 5%;
  bottom: 5%;
  z-index: 1;
`;
const Button = styled.button`
  font-weight: bold;
  font-size: 15px;
  padding: 15px 10px;
  background-color: #a396f8;
  color: #fff;
  border: 1px solid rgb(210, 204, 193);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  :hover {
    color: #fd40c8;
  }
`;
