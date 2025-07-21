import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import Landing from './pages/Landing';
import PLP from './pages/PLP';
import PDP from './pages/PDP';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

function Placeholder({ name }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-3xl font-bold text-gray-700">
      {name} Page (Coming Soon)
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/category/:cat" element={<PLP />} />
          <Route path="/product/:id" element={<PDP />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}
