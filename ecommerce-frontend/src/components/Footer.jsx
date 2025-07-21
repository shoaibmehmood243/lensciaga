import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 px-8 mt-12 text-center">
      <div className="mb-2">&copy; {new Date().getFullYear()} LensCart. All rights reserved.</div>
      <div className="flex justify-center gap-6 text-sm">
        <a href="#" className="hover:text-gray-300">Privacy Policy</a>
        <a href="#" className="hover:text-gray-300">Terms of Service</a>
        <a href="#" className="hover:text-gray-300">Contact</a>
      </div>
    </footer>
  );
} 