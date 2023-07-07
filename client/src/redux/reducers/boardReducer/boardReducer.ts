import { ADD_BOARD_INFO, DELETE_BOARD_INFO } from '../../actions/actionTypes';

type PictureMethod = 0 | 1;
/* 
    0: 그림
    1: 사진
*/

type Mood = 0 | 1 | 2 | 3 | 4;
/*
    0: 행복
    1: 좋음
    2: 보통
    3: 우울
    4: 화남
*/

type Lock = 'UNLOCK' | 'LOCK';

export interface boardI {
  boardInfo: {
    title: string;
    picture: string;
    pictureMethod: PictureMethod;
    mood: Mood;
    lock: Lock;
    content: string;
    date: string;
    nickname: string;
    id: number;
    user_id: number;
  };
}

const initialState: boardI = {
  boardInfo: {
    title: '',
    picture: '',
    pictureMethod: 0,
    mood: 0,
    lock: 'UNLOCK',
    content: '',
    date: '',
    nickname: '',
    id: 0,
    user_id: 0,
  },
};

const boardReducer = (
  prevState = initialState,
  action: {
    type: string;
    boardInfo: object;
  }
) => {
  let state;
  switch (action.type) {
    case ADD_BOARD_INFO:
      state = {
        ...prevState,
        boardInfo: action.boardInfo,
      };
      break;
    case DELETE_BOARD_INFO:
      state = {
        ...prevState,
        boardInfo: action.boardInfo,
      };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default boardReducer;
