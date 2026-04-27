import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Mail, MessageSquare, Phone } from 'lucide-react';

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse products, add them to your cart, and click Checkout. You'll need to be logged in to complete a purchase."
  },
  {
    q: "How can I track my order?",
    a: "Go to My Orders from your profile. Each order shows its current status — pending, processing, shipped, or delivered."
  },
  {
    q: "Can I cancel or return an order?",
    a: "You can cancel an order while it's still in 'pending' status. For returns, we offer a 30-day return policy on all items."
  },
  {
    q: "How do I contact a supplier?",
    a: "On any product page, click 'Send inquiry' to contact the supplier directly through our messaging system."
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. All payments are encrypted and processed securely. We never store your card details."
  },
  {
    q: "How do I add a product to my favorites?",
    a: "Click the heart icon on any product page. You must be logged in to save favorites."
  },
  {
    q: "How do I write a review?",
    a: "Open the product page, scroll to the Reviews tab, and submit your rating and comment. Login required."
  },
];

const Help = ({ setPage }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[#8B96A5] text-sm mb-6">
        <span className="cursor-pointer hover:text-primary" onClick={() => setPage('home')}>Home</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#1C1C1C] font-medium">Help & Support</span>
      </div>

      <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">Help & Support</h1>
      <p className="text-[#8B96A5] mb-8">Find answers to common questions below.</p>

      {/* FAQ */}
      <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden mb-8">
        <div className="p-4 lg:p-5 border-b border-[#DEE2E7]">
          <h2 className="font-bold text-[#1C1C1C]">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-[#DEE2E7]">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full text-left px-4 lg:px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#F7FAFC] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-[#1C1C1C] text-sm lg:text-base">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#8B96A5] flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 lg:px-5 pb-4 text-[#505050] text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact options */}
      <h2 className="font-bold text-[#1C1C1C] text-lg mb-4">Still need help?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <MessageSquare size={24} />, title: 'Live Chat', sub: 'Chat with our support team', action: () => setPage('message'), btn: 'Start Chat' },
          { icon: <Mail size={24} />, title: 'Email Us', sub: 'support@shopname.com', action: () => {}, btn: 'Send Email' },
          { icon: <Phone size={24} />, title: 'Call Us', sub: '+1 (800) 123-4567', action: () => {}, btn: 'Call Now' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-[#DEE2E7] rounded-lg p-5 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#E3F0FF] rounded-full flex items-center justify-center text-primary mb-3">
              {item.icon}
            </div>
            <h3 className="font-bold text-[#1C1C1C] mb-1">{item.title}</h3>
            <p className="text-[#8B96A5] text-sm mb-4">{item.sub}</p>
            <button onClick={item.action}
              className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
              {item.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;