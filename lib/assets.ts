// All image imports are replaced with static paths pointing to the /public folder
const p_img1 = "/p_img1.png";
const p_img2_1 = "/p_img2_1.png";
const p_img2_2 = "/p_img2_2.png";
const p_img2_3 = "/p_img2_3.png";
const p_img2_4 = "/p_img2_4.png";
const p_img3 = "/p_img3.png";
const p_img4 = "/p_img4.png";
const p_img5 = "/p_img5.png";
const p_img6 = "/p_img6.png";
const p_img7 = "/p_img7.png";
const p_img8 = "/p_img8.png";
const p_img9 = "/p_img9.png";
const p_img10 = "/p_img10.png";
const p_img11 = "/p_img11.png";
const p_img12 = "/p_img12.png";
const p_img13 = "/p_img13.png";
const p_img14 = "/p_img14.png";
const p_img15 = "/p_img15.png";
const p_img16 = "/p_img16.png";
const p_img17 = "/p_img17.png";
const p_img18 = "/p_img18.png";
const p_img19 = "/p_img19.png";
const p_img20 = "/p_img20.png";
const p_img21 = "/p_img21.png";
const p_img22 = "/p_img22.png";
const p_img23 = "/p_img23.png";
const p_img24 = "/p_img24.png";
const p_img25 = "/p_img25.png";
const p_img26 = "/p_img26.png";
const p_img27 = "/p_img27.png";
const p_img28 = "/p_img28.png";
const p_img29 = "/p_img29.png";
const p_img30 = "/p_img30.png";
const p_img31 = "/p_img31.png";
const p_img32 = "/p_img32.png";
const p_img33 = "/p_img33.png";
const p_img34 = "/p_img34.png";
const p_img35 = "/p_img35.png";
const p_img36 = "/p_img36.png";
const p_img37 = "/p_img37.png";
const p_img38 = "/p_img38.png";
const p_img39 = "/p_img39.png";
const p_img40 = "/p_img40.png";
const p_img41 = "/p_img41.png";
const p_img42 = "/p_img42.png";
const p_img43 = "/p_img43.png";
const p_img44 = "/p_img44.png";
const p_img45 = "/p_img45.png";
const p_img46 = "/p_img46.png";
const p_img47 = "/p_img47.png";
const p_img48 = "/p_img48.png";
const p_img49 = "/p_img49.png";
const p_img50 = "/p_img50.png";
const p_img51 = "/p_img51.png";
const p_img52 = "/p_img52.png";

// Define the Product type
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[]; // Kept as string[] for simplicity
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
}

// Export assets
export const assets = {
  logo1: "/logo1.png",
  hero_img: "/hero_img.png",
  cart_icon: "/cart_icon.png",
  bin_icon: "/bin_icon.png",
  dropdown_icon: "/dropdown_icon.png",
  exchange_icon: "/exchange_icon.png",
  profile_icon: "/profile_icon.png",
  quality_icon: "/quality_icon.png",
  search_icon: "/search_icon.png",
  star_dull_icon: "/star_dull_icon.png",
  star_icon: "/star_icon.png",
  support_img: "/support_img.png",
  menu_icon: "/menu_icon.png",
  about_img: "/about_img.png",
  contact_img: "/contact_img.png",
  razorpay_logo: "/razorpay_logo.png",
  stripe_logo: "/stripe_logo.png",
  cross_icon: "/cross_icon.png",
  p_img1,
  p_img2_1,
  p_img2_2,
  p_img2_3,
  p_img2_4,
  p_img3,
  p_img4,
  p_img5,
  p_img6,
  p_img7,
  p_img8,
  p_img9,
  p_img10,
  p_img11,
  p_img12,
  p_img13,
  p_img14,
  p_img15,
  p_img16,
  p_img17,
  p_img18,
  p_img19,
  p_img20,
  p_img21,
  p_img22,
  p_img23,
  p_img24,
  p_img25,
  p_img26,
  p_img27,
  p_img28,
  p_img29,
  p_img30,
  p_img32,
  p_img33,
  p_img34,
  p_img35,
  p_img36,
  p_img37,
  p_img38,
  p_img39,
  p_img40,
  p_img41,
  p_img42,
  p_img43,
  p_img44,
  p_img45,
  p_img46,
  p_img47,
  p_img48,
  p_img49,
  p_img50,
  p_img51,
  p_img52,

};

// Export product data
export const products: Product[] = [
    {
        _id: "aaaaa",
        name: "Women Round Neck Cotton Top",
        description: "A lightweight, usually knitted, pullover shirt...",
        price: 100,
        image: [p_img1],
        category: "Women",
        subCategory: "Topwear",
        sizes: ["S", "M", "L"],
        date: 1716634345448,
        bestseller: true
    },
    {
        _id: "aaaab",
        name: "Men Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt...",
        price: 200,
        image: [p_img2_1,p_img2_2,p_img2_3,p_img2_4],
        category: "Men",
        subCategory: "Topwear",
        sizes: ["M", "L", "XL"],
        date: 1716621345448,
        bestseller: true
    },
    // ... (paste all 52 of your product objects here, just like this)
    {
        _id: "aaabz",
        name: "Men Slim Fit Relaxed Denim Jacket",
        description: "A lightweight, usually knitted, pullover shirt...",
        price: 350,
        image: [p_img52],
        category: "Men",
        subCategory: "Winterwear",
        sizes: ["S", "M", "L", "XL"],
        date: 1716668445448,
        bestseller: false
    }
];