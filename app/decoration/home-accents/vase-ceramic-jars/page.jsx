import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Vase & Ceramic Jars',
};

export default async function VaseCeramicJarsPage() {
  const { products, categoryId } = await getProducts('vase-jar', ['vase-jar'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Vase & Ceramic Jars" />
}

