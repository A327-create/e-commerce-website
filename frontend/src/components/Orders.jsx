import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders()
      .then(data => setOrders(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container py-8">
      <div className="bg-white border border-[#DEE2E7] rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-[#DEE2E7] rounded-lg overflow-hidden">

                {/* Header */}
                <div className="bg-[#F7FAFC] p-4 border-b flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{order.id}</p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`font-medium text-sm px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                      }`}>{order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium">${order.total_price}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                {/* Items */}
                <div className="p-6 space-y-3">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">

                      <img
                        src={item.product?.image || "https://placehold.co/80"}
                        alt={item.product?.name}
                        className="w-16 h-16 object-contain border p-1"
                      />

                      <div>
                        <p className="font-medium">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Orders;