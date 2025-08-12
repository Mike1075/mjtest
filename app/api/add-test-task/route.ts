import { NextRequest, NextResponse } from 'next/server'
import { TaskStorage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    // 添加已知的测试任务到存储
    const testTaskId = '1755004349727106'
    const prompt = 'a red apple, simple, clean background'
    
    TaskStorage.createTask(testTaskId, prompt)
    
    return NextResponse.json({
      success: true,
      message: '测试任务已添加到存储',
      taskId: testTaskId
    })
  } catch (error: any) {
    console.error('Add test task error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message
    })
  }
}