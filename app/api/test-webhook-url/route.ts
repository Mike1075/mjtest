import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const webhookUrl = 'https://mjtest-seven.vercel.app/api/webhook'
    
    console.log('Testing webhook URL:', webhookUrl)
    
    // 测试GET请求
    const response = await fetch(webhookUrl)
    const responseText = await response.text()
    
    console.log('Webhook response status:', response.status)
    console.log('Webhook response text:', responseText)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { rawText: responseText }
    }
    
    return NextResponse.json({
      success: response.ok,
      message: response.ok ? 'Webhook URL accessible' : 'Webhook URL returned error',
      webhookUrl,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      response: responseData
    })
  } catch (error) {
    console.error('Webhook URL test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Webhook URL test failed',
      error: (error as Error).message,
      webhookUrl: 'https://mjtest-seven.vercel.app/api/webhook'
    })
  }
}