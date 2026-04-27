import React, { useState, useEffect } from 'react';
import { Star, Heart, ChevronRight } from 'lucide-react';
import { fetchProducts } from '../services/productService';

const HotOffers = ({ setPage, setSelectedProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        // old_price wale products = discounted
        const offers = data.filter(p => p.old_price && p.old_price > p.price);
        setProducts(offers);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getDiscount = (price, oldPrice) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-medium">Hot Offers</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">🔥 Hot Offers</h1>
          <p className="text-[#8B96A5] text-sm mt-1">{products.length} discounted products</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">😕</p>
          <p className="text-gray-400">No offers available right now</p>
          <button onClick={() => setPage('listing')}
            className="mt-4 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark">
            Browse All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-white border border-[#DEE2E7] rounded-lg p-4 hover:shadow-[0px_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative"
              onClick={() => { setSelectedProductId(product.id); setPage('details'); }}
            >
              {/* Discount badge */}
              <div className="absolute top-3 left-3 bg-[#FA3434] text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                -{getDiscount(product.price, product.old_price)}%
              </div>

              <div className="w-full aspect-square flex items-center justify-center mb-3 bg-[#F7F7F7] rounded-md p-4 overflow-hidden">
                <img src={product.image || 'https://placehold.co/200x200'} alt={product.name}
                  className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>

              <div className="w-full">
                <h3 className="text-[#505050] text-xs lg:text-sm line-clamp-2 mb-2 group-hover:text-primary">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={11} className={i < Math.floor(product.rating / 2) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#FA3434]">${product.price}</span>
                  <span className="text-xs text-[#8B96A5] line-through">${product.old_price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotOffers;