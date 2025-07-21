import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import menImg from '../assets/men.png';
import womenImg from '../assets/women.png';
import kidsImg from '../assets/kids.png';
import customBg from '../assets/1bg.png';
import customBg2 from '../assets/2bg.png';
import logo from '../assets/logo.png';
import { FiHome, FiTruck, FiRefreshCw, FiBox } from 'react-icons/fi';
import { SERVER_URL } from '../config';

export default function Landing() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/product`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        // Get the latest 4 products
        const latest = data.slice(0, 4);
        setFeaturedProducts(latest);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <motion.section
        className="relative h-[60vh] md:h-[100vh] flex items-center justify-center bg-black text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={customBg} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-widest drop-shadow-lg">Discover Your Style</h1>
          <p className="text-lg md:text-2xl mb-8 font-light">Shop the latest eyewear for Men, Women & Kids</p>
          <Link to="/category/men" className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-gray-200 transition">Shop Now</Link>
        </div>
      </motion.section>

      {/* Featured Collections */}
      <section className="py-12 px-4 md:px-16 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-wider">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link to="/category/men">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
              <img src={menImg} alt="Men" className="w-full h-56 object-cover" />
              <div className="p-4 text-center font-semibold text-xl">Men</div>
            </motion.div>
          </Link>
          <Link to="/category/women">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
              <img src={womenImg} alt="Women" className="w-full h-56 object-cover" />
              <div className="p-4 text-center font-semibold text-xl">Women</div>
            </motion.div>
          </Link>
          <Link to="/category/kids">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
              <img src={kidsImg} alt="Kids" className="w-full h-56 object-cover" />
              <div className="p-4 text-center font-semibold text-xl">Kids</div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 tracking-wider">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {loading && <div className="col-span-full text-center text-lg">Loading products...</div>}
          {error && <div className="col-span-full text-center text-red-600">{error}</div>}
          {!loading && !error && featuredProducts.map(product => (
            <motion.div 
              key={product.id} 
              whileHover={{ scale: 1.03 }} 
              className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={`${SERVER_URL}${product.images[0]}`}
                alt={product.name}
                className="w-full h-40 object-contain bg-white rounded mb-4"
              />
              <div className="font-semibold text-lg mb-2">{product.name}</div>
              <div className="text-gray-600 mb-2">${parseFloat(product.price).toFixed(2)}</div>
              <Link 
                to={`/product/${product.id}`}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              >
                View
              </Link>
            </motion.div>
          ))}
          {!loading && !error && featuredProducts.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No products available.
            </div>
          )}
        </div>
      </section>

      {/* Customization Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={customBg2} alt="Customization Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-red-600 p-4 mb-6">
              <img src={logo} alt="LensCart Logo" className="h-12 w-auto" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wider">CREATE YOUR<br />CUSTOM MEGA BALORAMA</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
              <Link to="/customize" className="inline-block bg-red-600 text-white px-8 py-3 rounded-none font-bold text-lg hover:bg-red-300 transition">
                START CUSTOMIZING
              </Link>
              <Link to="/styles" className="inline-block bg-white text-black px-8 py-3 rounded-none font-bold text-lg hover:bg-gray-100 transition">
                VIEW ALL STYLES
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Smooth Shopping Experience Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-2 tracking-wider">ENJOY A SMOOTH SHOPPING EXPERIENCE</h2>
        <p className="text-center text-lg mb-12">Discover our online and in-store services.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">
          <div>
            <FiHome size={64} className="mx-auto mb-4" />
            <div className="font-bold mb-2">BUY ONLINE,<br />PICK UP IN STORE</div>
            <div className="mb-4 text-gray-700">Buy online and pick up your item from any Ray-Ban, Sunglass Hut or LensCrafters partner store to benefit from free fitting and adjustment. Service now available in +900 stores.</div>
          </div>
          <div>
            <FiTruck size={64} className="mx-auto mb-4" />
            <div className="font-bold mb-2">SAME-DAY DELIVERY AT HOME</div>
            <div className="mb-4 text-gray-700">Get it faster with our Premium service of same day delivery at home</div>
          </div>
          <div>
            <FiRefreshCw size={64} className="mx-auto mb-4" />
            <div className="font-bold mb-2">NOT SURE?<br />RETURN FOR FREE</div>
            <div className="mb-4 text-gray-700">Not completely in love with your choice? Returning your order is free and easy.</div>
          </div>
          <div>
            <FiBox  size={64} className="mx-auto mb-4" />
            <div className="font-bold mb-2">RESPONSIBLE SHIPPING</div>
            <div className="mb-4 text-gray-700">We'll ship with logistics providers using solutions to reduce emissions.</div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <motion.section className="py-8 bg-black text-white text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <h3 className="text-2xl font-bold mb-2">Summer Sale: Up to 30% Off!</h3>
        <p className="text-lg">Limited time only. Shop your favorites now.</p>
      </motion.section>

      {/* Brand Story / USP */}
      <section className="py-12 px-4 md:px-16 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-4">Why LensCart?</h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-700">Premium eyewear for every style. Discover the perfect pair for you and your family. Free shipping, easy returns, and the latest trends in eyewear—just like the world's best brands.</p>
      </section>
    </div>
  );
} 