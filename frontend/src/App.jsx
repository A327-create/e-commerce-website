import React, { useState, useEffect } from 'react';
import { getCurrentUser } from './services/authService';
import Header from './components/Header';
import Hero from './components/Hero';
import Deals from './components/Deals';
import CategorySection from './components/CategorySection';
import InquiryForm from './components/InquiryForm';
import RecommendedItems from './components/RecommendedItems';
import Services from './components/Services';
import RegionSuppliers from './components/RegionSuppliers';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Orders from './components/Orders';
import Favorites from './components/Favorites';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import HotOffers from './components/HotOffers';
import NewArrivals from './components/NewArrivals';
import ComingSoon from './components/ComingSoon';
import Help from './components/Help';
import { fetchProducts } from './services/productService';

import homeBanner from './assets/Image/backgrounds/image 98.png';
import electronicsBanner from './assets/Image/backgrounds/image 106.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [user, setUser] = useState(null);
  const [homeProducts, setHomeProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getCurrentUser()
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('access_token'));
    }
  }, []);

  useEffect(() => {
    fetchProducts().then(data => {
      const uniqueCategories = [...new Set(data.map(p => p.category))];
      const cat1 = uniqueCategories[0] || '';
      const cat2 = uniqueCategories[1] || '';
      setHomeProducts(data.filter(p => p.category === cat1).slice(0, 8));
      setElectronicsProducts(data.filter(p => p.category === cat2).slice(0, 8));
    }).catch(console.error);
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'listing':
        return (
          <ProductListing
            setPage={setCurrentPage}
            setSelectedProductId={setSelectedProductId}
            initialSearch={searchQuery}
          />
        );
      case 'details':
        return (
          <ProductDetails
            setPage={setCurrentPage}
            productId={selectedProductId}
            setSelectedProductId={setSelectedProductId}
            user={user}
          />
        );
      case 'cart':
        return <Cart setPage={setCurrentPage} />;
      case 'profile':
        return <Profile setPage={setCurrentPage} user={user} setUser={setUser} />;
      case 'admin':
        return <AdminDashboard setPage={setCurrentPage} user={user} />;
      case 'message':
        return <Messages setPage={setCurrentPage} user={user} />;
      case 'favorites':
        return <Favorites setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'orders':
        return <Orders setPage={setCurrentPage} />;
      case 'login':
        return <Login setPage={setCurrentPage} setUser={setUser} />;
      case 'register':
        return <Register setPage={setCurrentPage} setUser={setUser} />;

      // ✅ Nayi pages
      case 'hot-offers':
        return <HotOffers setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'new-arrivals':
        return <NewArrivals setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />;
      case 'gift-boxes':
        return <ComingSoon setPage={setCurrentPage} title="Gift Boxes" />;
      case 'projects':
        return <ComingSoon setPage={setCurrentPage} title="Projects" />;
      case 'help':
        return <Help setPage={setCurrentPage} />;

      default:
        return (
          <div className="container">
            <Hero setPage={setCurrentPage} user={user} setSelectedProductId={setSelectedProductId} />
            <Deals setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />
            <CategorySection
              title="Home and outdoor"
              bannerBg="#FFE6BF"
              bannerImg={homeBanner}
              items={homeProducts}
              setPage={setCurrentPage}
              setSelectedProductId={setSelectedProductId}
            />
            <CategorySection
              title="Consumer electronics"
              bannerBg="#E5F1FF"
              bannerImg={electronicsBanner}
              items={electronicsProducts}
              setPage={setCurrentPage}
              setSelectedProductId={setSelectedProductId}
            />
            <InquiryForm />
            <RecommendedItems setPage={setCurrentPage} setSelectedProductId={setSelectedProductId} />
            <Services />
            <RegionSuppliers />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        setPage={setCurrentPage}
        user={user}
        setUser={setUser}
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage('listing');
        }}
      />
      <main className="flex-grow pb-12">
        {renderContent()}
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;