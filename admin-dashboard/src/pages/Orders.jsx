import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { ordersAPI } from '../services/api'
import OrderTable from '../components/orders/OrderTable'
import OrderDetailsModal from '../components/orders/OrderDetailsModal'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      setOrders(response.data)
    } catch (error) {
      toast.error('Failed to fetch orders')
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdating(true)
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, order_status: newStatus } : order
      ))
      setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null)
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error('Failed to update order status')
      console.error('Error updating order status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleViewOrder = async (order) => {
    setIsLoadingDetails(true)
    try {
      const response = await ordersAPI.getById(order.id)
      setSelectedOrder(response.data)
    } catch (error) {
      toast.error('Failed to fetch order details')
      console.error('Error fetching order details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all orders in your store including their details and status.
          </p>
        </div>
      </div>

      <OrderTable orders={orders} onViewOrder={handleViewOrder} />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
          isLoading={isLoadingDetails}
        />
      )}
    </div>
  )
} 