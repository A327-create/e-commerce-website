// import React, { useState, useEffect } from 'react';
// import { fetchProducts } from '../services/productService';
// import api from '../services/api';

// import bannerImg from '../assets/Image/backgrounds/Banner-board-800x420 2.png';
// import promo1 from '../assets/Image/backgrounds/Group 969.png';
// import promo2 from '../assets/Image/backgrounds/Group 982.png';

// const Hero = ({ setPage, user, setSelectedProductId }) => {
//   const [categories, setCategories] = useState([]);
//   const [featuredProduct, setFeaturedProduct] = useState(null);

//   useEffect(() => {
//     // ✅ Categories DB se
//     api
//       .get('/api/v1/products/categories')
//       .then((res) => setCategories(res.data))
//       .catch(console.error);

//     // ✅ Featured product banner ke liye
//     fetchProducts()
//       .then((data) => {
//         if (data.length > 0) setFeaturedProduct(data[0]);
//       })
//       .catch(console.error);
//   }, []);

//   return (
//     <section className="bg-white border border-shade-border rounded-lg mt-6 overflow-hidden">
//       <div className="flex p-4 gap-4 h-[400px]">
        
//         {/* ✅ Categories */}
//         <div className="w-64 flex-shrink-0">
//           <ul className="space-y-1">
//             {categories.map((cat, index) => (
//               <li
//                 key={index}
//                 className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
//                   index === 0
//                     ? 'bg-primary-light font-medium text-dark'
//                     : 'text-dark-light hover:bg-shade'
//                 }`}
//                 onClick={() => setPage('listing')}
//               >
//                 {cat}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* ✅ Banner */}
//         <div
//           className="flex-1 relative rounded-lg p-10 flex flex-col justify-center bg-cover bg-no-repeat bg-center"
//           style={{ backgroundImage: `url("${bannerImg}")` }}
//         >
//           <div className="relative z-10 w-1/2">
//             <h3 className="text-2xl font-normal text-dark mb-1">
//               Latest trending
//             </h3>

//             <h2 className="text-[32px] font-bold text-dark leading-tight mb-6">
//               {featuredProduct
//                 ? featuredProduct.category
//                 : 'Electronic items'}
//             </h2>

//             <button
//               className="bg-white text-dark px-6 py-2 rounded-md font-medium hover:bg-shade transition-colors shadow-sm"
//               onClick={() => {
//                 if (featuredProduct) {
//                   setSelectedProductId(featuredProduct.id);
//                   setPage('details');
//                 } else {
//                   setPage('listing');
//                 }
//               }}
//             >
//               Learn more
//             </button>
//           </div>
//         </div>

//         {/* ✅ Right Sidebar */}
//         <div className="w-60 flex flex-col gap-3">
          
//           {/* User Card */}
//           <div className="bg-[#E3F0FF] p-4 rounded-lg">
//             <div className="flex items-center gap-3 mb-4">
              
//               {/* Avatar */}
//               <div className="w-10 h-10 rounded-full bg-[#C3D9FF] flex items-center justify-center text-secondary font-bold">
//                 {user ? (
//                   <span>
//                     {user.fullname?.charAt(0).toUpperCase() ||
//                       user.username?.charAt(0).toUpperCase()}
//                   </span>
//                 ) : (
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
//                     <circle cx="12" cy="7" r="4" />
//                   </svg>
//                 )}
//               </div>

//               {/* User Info */}
//               <div className="flex flex-col">
//                 {user ? (
//                   <>
//                     <p className="text-dark text-sm font-medium">
//                       {user.fullname || user.username}
//                     </p>
//                     <p className="text-dark text-xs">{user.email}</p>
//                   </>
//                 ) : (
//                   <>
//                     <p className="text-dark text-sm">Hi, user</p>
//                     <p className="text-dark text-sm">
//                       let's get started
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Buttons */}
//             {user ? (
//               <button
//                 className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md text-sm font-medium transition-colors"
//                 onClick={() => setPage('profile')}
//               >
//                 My Profile
//               </button>
//             ) : (
//               <>
//                 <button
//                   className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md mb-2 text-sm font-medium transition-colors"
//                   onClick={() => setPage('register')}
//                 >
//                   Join now
//                 </button>

//                 <button
//                   className="w-full bg-white text-primary py-2 rounded-md text-sm font-medium border border-shade-border hover:bg-shade transition-colors"
//                   onClick={() => setPage('login')}
//                 >
//                   Log in
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Promo 1 */}
//           <div
//             className="bg-orange p-3 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 transition-opacity"
//             style={{ backgroundImage: `url("${promo1}")` }}
//             onClick={() => setPage('listing')}
//           >
//             <p className="text-sm font-normal leading-tight w-2/3">
//               Get US $10 off with a new supplier
//             </p>
//           </div>

//           {/* Promo 2 */}
//           <div
//             className="bg-teal p-3 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 transition-opacity"
//             style={{ backgroundImage: `url("${promo2}")` }}
//             onClick={() => setPage('listing')}
//           >
//             <p className="text-sm font-normal leading-tight w-2/3">
//               Send quotes with supplier preferences
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';
import api from '../services/api';

import bannerImg from '../assets/Image/backgrounds/Banner-board-800x420 2.png';
import promo1 from '../assets/Image/backgrounds/Group 969.png';
import promo2 from '../assets/Image/backgrounds/Group 982.png';

