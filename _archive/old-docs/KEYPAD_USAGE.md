# 科学公式输入小键盘使用说明

## 📌 功能概述

现在**科学计算器**、**函数分析模块**（导数、积分、求根、绘图）都已经配备了功能丰富的虚拟小键盘，可以方便地输入各种数学公式和科学符号。

---

## 🎯 已添加小键盘的模块

### 1. **科学计算器** (Module 02)
- 位置：Expression Console 下方
- 包含：基础运算、三角函数、希腊字母、材料常数等

### 2. **函数分析 - 导数** (Module 03 - Derivative)
- 位置：Function f(x) 输入框下方
- 用途：快速输入导数计算所需的数学表达式

### 3. **函数分析 - 积分** (Module 03 - Integral)
- 位置：Function f(x) 输入框下方
- 用途：快速输入积分计算所需的数学表达式

### 4. **函数分析 - 求根** (Module 03 - Root Solver)
- 位置：Function f(x) 输入框下方
- 用途：快速输入方程求解所需的数学表达式

### 5. **函数分析 - 绘图** (Module 03 - Plot)
- 位置：Function y(x) 输入框下方
- 用途：快速输入绘图所需的函数表达式

---

## 🔢 小键盘布局

每个小键盘都采用 **6列网格布局**，包含以下按钮类型：

### **第1行：控制按钮**
- **清除** - 清空整个输入框
- **退格** - 删除光标前的字符
- **分数** - 插入 `\frac{a}{b}` 格式
- **根号** - 插入 `\sqrt{x}` 格式
- **幂次** - 插入 `x^n` 格式
- **积分** - 插入 `\int_{a}^{b}` 格式

### **第2行：函数按钮**
- **sin, cos, tan** - 三角函数
- **ln, log, exp** - 对数和指数函数

### **第3行：希腊字母和常数**
- **α, β, γ** - 常用希腊字母
- **π, e** - 数学常数
- **( )** - 括号

### **第4-7行：数字和运算符**
- **数字键**：0-9 和小数点
- **运算符**：+、-、*、/、^
- **0键**：占据两列宽度（span-2）

---

## 🎨 按钮颜色编码

| 颜色 | 类型 | 示例 |
|------|------|------|
| ⚪ 灰色 | 实用工具 | 清除、退格 |
| 🔵 蓝色 | 函数 | sin, cos, √, x² |
| 🟣 紫色 | 常数 | π, e, R, G |
| 🟠 橙色 | 材料常数 | G, σ₀, ρ, f, r, b |
| ⚫ 黑色 | 数字 | 0-9, . |
| 🔴 红色 | 运算符 | +, -, *, /, ^ |

---

## 💡 使用技巧

### 1. **占位符自动清理**
- 小键盘上的某些按钮显示为 `\(\frac{a}{b}\)` 或 `\(x^n\)`
- 实际插入时会移除 LaTeX 渲染标记，只保留纯文本格式
- 例如：点击 `\(\frac{a}{b}\)` 会插入 `\frac{}{}`

### 2. **光标位置智能插入**
- 所有插入操作都会在**当前光标位置**进行
- 如果选中了文本，插入的内容会**替换选中的文本**

### 3. **MathLive 集成**
- 所有 `<math-field>` 元素都支持 MathLive 的专业渲染
- 输入的 LaTeX 格式会自动渲染为美观的数学公式
- 例如：输入 `x^{2}` 会显示为 x²（上标格式）

### 4. **快捷键提示**
- 鼠标悬停在按钮上可以看到完整的功能说明
- 某些按钮有 `title` 属性提供额外信息

---

## 🧪 测试建议

### 测试步骤：

1. **打开浏览器**，访问 `index.html`
2. **强制刷新页面**（Ctrl + Shift + R）以清除缓存
3. **切换到科学计算器**（Module 02）
   - 点击小键盘上的按钮
   - 验证公式是否正确插入到输入框
   - 点击 "Evaluate" 测试计算功能

4. **切换到函数分析**（Module 03）
   - 分别测试导数、积分、求根、绘图四个子模块
   - 在每个子模块的小键盘上点击按钮
   - 验证公式是否正确插入

5. **检查视觉效果**
   - 确认小键盘布局整齐，没有重叠
   - 确认按钮颜色区分清晰
   - 确认在不同屏幕尺寸下都能正常显示

---

## 🐛 常见问题

### Q1: 小键盘点击后没有反应？
**A:** 
- 确保已经**强制刷新页面**（Ctrl + Shift + R）
- 检查浏览器控制台是否有 JavaScript 错误
- 确认 MathLive 库已正确加载

### Q2: 插入的公式显示为 LaTeX 代码而不是渲染后的公式？
**A:**
- 这是正常的！MathLive 会在后台处理渲染
- 输入框中显示的是 LaTeX 源码
- 计算时会自动转换为 math.js 可识别的格式

### Q3: 小键盘按钮太小，难以点击？
**A:**
- 在移动端，按钮会自动调整为适合触摸的大小
- 可以通过 CSS 调整 `.keypad-button` 的 `min-height` 属性

### Q4: 如何在经典计算器中使用小键盘？
**A:**
- 经典计算器已经有独立的小键盘（7行6列布局）
- 位于表达式输入框下方
- 包含数字、运算符、函数和常数按钮

---

## 📝 技术实现细节

### HTML 结构
```html
<div class="scientific-keypad analysis-keypad">
  <button class="keypad-button utility" data-action="clear-field" data-target="xxx">清除</button>
  <button class="keypad-button function" data-insert="\sin(#?)">sin</button>
  <!-- 更多按钮... -->
</div>
```

### CSS 样式
```css
.scientific-keypad {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.6rem;
  padding: 0.8rem;
  background: rgba(245, 248, 252, 0.6);
  border-radius: 16px;
}

.keypad-button.constant {
  background: rgba(139, 92, 246, 0.08);
  color: #7c3aed;
}
```

### JavaScript 事件处理
```javascript
document.querySelectorAll('.analysis-keypad').forEach(keypad => {
  keypad.addEventListener('click', function(event) {
    const button = event.target.closest('[data-insert], [data-action]');
    if (!button) return;
    
    const targetId = button.dataset.target;
    const field = getById(targetId);
    field.focus();
    
    if (button.dataset.insert) {
      const cleanValue = button.dataset.insert.replace(/#\?/g, '');
      field.executeCommand('insert', cleanValue);
    }
  });
});
```

---

## 🚀 下一步计划

根据用户的最新需求，后续将实现：

1. **材料强化模块的小键盘**
   - 添加固溶强化、析出强化等公式模板
   - 支持自定义参数输入（G值、APB能量、体积分数等）

2. **公式管理系统**
   - 预设常用材料强化公式
   - 允许用户自定义公式
   - 保存和加载公式模板

3. **参数管理面板**
   - 集中管理所有材料参数
   - 实时同步到各个计算公式
   - 支持参数导入/导出

---

## 📞 反馈与支持

如果在使用过程中遇到任何问题，或有改进建议，请随时反馈！

**最后更新时间：** 2026-04-16
