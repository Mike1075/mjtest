import { NextRequest, NextResponse } from 'next/server'
import { fetchTask } from '@/lib/midjourney'

interface RouteParams {
  params: {
    taskId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { taskId } = params

    if (!taskId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'taskId is required',
          code: 'MISSING_TASK_ID'
        },
        { status: 400 }
      )
    }

    console.log('API v1 Status request for taskId:', taskId)

    // 获取任务详情
    const result = await fetchTask(taskId)
    
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

    // 映射状态
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
      default:
        console.log(`Unknown status for task ${taskId}:`, result.status)
        status = 'PENDING'
    }

    const imageAnalysis = analyzeImageType(imageUrl || '', result.buttons)

    // 构建响应数据
    const taskData = {
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
      updatedAt: new Date().toISOString(),
      // 额外的API信息
      apiResponse: {
        originalStatus: result.status,
        rawProgress: result.progress,
        percentage: result.percentage,
        finishTime: result.finishTime ? new Date(result.finishTime).toISOString() : undefined,
        startTime: result.startTime ? new Date(result.startTime).toISOString() : undefined
      }
    }

    return NextResponse.json({
      success: true,
      task: taskData,
      meta: {
        requestedAt: new Date().toISOString(),
        apiVersion: 'v1'
      }
    })

  } catch (error) {
    console.error('API v1 Status error:', error)
    
    // 如果是网络错误或API错误，返回更具体的错误信息
    if (error instanceof Error && error.message.includes('Midjourney API Error')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch task status from Midjourney API',
          code: 'MIDJOURNEY_API_ERROR',
          details: error.message
        },
        { status: 502 }
      )
    }

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