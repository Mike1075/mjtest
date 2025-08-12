import { NextRequest, NextResponse } from 'next/server'
import { midjourneyClient } from '@/lib/midjourney'

export async function GET(request: NextRequest) {
  try {
    // 测试API连接
    const response = await midjourneyClient.get('/mj')
    
    return NextResponse.json({
      success: true,
      message: 'API连接正常',
      data: response.data
    })
  } catch (error: any) {
    console.error('API test error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
  }
}