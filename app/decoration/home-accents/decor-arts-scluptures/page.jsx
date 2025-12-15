import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Decor Arts & Sculptures',
};

export default async function DecorArtsSclupturesPage() {
  const { products, categoryId } = await getProducts('scluptures', ['scluptures'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Decor Arts & Sculptures" />
}

