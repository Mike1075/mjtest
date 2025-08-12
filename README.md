# Midjourney 图像生成器

基于 Next.js 开发的 Midjourney API 网页客户端，支持通过网页界面生成 AI 图像。

## 功能特性

- ✨ 简洁易用的网页界面
- 🎨 支持多种 Midjourney 参数配置
  - 生成模式：快速模式 / 放松模式
  - 长宽比：正方形、横屏、竖屏等多种选择
  - 模型选择：Midjourney / Niji (动漫风格)
  - 质量设置：草稿 / 标准 / 高质量
  - 风格化程度调节
- 📊 实时任务进度追踪
- 🖼️ 自动显示生成结果
- 🔄 支持 WebHook 回调通知

## 技术栈

- **前端**: Next.js 14 + TypeScript + React
- **后端**: Next.js API Routes
- **样式**: CSS Modules
- **部署**: Vercel

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Mike1075/mjtest.git
cd mjtest
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env.local` 并配置必要的环境变量：

```bash
cp .env.example .env.local
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

## API 接口说明

### 提交生成任务
- `POST /api/midjourney/imagine`
- 提交图像生成任务，返回任务 ID

### 查询任务状态
- `POST /api/task/status`
- 查询任务执行状态和结果

### WebHook 回调
- `POST /api/webhook`
- 接收 Midjourney 服务的任务状态更新

## 项目结构

```
├── app/
│   ├── api/           # API 路由
│   ├── globals.css    # 全局样式
│   ├── layout.tsx     # 根布局
│   └── page.tsx       # 主页面
├── lib/
│   ├── midjourney.ts  # Midjourney API 客户端
│   └── storage.ts     # 任务状态管理
├── types/
│   └── midjourney.ts  # TypeScript 类型定义
└── vercel.json        # Vercel 部署配置
```

## 使用说明

1. 在提示词输入框中描述要生成的图像
2. 选择合适的生成参数（模式、长宽比、模型等）
3. 点击"生成图像"按钮提交任务
4. 等待生成完成，结果会自动显示在页面下方

## 许可证

MIT License