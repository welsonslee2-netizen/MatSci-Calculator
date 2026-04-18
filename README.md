# MatSci Calculator Lab

一款面向材料科学领域的科学计算器，集成公式编辑、函数分析、常数/元素数据库、材料强化模型计算与可视化。

## 项目结构

```
MatSci Calculator Lab/
├── index.html              # 主应用入口
├── main.js                 # Vite 入口（依赖管理 + 模块加载）
├── styles.css              # 全局样式与响应式布局
├── app.js                  # UI 交互、事件处理、渲染逻辑
├── vite.config.js          # Vite 构建配置
├── package.json            # 依赖与脚本
├── README.md
│
├── data/                   # 数据模块
│   ├── constants.js        # 数学/物理/热力学常数库
│   ├── elements.js         # 材料科学元素数据库
│   └── strengthening-formulas.js  # 强化公式库（Hall-Petch/Orowan 等）
│
├── modules/                # 功能模块
│   ├── utils.js            # 工具函数（格式化、剪贴板、MathJax 辅助）
│   ├── models.js           # 计算模型（强化公式、数值方法）
│   └── custom-formula-manager.js  # 自定义公式管理器
│
└── dist/                   # 构建产物（Vite build 输出）
```

## 功能模块

| 模块 | 说明 |
|------|------|
| 经典计算器 | 符号优先小键盘，DEG/RAD 切换 |
| 科学计算器 | 表达式求值、公式编辑（MathLive）、LaTeX/MathML 导出、OCR 公式识别 |
| 函数分析 | 数值求导、定积分、方程求根、函数绘图 |
| 常数库 | 可搜索的数学/物理/热力学常数 |
| 元素库 | 材料科学元素数据库，支持对比 |
| 材料强化 | Hall-Petch、位错、切割、Orowan 强化模型计算与对比 |
| 可视化实验室 | 参数扫描、机制对比、析出间距示意图 |

## 技术栈

- **构建工具**：[Vite](https://vitejs.dev/) — 快速开发 + 生产构建
- **App 打包**：[Capacitor](https://capacitorjs.com/) — Web → Android/iOS 原生壳
- **公式编辑**：[MathLive](https://cortexjs.io/mathlive/) — 类 MathType 体验
- **数学计算**：[math.js](https://mathjs.org/) + 自写数值方法
- **公式渲染**：[MathJax](https://www.mathjax.org/) (tex-svg)
- **图表可视化**：[Plotly.js](https://plotly.com/javascript/)
- **响应式**：4 个断点（1280/1080/820/560px），支持移动端底部导航
- **国际化**：中英双语切换

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（热更新）
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview
```

## 发布 Android/iOS App

```bash
# 初始化 Capacitor
npm run cap:init

# 添加 Android 平台
npm run cap:add:android

# 构建后同步到原生项目
npm run build && npm run cap:sync

# 在 Android Studio 中打开
npm run cap:open:android

# iOS 同理
npm run cap:add:ios
npm run cap:open:ios
```

## 构建产物分包

| 文件 | 大小 | 说明 |
|------|------|------|
| vendor-plotly.js | ~4.7 MB | Plotly 图表库 |
| vendor-mathlive.js | ~0.8 MB | MathLive 公式编辑器 |
| vendor-mathjs.js | ~0.6 MB | math.js 计算引擎 |
| index.js | ~0.1 MB | 业务代码 |
| index.css | ~0.03 MB | 样式 |
