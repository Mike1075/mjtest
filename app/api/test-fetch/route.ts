import { NextRequest, NextResponse } from 'next/server'
import { fetchTask } from '@/lib/midjourney'

export async function GET(request: NextRequest) {
  try {
    // 使用测试任务ID
    const taskId = '1755004349727106'
    console.log('Testing fetch task:', taskId)
    
    const response = await fetchTask(taskId)
    console.log('Fetch test response:', response)
    
    return NextResponse.json({
      success: true,
      message: 'Fetch接口测试成功',
      taskId,
      data: response
    })
  } catch (error: any) {
    console.error('Fetch test error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
  }
}