import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Books & Bookends',
};

export default async function BookBookendsPage() {
  const { products, categoryId } = await getProducts('books-bookends', ['books-bookends'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Books & Bookends" />
}

