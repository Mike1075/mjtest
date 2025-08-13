'use client'

import { useState } from 'react'
import SmartImage from './SmartImage'

interface ImageViewerProps {
  taskId: string
  imageUrl: string
  alt: string
  className?: string
  onError?: () => void
}

export default function ImageViewer({ taskId, imageUrl, alt, className, onError }: ImageViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDownload = async (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    try {
      console.log('Starting download for:', imageUrl)
      
      // 使用代理请求避免CORS问题
      const response = await fetch('/api/download-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, taskId })
      })
      
      if (!response.ok) {
        throw new Error('Download proxy failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `midjourney-${taskId}.png`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('Download completed')
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: 尝试直接下载
      try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = `midjourney-${taskId}.png`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError)
        // 最后的备选方案：在新标签页打开
        window.open(imageUrl, '_blank')
      }
    }
  }

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <SmartImage
          taskId={taskId}
          imageUrl={imageUrl}
          alt={alt}
          className={className}
          onError={onError}
        />
        
        {/* 操作按钮 */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsModalOpen(true)
            }}
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title="查看原图"
          >
            🔍
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDownload(e)
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
            title="下载图片"
          >
            📥
          </button>
        </div>

        {/* 点击放大 */}
        <div
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            cursor: 'pointer',
            background: 'transparent'
          }}
        />
      </div>

      {/* 全屏模态框 */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            style={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* 关闭按钮 */}
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
            
            {/* 下载按钮 */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDownload(e)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '-40px',
                right: '0',
                background: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              下载原图
            </button>
          </div>
        </div>
      )}
    </>
  )
}