const Hero = ({ setPage, user, setSelectedProductId }) => {
  const [categories, setCategories] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    api.get('/api/v1/products/categories')
      .then((res) => setCategories(res.data))
      .catch(console.error);

    fetchProducts()
      .then((data) => { if (data.length > 0) setFeaturedProduct(data[0]); })
      .catch(console.error);
  }, []);

  return (
    <section className="bg-white border border-shade-border rounded-lg mt-4 overflow-hidden">

      {/* ── MOBILE LAYOUT ── */}
      <div className="lg:hidden">

        {/* Banner */}
        <div
          className="relative p-6 flex flex-col justify-center min-h-[200px] bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url("${bannerImg}")` }}
        >
          <div className="relative z-10 w-2/3">
            <h3 className="text-lg font-normal text-dark mb-1">Latest trending</h3>
            <h2 className="text-2xl font-bold text-dark leading-tight mb-4">
              {featuredProduct ? featuredProduct.category : 'Electronic items'}
            </h2>
            <button
              className="bg-white text-dark px-5 py-2 rounded-md font-medium hover:bg-shade transition-colors shadow-sm text-sm"
              onClick={() => {
                if (featuredProduct) { setSelectedProductId(featuredProduct.id); setPage('details'); }
                else setPage('listing');
              }}
            >
              Learn more
            </button>
          </div>
        </div>

        {/* User card */}
        <div className="bg-[#E3F0FF] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C3D9FF] flex items-center justify-center text-secondary font-bold">
              {user ? (
                <span>{user.fullname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <div>
              {user ? (
                <>
                  <p className="text-dark text-sm font-medium">{user.fullname || user.username}</p>
                  <p className="text-dark text-xs opacity-70">{user.email}</p>
                </>
              ) : (
                <p className="text-dark text-sm">Hi, let's get started</p>
              )}
            </div>
          </div>
          {user ? (
            <button
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={() => setPage('profile')}
            >
              Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-md text-xs font-medium"
                onClick={() => setPage('register')}
              >
                Join
              </button>
              <button
                className="bg-white text-primary px-3 py-1.5 rounded-md text-xs font-medium border border-shade-border"
                onClick={() => setPage('login')}
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Categories accordion */}
        <div className="border-t border-shade-border">
          <button
            className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-dark"
            onClick={() => setShowCategories(!showCategories)}
          >
            <span>Browse Categories</span>
            <svg className={`w-4 h-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCategories && (
            <div className="px-4 pb-3 grid grid-cols-2 gap-1">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className="text-left px-3 py-2 rounded-md text-sm text-dark-light hover:bg-shade hover:text-primary transition-colors"
                  onClick={() => setPage('listing')}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Promo cards */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div
            className="bg-orange p-3 rounded-lg text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 min-h-[80px] flex items-end"
            style={{ backgroundImage: `url("${promo1}")` }}
            onClick={() => setPage('listing')}
          >
            <p className="text-xs font-normal leading-tight w-2/3">Get US $10 off with a new supplier</p>
          </div>
          <div
            className="bg-teal p-3 rounded-lg text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90 min-h-[80px] flex items-end"
            style={{ backgroundImage: `url("${promo2}")` }}
            onClick={() => setPage('listing')}
          >
            <p className="text-xs font-normal leading-tight w-2/3">Send quotes with supplier preferences</p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (original) ── */}
      <div className="hidden lg:flex p-4 gap-4 h-[400px]">

        {/* Categories sidebar */}
        <div className="w-64 flex-shrink-0">
          <ul className="space-y-1">
            {categories.map((cat, index) => (
              <li
                key={index}
                className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  index === 0 ? 'bg-primary-light font-medium text-dark' : 'text-dark-light hover:bg-shade'
                }`}
                onClick={() => setPage('listing')}
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Banner */}
        <div
          className="flex-1 relative rounded-lg p-10 flex flex-col justify-center bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: `url("${bannerImg}")` }}
        >
          <div className="relative z-10 w-1/2">
            <h3 className="text-2xl font-normal text-dark mb-1">Latest trending</h3>
            <h2 className="text-[32px] font-bold text-dark leading-tight mb-6">
              {featuredProduct ? featuredProduct.category : 'Electronic items'}
            </h2>
            <button
              className="bg-white text-dark px-6 py-2 rounded-md font-medium hover:bg-shade transition-colors shadow-sm"
              onClick={() => {
                if (featuredProduct) { setSelectedProductId(featuredProduct.id); setPage('details'); }
                else setPage('listing');
              }}
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-60 flex flex-col gap-3">
          <div className="bg-[#E3F0FF] p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C3D9FF] flex items-center justify-center text-secondary font-bold">
                {user ? (
                  <span>{user.fullname?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}</span>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                {user ? (
                  <>
                    <p className="text-dark text-sm font-medium">{user.fullname || user.username}</p>
                    <p className="text-dark text-xs">{user.email}</p>
                  </>
                ) : (
                  <>
                    <p className="text-dark text-sm">Hi, user</p>
                    <p className="text-dark text-sm">let's get started</p>
                  </>
                )}
              </div>
            </div>
            {user ? (
              <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md text-sm font-medium" onClick={() => setPage('profile')}>
                My Profile
              </button>
            ) : (
              <>
                <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md mb-2 text-sm font-medium" onClick={() => setPage('register')}>
                  Join now
                </button>
                <button className="w-full bg-white text-primary py-2 rounded-md text-sm font-medium border border-shade-border hover:bg-shade" onClick={() => setPage('login')}>
                  Log in
                </button>
              </>
            )}
          </div>
          <div className="bg-orange p-3 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90" style={{ backgroundImage: `url("${promo1}")` }} onClick={() => setPage('listing')}>
            <p className="text-sm font-normal leading-tight w-2/3">Get US $10 off with a new supplier</p>
          </div>
          <div className="bg-teal p-3 rounded-lg flex-1 text-white bg-cover bg-no-repeat bg-center cursor-pointer hover:opacity-90" style={{ backgroundImage: `url("${promo2}")` }} onClick={() => setPage('listing')}>
            <p className="text-sm font-normal leading-tight w-2/3">Send quotes with supplier preferences</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;