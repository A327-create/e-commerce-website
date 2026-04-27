import React from 'react';

const CategorySection = ({ title, bannerImg, items, bannerBg, setPage, setSelectedProductId }) => {
  return (
    <section className="bg-white border border-[#DEE2E7] rounded-lg mt-6 overflow-hidden">
      <div className="flex flex-col lg:flex-row">

        {/* Banner */}
        <div
          className="lg:w-72 p-6 flex flex-col justify-start relative overflow-hidden bg-cover bg-no-repeat"
          style={{ backgroundColor: bannerBg || '#F7F7F7', backgroundImage: `url("${bannerImg}")` }}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-dark w-40 leading-tight mb-4">{title}</h3>
            <button
              className="bg-white text-dark px-4 py-2 rounded-md font-medium text-sm hover:bg-shade transition-colors shadow-sm"
              onClick={() => setPage('listing')}
            >
              Source now
            </button>
          </div>
        </div>

        {/* Products grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {items.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center text-gray-400 text-sm py-10">
              No products found
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id || item.name}
                className="p-4 border-r border-b last:border-r-0 border-[#DEE2E7] flex justify-between cursor-pointer hover:bg-white hover:shadow-[0px_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 group min-h-[110px] relative hover:z-10"
                onClick={() => {
                  if (item.id) { setSelectedProductId(item.id); setPage('details'); }
                  else setPage('listing');
                }}
              >
                <div className="flex flex-col flex-1 pr-2">
                  <span className="text-[#1C1C1C] text-sm font-medium group-hover:text-primary transition-colors mb-1 line-clamp-2">
                    {item.name}
                  </span>
                  <span className="text-[#8B96A5] text-xs">
                    From <br /> USD {item.price}
                  </span>
                </div>
                <div className="w-[70px] h-[70px] flex-shrink-0 self-end">
                  <img
                    src={item.image || 'https://placehold.co/82x82'}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;