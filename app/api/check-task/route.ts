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
        const analyzeImageType = (url: string, buttons?: Array<any>) => {
          if (!url) return { type: 'unknown', count: 0 }
          
          // 检查buttons来判断图片类型
          if (buttons && buttons.length > 0) {
            const hasUpscaleButtons = buttons.some(btn => btn.label && btn.label.startsWith('U'))
            const hasVariationButtons = buttons.some(btn => btn.label && btn.label.startsWith('V'))
            
            // 如果同时有U1-U4和V1-V4按钮，说明是4张图的网格
            if (hasUpscaleButtons && hasVariationButtons) {
              return { type: 'grid', count: 4 }
            }
          }
          
          // 包含 'upscale' 或文件名中有'U'表示是放大的单张图片
          if (url.includes('upscale') || url.match(/[_-]U\d/)) {
            return { type: 'upscaled', count: 1 }
          }
          
          // 默认情况
          return { type: 'single', count: 1 }
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

        const imageAnalysis = analyzeImageType(imageUrl || '', result.buttons)

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