'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDates: (checkIn: string, checkOut: string) => void
  initialCheckIn?: string
  initialCheckOut?: string
  title?: string
}

export default function DatePickerModal({
  isOpen,
  onClose,
  onSelectDates,
  initialCheckIn,
  initialCheckOut,
  title
}: DatePickerModalProps) {
  const { t, locale } = useLocale()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn ? new Date(initialCheckIn) : null)
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut ? new Date(initialCheckOut) : null)
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)

  useEffect(() => {
    if (initialCheckIn) setCheckIn(new Date(initialCheckIn))
    if (initialCheckOut) setCheckOut(new Date(initialCheckOut))
  }, [initialCheckIn, initialCheckOut])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const monthNames = locale === 'de' ? [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ] : [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = locale === 'de' ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  
  const modalTitle = title || t('datePicker.title')

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    return { daysInMonth, startingDay, year, month }
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '—'
    return date.toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleDateClick = (day: number, month: number, year: number) => {
    const clickedDate = new Date(year, month, day)
    clickedDate.setHours(0, 0, 0, 0)

    if (clickedDate < today) return

    if (!selectingCheckOut || !checkIn) {
      // Selecting check-in
      setCheckIn(clickedDate)
      setCheckOut(null)
      setSelectingCheckOut(true)
    } else {
      // Selecting check-out
      if (clickedDate <= checkIn) {
        // If clicked date is before or same as check-in, reset
        setCheckIn(clickedDate)
        setCheckOut(null)
      } else {
        setCheckOut(clickedDate)
        setSelectingCheckOut(false)
      }
    }
  }

  const isInRange = (day: number, month: number, year: number) => {
    if (!checkIn || !checkOut) return false
    const date = new Date(year, month, day)
    return date > checkIn && date < checkOut
  }

  const isCheckIn = (day: number, month: number, year: number) => {
    if (!checkIn) return false
    const date = new Date(year, month, day)
    return date.getTime() === checkIn.getTime()
  }

  const isCheckOut = (day: number, month: number, year: number) => {
    if (!checkOut) return false
    const date = new Date(year, month, day)
    return date.getTime() === checkOut.getTime()
  }

  const isPast = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleConfirm = () => {
    if (checkIn && checkOut) {
      onSelectDates(formatDate(checkIn), formatDate(checkOut))
      onClose()
    }
  }

  const handleClear = () => {
    setCheckIn(null)
    setCheckOut(null)
    setSelectingCheckOut(false)
  }

  const renderMonth = (date: Date) => {
    const { daysInMonth, startingDay, year, month } = getDaysInMonth(date)
    const days = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const past = isPast(day, month, year)
      const isStart = isCheckIn(day, month, year)
      const isEnd = isCheckOut(day, month, year)
      const inRange = isInRange(day, month, year)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day, month, year)}
          disabled={past}
          className={`
            h-10 w-10 rounded-full text-sm font-medium transition-all
            ${past ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-cream-100 cursor-pointer'}
            ${isStart || isEnd ? 'bg-gold-500 text-white hover:bg-gold-600' : ''}
            ${inRange ? 'bg-gold-100 text-gold-800' : ''}
            ${!past && !isStart && !isEnd && !inRange ? 'text-charcoal-700' : ''}
          `}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-cream-200">
            <h2 className="font-merriweather text-lg md:text-xl text-charcoal-900">{modalTitle}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cream-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-charcoal-500" />
            </button>
          </div>

          {/* Selected Dates Display */}
          <div className="px-4 md:px-6 py-4 bg-cream-50 border-b border-cream-200">
            <div className="flex items-center gap-2 md:gap-4">
              <div className={`flex-1 p-2 md:p-3 rounded-xl border-2 transition-colors ${selectingCheckOut ? 'border-cream-200 bg-white' : 'border-gold-500 bg-white'}`}>
                <div className="text-[10px] md:text-xs text-charcoal-500 uppercase tracking-wide">{t('datePicker.checkIn')}</div>
                <div className="font-semibold text-charcoal-900 mt-0.5 text-sm md:text-base">{formatDisplayDate(checkIn)}</div>
              </div>
              <div className="text-charcoal-300">→</div>
              <div className={`flex-1 p-2 md:p-3 rounded-xl border-2 transition-colors ${selectingCheckOut && checkIn ? 'border-gold-500 bg-white' : 'border-cream-200 bg-white'}`}>
                <div className="text-[10px] md:text-xs text-charcoal-500 uppercase tracking-wide">{t('datePicker.checkOut')}</div>
                <div className="font-semibold text-charcoal-900 mt-0.5 text-sm md:text-base">{formatDisplayDate(checkOut)}</div>
              </div>
              {checkIn && checkOut && (
                <div className="hidden md:block flex-1 p-3 rounded-xl bg-gold-50 border border-gold-200">
                  <div className="text-xs text-gold-600 uppercase tracking-wide">{t('datePicker.duration')}</div>
                  <div className="font-semibold text-gold-800 mt-0.5">
                    {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} {t('datePicker.nights')}
                  </div>
                </div>
              )}
            </div>
            {/* Duration on mobile - show below */}
            {checkIn && checkOut && (
              <div className="md:hidden mt-3 p-2 rounded-xl bg-gold-50 border border-gold-200 text-center">
                <span className="text-sm font-semibold text-gold-800">
                  {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} {t('datePicker.nightsSelected')}
                </span>
              </div>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="p-4 md:p-6">
            {/* Month Navigation - Desktop (Two months) */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal-600" />
              </button>
              <div className="flex gap-8">
                <span className="font-semibold text-charcoal-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <span className="font-semibold text-charcoal-900">
                  {monthNames[nextMonth.getMonth()]} {nextMonth.getFullYear()}
                </span>
              </div>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-charcoal-600" />
              </button>
            </div>

            {/* Month Navigation - Mobile (Single month) */}
            <div className="flex md:hidden items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal-600" />
              </button>
              <span className="font-semibold text-charcoal-900 text-lg">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-2 hover:bg-cream-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-charcoal-600" />
              </button>
            </div>

            {/* Single Month View - Mobile */}
            <div className="md:hidden">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-charcoal-400">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderMonth(currentMonth)}
              </div>
            </div>

            {/* Two Month View - Desktop */}
            <div className="hidden md:grid md:grid-cols-2 gap-8">
              {/* First Month */}
              <div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-charcoal-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderMonth(currentMonth)}
                </div>
              </div>

              {/* Second Month */}
              <div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-charcoal-400">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {renderMonth(nextMonth)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 py-4 border-t border-cream-200 flex items-center justify-between bg-cream-50">
            <button
              onClick={handleClear}
              className="text-charcoal-600 hover:text-charcoal-900 font-medium transition-colors text-sm md:text-base"
            >
              {t('datePicker.clear')}
            </button>
            <button
              onClick={handleConfirm}
              disabled={!checkIn || !checkOut}
              className="bg-gold-500 hover:bg-gold-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {t('datePicker.confirm')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

