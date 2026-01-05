'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Copy, 
  Mail, 
  MessageCircle, 
  Facebook,
  Check,
  Link2
} from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  property: {
    name: string
    shortDescription: string
    image: string
    url: string
  }
  locale: string
}

export default function ShareModal({ isOpen, onClose, property, locale }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(property.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers or if clipboard API fails
      const textArea = document.createElement('textarea')
      textArea.value = property.url
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        console.error('Failed to copy:', e)
      }
      document.body.removeChild(textArea)
    }
  }

  const shareOptions = [
    {
      name: locale === 'de' ? 'Link kopieren' : 'Copy Link',
      icon: copied ? Check : Copy,
      onClick: handleCopyLink,
      highlight: copied,
    },
    {
      name: 'Email',
      icon: Mail,
      onClick: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(property.name)}&body=${encodeURIComponent(`${property.shortDescription}\n\n${property.url}`)}`
      },
    },
    {
      name: 'WhatsApp',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${property.name}\n${property.url}`)}`, '_blank')
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(property.url)}`, '_blank', 'width=600,height=400')
      },
    },
    {
      name: 'X',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      onClick: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(property.name)}&url=${encodeURIComponent(property.url)}`, '_blank', 'width=600,height=400')
      },
    },
    {
      name: 'Messages',
      icon: MessageCircle,
      onClick: () => {
        window.location.href = `sms:?body=${encodeURIComponent(`${property.name}\n${property.url}`)}`
      },
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div 
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-charcoal-900">
                {locale === 'de' ? 'Teilen' : 'Share this place'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-charcoal-600" />
              </button>
            </div>

            {/* Property Preview */}
            <div className="p-5 flex items-center gap-4 border-b border-gray-100">
              <img
                src={property.image}
                alt={property.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-charcoal-900 truncate">
                  {property.name}
                </h3>
                <p className="text-charcoal-500 text-sm truncate">
                  {property.shortDescription}
                </p>
              </div>
            </div>

            {/* Share Options */}
            <div className="p-5 grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.name}
                    onClick={option.onClick}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                      option.highlight
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-charcoal-700'
                    }`}
                  >
                    {typeof Icon === 'function' ? <Icon /> : <Icon className="w-5 h-5" />}
                    <span className="font-medium text-sm">{option.name}</span>
                  </button>
                )
              })}
            </div>

            {/* URL Preview */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Link2 className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
                <span className="text-sm text-charcoal-500 truncate flex-1">
                  {property.url}
                </span>
              </div>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

