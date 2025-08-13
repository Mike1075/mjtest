'use client'

export default function DocsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Midjourney API 文档</h1>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            返回首页
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* API Overview */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              API 概述
            </h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              这个API服务允许你通过HTTP请求调用Midjourney图像生成功能。所有请求都需要使用JSON格式，响应也是JSON格式。
            </p>
            <div style={{
              background: '#f1f5f9',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <strong>Base URL:</strong> <code>{typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}</code>
            </div>
          </section>

          {/* Authentication */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              认证
            </h2>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>
              目前API暂不需要认证，但建议在生产环境中添加API密钥认证机制。
            </p>
          </section>

          {/* Endpoints */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              API 端点
            </h2>

            {/* Generate Image */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>生成图像</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{
                    background: '#059669',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    POST
                  </span>
                  <code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    /api/v1/generate
                  </code>
                </div>
              </div>
              
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: '#374151' }}>请求参数</h4>
                <div style={{ overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>参数</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>类型</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>必填</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>prompt</code></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>string</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>是</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>图像描述文本</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>mode</code></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>string</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>否</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>生成模式: "fast" | "relax" (默认: "fast")</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>aspectRatio</code></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>string</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>否</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>"1:1" | "16:9" | "9:16" | "4:3" | "3:4" (默认: "1:1")</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>model</code></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>string</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>否</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>"midjourney" | "niji" (默认: "midjourney")</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>quality</code></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>string</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>否</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>"draft" | "standard" | "high" (默认: "standard")</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>stylize</code></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>number</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>否</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>风格化程度 0-1000 (默认: 100)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 style={{ color: '#374151', marginTop: '2rem' }}>请求示例</h4>
                <pre style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.9rem'
                }}>
{`curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/generate" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "一只可爱的小猫",
    "mode": "fast",
    "aspectRatio": "1:1",
    "model": "midjourney",
    "quality": "standard",
    "stylize": 100
  }'`}
                </pre>

                <h4 style={{ color: '#374151', marginTop: '2rem' }}>响应示例</h4>
                <pre style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.9rem'
                }}>
{`{
  "success": true,
  "taskId": "1755049329434652",
  "message": "任务已提交，请使用taskId查询进度"
}`}
                </pre>
              </div>
            </div>

            {/* Check Status */}
            <div style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#f8fafc',
                padding: '1rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>查询任务状态</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <span style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    GET
                  </span>
                  <code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    /api/v1/status/&#123;taskId&#125;
                  </code>
                </div>
              </div>
              
              <div style={{ padding: '1rem' }}>
                <h4 style={{ color: '#374151' }}>请求示例</h4>
                <pre style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.9rem'
                }}>
{`curl -X GET "${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/status/1755049329434652"`}
                </pre>

                <h4 style={{ color: '#374151', marginTop: '2rem' }}>响应示例</h4>
                <pre style={{
                  background: '#1e293b',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '0.9rem'
                }}>
{`{
  "success": true,
  "task": {
    "id": "1755049329434652",
    "prompt": "一只可爱的小猫",
    "status": "SUCCESS",
    "progress": 100,
    "imageUrl": "https://example.com/image.png",
    "imageType": "grid",
    "imageCount": 4,
    "buttons": [
      {"label": "U1", "customId": "MJ::JOB::upsample::1::..."},
      {"label": "U2", "customId": "MJ::JOB::upsample::2::..."},
      // ...更多按钮
    ],
    "createdAt": "2025-08-13T01:42:09.434Z",
    "updatedAt": "2025-08-13T01:42:44.977Z"
  }
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Status Codes */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              状态码说明
            </h2>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>状态</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>描述</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>PENDING</code></td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>任务等待处理</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>IN_PROGRESS</code></td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>任务正在生成中</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>SUCCESS</code></td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>任务完成，图像生成成功</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}><code>FAILURE</code></td>
                    <td style={{ padding: '0.75rem', border: '1px solid #e2e8f0' }}>任务失败</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SDK Examples */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              SDK 示例
            </h2>
            
            <h3 style={{ color: '#374151', marginTop: '2rem' }}>JavaScript/Node.js</h3>
            <pre style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`async function generateImage(prompt) {
  // 提交任务
  const response = await fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: prompt,
      mode: 'fast',
      aspectRatio: '1:1'
    })
  });
  
  const result = await response.json();
  const taskId = result.taskId;
  
  // 轮询查询状态
  while (true) {
    const statusResponse = await fetch(\`${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/status/\${taskId}\`);
    const statusResult = await statusResponse.json();
    
    if (statusResult.task.status === 'SUCCESS') {
      return statusResult.task.imageUrl;
    } else if (statusResult.task.status === 'FAILURE') {
      throw new Error('Generation failed');
    }
    
    // 等待2秒后再次查询
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}`}
            </pre>

            <h3 style={{ color: '#374151', marginTop: '2rem' }}>Python</h3>
            <pre style={{
              background: '#1e293b',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.9rem'
            }}>
{`import requests
import time

def generate_image(prompt):
    # 提交任务
    response = requests.post('${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/generate', json={
        'prompt': prompt,
        'mode': 'fast',
        'aspectRatio': '1:1'
    })
    
    result = response.json()
    task_id = result['taskId']
    
    # 轮询查询状态
    while True:
        status_response = requests.get(f'${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/status/{task_id}')
        status_result = status_response.json()
        
        if status_result['task']['status'] == 'SUCCESS':
            return status_result['task']['imageUrl']
        elif status_result['task']['status'] == 'FAILURE':
            raise Exception('Generation failed')
        
        # 等待2秒后再次查询
        time.sleep(2)`}
            </pre>
          </section>

          {/* Rate Limits */}
          <section>
            <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              使用限制
            </h2>
            <ul style={{ color: '#64748b', lineHeight: '1.6' }}>
              <li>每个任务的生成时间通常在30-60秒</li>
              <li>建议轮询间隔为2-3秒</li>
              <li>请避免过于频繁的API调用</li>
              <li>生成的图片默认为4张图片的网格，可以使用buttons中的U1-U4进行单独放大</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}