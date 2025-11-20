import React from 'react';
import Image from 'next/image';
import { assets } from '@/lib/assets';
import Title from '@/components/Title';
import Link from 'next/link';

const Orders = async () => {

  // Mock data for display.
  const mockOrders = [
    {
      _id: "ORD98765",
      items: [
        { name: "Women Round Neck Top", image: "/p_img1.png", quantity: 1, price: 100 },
        { name: "Men Cotton T-shirt", image: "/p_img2_1.png", quantity: 2, price: 200 },
      ],
      amount: 500,
      status: "Delivered",
      date: "Oct 15, 2025"
    },
    {
      _id: "ORD98766",
      items: [
        { name: "Men Tapered Trousers", image: "/p_img7.png", quantity: 1, price: 190 },
      ],
      amount: 190,
      status: "Processing",
      date: "Nov 19, 2025"
    }
  ];

  return (
    <div className="py-10 border-t border-gray-100 min-h-[70vh]">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-gray-900">
          My Orders
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <Link href="/" className="hover:text-black">Home</Link> / Orders
        </p>
      </div>
      
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {mockOrders.length === 0 ? (
          <p className="text-center text-xl text-gray-600">You have no past orders.</p>
        ) : (
          mockOrders.map((order) => (
            <div key={order._id} className="border border-gray-200 p-6 rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <p className="font-semibold text-lg">Order ID: {order._id}</p>
                <div className="flex items-center gap-3">
                    <p className={`text-sm font-bold px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-orange-500'}`}>
                        {order.status}
                    </p>
                    <button className="bg-black text-white text-xs px-4 py-2 rounded font-semibold hover:bg-[#ff5e5e] transition">
                        Track Order
                    </button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-700">Order Date</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-700">Total Amount</p>
                    <p className="text-lg font-bold text-black">${order.amount}.00</p>
                </div>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pt-4 border-t border-gray-100 mt-4">
                {order.items.map((item, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <Image 
                            src={item.image} 
                            alt={item.name} 
                            width={80} 
                            height={100} 
                            className="w-16 h-20 object-cover border border-gray-200" 
                        />
                        <p className="text-xs text-gray-600 mt-1 max-w-[80px] truncate">{item.name}</p>
                        <p className="text-xs font-semibold">x{item.quantity}</p>
                    </div>
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