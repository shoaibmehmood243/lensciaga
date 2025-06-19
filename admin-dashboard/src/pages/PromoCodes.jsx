import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { promoCodesAPI } from '../services/api'
import PromoCodeTable from '../components/promoCodes/PromoCodeTable'
import PromoCodeForm from '../components/promoCodes/PromoCodeForm'

export default function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPromoCode, setSelectedPromoCode] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      const response = await promoCodesAPI.getAll()
      setPromoCodes(response.data)
    } catch (error) {
      toast.error('Failed to fetch promo codes')
      console.error('Error fetching promo codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPromoCode = () => {
    setSelectedPromoCode(null)
    setIsModalOpen(true)
  }

  const handleEditPromoCode = (promoCode) => {
    setSelectedPromoCode(promoCode)
    setIsModalOpen(true)
  }

  const handleDeletePromoCode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) {
      return
    }

    try {
      await promoCodesAPI.delete(id)
      setPromoCodes(promoCodes.filter(code => code.id !== id))
      toast.success('Promo code deleted successfully')
    } catch (error) {
      toast.error('Failed to delete promo code')
      console.error('Error deleting promo code:', error)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (selectedPromoCode) {
        await promoCodesAPI.update(selectedPromoCode.id, formData)
        setPromoCodes(promoCodes.map(code => 
          code.id === selectedPromoCode.id ? { ...code, ...formData } : code
        ))
        toast.success('Promo code updated successfully')
      } else {
        const response = await promoCodesAPI.create(formData)
        setPromoCodes([...promoCodes, response.data])
        toast.success('Promo code created successfully')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(selectedPromoCode ? 'Failed to update promo code' : 'Failed to create promo code')
      console.error('Error saving promo code:', error)
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-xl font-semibold text-gray-900">Promo Codes</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your store's promo codes and discounts.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddPromoCode}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Promo Code
          </button>
        </div>
      </div>

      <PromoCodeTable
        promoCodes={promoCodes}
        onEdit={handleEditPromoCode}
        onDelete={handleDeletePromoCode}
      />

      {isModalOpen && (
        <PromoCodeForm
          promoCode={selectedPromoCode}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
} 