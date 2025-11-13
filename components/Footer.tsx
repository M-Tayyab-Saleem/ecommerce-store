import React from "react";
import { assets } from "@/public/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <Image src={assets.logo1} alt="" className="mb-5 w-32"></Image>
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
            ipsam consequuntur officia perferendis quidem iste quod cupiditate
            ipsa qui, ducimus explicabo ipsum molestias labore obcaecati!
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>contact@foreveryou.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2025 &copy; epoxySista.com - All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
