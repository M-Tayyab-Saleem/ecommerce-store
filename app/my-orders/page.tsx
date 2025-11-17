import React from 'react';
import Image from 'next/image';
import { assets } from '@/lib/assets';
import Title from '@/components/Title';

// This is a Server Component. We'll use mock data for now.
const Orders = async () => {

  // Mock data for display. Later, this will come from an API.
  const mockOrders = [
    {
      _id: "order123",
      items: [
        { name: "Women Round Neck Cotton Top", image: "/p_img1.png", quantity: 1 },
        { name: "Men Round Neck T-shirt", image: "/p_img2_1.png", quantity: 2 },
      ],
      amount: 500,
      status: "Delivered"
    },
    {
      _id: "order124",
      items: [
        { name: "Men Tapered Fit Trousers", image: "/p_img7.png", quantity: 1 },
      ],
      amount: 190,
      status: "Processing"
    }
  ];

  return (
    <div className="py-10 border-t">
      <Title text1="MY" text2="ORDERS" />
      <div className="flex flex-col gap-6 mt-6">
        {mockOrders.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          mockOrders.map((order) => (
            <div key={order._id} className="border border-gray-300 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Status: <span className={order.status === 'Delivered' ? 'text-green-600' : 'text-orange-500'}>{order.status}</span></p>
                  <p className="text-sm text-gray-600">Total: PKR {order.amount}</p>
                </div>
                <button className="bg-gray-100 text-sm px-4 py-2 rounded border">Track Order</button>
              </div>
              <div className="flex gap-3 overflow-x-auto">
                {order.items.map((item, index) => (
                  <Image 
                    key={index} 
                    src={item.image} 
                    alt={item.name} 
                    width={80} 
                    height={80} 
                    className="w-20 h-20 object-cover rounded" 
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;