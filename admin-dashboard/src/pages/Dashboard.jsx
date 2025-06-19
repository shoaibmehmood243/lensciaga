import { useEffect, useState } from 'react'
import { ordersAPI, productsAPI, promoCodesAPI } from '../services/api'
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  TagIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const stats = [
  {
    name: 'Total Revenue',
    value: '0 PKR',
    icon: CurrencyDollarIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Total Orders',
    value: '0',
    icon: ShoppingBagIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Active Promo Codes',
    value: '0',
    icon: TagIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Low Stock Items',
    value: '0',
    icon: ExclamationTriangleIcon,
    color: 'bg-yellow-500',
  },
]

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activePromoCodes: 0,
    lowStockItems: 0,
    recentOrders: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersResponse, productsResponse, promoCodesResponse] = await Promise.all([
          ordersAPI.getAll(),
          productsAPI.getAll(),
          promoCodesAPI.getAll()
        ])

        const orders = ordersResponse.data
        const products = productsResponse.data
        const promoCodes = promoCodesResponse.data

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)

        // Count low stock items (less than 10 items)
        const lowStockItems = products.filter(product => product.quantity < 10).length

        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)

        setDashboardData({
          totalRevenue,
          totalOrders: orders.length,
          activePromoCodes: promoCodes.length,
          lowStockItems,
          recentOrders,
        })
      } catch (error) {
        toast.error('Failed to load dashboard data')
        console.error('Dashboard data error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {index === 0
                  ? `${Number(dashboardData.totalRevenue).toFixed(2)} PKR`
                  : index === 1
                  ? dashboardData.totalOrders
                  : index === 2
                  ? dashboardData.activePromoCodes
                  : dashboardData.lowStockItems}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Number(order.total_amount).toFixed(2)} PKR
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          order.order_status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.order_status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 