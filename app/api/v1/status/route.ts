import { NextRequest, NextResponse } from 'next/server'
import { fetchTask } from '@/lib/midjourney'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证参数
    if (!body.taskIds || !Array.isArray(body.taskIds)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'taskIds is required and must be an array',
          code: 'INVALID_TASK_IDS'
        },
        { status: 400 }
      )
    }

    if (body.taskIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'taskIds array cannot be empty',
          code: 'EMPTY_TASK_IDS'
        },
        { status: 400 }
      )
    }

    if (body.taskIds.length > 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Maximum 10 taskIds allowed per request',
          code: 'TOO_MANY_TASK_IDS'
        },
        { status: 400 }
      )
    }

    console.log('API v1 Batch Status request for taskIds:', body.taskIds)

    // 解析进度值
    const parseProgress = (prog: string | number | undefined): number => {
      if (typeof prog === 'string') {
        return parseInt(prog.replace('%', '')) || 0
      }
      return prog || 0
    }

    // 分析图片类型和数量
    const analyzeImageType = (url: string, buttons?: Array<any>) => {
      if (!url) return { type: 'unknown', count: 0 }
      
      if (buttons && buttons.length > 0) {
        const hasUpscaleButtons = buttons.some(btn => btn.label && btn.label.startsWith('U'))
        const hasVariationButtons = buttons.some(btn => btn.label && btn.label.startsWith('V'))
        
        if (hasUpscaleButtons && hasVariationButtons) {
          return { type: 'grid', count: 4 }
        }
      }
      
      if (url.includes('upscale') || url.match(/[_-]U\d/)) {
        return { type: 'upscaled', count: 1 }
      }
      
      return { type: 'single', count: 1 }
    }

    // 并发获取所有任务状态
    const tasks = []
    const errors = []

    for (const taskId of body.taskIds) {
      try {
        const result = await fetchTask(taskId)
        
        let status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' = 'PENDING'
        let progress: number | undefined
        let imageUrl: string | undefined
        let failReason: string | undefined

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
        console.error(`Error fetching task ${taskId}:`, error)
        errors.push({
          taskId,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        
        // 为失败的任务添加一个错误记录
        tasks.push({
          id: taskId,
          prompt: 'Unknown prompt',
          status: 'FAILURE' as const,
          failReason: 'Failed to fetch task status',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }

    return NextResponse.json({
      success: true,
      tasks,
      meta: {
        requestedTaskIds: body.taskIds,
        successCount: tasks.filter(t => t.status !== 'FAILURE' || !t.failReason?.includes('Failed to fetch')).length,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : undefined,
        requestedAt: new Date().toISOString(),
        apiVersion: 'v1'
      }
    })

  } catch (error) {
    console.error('API v1 Batch Status error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
}