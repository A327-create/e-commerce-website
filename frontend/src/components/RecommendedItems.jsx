import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';

const RecommendedItems = ({ setPage, setSelectedProductId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => setItems(data.slice(0, 10)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <section className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Recommended items</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#DEE2E7] rounded-lg p-4 flex flex-col hover:shadow-[0px_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-full"
            onClick={() => { setSelectedProductId(item.id); setPage('details'); }}
          >
            <div className="flex-1 flex items-center justify-center p-4 mb-3">
              <img
                src={item.image || 'https://placehold.co/200x200'}
                alt={item.name}
                className="max-h-[140px] w-auto object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="mt-auto">
              <p className="font-medium text-[#1C1C1C] text-lg mb-1">${item.price}</p>
              <p className="text-[#8B96A5] text-[15px] line-clamp-2 leading-snug">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedItems;