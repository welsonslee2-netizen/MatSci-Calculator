# MatSci Calculator Lab — 项目记忆

## 项目概述
- 材料科学计算器，目标发布 Android/iOS App
- 7 大模块：经典/科学计算器、函数分析、常数/元素库、强化模型、可视化实验室
- 技术栈：Vite + MathLive + math.js + Plotly + MathJax + Capacitor

## 关键技术决策
- **构建工具**：Vite（v6.4.2），配置 `vite.config.js`
- **App 方案**：Capacitor（v6.1），Web → 原生壳
- **入口文件**：`main.js`（统一导入所有依赖和模块）
- **分包策略**：vendor-plotly / vendor-mathjs / vendor-mathlive 独立分包
- **MathJax**：仍通过动态 script 标签加载（CDN），其余依赖已本地化

## MathLive 集成要点（重要踩坑记录）
- `<math-field>` Web Component：`value` 属性读写 LaTeX，`setValue()`/`getValue()` 可带格式参数
- **不要用** `getValue()` + `setValue()` 拼接字符串来插入内容！这会破坏 LaTeX 结构（把 `\\frac{}{}` 变成纯文本）
- **正确方式**：`field.executeCommand('insert', latexString)` — 保持数学结构完整
- **删除**：`field.executeCommand('deleteBackward')` / `field.executeCommand('deleteAll')`
- **HTML 属性注意**：`data-insert` 中用单反斜杠 `\frac`，**不要**用双反斜杠 `\\frac`（HTML 属性不会反转义）
- **占位符**：`#0` 是 MathLive 的 placeholder 语法，`executeCommand('insert', '\frac{#0}{#0}')` 会创建可编辑占位符
- **函数按钮模式**：使用 `\sin\left(#0\right)` 而非 `sin(` — 纯文本不是有效 LaTeX，MathLive 会作为普通文字处理
- **history 回填**：需要同时保存原始 LaTeX 和 math.js 表达式，回填 math-field 时用 LaTeX
- `latexToMathJS()` 转换函数：处理分数/根号/幂次/函数/常数/隐式乘法/科学常数，需维护

## 内置科学常数
- math.js baseScope 已包含：pi, e, Na, kB, h, hbar, R, eCharge, c, epsilon0, me, sigmaSB
- latexToMathJS 支持的 LaTeX→math.js 常数转换：\pi, \hbar, \varepsilon_{0}, \sigma_{SB}, e_{Charge}, k_{B}, N_{A}, m_{e}（含 \mathrm{} 格式）
- normalizeExpression 需保持与 latexToMathJS 一致（双路径转换）

## 符号计算引擎
- **nerdamer v1.1.13**：通过 jsDelivr CDN 动态加载（与 MathJax 相同方式）
- 加载顺序：nerdamer.core.js → Algebra.js → Calculus.js → Solve.js
- 不支持 ES module import（UMD 格式），必须用 script 标签加载
- API：nerdamer.diff(expr, var, order), nerdamer.integrate(expr, var, lower, upper), nerdamer.solve(equation, var)
- latexToNerdamer() 转换函数在 app.js 中，独立于 latexToMathJS

## 环境信息
- Node.js v20.18.0（路径：`C:\Users\Administrator\.workbuddy\binaries\node\versions\20.18.0.installing.13140\node-v20.18.0-win-x64`，已添加到用户 PATH）
- npm 10.8.2
- 项目目录：`d:\MatSci Calculator Lab`
- 构建产物：`dist/`

## App 打包与部署
- **Capacitor 配置**：`capacitor.config.json`，appId `com.matsci.calculator`，webDir `dist`
- **CDN 已全部本地化**：Google Fonts → @fontsource，nerdamer → npm 包，MathJax → npm 包
- **iOS 构建**：通过 GitHub Actions 云构建（macOS runner），workflow 文件 `.github/workflows/build-ios.yml`
- **自动脚本**：`github-auth.bat` 用于 gh CLI 登录 + 仓库创建 + 代码推送
- **Windows 限制**：`cap add ios` 必须在 macOS 上执行，本地无法创建 ios/ 目录

## 文件结构
- `main.js` — Vite 入口，管理依赖初始化顺序
- `app.js` — 主业务逻辑（~136KB），用 bootstrapApp IIFE 包装
- `data/constants.js`, `data/elements.js`, `data/strengthening-formulas.js` — 数据
- `modules/utils.js`, `modules/models.js`, `modules/custom-formula-manager.js` — 功能模块
- `_archive/` — 历史文件归档（57个文件，不影响运行）
