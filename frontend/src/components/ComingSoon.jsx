import React from 'react';

const ComingSoon = ({ setPage, title = "Coming Soon" }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl font-bold text-[#1C1C1C] mb-3">{title}</h1>
        <p className="text-[#8B96A5] mb-8 max-w-sm mx-auto">
          We're working hard to bring this to you. Stay tuned!
        </p>
        <button
          onClick={() => setPage('home')}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;