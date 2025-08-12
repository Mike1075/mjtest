import { NextRequest, NextResponse } from 'next/server'
import { submitImagineTask } from '@/lib/midjourney'

export async function POST(request: NextRequest) {
  try {
    console.log('Testing imagine API with simple prompt')
    
    const response = await submitImagineTask({
      prompt: 'a red apple, simple, clean background'
    })
    
    console.log('Imagine test response:', response)
    
    return NextResponse.json({
      success: true,
      message: 'Imagine接口测试成功',
      data: response
    })
  } catch (error: any) {
    console.error('Imagine test error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
  }
}