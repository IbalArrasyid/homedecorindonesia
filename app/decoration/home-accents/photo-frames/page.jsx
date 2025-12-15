import ProductsPage from "@/components/ProductsPage";
import { getProducts } from "@/services/api";

export const metadata = {
  title: 'Photo Framases',
};

export default async function PhotoFramesPage() {
  const { products, categoryId } = await getProducts('photo-frames', ['photo-frames'], 100);

  return <ProductsPage categoryId={categoryId} products={products} category="Photo Framases" />
}

