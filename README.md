# Chat Generator (情话生成器)

一个基于 React + Vite 的情话生成器，使用 OpenAI API 生成个性化的情话。

## 功能特点

- 支持输入关键词生成情话
- 多种情话风格选择
- 支持自定义 OpenAI API 配置
- 响应式设计
- 一键复制生成结果

## 技术栈

- React 18
- TypeScript
- Vite
- Chakra UI
- Axios
- OpenAI API

## 本地开发

1. 克隆项目：

```bash
git clone [repository-url]
cd chat-generator
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

4. 在浏览器中打开 `http://localhost:5173`

## 配置说明

首次使用时，需要配置 OpenAI API：

1. 点击右上角的设置图标
2. 输入 OpenAI Base URL（默认为 https://api.openai.com）
3. 输入你的 OpenAI API Key

配置信息会保存在浏览器的 localStorage 中。

## 部署

项目可以轻松部署到 Vercel：

1. Fork 本项目到你的 GitHub
2. 在 Vercel 中导入项目
3. 部署完成后即可使用

## 使用说明

1. 在关键词输入框中输入多个关键词（用逗号分隔）
2. 选择想要的情话风格
3. 输入对方的名字
4. 点击"生成情话"按钮
5. 等待生成结果
6. 可以点击"复制"按钮复制生成的情话

## 许可证

MIT
