import React, { useState, useEffect } from 'react';
import { User, MessageSquare, Heart, ShoppingCart, Menu, ChevronDown, ShoppingBag, Search, X } from 'lucide-react';
import logo from '../assets/Layout/Brand/logo-colored.png';
import flagDE from '../assets/Layout1/Image/flags/DE@2x.png';
import api from '../services/api';
 
const Header = ({ setPage, user, setUser, onSearch }) => {
  const [query, setQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
 
  useEffect(() => {
    api.get('/api/v1/products/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);
 
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setPage('listing');
      setMobileSearchOpen(false);
    }
  };
 
  const handleCategorySelect = (cat) => {
    setQuery('');
    onSearch(cat);
    setPage('listing');
    setShowCategories(false);
    setMobileMenuOpen(false);
  };
 
  return (
    <header className="bg-white border-b border-shade-border sticky top-0 z-50 shadow-sm">
 
      {/* ── TOP BAR ── */}
      <div className="container py-3 flex items-center justify-between gap-3">
 
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => setPage('home')}>
          <img src={logo} alt="Brand" className="h-[36px] lg:h-[46px]" />
        </div>
 
        {/* Search bar — hidden on mobile, visible on md+ */}
        <div className="hidden md:flex flex-1 max-w-2xl border-2 border-primary rounded-lg overflow-hidden relative">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 outline-none text-sm"
          />
          <div className="relative">
            <div
              className="flex items-center border-l border-primary px-3 py-2 bg-white cursor-pointer hover:bg-gray-50 h-full"
              onClick={() => setShowCategories(!showCategories)}
            >
              <span className="text-sm whitespace-nowrap hidden lg:inline">All category</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </div>
            {showCategories && (
              <div className="absolute top-full right-0 bg-white border border-[#DEE2E7] rounded-lg shadow-lg z-50 w-48 py-2">
                <div
                  className="px-4 py-2 text-sm hover:bg-shade cursor-pointer text-primary font-medium"
                  onClick={() => { onSearch(''); setQuery(''); setPage('listing'); setShowCategories(false); }}
                >
                  All Products
                </div>
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 text-sm hover:bg-shade cursor-pointer"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 font-medium transition-colors text-sm"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
 
        {/* Right icons */}
        <div className="flex items-center gap-3 lg:gap-6">
 
          {/* Mobile: search icon */}
          <button
            className="md:hidden flex flex-col items-center text-secondary hover:text-primary"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>
 
          {/* Profile */}
          <div
            className="hidden sm:flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors"
            onClick={() => user ? setPage('profile') : setPage('login')}
          >
            {user ? (
              <div className="w-8 h-8 rounded-full bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-sm">
                {user.fullname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            ) : (
              <User className="w-5 h-5 mb-1" />
            )}
            <span className="text-xs hidden lg:block">{user ? (user.fullname?.split(' ')[0] || user.username) : 'Profile'}</span>
          </div>
 
          {/* Message — hidden on small */}
          <div className="hidden sm:flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => setPage('message')}>
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs hidden lg:block">Message</span>
          </div>
 
          {/* Favorites — hidden on small */}
          <div className="hidden sm:flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => user ? setPage('favorites') : setPage('login')}>
            <Heart className="w-5 h-5 mb-1" />
            <span className="text-xs hidden lg:block">Favorites</span>
          </div>
 
          {/* Orders — hidden on small */}
          <div className="hidden sm:flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => user ? setPage('orders') : setPage('login')}>
            <ShoppingBag className="w-5 h-5 mb-1" />
            <span className="text-xs hidden lg:block">Orders</span>
          </div>
 
          {/* Cart — always visible */}
          <div className="flex flex-col items-center cursor-pointer text-secondary hover:text-primary transition-colors" onClick={() => setPage('cart')}>
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs hidden lg:block">My cart</span>
          </div>
 
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col items-center text-secondary hover:text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
 
      {/* ── MOBILE SEARCH BAR ── */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex border-2 border-primary rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3 py-2 outline-none text-sm"
              autoFocus
            />
            <button
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 font-medium transition-colors text-sm"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          {/* Mobile category buttons */}
          {categories.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => { onSearch(''); setQuery(''); setPage('listing'); setMobileSearchOpen(false); }}
                className="flex-shrink-0 text-xs px-3 py-1 rounded-full border border-primary text-primary"
              >
                All
              </button>
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => { handleCategorySelect(cat); setMobileSearchOpen(false); }}
                  className="flex-shrink-0 text-xs px-3 py-1 rounded-full border border-[#DEE2E7] text-[#505050] hover:border-primary hover:text-primary"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
 
      {/* ── NAV BAR — desktop ── */}
      <div className="hidden md:block border-t border-shade-border bg-white overflow-x-auto no-scrollbar">
        <div className="container py-3 flex items-center justify-between whitespace-nowrap gap-4">
          <nav className="flex items-center gap-6 font-medium text-dark">
            <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={() => setPage('listing')}>
              <Menu className="w-5 h-5" />
              <span>All category</span>
            </div>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('listing'); }}>Hot offers</a>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('listing'); }}>Gift boxes</a>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('listing'); }}>Projects</a>
            <a href="#" className="hover:text-primary transition-colors" onClick={(e) => { e.preventDefault(); setPage('listing'); }}>Menu item</a>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
              <span>Help</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </nav>
          <div className="flex items-center gap-6 font-medium text-dark">
            <div className="flex items-center gap-1 cursor-pointer">
              <span>English, USD</span>
              <ChevronDown className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <span>Ship to</span>
              <img src={flagDE} alt="DE" className="w-5 h-3 rounded-sm shadow-sm" />
              <ChevronDown className="w-4 h-4 text-secondary" />
            </div>
          </div>
        </div>
      </div>
 
      {/* ── MOBILE MENU DRAWER ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-shade-border shadow-lg">
          <div className="px-4 py-4 space-y-1">
 
            {/* Nav links */}
            {[
              { label: 'All Categories', action: () => setPage('listing') },
              { label: 'Hot Offers', action: () => setPage('listing') },
              { label: 'Gift Boxes', action: () => setPage('listing') },
              { label: 'Projects', action: () => setPage('listing') },
              { label: 'Help', action: () => {} },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { item.action(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-dark hover:bg-shade hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
 
            <div className="h-px bg-[#DEE2E7] my-2" />
 
            {/* User actions */}
            <button onClick={() => { user ? setPage('profile') : setPage('login'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-dark hover:bg-shade hover:text-primary transition-colors flex items-center gap-3">
              <User className="w-4 h-4" /> {user ? (user.fullname || user.username) : 'Login / Register'}
            </button>
            <button onClick={() => { setPage('message'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-dark hover:bg-shade hover:text-primary transition-colors flex items-center gap-3">
              <MessageSquare className="w-4 h-4" /> Messages
            </button>
            <button onClick={() => { user ? setPage('favorites') : setPage('login'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-dark hover:bg-shade hover:text-primary transition-colors flex items-center gap-3">
              <Heart className="w-4 h-4" /> Favorites
            </button>
            <button onClick={() => { user ? setPage('orders') : setPage('login'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-dark hover:bg-shade hover:text-primary transition-colors flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" /> My Orders
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
 
export default Header;