'use client'

import { useState, useEffect } from 'react'
import { MidjourneyRequest, MidjourneyTask } from '@/types/midjourney'
import ImageViewer from '@/components/ImageViewer'

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [mode, setMode] = useState<'fast' | 'relax'>('fast')
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1')
  const [model, setModel] = useState<'midjourney' | 'niji'>('midjourney')
  const [quality, setQuality] = useState<'draft' | 'standard' | 'high'>('standard')
  const [stylize, setStylize] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<MidjourneyTask[]>([])
  const [debugInfo, setDebugInfo] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)

    const request: MidjourneyRequest = {
      prompt: prompt.trim(),
      mode,
      aspectRatio,
      model,
      quality,
      stylize
    }

    try {
      console.log('Submitting request:', request)
      
      const response = await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      const data = await response.json()
      console.log('Response from submit-task API:', data)
      setDebugInfo(JSON.stringify(data, null, 2))
      
      if (data.success && data.task) {
        console.log('Adding task to local state:', data.task)
        setTasks(prev => [data.task, ...prev])
        setPrompt('')
      } else {
        alert('提交失败: ' + data.message)
      }
    } catch (error) {
      console.error('Submit error:', error)
      setDebugInfo(`提交失败: ${error}`)
      alert('提交失败: ' + (error as Error).message)
    }

    setIsLoading(false)
  }

  const fetchTaskStatus = async (forceRefreshAll = false) => {
    let tasksToCheck = tasks.filter(task => 
      task.status === 'PENDING' || task.status === 'IN_PROGRESS'
    )

    // 如果强制刷新，检查所有任务
    if (forceRefreshAll) {
      tasksToCheck = tasks
    }

    console.log('All tasks:', tasks)
    console.log('Tasks to check:', tasksToCheck)

    if (tasksToCheck.length === 0) {
      setDebugInfo(forceRefreshAll ? '没有任务可以刷新' : '没有待处理的任务需要刷新')
      return
    }

    try {
      console.log('Checking status for tasks:', tasksToCheck.map(t => t.id))
      
      const response = await fetch('/api/check-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds: tasksToCheck.map(t => t.id) })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Task status response:', data)
      setDebugInfo(JSON.stringify(data, null, 2))
      
      if (data.success && data.tasks) {
        setTasks(prev => prev.map(task => {
          const updatedTask = data.tasks.find((t: MidjourneyTask) => t.id === task.id)
          if (updatedTask) {
            console.log(`Updating task ${task.id}:`, updatedTask)
          }
          return updatedTask || task
        }))
      } else {
        console.error('Task status check failed:', data)
      }
    } catch (error) {
      console.error('获取任务状态失败:', error)
      setDebugInfo(`获取任务状态失败: ${error}`)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const pendingTasks = tasks.filter(task => 
        task.status === 'PENDING' || task.status === 'IN_PROGRESS'
      )
      if (pendingTasks.length > 0) {
        console.log('Auto-refreshing tasks...', pendingTasks.map(t => `${t.id}:${t.status}`))
        fetchTaskStatus()
      }
    }, 2000) // 更频繁的轮询：2秒而不是3秒
    return () => clearInterval(interval)
  }, [tasks])

  const testAPI = async () => {
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      setDebugInfo(JSON.stringify(data, null, 2))
    } catch (error) {
      setDebugInfo(`API测试失败: ${error}`)
    }
  }

  const testImagine = async () => {
    try {
      const response = await fetch('/api/test-imagine', { method: 'POST' })
      const data = await response.json()
      setDebugInfo(JSON.stringify(data, null, 2))
    } catch (error) {
      setDebugInfo(`Imagine测试失败: ${error}`)
    }
  }

  const testFetch = async () => {
    try {
      const response = await fetch('/api/test-fetch')
      const data = await response.json()
      setDebugInfo(JSON.stringify(data, null, 2))
    } catch (error) {
      setDebugInfo(`Fetch测试失败: ${error}`)
    }
  }

  const addTestTask = async () => {
    try {
      const response = await fetch('/api/add-test-task', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
        // 添加测试任务到本地状态
        const newTask: MidjourneyTask = {
          id: data.taskId,
          prompt: 'a red apple, simple, clean background',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setTasks(prev => [newTask, ...prev])
        setDebugInfo('测试任务已添加，请点击"手动刷新状态"查看结果')
      } else {
        setDebugInfo(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      setDebugInfo(`添加测试任务失败: ${error}`)
    }
  }

  const debugTasks = async () => {
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      setDebugInfo(JSON.stringify(data, null, 2))
    } catch (error) {
      setDebugInfo(`调试失败: ${error}`)
    }
  }

  const testWebhookUrl = async () => {
    try {
      const response = await fetch('/api/test-webhook-url')
      const data = await response.json()
      setDebugInfo(JSON.stringify(data, null, 2))
      
      // 测试WebHook后自动刷新任务状态
      console.log('Auto-refreshing tasks after webhook test...')
      await fetchTaskStatus()
    } catch (error) {
      setDebugInfo(`WebHook测试失败: ${error}`)
    }
  }

  const forceRefreshAll = async () => {
    await fetchTaskStatus(true)
  }

  const refreshImage = async (taskId: string) => {
    try {
      const response = await fetch('/api/refresh-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      
      const data = await response.json()
      
      if (data.success && data.task) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? data.task : task
        ))
        setDebugInfo('图像URL已刷新')
      } else {
        setDebugInfo(`刷新失败: ${data.message}`)
      }
    } catch (error) {
      setDebugInfo(`刷新图像失败: ${error}`)
    }
  }

  return (
    <div className="container">
      <h1 style={{ 
        textAlign: 'center', 
        color: 'white', 
        fontSize: '2.5rem', 
        marginBottom: '2rem',
        fontWeight: 'bold'
      }}>
        Midjourney 图像生成器
      </h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">提示词</label>
            <textarea
              className="form-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想要生成的图像..."
              required
            />
          </div>

          <div className="grid">
            <div className="form-group">
              <label className="form-label">生成模式</label>
              <select 
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value as 'fast' | 'relax')}
              >
                <option value="fast">快速模式</option>
                <option value="relax">放松模式</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">长宽比</label>
              <select 
                className="form-select"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
              >
                <option value="1:1">正方形 (1:1)</option>
                <option value="16:9">横屏 (16:9)</option>
                <option value="9:16">竖屏 (9:16)</option>
                <option value="4:3">标准横屏 (4:3)</option>
                <option value="3:4">标准竖屏 (3:4)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">模型</label>
              <select 
                className="form-select"
                value={model}
                onChange={(e) => setModel(e.target.value as 'midjourney' | 'niji')}
              >
                <option value="midjourney">Midjourney</option>
                <option value="niji">Niji (动漫风格)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">质量</label>
              <select 
                className="form-select"
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
              >
                <option value="draft">草稿模式</option>
                <option value="standard">标准质量</option>
                <option value="high">高质量</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">风格化程度: {stylize}</label>
              <input
                type="range"
                className="form-input"
                min="0"
                max="1000"
                step="25"
                value={stylize}
                onChange={(e) => setStylize(parseInt(e.target.value))}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading || !prompt.trim()}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {isLoading ? '提交中...' : '生成图像'}
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => fetchTaskStatus()}
            >
              刷新进行中任务
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={forceRefreshAll}
            >
              强制刷新所有任务
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={testAPI}
            >
              测试API连接
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={() => window.open('/docs', '_blank')}
              style={{ background: '#059669' }}
            >
              📚 API文档
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={testImagine}
            >
              测试Imagine接口
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={testFetch}
            >
              测试Fetch接口
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={addTestTask}
            >
              添加测试任务
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={debugTasks}
            >
              查看所有任务
            </button>
            <button 
              type="button"
              className="btn btn-primary"
              onClick={testWebhookUrl}
            >
              测试WebHook
            </button>
          </div>
        </form>
      </div>

      {tasks.length > 0 && (
        <div>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.5rem' }}>
            生成任务
          </h2>
          <div className="grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className={`task-status status-${task.status.toLowerCase()}`}>
                    {task.status === 'PENDING' ? '等待中' :
                     task.status === 'IN_PROGRESS' ? '生成中' :
                     task.status === 'SUCCESS' ? '完成' : '失败'}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {task.id.substring(0, 8)}...
                    </span>
                    {task.imageUrl && (
                      <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                        {task.imageType === 'grid' ? `${task.imageCount}张图片网格` :
                         task.imageType === 'upscaled' ? '放大图片' :
                         task.imageType === 'single' ? '单张图片' : '未知类型'}
                      </span>
                    )}
                  </div>
                </div>
                
                <p style={{ marginBottom: '12px', fontSize: '14px', color: '#374151' }}>
                  {task.prompt}
                </p>

                {task.status === 'IN_PROGRESS' && task.progress !== undefined && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                )}

                {task.imageUrl && (
                  <>
                    <ImageViewer
                      taskId={task.id}
                      imageUrl={task.imageUrl}
                      alt={task.prompt}
                      className="task-image"
                      onError={() => {
                        console.log('Image load failed, will retry on next refresh')
                        // 当图像加载失败时，将任务状态改回IN_PROGRESS以触发重新获取
                        if (task.status === 'SUCCESS') {
                          setTasks(prev => prev.map(t => 
                            t.id === task.id ? { ...t, status: 'IN_PROGRESS' as const } : t
                          ))
                        }
                      }}
                    />
                    
                    {/* 调试信息：显示attachments和buttons */}
                    {(task.attachments || task.buttons) && (
                      <details style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>调试信息</summary>
                        <div style={{ marginTop: '4px', padding: '4px', background: '#f9fafb', borderRadius: '4px' }}>
                          {task.attachments && (
                            <div>
                              <strong>Attachments ({task.attachments.length}):</strong>
                              <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                                {task.attachments.map((att, i) => (
                                  <li key={i}><a href={att.url} target="_blank" rel="noopener noreferrer">{att.url.substring(0, 50)}...</a></li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {task.buttons && task.buttons.length > 0 && (
                            <div>
                              <strong>Buttons ({task.buttons.length}):</strong>
                              <div style={{ margin: '4px 0' }}>
                                {JSON.stringify(task.buttons, null, 2)}
                              </div>
                            </div>
                          )}
                        </div>
                      </details>
                    )}
                  </>
                )}

                {task.status === 'FAILURE' && task.failReason && (
                  <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '8px' }}>
                    失败原因: {task.failReason}
                  </p>
                )}

                {task.status === 'SUCCESS' && (
                  <button 
                    onClick={() => refreshImage(task.id)}
                    style={{
                      marginTop: '12px',
                      padding: '6px 12px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    刷新图像
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {debugInfo && (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '20px', 
          marginTop: '32px',
          maxHeight: '400px',
          overflow: 'auto'
        }}>
          <h3 style={{ marginBottom: '16px' }}>调试信息</h3>
          <pre style={{ 
            fontSize: '12px', 
            background: '#f3f4f6', 
            padding: '12px', 
            borderRadius: '6px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {debugInfo}
          </pre>
          <button 
            onClick={() => setDebugInfo('')}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            清除调试信息
          </button>
        </div>
      )}
    </div>
  )
}