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

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `midjourney-${taskId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: 直接打开图片
      window.open(imageUrl, '_blank')
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
            onClick={() => setIsModalOpen(true)}
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
            onClick={handleDownload}
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
          <div style={{ position: 'relative', maxWidth: '95vw', maxHeight: '95vh' }}>
            <img
              src={imageUrl}
              alt={alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
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
              onClick={handleDownload}
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