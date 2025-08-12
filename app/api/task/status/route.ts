import { NextRequest, NextResponse } from 'next/server'
import { TaskStorage } from '@/lib/storage'
import { fetchTask } from '@/lib/midjourney'

export async function POST(request: NextRequest) {
  try {
    const { taskIds } = await request.json()

    if (!Array.isArray(taskIds)) {
      return NextResponse.json(
        { success: false, message: 'taskIds 必须是数组' },
        { status: 400 }
      )
    }

    const tasks = []
    
    for (const taskId of taskIds) {
      let task = TaskStorage.getTask(taskId)
      
      if (task && (task.status === 'PENDING' || task.status === 'IN_PROGRESS')) {
        try {
          const response = await fetchTask(taskId)
          console.log(`Fetching task ${taskId}:`, response)
          
          if (response.code === 1 && response.result) {
            const result = response.result
            let status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' = 'PENDING'
            let progress: number | undefined
            let imageUrl: string | undefined
            let failReason: string | undefined

            console.log(`Task ${taskId} status from API:`, result.status)

            switch (result.status) {
              case 'SUBMITTED':
              case 'IN_PROGRESS':
              case 'PROCESSING':
                status = 'IN_PROGRESS'
                progress = result.progress || result.percentage || 0
                break
              case 'SUCCESS':
              case 'FINISHED':
                status = 'SUCCESS'
                // 尝试多个可能的图像URL字段
                imageUrl = result.imageUrl || result.image_url || result.url || result.attachments?.[0]?.url
                progress = 100
                break
              case 'FAILURE':
              case 'FAILED':
                status = 'FAILURE'
                failReason = result.failReason || result.reason || result.error || '生成失败'
                break
              default:
                // 保持原状态，但记录未知状态
                console.log(`Unknown status for task ${taskId}:`, result.status, 'Full result:', result)
            }

            task = TaskStorage.updateTask(taskId, {
              status,
              progress,
              imageUrl,
              failReason
            })
          } else {
            console.log(`Failed to fetch task ${taskId}:`, response)
          }
        } catch (error) {
          console.error(`Error fetching task ${taskId}:`, error)
        }
      }
      
      if (task) {
        tasks.push(task)
      }
    }

    return NextResponse.json({
      success: true,
      tasks
    })
  } catch (error) {
    console.error('Task status API error:', error)
    return NextResponse.json(
      { success: false, message: '获取任务状态失败' },
      { status: 500 }
    )
  }
}