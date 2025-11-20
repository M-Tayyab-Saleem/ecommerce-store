import { products, Product } from '@/lib/assets'; 
import ProductDetails from '@/components/ProductDetails';
import RelatedProducts from '@/components/RelatedProducts';

// This interface tells TS what to expect for params
interface ProductPageParams {
    params: {
      productId: string;
    };
  }
  

// This is a Server Component, running without 'use client'
export default async function ProductPage({ params }: ProductPageParams) {
  const { productId } = params;

  // Fetch data ON THE SERVER
  const productData = products.find(
    (item) => item._id === productId
  ) as Product | undefined;

  if (!productData) {
    return <div className='py-20 text-center text-2xl font-heading'>Product not found</div>;
  }

  // Pass server-fetched data to the Client Component
  return (
    <div>
      <ProductDetails productData={productData} />
      
      {/* Related Products is a separate Server Component */}
      <RelatedProducts 
        category={productData.category} 
        subCategory={productData.subCategory} 
      />
    </div>
  );
}