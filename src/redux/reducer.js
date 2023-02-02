import {
  REMOVE,
  ADD,
  INC,
  DEC,
  CHANGE_PRICE,
  SET_PREV_PRICE,
  CLEAR_CART,
} from "./type";

const initialState = {
  cartItems: [],
  totalPrice: 0,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      let prevItems = state.cartItems;
      const exists = prevItems.find((a) => a.id === action.payload.id);
      if (exists) {
        prevItems = state.cartItems.map((e) => {
          let nItem = { ...e };
          if (e.id === action.payload.id) {
            nItem = action.payload;
          }
          return nItem;
        });
      } else {
        prevItems.push(action.payload);
      }
      const total = [];
      prevItems.forEach((a) => {
        total.push(a.quantity * a.priceTakhfif);
      });
      const reduce = total.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
      });
      return {
        ...state,
        cartItems: prevItems,
        totalPrice: reduce,
      };
    case INC:
      const increasedItems = state.cartItems.map((w) => {
        const m = { ...w };
        if (m.id === action.payload.id) {
          if (m.inventory > m.quantity) {
            m.quantity += 1;
          }
        }
        return m;
      });
      const itotal = [];
      increasedItems.forEach((a) => {
        itotal.push(a.quantity * a.priceTakhfif);
      });
      const ireduce = itotal.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
      });
      return {
        ...state,
        cartItems: increasedItems,
        totalPrice: ireduce,
      };
    case DEC:
      const decreasedItems = state.cartItems.map((w) => {
        const m = { ...w };
        if (m.id === action.payload.id) {
          if (m.quantity > 1) {
            m.quantity -= 1;
          }
        }
        return m;
      });
      const dtotal = [];
      decreasedItems.forEach((a) => {
        dtotal.push(a.quantity * a.priceTakhfif);
      });
      const dreduce = dtotal.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
      });
      return {
        ...state,
        cartItems: decreasedItems,
        totalPrice: dreduce,
      };
    case REMOVE:
      const removedCartItems = state.cartItems.filter(
        (e) => e.id !== action.payload.id
      );
      let rtotal;
      let rreduce;
      if (removedCartItems.length > 0) {
        rtotal = [];
        removedCartItems.forEach((a) => {
          rtotal.push(a.quantity * a.priceTakhfif);
        });
        rreduce = rtotal.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue;
        });
      } else {
        rreduce = 0;
      }
      return {
        ...state,
        cartItems: removedCartItems,
        totalPrice: rreduce,
      };
    case CHANGE_PRICE:
      const price = state.totalPrice;
      const parsedPercentage = JSON.parse(action.payload);
      const percent = (price / 100) * parsedPercentage;
      const newPrice = price - percent;
      return {
        ...state,
        totalPrice: newPrice,
      };
    case SET_PREV_PRICE:
      const stotal = [];
      state.cartItems.forEach((a) => {
        stotal.push(a.quantity * a.priceTakhfif);
      });
      const sreduce = stotal.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue;
      });
      return {
        ...state,
        totalPrice: sreduce,
      };
    case CLEAR_CART:
      return {
        cartItems: [],
        totalPrice: 0,
      };
    default:
      return state;
  }
};
