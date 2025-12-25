'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Calendar, Loader2 } from 'lucide-react'

interface AvailabilityPeriod {
  id: number
  start_date: string
  end_date: string
  price_per_week: number
  price_per_night: number | null
  min_nights: number
  status: 'available' | 'booked' | 'blocked'
}

interface BookingCalendarProps {
  propertySlug: string
  propertyName: string
  isOpen: boolean
  onClose: () => void
  onSelect: (checkIn: string, checkOut: string, price: number | null) => void
  initialCheckIn?: string
  initialCheckOut?: string
}

export default function BookingCalendar({
  propertySlug,
  propertyName,
  isOpen,
  onClose,
  onSelect,
  initialCheckIn,
  initialCheckOut,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availability, setAvailability] = useState<AvailabilityPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [checkIn, setCheckIn] = useState<string | null>(initialCheckIn || null)
  const [checkOut, setCheckOut] = useState<string | null>(initialCheckOut || null)
  const [selecting, setSelecting] = useState<'checkIn' | 'checkOut'>('checkIn')

  // Fetch availability on mount
  useEffect(() => {
    if (isOpen && propertySlug) {
      fetchAvailability()
    }
  }, [isOpen, propertySlug])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/properties/${propertySlug}/availability`)
      const data = await res.json()
      if (data.success) {
        setAvailability(data.availability)
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days: (Date | null)[] = []
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  // Check if a date is available
  const getDateStatus = useCallback((date: Date): 'available' | 'booked' | 'blocked' | 'past' | 'none' => {
    const dateStr = date.toISOString().split('T')[0]
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return 'past'
    
    for (const period of availability) {
      if (dateStr >= period.start_date && dateStr <= period.end_date) {
        return period.status
      }
    }
    
    return 'none' // No availability set
  }, [availability])

  // Get price for a date
  const getPriceForDate = useCallback((date: Date): number | null => {
    const dateStr = date.toISOString().split('T')[0]
    
    for (const period of availability) {
      if (dateStr >= period.start_date && dateStr <= period.end_date && period.status === 'available') {
        return period.price_per_week
      }
    }
    
    return null
  }, [availability])

  // Check if date is in selected range
  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false
    const dateStr = date.toISOString().split('T')[0]
    return dateStr >= checkIn && dateStr <= checkOut
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date)
    if (status === 'past' || status === 'booked' || status === 'blocked') return
    
    const dateStr = date.toISOString().split('T')[0]
    
    if (selecting === 'checkIn') {
      setCheckIn(dateStr)
      setCheckOut(null)
      setSelecting('checkOut')
    } else {
      if (checkIn && dateStr > checkIn) {
        setCheckOut(dateStr)
        setSelecting('checkIn')
      } else {
        // If clicked date is before check-in, reset
        setCheckIn(dateStr)
        setCheckOut(null)
      }
    }
  }

  // Calculate total price
  const calculateTotal = (): { nights: number; price: number } | null => {
    if (!checkIn || !checkOut) return null
    
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    // Find the price for this period
    const price = getPriceForDate(start)
    if (!price) return null
    
    // Calculate weekly price prorated
    const weeks = nights / 7
    const totalPrice = Math.round(price * weeks)
    
    return { nights, price: totalPrice }
  }

  const total = calculateTotal()

  // Navigate months
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))

  // Month display
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentMonth)
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
  const nextMonthDays = getDaysInMonth(nextMonthDate)

  const handleConfirm = () => {
    if (checkIn && checkOut) {
      onSelect(checkIn, checkOut, total?.price || null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-merriweather text-2xl text-charcoal-900">Select Dates</h2>
              <p className="text-charcoal-500 text-sm mt-1">{propertyName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors"
            >
              <X className="w-5 h-5 text-charcoal-600" />
            </button>
          </div>

          {/* Selection Status */}
          <div className="px-6 py-4 bg-cream-50 border-b border-cream-100 flex items-center gap-6">
            <div 
              className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selecting === 'checkIn' ? 'border-gold-500 bg-white' : 'border-transparent bg-white/50'
              }`}
              onClick={() => setSelecting('checkIn')}
            >
              <div className="text-xs text-charcoal-500 uppercase tracking-wide mb-1">Check-in</div>
              <div className="text-lg font-semibold text-charcoal-900">
                {checkIn ? new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
              </div>
            </div>
            <div 
              className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selecting === 'checkOut' ? 'border-gold-500 bg-white' : 'border-transparent bg-white/50'
              }`}
              onClick={() => setSelecting('checkOut')}
            >
              <div className="text-xs text-charcoal-500 uppercase tracking-wide mb-1">Check-out</div>
              <div className="text-lg font-semibold text-charcoal-900">
                {checkOut ? new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
              </div>
            </div>
            {total && (
              <div className="flex-1 p-4 rounded-xl bg-gold-50 border-2 border-gold-200">
                <div className="text-xs text-gold-700 uppercase tracking-wide mb-1">{total.nights} nights</div>
                <div className="text-lg font-semibold text-gold-700">€{total.price.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Calendars */}
          <div className="p-6 overflow-auto max-h-[50vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Current Month */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-cream-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-semibold text-charcoal-900">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <div className="w-10" /> {/* Spacer */}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                      <div key={day} className="text-center text-xs text-charcoal-400 font-medium py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((date, i) => {
                      if (!date) return <div key={`empty-${i}`} className="aspect-square" />
                      
                      const status = getDateStatus(date)
                      const dateStr = date.toISOString().split('T')[0]
                      const isCheckIn = checkIn === dateStr
                      const isCheckOut = checkOut === dateStr
                      const inRange = isInRange(date)
                      const isDisabled = status === 'past' || status === 'booked' || status === 'blocked'
                      
                      return (
                        <button
                          key={dateStr}
                          disabled={isDisabled}
                          onClick={() => handleDateClick(date)}
                          className={`
                            aspect-square rounded-lg text-sm font-medium transition-all relative
                            ${isCheckIn || isCheckOut ? 'bg-gold-500 text-white' : ''}
                            ${inRange && !isCheckIn && !isCheckOut ? 'bg-gold-100 text-gold-700' : ''}
                            ${status === 'available' && !isCheckIn && !isCheckOut && !inRange ? 'bg-green-50 text-charcoal-700 hover:bg-green-100' : ''}
                            ${status === 'booked' ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' : ''}
                            ${status === 'blocked' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : ''}
                            ${status === 'past' ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${status === 'none' && !isDisabled ? 'text-charcoal-400 hover:bg-cream-50' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Next Month */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10" /> {/* Spacer */}
                    <h3 className="font-semibold text-charcoal-900">
                      {monthNames[nextMonthDate.getMonth()]} {nextMonthDate.getFullYear()}
                    </h3>
                    <button
                      onClick={nextMonth}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-cream-50 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(day => (
                      <div key={`next-${day}`} className="text-center text-xs text-charcoal-400 font-medium py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {nextMonthDays.map((date, i) => {
                      if (!date) return <div key={`next-empty-${i}`} className="aspect-square" />
                      
                      const status = getDateStatus(date)
                      const dateStr = date.toISOString().split('T')[0]
                      const isCheckIn = checkIn === dateStr
                      const isCheckOut = checkOut === dateStr
                      const inRange = isInRange(date)
                      const isDisabled = status === 'past' || status === 'booked' || status === 'blocked'
                      
                      return (
                        <button
                          key={dateStr}
                          disabled={isDisabled}
                          onClick={() => handleDateClick(date)}
                          className={`
                            aspect-square rounded-lg text-sm font-medium transition-all relative
                            ${isCheckIn || isCheckOut ? 'bg-gold-500 text-white' : ''}
                            ${inRange && !isCheckIn && !isCheckOut ? 'bg-gold-100 text-gold-700' : ''}
                            ${status === 'available' && !isCheckIn && !isCheckOut && !inRange ? 'bg-green-50 text-charcoal-700 hover:bg-green-100' : ''}
                            ${status === 'booked' ? 'bg-red-50 text-red-300 cursor-not-allowed line-through' : ''}
                            ${status === 'blocked' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : ''}
                            ${status === 'past' ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${status === 'none' && !isDisabled ? 'text-charcoal-400 hover:bg-cream-50' : ''}
                          `}
                        >
                          {date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-6 py-3 bg-cream-50 border-t border-cream-100 flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
              <span className="text-charcoal-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
              <span className="text-charcoal-600">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
              <span className="text-charcoal-600">Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gold-500" />
              <span className="text-charcoal-600">Selected</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => { setCheckIn(null); setCheckOut(null); setSelecting('checkIn'); }}
              className="text-charcoal-600 hover:text-charcoal-900 font-medium"
            >
              Clear dates
            </button>
            <button
              onClick={handleConfirm}
              disabled={!checkIn || !checkOut}
              className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Dates
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

