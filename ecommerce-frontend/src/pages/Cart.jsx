import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../config';

export default function Cart() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const { items, totalAmount } = state;

  const handleRemove = id => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-red-600 underline font-semibold">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-white py-12 px-4 md:px-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Cart</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.id} className="flex gap-6 items-center bg-gray-100 rounded-lg p-4">
              <img
                src={`${SERVER_URL}${item.image}`}
                alt={item.name}
                className="w-24 h-24 object-contain bg-white rounded"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.name}</div>
                <div className="text-gray-600 mb-2">${parseFloat(item.price).toFixed(2)}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="font-bold text-lg w-24 text-right">${(item.price * item.quantity).toFixed(2)}</div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-600 font-bold ml-4 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* Cart Summary */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-between h-fit">
          <div>
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition mt-4"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
} 