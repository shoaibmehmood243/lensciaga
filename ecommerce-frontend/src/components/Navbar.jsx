import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { state } = useCart();
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <nav className="bg-black text-white flex items-center justify-between px-8 py-4 shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-widest">
        <img src={logo} alt="LensCart Logo" className="h-16 w-auto" />
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-red-600">Home</Link>
        <Link to="/category/men" className="hover:text-red-600">Men</Link>
        <Link to="/category/women" className="hover:text-red-600">Women</Link>
        <Link to="/category/kids" className="hover:text-red-600">Kids</Link>
      </div>
      <Link to="/cart" className="relative">
        <FiShoppingCart size={24} className="hover:text-red-600" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-2 py-0.5">{totalQuantity}</span>
        )}
      </Link>
    </nav>
  );
} 