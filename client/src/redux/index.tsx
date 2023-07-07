/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './reducers/userReducer/userReducer';
import boardReducer from './reducers/boardReducer/boardReducer';
import modalReducer from './reducers/modalReducer/modalReducer';
import editReducer from './reducers/editReducer/editReducer';
import diaryReducer from './reducers/diaryReducer/diaryReducer';
import renderReducer from './reducers/renderReducer/renderReducer';
import orderReducer from './reducers/orderReducer/orderReducer';

const rootReducer = combineReducers({
  userInfo: userReducer,
  boardInfo: boardReducer,
  modalInfo: modalReducer,
  editInfo: editReducer,
  diaryInfo: diaryReducer,
  renderInfo: renderReducer,
  orderInfo: orderReducer,
});
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userInfo'],
};
export type RootState = ReturnType<typeof rootReducer>;
export default persistReducer(persistConfig, rootReducer);
