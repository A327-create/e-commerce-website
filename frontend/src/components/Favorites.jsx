import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getMyFavorites } from '../services/favoriteService';

const Favorites = ({ setPage, setSelectedProductId }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyFavorites()
            .then(setFavorites)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-6">My Favorites</h1>

            {favorites.length === 0 ? (
                <div className="text-center py-20">
                    <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No favorites yet</p>
                    <button
                        onClick={() => setPage('listing')}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium"
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map(product => (
                        <div
                            key={product.id}
                            className="bg-white border border-[#DEE2E7] rounded-lg p-4 cursor-pointer hover:shadow-md transition-all group"
                            onClick={() => { setSelectedProductId(product.id); setPage('details'); }}
                        >
                            <div className="aspect-square flex items-center justify-center bg-[#F7F7F7] rounded-md mb-4 p-4">
                                <img
                                    src={product.image || 'https://placehold.co/200x200'}
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-[#1C1C1C] line-clamp-2 mb-1">{product.name}</h3>
                            <p className="text-primary font-bold">${product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;