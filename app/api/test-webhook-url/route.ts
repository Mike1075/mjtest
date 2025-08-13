import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const webhookUrl = 'https://mjtest-seven.vercel.app/api/webhook'
    
    // 测试GET请求
    const response = await fetch(webhookUrl)
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Webhook URL test successful',
      webhookUrl,
      response: data,
      status: response.status
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Webhook URL test failed',
      error: (error as Error).message
    })
  }
}