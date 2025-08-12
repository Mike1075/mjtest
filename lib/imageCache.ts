// 浏览器端图片缓存工具
export class ImageCache {
  private static readonly CACHE_PREFIX = 'mj_img_'
  private static readonly MAX_CACHE_SIZE = 50 // 最大缓存50张图片

  // 将图片URL转换为Base64并存储到localStorage
  static async cacheImage(taskId: string, imageUrl: string): Promise<string> {
    try {
      const cacheKey = this.CACHE_PREFIX + taskId
      
      // 检查是否已缓存
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        return cached
      }

      // 下载图片并转换为Base64
      const response = await fetch(imageUrl, { mode: 'cors' })
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const blob = await response.blob()
      const base64 = await this.blobToBase64(blob)
      
      // 存储到localStorage
      this.cleanupCache() // 清理旧缓存
      localStorage.setItem(cacheKey, base64)
      
      return base64
    } catch (error) {
      console.error('Failed to cache image:', error)
      return imageUrl // 返回原URL作为fallback
    }
  }

  // 获取缓存的图片
  static getCachedImage(taskId: string): string | null {
    return localStorage.getItem(this.CACHE_PREFIX + taskId)
  }

  // Blob转Base64
  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // 清理旧缓存，保持缓存数量在限制内
  private static cleanupCache() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.CACHE_PREFIX))
    
    if (keys.length >= this.MAX_CACHE_SIZE) {
      // 删除最旧的缓存项（简单实现：删除前10个）
      keys.slice(0, 10).forEach(key => localStorage.removeItem(key))
    }
  }

  // 清除所有图片缓存
  static clearAllCache() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.CACHE_PREFIX))
    keys.forEach(key => localStorage.removeItem(key))
  }
}