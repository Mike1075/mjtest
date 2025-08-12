import { NextRequest, NextResponse } from 'next/server'
import { TaskStorage } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    const allTasks = TaskStorage.getAllTasks()
    
    return NextResponse.json({
      success: true,
      message: '调试信息',
      totalTasks: allTasks.length,
      tasks: allTasks.map(task => ({
        id: task.id,
        prompt: task.prompt.substring(0, 50) + '...',
        status: task.status,
        progress: task.progress,
        hasImageUrl: !!task.imageUrl,
        imageUrl: task.imageUrl ? task.imageUrl.substring(0, 100) + '...' : null,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
      }))
    })
  } catch (error: any) {
    console.error('Debug API error:', error)
    
    return NextResponse.json({
      success: false,
      message: error.message
    })
  }
}