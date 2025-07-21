import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FiArrowLeft, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { SERVER_URL } from '../config';

export default function PDP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch main product
        const res = await fetch(`${SERVER_URL}/api/product/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        
        // Fetch related products
        const relatedRes = await fetch(`${SERVER_URL}/api/product`);
        if (!relatedRes.ok) throw new Error('Failed to fetch related products');
        const allProducts = await relatedRes.json();
        const related = allProducts
          .filter(p => p.category === data.category && p.id !== data.id)
          .slice(0, 4);
        setRelatedProducts(related);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category,
          quantity: quantity,
          image: product.images[0]
        }
      });
      setShowCartPopup(true);
      setTimeout(() => setShowCartPopup(false), 3000);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!product) return null;

  const inStock = product.quantity > 0;

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="hover:text-red-600">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-red-600 capitalize">
            {product.category === 'children' ? 'Kids' : product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-500">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg p-8 aspect-square relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={`${SERVER_URL}${product.images[selectedImageIndex]}`}
                  alt={`${product.name} - View ${selectedImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={`${SERVER_URL}${image}`}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-contain p-2 bg-gray-100"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium capitalize">
                  {product.category === 'children' ? 'Kids' : product.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="text-3xl font-bold mb-8">
                ${parseFloat(product.price).toFixed(2)}
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                    disabled={!inStock}
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                    disabled={!inStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full py-4 rounded-lg font-bold text-lg mb-6 transition flex items-center justify-center gap-2 ${
                  inStock 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiShoppingCart size={20} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-8">
              <h3 className="font-bold mb-4">Product Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Category: {product.category === 'children' ? 'Kids' : product.category}</li>
                <li>Available Quantity: {product.quantity}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <motion.div
                  key={related.id}
                  whileHover={{ y: -5 }}
                  className="bg-gray-100 rounded-lg p-4 cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    navigate(`/product/${related.id}`);
                  }}
                >
                  <img
                    src={`${SERVER_URL}${related.images[0]}`}
                    alt={related.name}
                    className="w-full h-40 object-contain bg-white rounded mb-4"
                  />
                  <h3 className="font-semibold mb-2">{related.name}</h3>
                  <p className="text-gray-600">${parseFloat(related.price).toFixed(2)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Popup */}
      <AnimatePresence>
        {showCartPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-black text-white px-6 py-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-4">
              <FiCheck size={20} />
              <span>Added to cart!</span>
              <button
                onClick={() => navigate('/cart')}
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                View Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 