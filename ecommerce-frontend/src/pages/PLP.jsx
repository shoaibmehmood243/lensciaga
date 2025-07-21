import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { SERVER_URL } from '../config';

const CATEGORY_MAP = {
  men: 'men',
  women: 'women',
  kids: 'children',
};

export default function PLP() {
  const { cat } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${SERVER_URL}/api/product`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        const filtered = data.filter(
          p => p.category.toLowerCase() === CATEGORY_MAP[cat]
        );
        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [cat]);

  const handleAddToCart = (product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        category: product.category,
        quantity: 1,
        image: product.images[0]
      }
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-16">
      <h1 className="text-4xl font-bold mb-8 text-center capitalize tracking-widest">
        {cat} Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {products.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No products found.</div>
        )}
        {products.map(product => (
          <motion.div
            key={product.id}
            className="bg-gray-100 rounded-lg shadow p-4 flex flex-col relative group"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="w-full h-48 bg-white rounded mb-4 cursor-pointer overflow-hidden"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={`${SERVER_URL}${product.images[0]}`}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="font-semibold text-lg mb-2">{product.name}</div>
            <div className="text-gray-600 mb-4">${parseFloat(product.price).toFixed(2)}</div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex-1 bg-black text-white px-2 py-2 rounded hover:bg-gray-800 transition"
              >
                View
              </button>
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
            </div>
            
            {/* Add to Cart Success Popup */}
            <AnimatePresence>
              {addedToCart === product.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-20 left-0 right-0 mx-4 bg-black text-white py-2 px-4 rounded text-center"
                >
                  Added to cart!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 