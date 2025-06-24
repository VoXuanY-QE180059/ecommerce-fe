import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, X } from 'lucide-react';
import { getOrderHistory, cancelOrder } from '../services/orderApi';

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
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

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

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const response = await cancelOrder(orderId);
      
      if (response.success) {
        // Cập nhật trạng thái đơn hàng trong state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.orderId === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        alert('Đơn hàng đã được hủy thành công!');
      } else {
        alert(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi hủy đơn hàng');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'shipping':
        return <Truck className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  const canCancelOrder = (status: string) => {
    return ['pending', 'confirmed'].includes(status.toLowerCase());
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center mb-6">
          <Package className="w-7 h-7 text-green-500 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Lịch sử đơn hàng</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-500">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  {/* Header - Compact */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-800">
                        #{order.orderId.slice(-8)}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      {canCancelOrder(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={cancellingOrderId === order.orderId}
                          className="flex items-center px-3 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingOrderId === order.orderId ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                              Đang hủy...
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 mr-1" />
                              Hủy đơn
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content - Compact Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                    {/* Shipping Info */}
                    <div className="lg:col-span-2">
                      <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
                        <div className="flex-1">
                          <span className="font-medium text-gray-700">Địa chỉ:</span>
                          <span className="ml-2 text-gray-600">{order.shippingAddress}</span>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="font-medium text-gray-700">SĐT:</span>
                          <span className="ml-2 text-gray-600">{order.phoneNumber}</span>
                        </div>
                      </div>
                      {order.notes && (
                        <div className="mt-2">
                          <span className="font-medium text-gray-700">Ghi chú:</span>
                          <span className="ml-2 text-gray-600">{order.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Total Amount */}
                    <div className="flex flex-col items-start lg:items-end">
                      <div className="text-xs text-gray-500 mb-1">
                        {order.products.length} sản phẩm
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Products Summary - Collapsed by default */}
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
                      Chi tiết sản phẩm ({order.products.length} món)
                    </summary>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="space-y-1">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex justify-between text-sm text-gray-600">
                            <span>Sản phẩm #{product.productId} x{product.quantity}</span>
                            <span>{formatCurrency(product.price * product.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
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