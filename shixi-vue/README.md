# 股票预测系统前端（Vue 3 + Vite）

最小化环境要求，开箱即用，开发同伴只需 Node.js 与一个终端即可开始。

## 快速开始

1) 安装依赖
```sh
npm ci
```

2) 本地开发
```sh
npm run dev
```
默认端口：8080（已在 `vite.config.js` 指定）。浏览器会自动打开。

3) 生产构建
```sh
npm run build
```

4) 预览构建
```sh
npm run preview
```

## 零配置依赖

- 图标与图表通过 CDN 自动注入：在 `index.html` 中已包含 Iconify 与 ECharts CDN，无需本地安装也可运行。
- Tailwind + DaisyUI 已在 `vite.config.js` 和 `tailwind.config.js` 配置好，无需单独步骤。

## 目录结构

- 应用入口：`src/main.js`
- 路由：`src/router/index.js`
- 视图：`src/views/*`
- 组件：`src/components/*`

## 环境变量

如需自定义端口或后端接口，创建 `.env.local`（已在 `.gitignore` 忽略）：
```
VITE_PORT=8080
VITE_API_BASE=https://api.example.com
```

## 常见问题

- 端口被占用：修改 `vite.config.js` 中的 `server.port` 或设置 `VITE_PORT`。
- 无法访问图标/图表 CDN：切换网络或暂时本地安装 `echarts`，并在 `MarketOverview.vue` 里按需导入。

## 开发规范

- 统一用 Vue 3 组合式 API。
- 路由新增请在 `src/router/index.js` 注册，并创建对应 `src/views/xxx.vue`。

## 版本要求

- Node.js：`^20.19.0 || >=22.12.0`（见 `package.json`）

