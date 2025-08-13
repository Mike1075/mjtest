import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== Webhook received ===')
    console.log('Task ID:', body.id)
    console.log('Status:', body.status)
    console.log('Progress:', body.progress)
    console.log('Full payload:', JSON.stringify(body, null, 2))
    console.log('========================')

    // 简单返回成功，让轮询机制处理状态更新
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received and logged',
      taskId: body.id,
      status: body.status
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, message: '处理webhook失败' },
      { status: 500 }
    )
  }
}

// 添加GET方法用于测试
export async function GET() {
  return NextResponse.json({
    message: 'Webhook endpoint is active',
    url: 'https://mjtest-seven.vercel.app/api/webhook',
    timestamp: new Date().toISOString()
  })
}