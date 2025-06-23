import React, { useState } from 'react';
import { ArrowLeft, CreditCard, MapPin, User, Phone, CheckCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCurrentUser } from '../services/auth';
import { createOrder, CreateOrderData } from '../services/orderApi';

const API_URL = 'https://ecommerce-be-p4qj.onrender.com';

interface OrderPageProps {
  navigateTo: (page: string) => void;
}

interface OrderForm {
  address: string;
  phone: string;
  notes: string;
}

export default function OrderPage({ navigateTo }: OrderPageProps) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [orderForm, setOrderForm] = useState<OrderForm>({
    address: '',
    phone: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  const currentUser = getCurrentUser();

  const getImageSrc = (image?: string | File) => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === 'string' && image) {
      return `${API_URL}${image}`;
    }
    return 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderForm.address.trim() || !orderForm.phone.trim()) {
      alert('Vui lòng điền đầy đủ địa chỉ và số điện thoại!');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderData: CreateOrderData = {
        products: cartItems.map(item => ({
          // FIX: Convert productId to string
          productId: item.product.id.toString(),
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: orderForm.address,
        phoneNumber: orderForm.phone,
        notes: orderForm.notes,
        status: 'pending' as const
      };

      const response = await createOrder(orderData);
      
      if (response.success) {
        setOrderId(response.data.orderId || 'N/A');
        setOrderSuccess(true);
        clearCart();
      } else {
        throw new Error(response.message || 'Đặt hàng thất bại');
      }
    } catch (error: any) {
      console.error('Order error:', error);
      alert(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
          </p>
          <div className="bg-gray-100 rounded-lg p-3 mb-6">
            <span className="font-mono text-lg font-semibold text-gray-900">#{orderId}</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">
            Bạn không có sản phẩm nào trong giỏ hàng để đặt hàng.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin đặt hàng</h2>
            
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">Thông tin khách hàng</span>
                </div>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>

              {/* Shipping Address */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Địa chỉ giao hàng *</span>
                </label>
                <textarea
                  name="address"
                  value={orderForm.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ chi tiết..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Số điện thoại *</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderForm.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  name="notes"
                  value={orderForm.notes}
                  onChange={handleInputChange}
                  placeholder="Ghi chú thêm cho đơn hàng..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Đặt hàng</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                  <img
                    src={getImageSrc(item.product.image)}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-500">
                      ₫{item.product.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₫{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₫{getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}