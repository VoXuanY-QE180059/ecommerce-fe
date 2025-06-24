import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle } from 'lucide-react';
import { getOrderHistory } from '../services/orderApi';

interface OrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  userId: string;
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrderHistory();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || 'Không thể tải lịch sử đơn hàng');
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-5 h-5 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrderHistory}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Package className="w-8 h-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-500">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        Đơn hàng #{order.orderId.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Đặt ngày: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Thông tin giao hàng</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Địa chỉ:</strong> {order.shippingAddress}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Số điện thoại:</strong> {order.phoneNumber}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Ghi chú:</strong> {order.notes}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Sản phẩm</h4>
                        <div className="space-y-1">
                          {order.products.map((product, index) => (
                            <div key={index} className="text-sm text-gray-600 flex justify-between">
                              <span>Sản phẩm #{product.productId} x{product.quantity}</span>
                              <span>{formatCurrency(product.price * product.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Tổng tiền:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;