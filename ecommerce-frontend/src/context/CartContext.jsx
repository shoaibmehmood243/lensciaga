import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  totalAmount: 0,
  promoCode: '',
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.id === action.payload.id);
      let items;
      if (existing) {
        items = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        items = [...state.items, action.payload];
      }
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { ...state, items, totalAmount };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(item => item.id !== action.payload);
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { ...state, items, totalAmount };
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { ...state, items, totalAmount };
    }
    case 'CLEAR_CART':
      return { ...initialState };
    case 'SET_PROMO':
      return { ...state, promoCode: action.payload };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 