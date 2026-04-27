import React, { useState, useEffect } from 'react';
import { ChevronRight, Grid, List, ChevronDown, Star, Heart, SlidersHorizontal, X } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import api from '../services/api';

const ProductListing = ({ setPage, setSelectedProductId, initialSearch = '' }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 9;

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    api.get('/api/v1/products/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(searchQuery || selectedCategory);
        setProducts(data);
        setFilteredProducts(data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setSearchQuery(initialSearch);
    setSelectedCategory('');
  }, [initialSearch]);

  const applyFilters = () => {
    let result = [...products];
    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
    if (selectedRating > 0) result = result.filter(p => Math.floor(p.rating / 2) >= selectedRating);
    setFilteredProducts(result);
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const FilterPanel = () => (
    <div className="space-y-2">
      {/* Categories */}
      <div className="border-t border-[#DEE2E7] py-3">
        <h4 className="font-bold text-[#1C1C1C] mb-3 flex justify-between items-center">
          Category <ChevronDown className="w-4 h-4 opacity-50" />
        </h4>
        <ul className="space-y-3 text-[#505050] text-sm">
          <li className={`hover:text-primary cursor-pointer ${selectedCategory === '' ? 'text-primary font-medium' : ''}`}
            onClick={() => { setSelectedCategory(''); setShowMobileFilters(false); }}>All</li>
          {categories.map((cat, i) => (
            <li key={i}
              className={`hover:text-primary cursor-pointer ${selectedCategory === cat ? 'text-primary font-medium' : ''}`}
              onClick={() => { setSelectedCategory(cat); setShowMobileFilters(false); }}>
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="border-t border-[#DEE2E7] py-3">
        <h4 className="font-bold text-[#1C1C1C] mb-3 flex justify-between items-center">
          Price range <ChevronDown className="w-4 h-4 opacity-50" />
        </h4>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-[#1C1C1C] text-xs mb-1">Min</p>
              <input type="number" placeholder="0" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                className="w-full border border-[#DEE2E7] rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[#1C1C1C] text-xs mb-1">Max</p>
              <input type="number" placeholder="999999" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                className="w-full border border-[#DEE2E7] rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <button onClick={applyFilters}
            className="w-full bg-white border border-[#DEE2E7] text-primary py-2 rounded-md text-sm font-medium hover:bg-shade transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Ratings */}
      <div className="border-t border-[#DEE2E7] py-3 pb-4">
        <h4 className="font-bold text-[#1C1C1C] mb-3">Ratings</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((stars) => (
            <label key={stars} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="rating" checked={selectedRating === stars}
                onChange={() => {
                  setSelectedRating(stars);
                  let result = [...products];
                  if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
                  if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));
                  result = result.filter(p => Math.floor(p.rating / 2) >= stars);
                  setFilteredProducts(result);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 text-primary focus:ring-primary" />
              <div className="flex gap-0.5">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={14} className={i < stars ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                ))}
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div className="container py-4">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-4">
        <span className="cursor-pointer hover:text-primary" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C]">Products</span>
      </div>

      {/* Mobile: filter button */}
      <button
        className="lg:hidden mb-4 flex items-center gap-2 border border-[#DEE2E7] rounded-lg px-4 py-2 text-sm font-medium text-dark bg-white"
        onClick={() => setShowMobileFilters(true)}
      >
        <SlidersHorizontal className="w-4 h-4" /> Filters
        {(selectedCategory || minPrice || maxPrice || selectedRating > 0) && (
          <span className="ml-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">!</span>
        )}
      </button>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="flex gap-6">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0">
          <FilterPanel />
        </aside>

        <main className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white border border-[#DEE2E7] rounded-lg p-3 lg:p-4 flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-[#1C1C1C] text-sm">
              <span className="font-bold">{filteredProducts.length}</span> items
              {selectedCategory && <span className="ml-1 text-primary">"{selectedCategory}"</span>}
            </span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedCategory(''); }}
                className="border border-[#DEE2E7] rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary w-36 lg:w-48"
              />
              <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden">
                <div className={`p-2 border-r border-[#DEE2E7] cursor-pointer ${viewMode === 'grid' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`} onClick={() => setViewMode('grid')}>
                  <Grid size={16} className="text-[#1C1C1C]" />
                </div>
                <div className={`p-2 cursor-pointer ${viewMode === 'list' ? 'bg-[#EFF2F4]' : 'hover:bg-shade'}`} onClick={() => setViewMode('list')}>
                  <List size={16} className="text-[#1C1C1C]" />
                </div>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-400">No products found</div>
          )}

          {/* List view */}
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#DEE2E7] rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow group cursor-pointer relative"
                  onClick={() => { setSelectedProductId(product.id); setPage('details'); }}
                >
                  <div className="w-[90px] h-[90px] lg:w-[140px] lg:h-[140px] flex-shrink-0 flex items-center justify-center bg-[#F7F7F7] rounded-lg p-3 overflow-hidden">
                    <img src={product.image || 'https://placehold.co/200x200'} alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-[#1C1C1C] text-sm lg:text-base font-semibold group-hover:text-primary mb-1 lg:mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex flex-col mb-2">
                      <span className="text-lg font-bold text-[#1C1C1C]">${product.price}</span>
                      {product.old_price && <span className="text-[#8B96A5] line-through text-xs">${product.old_price}</span>}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={12} className={i < Math.floor(product.rating / 2) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                      ))}
                      <span className="text-[#8B96A5] text-xs ml-1">{product.orders} orders</span>
                    </div>
                    <p className="text-[#505050] text-xs lg:text-sm leading-relaxed line-clamp-2 hidden sm:block">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Grid view
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#DEE2E7] rounded-lg p-3 lg:p-4 hover:shadow-[0px_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center cursor-pointer"
                  onClick={() => { setSelectedProductId(product.id); setPage('details'); }}
                >
                  <div className="w-full aspect-square flex items-center justify-center mb-3 bg-[#F7F7F7] rounded-md p-4 overflow-hidden">
                    <img src={product.image || 'https://placehold.co/200x200'} alt={product.name}
                      className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base lg:text-lg font-bold text-[#1C1C1C]">${product.price}</span>
                      <button className="w-7 h-7 lg:w-8 lg:h-8 border border-[#DEE2E7] rounded-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        onClick={(e) => e.stopPropagation()}>
                        <Heart size={14} />
                      </button>
                    </div>
                    {product.old_price && <span className="text-[#8B96A5] line-through text-xs">${product.old_price}</span>}
                    <div className="flex items-center gap-0.5 my-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={11} className={i < Math.floor(product.rating / 2) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                      ))}
                    </div>
                    <h3 className="text-[#505050] text-xs lg:text-[13px] leading-[1.4] line-clamp-2 hover:text-primary">{product.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center lg:justify-end mt-6">
              <div className="flex border border-[#DEE2E7] rounded-md overflow-hidden bg-white">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-2 border-r border-[#DEE2E7] text-dark hover:bg-shade disabled:opacity-30">{"<"}</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border-r border-[#DEE2E7] text-sm transition-colors ${currentPage === page ? 'bg-primary text-white font-bold' : 'hover:bg-shade text-dark'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-2 text-dark hover:bg-shade disabled:opacity-30">{">"}</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;