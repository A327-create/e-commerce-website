import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';

const Deals = ({ setPage, setSelectedProductId }) => {
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 13, mins: 34, secs: 56 });

  useEffect(() => {
    fetchProducts().then(data => setDeals(data.slice(0, 5))).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white border border-[#DEE2E7] rounded-lg mt-6 overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* Timer */}
        <div className="lg:w-72 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-[#DEE2E7] flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-4">
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-dark mb-1">Deals and offers</h3>
            <p className="text-secondary text-sm lg:text-base">Limited time deals</p>
          </div>
          <div className="flex gap-2">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hr' },
              { val: timeLeft.mins, label: 'Min' },
              { val: timeLeft.secs, label: 'Sec' },
            ].map((t, i) => (
              <div key={i} className="w-11 h-11 lg:w-12 lg:h-12 bg-[#606060] rounded flex flex-col items-center justify-center text-white">
                <span className="text-xs lg:text-sm font-bold">{String(t.val).padStart(2, '0')}</span>
                <span className="text-[9px] lg:text-[10px] opacity-70">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deals grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-4 flex flex-col items-center justify-center text-center border-r border-b lg:border-b-0 last:border-r-0 border-[#DEE2E7] cursor-pointer hover:shadow-[0px_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group"
              onClick={() => { setSelectedProductId(deal.id); setPage('details'); }}
            >
              <div className="w-full aspect-square bg-[#F7F7F7] rounded-md flex items-center justify-center mb-3 overflow-hidden p-2">
                <img
                  src={deal.image || 'https://placehold.co/200x200'}
                  alt={deal.name}
                  className="max-w-[90%] max-h-[90%] object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="text-[#1C1C1C] text-xs lg:text-sm mb-2 line-clamp-1">{deal.name}</p>
              <span className="bg-[#FFE3E3] text-[#EB001B] px-2 py-1 rounded-full text-xs font-bold">
                ${deal.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;