import React, { useEffect, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import CategorySection from './CategorySection';
import Deals from './Deals';
import RecommendedItems from './RecommendedItems';
import Services from './Services';
import RegionSuppliers from './RegionSuppliers';
import Newsletter from './Newsletter';
import Footer from './Footer';

import { fetchFeaturedProducts } from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFeaturedProducts();
      setFeaturedProducts(data);
    };
    load();
  }, []);

  return (
    <div>
      <Header />

      <Hero />

      <CategorySection />

      <Deals products={featuredProducts} />  {/* 🔥 dynamic */}

      <RecommendedItems products={featuredProducts} /> {/* 🔥 dynamic */}

      <Services />

      <RegionSuppliers />

      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home;