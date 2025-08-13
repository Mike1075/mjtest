import { NextRequest, NextResponse } from 'next/server'
import { submitImagineTask } from '@/lib/midjourney'
import { MidjourneyRequest } from '@/types/midjourney'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必需参数
    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'prompt is required and must be a string',
          code: 'INVALID_PROMPT'
        },
        { status: 400 }
      )
    }

    // 验证参数值
    const validModes = ['fast', 'relax'] as const
    const validAspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const
    const validModels = ['midjourney', 'niji'] as const
    const validQualities = ['draft', 'standard', 'high'] as const

    // 设置默认值并验证
    const mode = body.mode || 'fast'
    const aspectRatio = body.aspectRatio || '1:1'
    const model = body.model || 'midjourney'
    const quality = body.quality || 'standard'
    const stylize = body.stylize || 100

    if (!validModes.includes(mode as any)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid mode. Must be one of: ${validModes.join(', ')}`,
          code: 'INVALID_MODE'
        },
        { status: 400 }
      )
    }

    if (!validAspectRatios.includes(aspectRatio as any)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid aspectRatio. Must be one of: ${validAspectRatios.join(', ')}`,
          code: 'INVALID_ASPECT_RATIO'
        },
        { status: 400 }
      )
    }

    if (!validModels.includes(model as any)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid model. Must be one of: ${validModels.join(', ')}`,
          code: 'INVALID_MODEL'
        },
        { status: 400 }
      )
    }

    if (!validQualities.includes(quality as any)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid quality. Must be one of: ${validQualities.join(', ')}`,
          code: 'INVALID_QUALITY'
        },
        { status: 400 }
      )
    }

    if (typeof stylize !== 'number' || stylize < 0 || stylize > 1000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'stylize must be a number between 0 and 1000',
          code: 'INVALID_STYLIZE'
        },
        { status: 400 }
      )
    }

    // 构建请求对象
    const midjourneyRequest: MidjourneyRequest = {
      prompt: body.prompt.trim(),
      mode: mode as 'fast' | 'relax',
      aspectRatio: aspectRatio as '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
      model: model as 'midjourney' | 'niji',
      quality: quality as 'draft' | 'standard' | 'high',
      stylize
    }

    console.log('API v1 Generate request:', midjourneyRequest)

    // 调用Midjourney API
    const response = await submitImagineTask(midjourneyRequest)

    if (response.code !== 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: response.description || 'Failed to submit task',
          code: 'MIDJOURNEY_API_ERROR'
        },
        { status: 500 }
      )
    }

    // 返回任务ID
    return NextResponse.json({
      success: true,
      taskId: response.result,
      message: '任务已提交，请使用taskId查询进度',
      data: {
        taskId: response.result,
        prompt: midjourneyRequest.prompt,
        parameters: {
          mode,
          aspectRatio,
          model,
          quality,
          stylize
        },
        submittedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('API v1 Generate error:', error)
    
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