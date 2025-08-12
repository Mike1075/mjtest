'use client'

import { useState, useEffect } from 'react'
import { ImageCache } from '@/lib/imageCache'

interface SmartImageProps {
  taskId: string
  imageUrl: string
  alt: string
  className?: string
  onError?: () => void
}

export default function SmartImage({ taskId, imageUrl, alt, className, onError }: SmartImageProps) {
  const [displayUrl, setDisplayUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadImage()
  }, [imageUrl, taskId])

  const loadImage = async () => {
    setLoading(true)
    setError(false)

    try {
      // 首先检查缓存
      const cached = ImageCache.getCachedImage(taskId)
      if (cached) {
        setDisplayUrl(cached)
        setLoading(false)
        return
      }

      // 如果没有缓存，尝试缓存图片
      const cachedUrl = await ImageCache.cacheImage(taskId, imageUrl)
      setDisplayUrl(cachedUrl)
      setLoading(false)
    } catch (err) {
      console.error('Smart image load error:', err)
      setError(true)
      setLoading(false)
      setDisplayUrl(imageUrl) // fallback到原URL
      onError?.()
    }
  }

  const handleImageError = () => {
    setError(true)
    onError?.()
  }

  if (loading) {
    return (
      <div 
        className={className}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f3f4f6',
          minHeight: '200px',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ marginBottom: '8px' }}>📸</div>
          <div style={{ fontSize: '14px' }}>加载图片中...</div>
        </div>
      </div>
    )
  }

  if (error && !displayUrl) {
    return (
      <div 
        className={className}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#fee2e2',
          minHeight: '200px',
          borderRadius: '8px'
        }}
      >
        <div style={{ textAlign: 'center', color: '#dc2626' }}>
          <div style={{ marginBottom: '8px' }}>❌</div>
          <div style={{ fontSize: '14px' }}>图片加载失败</div>
        </div>
      </div>
    )
  }

  return (
    <img 
      src={displayUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
      style={{
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px'
      }}
    />
  )
}