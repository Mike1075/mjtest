import { NextRequest, NextResponse } from 'next/server'
import { TaskStorage } from '@/lib/storage'
import { fetchTask } from '@/lib/midjourney'

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json()

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: '缺少任务ID' },
        { status: 400 }
      )
    }

    const task = TaskStorage.getTask(taskId)
    if (!task) {
      return NextResponse.json(
        { success: false, message: '任务不存在' },
        { status: 404 }
      )
    }

    try {
      const result = await fetchTask(taskId)
      console.log(`Refreshing image URL for task ${taskId}:`, result)
      
      if (result.status === 'SUCCESS') {
        const imageUrl = result.imageUrl || result.image_url || result.url || result.thumbnailUrl
        
        const updatedTask = TaskStorage.updateTask(taskId, {
          imageUrl,
          updatedAt: new Date().toISOString()
        })

        return NextResponse.json({
          success: true,
          message: '图像URL已刷新',
          task: updatedTask
        })
      } else {
        return NextResponse.json({
          success: false,
          message: `任务状态: ${result.status}`
        })
      }
    } catch (error) {
      console.error(`Error refreshing image for task ${taskId}:`, error)
      return NextResponse.json(
        { success: false, message: '刷新失败: ' + (error as Error).message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Refresh image API error:', error)
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    )
  }
}