import { NextRequest, NextResponse } from 'next/server'
import { midjourneyClient } from '@/lib/midjourney'

export async function GET(request: NextRequest) {
  try {
    // 测试不同的认证方式
    const authMethods = [
      { headers: { 'mj-api-secret': 'uhak4zo7vnxk63rxczd0qlah77r62uxc' } },
      { headers: { 'Authorization': 'uhak4zo7vnxk63rxczd0qlah77r62uxc' } },
      { headers: { 'Authorization': 'Bearer uhak4zo7vnxk63rxczd0qlah77r62uxc' } }
    ]
    
    const endpoints = ['/mj', '/mj/info', '/mj/accounts', '/mj/submit', '/']
    
    for (const auth of authMethods) {
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing ${endpoint} with auth:`, Object.keys(auth.headers)[0])
          const response = await midjourneyClient.get(endpoint, auth)
          return NextResponse.json({
            success: true,
            message: `API连接正常`,
            endpoint,
            authMethod: Object.keys(auth.headers)[0],
            data: response.data
          })
        } catch (err: any) {
          console.log(`${endpoint} (${Object.keys(auth.headers)[0]}) failed:`, err.response?.status)
        }
      }
    }
    
    throw new Error('All endpoints and auth methods failed')
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