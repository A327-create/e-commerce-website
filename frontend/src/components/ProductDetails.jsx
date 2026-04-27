import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingBag, ShieldCheck, Globe, ChevronRight, Check } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/productService';
import { addToCart } from '../services/cartService';
import api from '../services/api';

const ProductDetails = ({ setPage, productId, setSelectedProductId, user }) => {
   const [product, setProduct] = useState(null);
   const [relatedProducts, setRelatedProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [selectedThumb, setSelectedThumb] = useState(0);
   const [addingToCart, setAddingToCart] = useState(false);
   const [activeTab, setActiveTab] = useState('Description');
   const [reviews, setReviews] = useState([]);
   const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
   const [hoverRating, setHoverRating] = useState(0);
   const [reviewLoading, setReviewLoading] = useState(false);
   const [reviewMessage, setReviewMessage] = useState('');
   const [isFavorited, setIsFavorited] = useState(false);

   useEffect(() => {
    if (!productId) return;
    const load = async () => {
        try {
            setLoading(true);
            const data = await fetchProductById(productId);
            setProduct(data);
            const related = await fetchProducts(data.category);
            setRelatedProducts(related.filter(p => p.id !== productId).slice(0, 6));
            const rev = await api.get(`/api/v1/reviews/${productId}`);
            setReviews(rev.data);
            if (user) {
                const favRes = await api.get('/api/v1/favorites');
                setIsFavorited(favRes.data.some(f => f.id === productId));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    load();
}, [productId]);

   const handleAddToCart = async () => {
      try {
         setAddingToCart(true);
         await addToCart(product.id, 1);
         setPage('cart');
      } catch (err) {
         console.error(err);
      } finally {
         setAddingToCart(false);
      }
   };

   const handleReviewSubmit = async () => {
      if (!user) { setPage('login'); return; }
      if (reviewForm.rating === 0) { setReviewMessage('Please select a rating'); return; }
      try {
         setReviewLoading(true);
         await api.post(`/api/v1/reviews/${productId}`, reviewForm);
         const rev = await api.get(`/api/v1/reviews/${productId}`);
         setReviews(rev.data);
         setReviewForm({ rating: 0, comment: '' });
         setReviewMessage('Review submitted!');
      } catch (err) {
         setReviewMessage(err.response?.data?.detail || 'Failed to submit review');
      } finally {
         setReviewLoading(false);
      }
   };

   if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
   if (!product) return <div className="text-center py-20 text-red-400">Product not found</div>;

   const images = product.image ? [product.image] : [];

   return (
      <div className="container py-4">
         {/* Breadcrumbs */}
         <div className="flex items-center gap-2 text-[#8B96A5] text-xs lg:text-sm mb-4">
            <span className="cursor-pointer hover:text-primary" onClick={() => setPage('home')}>Home</span>
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="cursor-pointer hover:text-primary" onClick={() => setPage('listing')}>Products</span>
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="text-[#1C1C1C] line-clamp-1">{product.name}</span>
         </div>

         {/* Main Content Card */}
         <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 mb-6 shadow-sm">

            {/* Gallery */}
            <div className="w-full lg:w-[450px] lg:flex-shrink-0">
               <div className="border border-[#DEE2E7] rounded-lg p-6 lg:p-8 flex items-center justify-center bg-[#F7F7F7] aspect-square overflow-hidden max-h-[280px] lg:max-h-none">
                  <img
                     src={images[selectedThumb] || 'https://placehold.co/400x400'}
                     alt={product.name}
                     className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
               </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-2">
                  {product.stock > 0 ? (
                     <span className="flex items-center gap-1 text-[#00B517] text-sm font-medium">
                        <Check size={16} /> In stock ({product.stock} left)
                     </span>
                  ) : (
                     <span className="text-red-500 text-sm font-medium">Out of stock</span>
                  )}
               </div>

               <h1 className="text-lg lg:text-2xl font-bold text-[#1C1C1C] mb-3">{product.name}</h1>

               <div className="flex flex-wrap items-center gap-3 lg:gap-4 mb-4">
                  <div className="flex items-center gap-1">
                     {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(product.rating / 2) ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                     ))}
                     <span className="text-[#FF9017] text-sm ml-1">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#8B96A5] text-sm">
                     <ShoppingBag size={14} />
                     <span>{product.orders} sold</span>
                  </div>
                  <span className="text-[#8B96A5] text-sm">{reviews.length} reviews</span>
               </div>

               {/* Price */}
               <div className="bg-[#FFF0DF] p-3 lg:p-4 rounded-lg mb-4">
                  <span className="text-2xl lg:text-3xl font-bold text-[#FA3434]">${product.price}</span>
                  {product.old_price && (
                     <span className="text-[#8B96A5] line-through text-sm ml-3">${product.old_price}</span>
                  )}
               </div>

               {/* Meta */}
               <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                     <span className="text-[#8B96A5]">Category:</span>
                     <span className="col-span-2 text-[#505050]">{product.category}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm border-t border-[#DEE2E7] pt-3">
                     <span className="text-[#8B96A5]">Description:</span>
                     <span className="col-span-2 text-[#505050] text-xs lg:text-sm">{product.description}</span>
                  </div>
               </div>

               <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>

               {/* Actions */}
               <div className="flex flex-wrap gap-3">
                  <button
                     className="flex-1 min-w-[120px] bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm lg:text-base"
                     onClick={handleAddToCart}
                     disabled={addingToCart || product.stock === 0}
                  >
                     {addingToCart ? 'Adding...' : 'Buy Now'}
                  </button>
                  <button
                     className="flex-1 min-w-[120px] bg-[#E3F0FF] hover:bg-[#D1E9FF] text-primary py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm lg:text-base"
                     onClick={handleAddToCart}
                     disabled={addingToCart || product.stock === 0}
                  >
                     Add to Cart
                  </button>
                  <button
                     onClick={async () => {
                        if (!user) { setPage('login'); return; }
                        const res = await api.post(`/api/v1/favorites/${product.id}`);
                        setIsFavorited(res.data.favorited);
                     }}
                     className={`w-12 h-12 flex items-center justify-center border rounded-lg transition-colors ${isFavorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-[#DEE2E7] text-primary hover:bg-shade'}`}
                  >
                     <Heart size={20} className={isFavorited ? 'fill-red-500' : ''} />
                  </button>
               </div>
            </div>

            {/* Seller Sidebar — below on mobile */}
            <div className="w-full lg:w-[280px]">
               <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 lg:p-5">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-md bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-lg">S</div>
                     <div>
                        <span className="text-[#1C1C1C] font-normal block text-sm">Supplier</span>
                        <span className="text-[#505050] text-xs">Verified Store</span>
                     </div>
                  </div>
                  <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>
                  <div className="flex flex-row lg:flex-col gap-4 lg:gap-3 mb-4">
                     <div className="flex items-center gap-2 text-sm text-[#8B96A5]">
                        <ShieldCheck size={16} /><span>Verified Seller</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-[#8B96A5]">
                        <Globe size={16} /><span>Worldwide shipping</span>
                     </div>
                  </div>
                  <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                     Send inquiry
                  </button>
               </div>
            </div>
         </div>

         {/* Tabs */}
         <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden mb-6">
            <div className="flex overflow-x-auto no-scrollbar border-b border-[#DEE2E7]">
               {['Description', 'Reviews', 'Shipping'].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium border-b-2 flex-shrink-0 transition-colors ${activeTab === tab ? 'text-primary border-primary' : 'text-[#8B96A5] border-transparent hover:text-primary'}`}
                  >
                     {tab} {tab === 'Reviews' && `(${reviews.length})`}
                  </button>
               ))}
            </div>

            <div className="p-4 lg:p-8">
               {activeTab === 'Description' && (
                  <p className="text-[#505050] text-sm leading-relaxed">{product.description || 'No description available.'}</p>
               )}

               {activeTab === 'Reviews' && (
                  <div className="space-y-6">
                     <div className="border border-[#DEE2E7] rounded-lg p-4 lg:p-5">
                        <h3 className="font-bold text-[#1C1C1C] mb-4">
                           {user ? 'Write a Review' : 'Login to write a review'}
                        </h3>
                        {reviewMessage && (
                           <div className={`mb-4 p-3 rounded-lg text-sm ${reviewMessage.includes('submitted') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                              {reviewMessage}
                           </div>
                        )}
                        {user && (
                           <>
                              <div className="flex items-center gap-2 mb-4">
                                 <span className="text-sm text-[#8B96A5]">Rating:</span>
                                 <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                       <Star key={star} size={24}
                                          className={`cursor-pointer transition-colors ${star <= (hoverRating || reviewForm.rating) ? 'fill-[#FF9017] text-[#FF9017]' : 'text-[#D1D3D3]'}`}
                                          onMouseEnter={() => setHoverRating(star)}
                                          onMouseLeave={() => setHoverRating(0)}
                                          onClick={() => setReviewForm({ ...reviewForm, rating: star })} />
                                    ))}
                                 </div>
                              </div>
                              <textarea placeholder="Share your experience..."
                                 value={reviewForm.comment}
                                 onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                 className="w-full border border-[#DEE2E7] rounded-lg px-4 py-3 text-sm outline-none focus:border-primary resize-none"
                                 rows={3} />
                              <button onClick={handleReviewSubmit} disabled={reviewLoading}
                                 className="mt-3 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
                                 {reviewLoading ? 'Submitting...' : 'Submit Review'}
                              </button>
                           </>
                        )}
                        {!user && (
                           <button onClick={() => setPage('login')}
                              className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark">
                              Login to Review
                           </button>
                        )}
                     </div>
                     {reviews.length === 0 ? (
                        <p className="text-[#8B96A5] text-sm">No reviews yet.</p>
                     ) : (
                        reviews.map((review) => (
                           <div key={review.id} className="border-b border-[#DEE2E7] pb-4">
                              <div className="flex items-center gap-3 mb-2">
                                 <div className="w-8 h-8 rounded-full bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-sm">U</div>
                                 <div>
                                    <div className="flex gap-0.5">
                                       {Array(5).fill(0).map((_, i) => (
                                          <Star key={i} size={13} className={i < review.rating ? "fill-[#FF9017] text-[#FF9017]" : "text-[#D1D3D3]"} />
                                       ))}
                                    </div>
                                    <span className="text-xs text-[#8B96A5]">{new Date(review.created_at).toLocaleDateString()}</span>
                                 </div>
                              </div>
                              {review.comment && <p className="text-[#505050] text-sm">{review.comment}</p>}
                           </div>
                        ))
                     )}
                  </div>
               )}

               {activeTab === 'Shipping' && (
                  <div className="space-y-3 text-sm text-[#505050]">
                     <p>✅ Free shipping on orders over $100</p>
                     <p>✅ Worldwide delivery available</p>
                     <p>✅ Easy 30-day returns</p>
                  </div>
               )}
            </div>
         </div>

         {/* Related Products */}
         {relatedProducts.length > 0 && (
            <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 lg:p-6 mb-6">
               <h4 className="font-bold text-[#1C1C1C] text-lg mb-4">Related products</h4>
               <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
                  {relatedProducts.map((item) => (
                     <div key={item.id} className="flex flex-col gap-2 group cursor-pointer"
                        onClick={() => { setSelectedProductId(item.id); setSelectedThumb(0); }}>
                        <div className="w-full aspect-square border border-[#DEE2E7] rounded-lg p-2 flex items-center justify-center bg-white group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                           <img src={item.image || 'https://placehold.co/200x200'} alt={item.name}
                              className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                           <span className="text-[#505050] text-xs line-clamp-2 group-hover:text-primary">{item.name}</span>
                           <span className="text-[#8B96A5] text-xs">${item.price}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Banner */}
         <div className="bg-gradient-to-r from-primary to-[#005ADE] rounded-lg p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 text-white">
            <div>
               <h2 className="text-lg lg:text-2xl font-bold mb-1">Super discount on more than 100 USD</h2>
               <p className="opacity-80 text-sm">Limited time offer — shop now!</p>
            </div>
            <button className="bg-[#FF9017] hover:bg-[#E38015] text-white px-6 py-3 rounded-lg font-bold transition-colors flex-shrink-0"
               onClick={() => setPage('listing')}>
               Shop now
            </button>
         </div>
      </div>
   );
};

export default ProductDetails;