'use client'

import { products } from '@/lib/assets'; 
import { Product } from '@/lib/assets'; // Import the type we defined
import ProductDetails from '@/components/ProductDetails'; // Our new Client Component
import RelatedProducts from '@/components/RelatedProducts'; // We'll make this too

// This interface tells TS what to expect for params
interface ProductPageParams {
    params: {
      productId: string;
    };
  }
  

// 1. This is a Server Component, so we can make it async
export default async function ProductPage({ params }: ProductPageParams) {
  const { productId } = await params;
   console.log(productId);

  // 2. Fetch data ON THE SERVER
  // We find the product from our data file
  const productData = products.find(
    (item) => item._id === productId
  ) as Product | undefined;

  if (!productData) {
    // You can customize this later with a proper 404 page
    return <div>Product not found</div>;
  }

  // 3. We pass the server-fetched data as props
  //    to our Client Component, which handles interaction.
  return (
    <div>
      <ProductDetails productData={productData} />
      
      {/* This is a great place for another Server Component!
        It fetches its own data on the server.
      */}
      <RelatedProducts 
        category={productData.category} 
        subCategory={productData.subCategory} 
      />
    </div>
  );
}