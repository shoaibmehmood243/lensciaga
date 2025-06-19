import { XMarkIcon } from '@heroicons/react/24/outline'
import { SERVER_URL } from '../../config'

const statusConfig = {
  Pending: {
    color: 'bg-yellow-100 text-yellow-800',
  },
  Processing: {
    color: 'bg-blue-100 text-blue-800',
  },
  Shipped: {
    color: 'bg-purple-100 text-purple-800',
  },
  Delivered: {
    color: 'bg-green-100 text-green-800',
  },
  Cancelled: {
    color: 'bg-red-100 text-red-800',
  },
}

export default function OrderDetailsModal({ order, onClose, onUpdateStatus, isUpdating, isLoading }) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Order #{order.id}
              </h3>
              {isLoading ? (
                <div className="mt-4 flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Details</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p>{order.name}</p>
                        <p>{order.email}</p>
                        <p>{order.phone}</p>
                        <p>{order.address}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Order Status</h4>
                      <div className="mt-2">
                        <select
                          value={order.order_status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                          disabled={isUpdating}
                          className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {Object.keys(statusConfig).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900">Order Items</h4>
                    <div className="mt-2 divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img
                                src={SERVER_URL + item.image_url}
                                alt={item.name}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                              <div className="ml-4">
                                <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{Number(item.price).toFixed(2)} PKR</div>
                              <div className="text-sm text-gray-500">
                                Total: {(Number(item.price) * item.quantity).toFixed(2)} PKR
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900">Order Summary</h4>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{Number(order.total_amount).toFixed(2)} PKR</span>
                      </div>
                      {order.discount_applied > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({order.discount_applied}%):</span>
                          <span>-{(Number(order.total_amount) * order.discount_applied / 100).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Total:</span>
                        <span>{Number(order.total_amount).toFixed(2)} PKR</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 