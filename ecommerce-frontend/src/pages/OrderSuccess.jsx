import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

export default function OrderSuccess() {
  const location = useLocation();
  const { orderId } = location.state || {};

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
        {orderId && (
          <div className="bg-gray-100 py-2 px-4 rounded-lg mb-4">
            <p className="text-gray-600 text-sm">Order ID</p>
            <p className="font-mono font-bold">{orderId}</p>
          </div>
        )}
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We'll send you an email confirmation with order details and tracking information.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/category/men"
            className="block w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Browse New Arrivals
          </Link>
        </div>
      </motion.div>
    </div>
  );
} 