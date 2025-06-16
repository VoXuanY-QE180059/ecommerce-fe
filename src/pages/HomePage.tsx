import { useEffect, useState } from 'react';
import { Package, Plus, LayoutGrid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types/product.ts';
import { getProducts } from '../services/api';
import React from 'react';

interface HomePageProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
  isLoggedIn: boolean;                         // (+) thêm prop
}

export default function HomePage({
  products,
  setProducts,
  navigateTo,
  confirmDelete,
  isLoggedIn,                                  // (+) destructuring
}: HomePageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.data);
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setProducts]);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-roboto">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-light text-black tracking-wide">Sản phẩm</h2>
          <p className="mt-1 text-gray-600 text-sm">Quản lý kho hàng của bạn một cách dễ dàng</p>
        </div>

        {/* nút “Thêm sản phẩm” chỉ hiện khi đã đăng nhập */}
        {isLoggedIn && (                               /* (+) */
          <div className="flex space-x-3">
            <button
              onClick={() => navigateTo('form')}
              className="bg-green-400 hover:bg-green-500 text-black px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:shadow-sm"
            >
              <Plus size={18} />
              <span className="font-medium text-sm">Thêm sản phẩm</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-sm"
              aria-label="Chuyển đổi chế độ xem"
            >
              {viewMode === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-green-400"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center mb-6">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <div>
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm text-center py-16 transition-all duration-200 hover:shadow-md">
              <Package size={50} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-black mb-2 tracking-wide">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                Bắt đầu bằng cách thêm sản phẩm đầu tiên.
              </p>

              {/* nút thêm sản phẩm cũng tuỳ vào isLoggedIn */}
              {isLoggedIn && (                         /* (+) */
                <button
                  onClick={() => navigateTo('form')}
                  className="bg-green-400 hover:bg-green-500 text-black px-5 py-2.5 rounded-lg flex items-center space-x-2 mx-auto transition-all duration-200 hover:shadow-sm"
                >
                  <Plus size={18} />
                  <span className="font-medium text-sm">Thêm sản phẩm</span>
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <div key={product.id} className="transition-all duration-200 hover:-translate-y-0.5">
                  <ProductCard
                    product={product}
                    navigateTo={navigateTo}
                    confirmDelete={confirmDelete}
                    viewMode={viewMode}
                    isLoggedIn={isLoggedIn}           /* (+) truyền xuống ProductCard */
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
