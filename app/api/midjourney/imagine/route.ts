import { NextRequest, NextResponse } from 'next/server'
import { submitImagineTask } from '@/lib/midjourney'
import { TaskStorage } from '@/lib/storage'
import { MidjourneyRequest } from '@/types/midjourney'

export async function POST(request: NextRequest) {
  try {
    const body: MidjourneyRequest = await request.json()

    if (!body.prompt?.trim()) {
      return NextResponse.json(
        { success: false, message: '提示词不能为空' },
        { status: 400 }
      )
    }

    const response = await submitImagineTask({
      prompt: body.prompt,
      mode: body.mode || 'fast',
      aspectRatio: body.aspectRatio,
      model: body.model,
      quality: body.quality,
      stylize: body.stylize
    })

    if (response.code === 1 && response.result) {
      const taskId = response.result
      TaskStorage.createTask(taskId, body.prompt)
      
      return NextResponse.json({
        success: true,
        taskId,
        message: '任务提交成功'
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: response.description || '任务提交失败' 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Imagine API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '服务器错误' 
      },
      { status: 500 }
    )
  }
}