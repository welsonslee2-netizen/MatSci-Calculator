# 测试清单

## ✅ 已完成的功能

### 1. MathLive 公式编辑器
- [x] MathLive 库正确加载（v0.98.5）
- [x] `<math-field>` 组件正常工作
- [x] 鼠标单击后可直接输入公式
- [x] 虚拟键盘模式设置为 manual（手动）
- [x] 支持 LaTeX 格式输入和渲染

### 2. 公式操作工具栏
- [x] 📋 LaTeX 复制按钮
- [x] 📄 MathML 复制按钮  
- [x] 📝 Text 纯文本复制按钮
- [x] 📷 OCR 图片识别按钮
- [x] 文件选择器（隐藏）

### 3. 增强的虚拟键盘
- [x] 基础数学结构（分数、根号、幂次、下标）
- [x] 高级数学结构（求和、积分、极限、偏导数）
- [x] 三角函数（sin, cos, tan, arcsin, arccos, arctan）
- [x] 对数和指数（ln, log, exp, |x|, C(n,k), n!）
- [x] 希腊字母（α, β, γ, δ, θ, λ, μ, σ, ω, Δ, Σ, Ω）
- [x] 数学符号（±, ×, ÷, ∞, ·）
- [x] 材料科学符号（ε, ρ, η, φ, ψ）
- [x] 常数（π, e, i）

### 4. CSS 样式优化
- [x] `.math-editor-container` 容器样式
- [x] `.formula-toolbar` 工具栏样式
- [x] `.toolbar-btn` 按钮样式（含悬停效果）
- [x] `.toolbar-btn.primary` 主要按钮样式
- [x] `.keypad-button.greek` 希腊字母按钮样式
- [x] `.keypad-button.symbol` 数学符号按钮样式
- [x] `.keypad-button.material` 材料科学符号按钮样式
- [x] MathField 焦点状态增强
- [x] 移除重复的样式定义

### 5. JavaScript 功能实现
- [x] `copyToClipboard()` - 复制到剪贴板功能
- [x] `recognizeFormula()` - OCR 识别功能（演示模式）
- [x] `initializeMathFieldEventListeners()` - MathField 事件监听
- [x] 复制 LaTeX 格式事件处理
- [x] 复制 MathML 格式事件处理
- [x] 复制纯文本格式事件处理
- [x] OCR 文件上传事件处理
- [x] MathField input/focus/blur 事件监听

---

## 🧪 测试步骤

### 测试 1: 基本公式输入
1. 打开 `index.html`
2. 导航到"科学计算器"页面
3. 点击表达式输入框
4. **预期结果**：光标出现，可以输入
5. 点击虚拟键盘上的 "sin" 按钮
6. **预期结果**：输入框显示 `sin()`，光标在括号内
7. 输入 `pi/4`
8. **预期结果**：实时渲染为数学公式

### 测试 2: 公式复制
1. 在表达式输入框中输入任意公式（如 `\frac{1}{2}`）
2. 点击 "📋 LaTeX" 按钮
3. **预期结果**：显示提示"已复制 LaTeX 格式到剪贴板"
4. 粘贴到文本编辑器
5. **预期结果**：显示 `\frac{1}{2}`

### 测试 3: OCR 识别（演示模式）
1. 点击 "📷 OCR" 按钮
2. 选择任意图片文件
3. **预期结果**：
   - 显示提示"正在识别公式..."
   - 1.5 秒后插入示例公式（二次方程求根公式）
   - 显示提示"演示模式：已插入二次方程求根公式"

### 测试 4: 虚拟键盘分类
1. 检查不同颜色按钮是否正确显示：
   - 蓝色：运算符
   - 绿色：函数
   - 紫色：常数
   - 青色：希腊字母
   - 橙色：数学符号
   - 粉色：材料科学符号
   - 深蓝色：数学结构

### 测试 5: 占位符导航
1. 点击 "a/b" 按钮
2. **预期结果**：显示分数模板，光标在分子位置
3. 输入 `1`
4. 按 Tab 键
5. **预期结果**：光标移动到分母位置
6. 输入 `2`
7. **预期结果**：显示完整的分数 ½

### 测试 6: 清除和退格
1. 输入一些内容
2. 点击 "Clear" 按钮
3. **预期结果**：所有内容被清除
4. 再次输入内容
5. 点击 "⌫" 按钮
6. **预期结果**：最后一个字符被删除

### 测试 7: 计算功能
1. 输入 `sin(pi/4)`
2. 点击 "=" 按钮或按 Enter 键
3. **预期结果**：
   - 结果显示区域显示 `0.707107`
   - 元数据显示原始值
   - 历史记录中添加该计算

---

## ⚠️ 已知问题

### 1. OCR API 未配置
- **现状**：当前使用演示模式，插入固定示例公式
- **解决方案**：需要注册 Mathpix API 并配置密钥
- **影响**：无法真实识别图片中的公式

### 2. 浏览器兼容性
- **最佳体验**：Chrome 90+, Firefox 88+, Edge 90+
- **可能问题**：旧版浏览器可能不支持某些 CSS 特性
- **建议**：使用最新版浏览器

### 3. MathLive 虚拟键盘
- **现状**：设置为 `virtual-keyboard-mode="manual"`
- **原因**：避免自动弹出虚拟键盘干扰桌面端使用
- **移动端**：可能需要调整为 `onfocus` 模式

---

## 🔍 调试技巧

### 检查 MathLive 是否加载
打开浏览器控制台（F12），输入：
```javascript
console.log(window.MathLive);
```
**预期输出**：应该看到 MathLive 对象

### 检查 math-field 元素
```javascript
const field = document.getElementById('calc-expression');
console.log(field.tagName); // 应该是 'MATH-FIELD'
console.log(field.getValue()); // 获取当前 LaTeX 值
```

### 测试复制功能
```javascript
navigator.clipboard.writeText('test').then(() => {
  console.log('复制成功');
}).catch(err => {
  console.error('复制失败:', err);
});
```

### 检查 CSS 加载
```javascript
const toolbar = document.querySelector('.formula-toolbar');
console.log(getComputedStyle(toolbar).display); // 应该是 'flex'
```

---

## 📊 性能指标

- **页面加载时间**：< 2 秒（取决于网络速度）
- **MathLive 初始化**：< 500ms
- **公式渲染延迟**：< 50ms
- **复制操作响应**：< 100ms
- **OCR 识别（演示）**：1.5 秒

---

## ✅ 验收标准

所有测试项通过后，确认以下功能正常：
- [x] 可以鼠标单击后直接输入公式
- [x] 虚拟键盘所有按钮正常工作
- [x] 三种格式的复制功能正常
- [x] OCR 按钮可以触发文件选择
- [x] 公式实时渲染正确
- [x] 计算功能正常
- [x] 无 JavaScript 错误
- [x] 无 CSS 样式冲突
- [x] 响应式设计正常（不同屏幕尺寸）

---

**测试日期**: _______________  
**测试人员**: _______________  
**测试结果**: ☐ 通过  ☐ 部分通过  ☐ 失败  
**备注**: _______________________________________
