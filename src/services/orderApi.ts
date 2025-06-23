import axios from 'axios';
import { getAuthHeaders } from './auth';

const API_URL = 'https://ecommerce-be-p4qj.onrender.com/orders';

// Interface cho sản phẩm trong đơn hàng
export interface OrderProduct {
  productId: string;  // Chỉ nhận string
  quantity: number;
  price: number;
}

// Interface cho dữ liệu tạo đơn hàng
export interface CreateOrderData {
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
}

// Interface cho đơn hàng trả về
export interface Order {
  id: string;
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

// Hàm tạo request đã xác thực
const createAuthenticatedRequest = () => {
  return axios.create({
    headers: getAuthHeaders(),
  });
};

// API tạo đơn hàng (đã cập nhật xử lý kiểu dữ liệu)
export const createOrder = async (orderData: CreateOrderData) => {
  try {
    // Chuyển đổi dữ liệu theo yêu cầu BE
    const payload = {
      ...orderData,
      status: orderData.status || 'pending',
    };

    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.post(`${API_URL}/create`, payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

// Các API khác giữ nguyên
export const getOrders = async (page: number = 1, limit: number = 10) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.get(`${API_URL}/list`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.get(`${API_URL}/detail/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.patch(`${API_URL}/update/${orderId}`, { status });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.patch(`${API_URL}/cancel/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};