"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight, Calendar, CreditCard, Filter, Search } from "lucide-react";

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (isAuthenticated && user) {
      fetchUserOrders();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      // In production, call your API to fetch user orders
      // For now, simulate with mock data
      const mockOrders = [
        {
          id: '118192',
          invoiceNumber: 'INV-118192',
          date: '2025-12-15',
          status: 'processing',
          total: 2500000,
          paymentMethod: 'DOKU Payment Gateway',
          items: [
            { name: 'Modern Sofa Set', quantity: 1, price: 2000000 },
            { name: 'Coffee Table', quantity: 1, price: 500000 }
          ]
        },
        {
          id: '118191',
          invoiceNumber: 'INV-118191',
          date: '2025-12-14',
          status: 'completed',
          total: 1500000,
          paymentMethod: 'Bank Transfer',
          items: [
            { name: 'Dining Chair', quantity: 4, price: 375000 }
          ]
        }
      ];

      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'processing':
        return 'Sedang Diproses';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-black font-semibold text-lg">
              HomeDecor
            </Link>
            <Link
              href="/account"
              className="text-gray-600 hover:text-black transition-colors"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and track your order history</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by order number or invoice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="processing">Sedang Diproses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Invoice: {order.invoiceNumber}
                      </p>
                    </div>
                    <div className="text-right mt-4 sm:mt-0">
                      <p className="text-lg font-medium text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.total)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        {order.paymentMethod}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package size={16} />
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="flex items-center gap-1 text-black hover:text-gray-700 transition-colors">
                        View Details
                        <ChevronRight size={16} />
                      </button>
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
}