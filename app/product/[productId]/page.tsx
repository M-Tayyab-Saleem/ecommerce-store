import { redirect } from 'next/navigation';

interface ProductPageParams {
  params: Promise<{
    productId: string;
  }>;
}

// Redirect old ID-based URLs to new slug-based structure
export default async function ProductPage({ params }: ProductPageParams) {
  const { productId } = await params;

  // Redirect to products listing page
  // In a real scenario, you might want to fetch the product by ID and redirect to its slug
  redirect('/products');
}