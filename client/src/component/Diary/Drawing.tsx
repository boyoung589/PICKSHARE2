/*eslint-disable*/
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FormValues } from '../../pages/DiaryPage';
import { v4 as uuidv4 } from 'uuid';
const AWS = require('aws-sdk/dist/aws-sdk-react-native');

export interface drawingProps {
  boardInput: FormValues;
  setBoardInput: (boardInput: FormValues) => FormValues | void;
  setPickWay: (pickWay: number) => number | void;
  pickWay: number;
}
export default function Drawing({
  boardInput,
  setBoardInput,
  setPickWay,
  pickWay,
}: drawingProps) {
  const canvasRef = useRef(null);
  const inputFile: any = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFillMode, setIsFillMode] = useState(false);
  const [lineWidth, setLineWidth] = useState(7.5);
  const [drawingImg, setDrawingImg] = useState('');
  const previousImg = boardInput.picture;

  // 초기값 설정
  const image = new Image();
  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext('2d');
    image.setAttribute('crossOrigin', '*');
    image.src = previousImg;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
    ctx.strokeStyle = '#2c2c2c';
    ctx.lineWidth = 7.5;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, []);

  // Draw start
  function initDraw({ nativeEvent }: any) {
    setIsDrawing(true);

    const ctx = canvasRef.current.getContext('2d');

    const { offsetX, offsetY } = nativeEvent;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  }
  // Draw 이벤트
  function draw({ nativeEvent }: any) {
    if (!isDrawing) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');

    const { offsetX, offsetY } = nativeEvent;

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }

  // finish 이벤트
  function finishDraw() {
    setIsDrawing(false);
  }

  // color 변경 함수
  function handleColorClick({ nativeEvent }: any) {
    const ctx = canvasRef.current.getContext('2d');
    if (!isFillMode) {
      // fill모드 false일때 선 선색 변경
      ctx.strokeStyle = nativeEvent.target.style.backgroundColor;
    } else {
      // fill모드일때 색상 선택시 해당 색상으로 배경색 채우고 paint 모드로 변경
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = nativeEvent.target.style.backgroundColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setIsFillMode(!isFillMode);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // lineWidth 변경 함수
  const handleRangeChange = ({ nativeEvent }: any) => {
    const ctx = canvasRef.current.getContext('2d');
    const size = nativeEvent.target.value;
    ctx.lineWidth = size;
    setLineWidth(size);
  };

  // 캔버스 Clear
  function fillWhiteHandler(event: any) {
    const ctx = canvasRef.current.getContext('2d');
    //클릭시 fillStyle을 white로 바꾸고
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    //fillRect(x축좌표, y축좌표, width, height)
  }
  // Fill, Paint 모드 변경 함수
  function fillModeHandler(event: any) {
    // fill 버튼 클릭시 fill 모드 true로 변경 (여러번 클릭해도 동일)
    if (event.target.dataset.mode === 'fill') {
      setIsFillMode(true);
    }
    // pain 버튼 클릭시 fill 모드 false로 변경 (여러번 클릭해도 동일)
    else if (event.target.dataset.mode === 'paint') {
      setIsFillMode(false);
    }
  }
  // 그림 저장 함수
  AWS.config.update({
    region: `${process.env.REACT_APP_AWS_REGION}`, // congito IdentityPoolId 리전을 문자열로 입력하기. 아래 확인 (Ex. "ap-northeast-2")
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: `${process.env.REACT_APP_AWS_IMG_ID}`, // cognito 인증 풀에서 받아온 키를 문자열로 입력하기. (Ex. "ap-northeast-2...")
    }),
  });

  function dataURItoBlob(dataURI: string) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/png' });
  }

  const SaveImgHandler = async (e: any) => {
    const image = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    setPickWay(1);
    alert('그림이 추가되었습니다.');

    const newFileName = uuidv4();
    const imgfile = dataURItoBlob(image);

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: 'profileimage-pickshare', // 업로드할 대상 버킷명 문자열로 작성.
        Key: newFileName, //업로드할 파일명
        Body: imgfile, // 업로드할 파일 객체
      },
    });

    const promise = upload.promise();

    await promise.then(
      function (data: { Location: any }) {
        setBoardInput({
          ...boardInput,
          ['picture']: data.Location,
        });
      },
      function (err: any) {
        console.log(err, '사진등록 실패');
      }
    );
  };

  return (
    <DiaryWrap id="page">
      <div className="drawing">
        <CanvasWrap>
          <canvas
            ref={canvasRef}
            onMouseDown={initDraw}
            onMouseUp={finishDraw}
            onMouseMove={draw}
            onMouseLeave={finishDraw}
          />
        </CanvasWrap>
        <div className="controls">
          <div className="controls_range">
            <input
              type="range"
              min="0.1"
              max="15"
              value={lineWidth}
              step="0.1"
              onChange={handleRangeChange}
            />
            <div>{lineWidth}</div>
          </div>
          <div className="controls_btns">
            <button onClick={(e) => fillWhiteHandler(e)}>Clear</button>
            <button
              onClick={(e) => fillModeHandler(e)}
              className={!isFillMode ? 'active' : ''}
              data-mode="paint"
            >
              Paint
            </button>
            <button
              onClick={(e) => fillModeHandler(e)}
              className={isFillMode ? 'active' : ''}
              data-mode="fill"
            >
              Fill
            </button>
            <button
              onClick={SaveImgHandler}
              name="picture"
              style={{ border: 'solid pink 5px' }}
            >
              Save
            </button>
          </div>
        </div>
        {/* 컬러 팔레트 */}
        <ul>
          <li
            style={{ backgroundColor: '#ffffff', border: '1px solid #ccc' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#fffafa' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#2c2c2c' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#FAEBD7' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#a52a2a' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#d26c6c' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#d2691e' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#ffbb00' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#8fbc8f' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#339933' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#b7e2fc' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#4682b4' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#f2f2fc' }}
            onClick={handleColorClick}
          />
          <li
            style={{ backgroundColor: '#c37fcc' }}
            onClick={handleColorClick}
          />
        </ul>
        {/* <p>*배경을 채우면 기존에 그린 배경색과 섞여서 채워집니다</p> */}
      </div>
    </DiaryWrap>
  );
}

const DiaryWrap = styled.div`
  border: #a396f8 solid 2px;
  border-radius: 10px;
  width: 90%;
  height: 90%;

  h3 {
    text-align: center;
  }

  div.drawing {
    margin: auto;
    background-color: #fff;
    border-radius: 1rem;
    position: relative;
  }
  button.close_btn {
    margin: 0;
    padding: 1rem 1.2rem;
    font-size: 1.5em;
    line-height: 1;
    color: var(--color-black);
    border: none;
    background: none;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }
  button.close_btn:hover {
    color: var(--color-red);
  }
  div.controls_range {
    margin-top: 1rem;
    font-size: 0.9em;
    color: #666;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  div.controls_btns {
    display: flex;
    justify-content: center;
  }
  div.controls_btns button {
    margin: 1.2rem 0.2rem 0.5rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
  }
  div.controls_btns button.active {
    border: 1px solid #999;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  }
  ul {
    margin: 1rem;
    display: flex;
    justify-content: center;
  }
  li {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 0.2rem;
    border-radius: 50%;
    cursor: pointer;
  }

  p {
    text-align: center;
    color: var(--color-black);
  }
`;
const CanvasWrap = styled.div`
  width: 100%;
  height: auto;
  min-height: 30vh;

  margin: auto;
  background-color: #eee;
  position: relative;
  canvas {
    border: 2px solid #ccc;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
`;
const Img = styled.img`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;
