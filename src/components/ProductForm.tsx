import { useState } from 'react';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import type { ProductFormData } from '../types/product.ts';
import { createProduct, updateProduct } from '../services/api';

const API_URL = 'https://ecommerce-be-p4qj.onrender.com';

interface ProductFormProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
  isEditing: boolean;
  navigateTo: (page: string) => void;
}

export default function ProductForm({ formData, setFormData, isEditing, navigateTo }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Hình ảnh không được vượt quá 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: isEditing ? '' : undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formData.name || !formData.price || !formData.description || !formData.category) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('id', String(formData.id));
      data.append('name', formData.name);
      data.append('price', String(formData.price));
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('stock', String(formData.stock || 0));
      data.append('isActive', String(formData.isActive));

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      } else if (isEditing && typeof formData.image === 'string' && formData.image) {
        data.append('image', formData.image);
      }

      if (isEditing) {
        await updateProduct(Number(formData.id), data);
      } else {
        await createProduct(data);
      }
      navigateTo('home');
    } catch (err: any) {
      console.error('Error creating/updating product:', err.response?.data || err.message);
      setError(err.response?.data?.error?.message || err.message || 'Đã xảy ra lỗi');
    } finally {
      setIsLoading(false);
    }
  };

  const getImageSrc = () => {
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }
    if (typeof formData.image === 'string' && formData.image) {
      return `${API_URL}${formData.image}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-roboto">
      {/* Back Button */}
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center space-x-2 text-black hover:text-green-400 mb-8 transition-all duration-200 group"
        aria-label="Quay lại danh sách sản phẩm"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-base font-light">Quay lại</span>
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mx-auto transition-all duration-200 hover:shadow-md">
        <h2 className="text-3xl font-light text-black mb-6 tracking-wide">
          {isEditing ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-6">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product ID */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="id">
                Mã sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled={isEditing}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="name">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="price">
                Giá <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="stock">
                Tồn kho
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="description">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Hình ảnh sản phẩm</label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">
                      <span className="text-green-400">Tải lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, hoặc GIF (Tối đa 5MB)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/gif"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              {getImageSrc() ? (
                <div className="relative inline-block">
                  <img
                    src={getImageSrc() || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'}
                    alt="Xem trước sản phẩm"
                    className="w-32 h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200"
                    aria-label="Xóa hình ảnh"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                  Không có ảnh
                </div>
              )}
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-400 focus:ring-green-400 border-gray-200 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-600">
              Sản phẩm đang hoạt động
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`flex-1 bg-green-400 hover:bg-green-500 text-black px-5 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 mr-2 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <Check size={18} />
              )}
              <span className="font-medium text-sm">{isEditing ? 'Cập nhật' : 'Tạo sản phẩm'}</span>
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-black px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}