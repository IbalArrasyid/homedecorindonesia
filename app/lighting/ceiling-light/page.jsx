import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Ceiling Lights',
};

export default async function CeilingLightPage() {
  const { products, categoryId } = await getProducts('ceiling-lights', ['ceiling-lights'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Ceiling Lights" />
}

