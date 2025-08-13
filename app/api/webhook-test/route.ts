import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook test received:', JSON.stringify(body, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received successfully',
      received: body
    })
  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json({ success: false, message: 'Webhook test failed' })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook endpoint is working',
    url: 'https://mjtest-seven.vercel.app/api/webhook',
    timestamp: new Date().toISOString()
  })
}