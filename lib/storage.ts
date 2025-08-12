import { MidjourneyTask } from '@/types/midjourney'

let tasks: Map<string, MidjourneyTask> = new Map()

export class TaskStorage {
  static createTask(taskId: string, prompt: string): MidjourneyTask {
    const task: MidjourneyTask = {
      id: taskId,
      prompt,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    tasks.set(taskId, task)
    return task
  }

  static updateTask(taskId: string, updates: Partial<MidjourneyTask>): MidjourneyTask | null {
    const task = tasks.get(taskId)
    if (!task) return null

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    }

    tasks.set(taskId, updatedTask)
    return updatedTask
  }

  static getTask(taskId: string): MidjourneyTask | null {
    return tasks.get(taskId) || null
  }

  static getTasks(taskIds: string[]): MidjourneyTask[] {
    return taskIds.map(id => tasks.get(id)).filter(Boolean) as MidjourneyTask[]
  }

  static getAllTasks(): MidjourneyTask[] {
    return Array.from(tasks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  static deleteTask(taskId: string): boolean {
    return tasks.delete(taskId)
  }

  static cleanup(olderThan: Date): number {
    let deleted = 0
    for (const [id, task] of tasks.entries()) {
      if (new Date(task.createdAt) < olderThan) {
        tasks.delete(id)
        deleted++
      }
    }
    return deleted
  }
}