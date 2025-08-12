import axios from 'axios'

const MIDJOURNEY_API_URL = 'https://mj.superdafee.uk'
const API_KEY = 'uhak4zo7vnxk63rxczd0qlah77r62uxc'

export const midjourneyClient = axios.create({
  baseURL: MIDJOURNEY_API_URL,
  headers: {
    'mj-api-secret': API_KEY,
    'Content-Type': 'application/json'
  }
})

export interface ImagineRequest {
  prompt: string
  mode?: string
  aspectRatio?: string
  model?: string
  quality?: string
  stylize?: number
}

export interface ImagineResponse {
  code: number
  description: string
  result?: string
}

export interface TaskResponse {
  code: number
  description: string
  result?: {
    id: string
    status: string
    imageUrl?: string
    progress?: number
    failReason?: string
  }
}

export async function submitImagineTask(request: ImagineRequest): Promise<ImagineResponse> {
  try {
    let fullPrompt = request.prompt

    if (request.aspectRatio && request.aspectRatio !== '1:1') {
      fullPrompt += ` --ar ${request.aspectRatio}`
    }

    if (request.model === 'niji') {
      fullPrompt += ' --niji'
    }

    if (request.quality === 'draft') {
      fullPrompt += ' --q 0.25'
    } else if (request.quality === 'high') {
      fullPrompt += ' --q 2'
    }

    if (request.stylize && request.stylize !== 100) {
      fullPrompt += ` --s ${request.stylize}`
    }

    const notifyHook = process.env.VERCEL_URL ? 
      `https://${process.env.VERCEL_URL}/api/webhook` : 
      'https://mjtest.vercel.app/api/webhook'
    
    console.log('Submitting imagine task:', { prompt: fullPrompt, notifyHook })
    
    const response = await midjourneyClient.post('/mj/submit/imagine', {
      prompt: fullPrompt,
      notifyHook: notifyHook,
      state: '',
      base64Array: []
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Midjourney API Error: ${error.response?.data?.description || error.message}`)
    }
    throw error
  }
}

export async function fetchTask(taskId: string): Promise<TaskResponse> {
  try {
    const response = await midjourneyClient.get(`/mj/task/${taskId}/fetch`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Midjourney API Error: ${error.response?.data?.description || error.message}`)
    }
    throw error
  }
}