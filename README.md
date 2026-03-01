# 港股智通 (HK-Elite Insight)

专业港股IPO专家Agent，为内地企业家提供港股上市一站式服务。

## 功能特性

- 🤖 **AI智能分析** - 基于GPT-4的港股通体检和招股书分析
- 📊 **港股通体检** - 输入公司信息，AI评估入通可行性
- 📄 **招股书分析** - AI解读招股书核心要点
- 💳 **会员服务** - 订阅制会员，尊享全部特权

## 技术栈

- **前端**: Next.js 14 + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **AI**: Azure OpenAI (GPT-4)
- **部署**: Vercel

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
hk-elite-insight/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── health-check/      # 港股通体检页面
│   ├── ipo-analysis/      # 招股书分析页面
│   ├── profile/           # 个人中心页面
│   └── membership/        # 会员中心页面
├── public/                # 静态资源
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## 环境变量

在项目根目录创建 `.env.local` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4
```

## 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

## 许可证

MIT License
