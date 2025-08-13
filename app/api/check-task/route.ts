import { NextRequest, NextResponse } from 'next/server'
import { fetchTask } from '@/lib/midjourney'

export async function POST(request: NextRequest) {
  try {
    const { taskIds } = await request.json()

    if (!Array.isArray(taskIds)) {
      return NextResponse.json(
        { success: false, message: 'taskIds 必须是数组' },
        { status: 400 }
      )
    }

    console.log('Checking tasks:', taskIds)

    const tasks = []
    
    for (const taskId of taskIds) {
      try {
        const result = await fetchTask(taskId)
        console.log(`Task ${taskId} from API:`, result)
        console.log(`Task ${taskId} - imageUrl:`, result.imageUrl)
        console.log(`Task ${taskId} - attachments:`, result.attachments)
        console.log(`Task ${taskId} - buttons:`, result.buttons)
        
        let status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' = 'PENDING'
        let progress: number | undefined
        let imageUrl: string | undefined
        let failReason: string | undefined

        // 解析进度值（可能是 "100%" 字符串或数字）
        const parseProgress = (prog: string | number | undefined): number => {
          if (typeof prog === 'string') {
            return parseInt(prog.replace('%', '')) || 0
          }
          return prog || 0
        }

        // 分析图片类型和数量
        const analyzeImageType = (url: string) => {
          if (!url) return { type: 'unknown', count: 0 }
          
          // Discord CDN URL包含下划线通常表示是4张图片的网格
          if (url.includes('cdn.discordapp.com') && url.includes('_')) {
            return { type: 'grid', count: 4 }
          }
          // 包含 'upscale' 或 'U' 通常表示是放大的单张图片
          else if (url.includes('upscale') || url.match(/U\d/)) {
            return { type: 'upscaled', count: 1 }
          }
          // 其他情况视为单张图片
          else {
            return { type: 'single', count: 1 }
          }
        }

        switch (result.status) {
          case 'SUBMITTED':
          case 'IN_PROGRESS':
          case 'PROCESSING':
            status = 'IN_PROGRESS'
            progress = parseProgress(result.progress) || result.percentage || 0
            break
          case 'SUCCESS':
          case 'FINISHED':
            status = 'SUCCESS'
            imageUrl = result.imageUrl || result.image_url || result.url || result.thumbnailUrl
            progress = 100
            break
          case 'FAILURE':
          case 'FAILED':
            status = 'FAILURE'
            failReason = result.failReason || result.reason || result.error || '生成失败'
            break
          default:
            console.log(`Unknown status for task ${taskId}:`, result.status)
        }

        const imageAnalysis = analyzeImageType(imageUrl || '')

        tasks.push({
          id: taskId,
          prompt: result.prompt || result.promptEn || 'Unknown prompt',
          status,
          progress,
          imageUrl,
          failReason,
          attachments: result.attachments,
          buttons: result.buttons,
          imageType: imageAnalysis.type as 'grid' | 'single' | 'upscaled',
          imageCount: imageAnalysis.count,
          createdAt: new Date(result.submitTime || Date.now()).toISOString(),
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        console.error(`Error checking task ${taskId}:`, error)
        // 如果API调用失败，返回未知状态的任务
        tasks.push({
          id: taskId,
          prompt: 'Unknown prompt',
          status: 'PENDING' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    return NextResponse.json({
      success: true,
      tasks
    })
  } catch (error) {
    console.error('Check task API error:', error)
    return NextResponse.json(
      { success: false, message: '检查任务状态失败' },
      { status: 500 }
    )
  }
}