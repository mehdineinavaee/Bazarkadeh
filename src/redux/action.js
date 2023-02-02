import {
  ADD,
  DEC,
  INC,
  REMOVE,
  CHANGE_PRICE,
  SET_PREV_PRICE,
  CLEAR_CART,
} from "./type";

export const add = (product) => {
  return {
    type: ADD,
    payload: product,
  };
};

export const remove = (id) => {
  return {
    type: REMOVE,
    payload: id,
  };
};

export const dec = (product) => {
  return {
    type: DEC,
    payload: product,
  };
};

export const inc = (product) => {
  return {
    type: INC,
    payload: product,
  };
};

export const setTotalPrice = (price) => {
  return {
    type: CHANGE_PRICE,
    payload: price,
  };
};

export const setPrevPrice = () => {
  return {
    type: SET_PREV_PRICE,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};
