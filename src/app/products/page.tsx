import ProductGrid from '@/components/products/ProductGrid';
import FilterSidebar from '@/components/products/FilterSidebar';
import ProductCategories from '@/components/products/ProductCategories';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsNav from '@/components/layout/ProductsNav';

export default function ProductsPage() {
  return (
    <>
      <ProductsNav />
      
      <main className="w-full bg-black min-h-screen">
        <ProductsHeader />
        <ProductCategories />
        <div className="max-w-[1800px] mx-auto py-12 px-8">
          <div className="flex gap-8">
            <FilterSidebar />
            <ProductGrid />
          </div>
        </div>
      </main>
    </>
  );
}
