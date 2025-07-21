import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { SERVER_URL } from '../config';

export default function Checkout() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    promoCode: ''
  });
  const [validatedPromo, setValidatedPromo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [promoSuccess, setPromoSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear promo states when promo code input changes
    if (name === 'promoCode') {
      setPromoError(null);
      setPromoSuccess(null);
      setValidatedPromo(null);
    }
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Invalid email format';
    if (!formData.phone) return 'Phone is required';
    if (!formData.address) return 'Address is required';
    return null;
  };

  const handlePromoCode = async () => {
    if (!formData.promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/api/promo/validate/${formData.promoCode}`);
      const data = await response.json();
      
      if (data.success) {
        setValidatedPromo(data.data);
        setPromoSuccess(`Promo code applied! ${data.data.discountPercentage ? `${data.data.discountPercentage}% off` : `$${data.data.discountAmount} off`}`);
        setPromoError(null);
      } else {
        setPromoError(data.message || 'Invalid promo code');
        setPromoSuccess(null);
        setValidatedPromo(null);
      }
    } catch (error) {
      setPromoError('Failed to validate promo code');
      setPromoSuccess(null);
      setValidatedPromo(null);
    }
  };

  // Calculate discount and final total
  const calculateDiscount = () => {
    if (!validatedPromo) return 0;
    
    let discount = 0;
    if (validatedPromo.discountPercentage) {
      discount = (state.totalAmount * validatedPromo.discountPercentage) / 100;
    } else if (validatedPromo.discountAmount) {
      discount = validatedPromo.discountAmount;
    }

    // Apply max discount limit if it exists
    if (validatedPromo.maxDiscount && discount > validatedPromo.maxDiscount) {
      discount = validatedPromo.maxDiscount;
    }

    return discount;
  };

  const discount = calculateDiscount();
  const finalTotal = state.totalAmount - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: state.items,
        totalAmount: state.totalAmount,
        ...(validatedPromo && { promoCode: validatedPromo.code })
      };

      const response = await fetch(`${SERVER_URL}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order');
      
      const responseData = await response.json();

      // Clear cart and redirect to success page with order ID
      dispatch({ type: 'CLEAR_CART' });
      navigate('/order-success', { 
        state: { orderId: responseData.orderId }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Information Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {state.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={`${SERVER_URL}${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-gray-100 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-gray-600">
                        ${item.price} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="border-t pt-4 mb-6">
                <label className="block text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="promoCode"
                    value={formData.promoCode}
                    onChange={handleInputChange}
                    className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter promo code"
                  />
                  <button
                    onClick={handlePromoCode}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-600 text-sm mt-2">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-green-600 text-sm mt-2">{promoSuccess}</p>
                )}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${state.totalAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </motion.button>

            {error && (
              <div className="text-red-600 text-center">{error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 