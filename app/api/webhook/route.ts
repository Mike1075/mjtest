import { NextRequest, NextResponse } from 'next/server'
import { TaskStorage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook received:', body)

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: '缺少任务ID' },
        { status: 400 }
      )
    }

    const task = TaskStorage.getTask(body.id)
    if (!task) {
      console.log('Task not found:', body.id)
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      )
    }

    let status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' = 'PENDING'
    let progress: number | undefined
    let imageUrl: string | undefined
    let failReason: string | undefined

    switch (body.status) {
      case 'SUBMITTED':
      case 'IN_PROGRESS':
        status = 'IN_PROGRESS'
        progress = body.progress || 0
        break
      case 'SUCCESS':
        status = 'SUCCESS'
        imageUrl = body.imageUrl
        progress = 100
        break
      case 'FAILURE':
        status = 'FAILURE'
        failReason = body.failReason || '生成失败'
        break
      default:
        status = 'PENDING'
    }

    TaskStorage.updateTask(body.id, {
      status,
      progress,
      imageUrl,
      failReason
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, message: '处理webhook失败' },
      { status: 500 }
    )
  }
}