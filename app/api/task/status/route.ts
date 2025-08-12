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
          
          if (response.code === 1 && response.result) {
            const result = response.result
            let status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' = 'PENDING'
            let progress: number | undefined
            let imageUrl: string | undefined
            let failReason: string | undefined

            switch (result.status) {
              case 'SUBMITTED':
              case 'IN_PROGRESS':
                status = 'IN_PROGRESS'
                progress = result.progress || 0
                break
              case 'SUCCESS':
                status = 'SUCCESS'
                imageUrl = result.imageUrl
                progress = 100
                break
              case 'FAILURE':
                status = 'FAILURE'
                failReason = result.failReason || '生成失败'
                break
            }

            task = TaskStorage.updateTask(taskId, {
              status,
              progress,
              imageUrl,
              failReason
            })
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