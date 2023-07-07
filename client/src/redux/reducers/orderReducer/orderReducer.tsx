import {
  HEART_OFF,
  HEART_ON,
  RESET_ORDER,
  SEARCH_OFF,
  SEARCH_ON,
} from '../../actions/actionTypes';

export interface wayOfOrder {
  heartState: boolean;
  searchState: boolean;
}

const initialState: wayOfOrder = {
  heartState: false,
  searchState: false,
};

const orderReducer = (
  prevState = initialState,
  action: {
    type: string;
    heartState: boolean;
    searchState: boolean;
  }
): wayOfOrder => {
  let state;
  switch (action.type) {
    case HEART_ON:
      state = { ...prevState, heartState: true };
      break;
    case HEART_OFF:
      state = { ...prevState, heartState: false };
      break;
    case SEARCH_ON:
      state = { ...prevState, searchState: true };
      break;
    case SEARCH_OFF:
      state = { ...prevState, searchState: false };
      break;
    case RESET_ORDER:
      state = { heartState: false, searchState: false };
      break;
    default:
      state = { ...prevState };
  }
  return state;
};

export default orderReducer;
