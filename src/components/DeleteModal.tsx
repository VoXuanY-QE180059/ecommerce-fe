import type { Product } from '../types/product.ts';
import React from 'react';
interface DeleteModalProps {
  show: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ show, product, onConfirm, onCancel }: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-roboto">
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-sm w-full mx-4 transition-all duration-200">
        <h3 className="text-lg font-medium text-black mb-3 tracking-wide">Xóa sản phẩm</h3>
        <p className="text-gray-600 text-sm mb-4">
          Bạn có chắc chắn muốn xóa <span className="font-medium text-black">"{product?.name}"</span>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm"
            aria-label="Xác nhận xóa sản phẩm"
          >
            Xóa
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-sm"
            aria-label="Hủy xóa"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}