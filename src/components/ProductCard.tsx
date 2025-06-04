import { Eye, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '../types/product.ts';

const API_URL = 'https://ecommerce-be-eta.vercel.app';

interface ProductCardProps {
  product: Product;
  navigateTo: (page: string, product?: Product) => void;
  confirmDelete: (product: Product) => void;
  viewMode: 'grid' | 'list'; 
}

export default function ProductCard({ product, navigateTo, confirmDelete, viewMode }: ProductCardProps) {
  const getImageSrc = () => {
    if (product.image instanceof File) {
      return URL.createObjectURL(product.image);
    }
    if (typeof product.image === 'string' && product.image) {
      return `${API_URL}${product.image}`;
    }
    return null;
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        viewMode === 'list' ? 'flex flex-row items-center space-x-4 max-w-3xl mx-auto p-4' : ''
      }`}
    >
      {/* Image Section */}
      <div className={viewMode === 'list' ? 'relative w-44 h-44' : 'relative overflow-hidden'}>
        <img
          src={getImageSrc() || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
          alt={product.name}
          className={`object-cover rounded-t-2xl transition-transform duration-200 hover:scale-102 ${
            viewMode === 'list' ? 'w-44 h-44 rounded-lg' : 'w-full h-44'
          }`}
        />
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {product.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
        </span>
      </div>

      {/* Content Section */}
      <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
        <h3 className="text-base font-medium text-black mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-base font-medium text-black">₫{product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">Tồn kho: {product.stock}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateTo('detail', product)}
            className="flex-1 bg-green-400 hover:bg-green-500 text-black px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all duration-200 hover:shadow-sm"
            aria-label="Xem chi tiết sản phẩm"
          >
            <Eye size={14} />
            <span className="text-xs font-medium">Xem</span>
          </button>
          <button
            onClick={() => navigateTo('form', product)}
            className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-sm"
            aria-label="Chỉnh sửa sản phẩm"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => confirmDelete(product)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-sm"
            aria-label="Xóa sản phẩm"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}