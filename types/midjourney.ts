export interface MidjourneyTask {
  id: string;
  prompt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE';
  imageUrl?: string;
  progress?: number;
  failReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MidjourneyRequest {
  prompt: string;
  mode?: 'fast' | 'relax';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  model?: 'midjourney' | 'niji';
  quality?: 'draft' | 'standard' | 'high';
  stylize?: number;
}

export interface MidjourneyResponse {
  code: number;
  description: string;
  result?: string; // task id
}