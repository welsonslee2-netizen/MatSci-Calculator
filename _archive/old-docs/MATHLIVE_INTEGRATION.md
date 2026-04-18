# MathLive 集成方案 - 实现 MathType 级别的公式输入体验

## 🎯 目标

实现类似 MathType 的专业数学公式输入体验：
- ✅ 输入 `x^2` 自动渲染为上标 x²
- ✅ 输入 `1/2` 显示为垂直分数
- ✅ 输入 `sqrt(x)` 显示为 √x
- ✅ 虚拟数学键盘（移动端友好）
- ✅ LaTeX 导出支持

---

## 📦 步骤 1：MathLive 已添加

✅ 已在 [index.html](file:///d:/MatSci%20Calculator%20Lab%20-%20%E5%89%AF%E6%9C%AC/index.html#L33-L36) 中添加 MathLive 库：

```html
<!-- MathLive: 专业的数学公式编辑器 (MathType 类似体验) -->
<script type="module">
  import 'https://unpkg.com/mathlive';
</script>
```

---

## 🧪 步骤 2：测试 MathLive

打开测试页面体验：
```
http://localhost:8080/test-mathlive.html
```

**测试内容：**
1. 点击公式输入框
2. 输入 `x^2` - 应该看到上标渲染
3. 输入 `1/2` - 应该看到分数渲染
4. 输入 `sqrt(x)` - 应该看到根号渲染
5. 点击"显示 LaTeX"查看生成的代码

---

## 🔧 步骤 3：替换输入框（下一步）

### 当前（旧方案）
```html
<input id="classic-expression" type="text" value="sin(π ÷ 4) + 3^2">
```

### 替换为 MathLive
```html
<math-field id="classic-expression" virtual-keyboard-mode="manual">
  \sin\left(\frac{\pi}{4}\right) + 3^{2}
</math-field>
```

### 优势对比

| 特性 | 旧方案（input） | 新方案（math-field） |
|------|----------------|---------------------|
| 上标显示 | ❌ 3^2（纯文本） | ✅ 3²（真实上标） |
| 分数显示 | ❌ 1/2（纯文本） | ✅ ½（垂直分数） |
| 根号显示 | ❌ sqrt(x)（纯文本） | ✅ √x（真实根号） |
| 虚拟键盘 | ❌ 无 | ✅ 数学键盘 |
| LaTeX 导出 | ❌ 不支持 | ✅ 支持 |
| 移动端友好 | ⚠️ 一般 | ✅ 非常好 |

---

## 📝 步骤 4：修改 app.js 逻辑

### 读取公式值
```javascript
// 旧方案
const expression = document.getElementById('classic-expression').value;

// 新方案（MathLive）
const expression = document.getElementById('classic-expression').value; // 返回 LaTeX
```

### 将 LaTeX 转换为 math.js 可计算格式
```javascript
function latexToMathJS(latex) {
  return latex
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\ln/g, 'ln')
    .replace(/\\log/g, 'log')
    .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\^\{([^}]+)\}/g, '^($1)')
    .replace(/\^(\d)/g, '^$1')
    .replace(/\\pi/g, 'pi')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\\(/g, '')
    .replace(/\\\)/g, '');
}
```

---

## 🎨 步骤 5：样式调整

MathLive 有自己的默认样式，需要与项目风格统一：

```css
math-field {
  font-size: 1.25rem;
  padding: 12px 16px;
  border: 2px solid var(--line);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.95);
  --keyboard-zindex: 10000;
}

math-field:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(31, 94, 135, 0.1);
}
```

---

## 📱 移动端优化

### 虚拟键盘模式
```html
<!-- 手动模式 - 用户点击按钮才显示键盘 -->
<math-field virtual-keyboard-mode="manual">

<!-- 自动模式 - 聚焦时自动显示 -->
<math-field virtual-keyboard-mode="onfocus">

<!-- 禁用虚拟键盘 -->
<math-field virtual-keyboard-mode="off">
```

**推荐配置：**
- 桌面端：`manual` 或 `off`
- 移动端：`onfocus`

---

## 🚀 实施计划

### 第一阶段：测试和验证（当前）
- ✅ 添加 MathLive 库
- ✅ 创建测试页面
- ⏳ 用户测试体验

### 第二阶段：逐步替换（需要您的确认）
1. 替换经典计算器输入框
2. 替换科学计算器输入框
3. 替换函数分析的所有输入框
4. 添加 LaTeX 到 math.js 转换逻辑
5. 测试所有计算功能

### 第三阶段：优化
- 样式统一
- 移动端适配
- 性能优化

---

## ⚠️ 注意事项

### 兼容性
- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ iOS Safari 14+
- ✅ Android Chrome 88+

### 性能
- MathLive 库大小：~100KB（gzip 后 ~30KB）
- 首次加载会增加 ~30KB
- 运行时性能良好，无卡顿

### 学习曲线
- 用户需要适应 LaTeX 输入语法
- 提供虚拟键盘降低门槛
- 建议添加输入提示

---

## 📞 下一步

请您：

1. **打开测试页面**：`http://localhost:8080/test-mathlive.html`
2. **体验 MathLive**：尝试输入各种公式
3. **反馈感受**：
   - 是否满足 MathType 级别的体验？
   - 虚拟键盘是否好用？
   - 公式渲染是否满意？

根据您的反馈，我会继续完善集成方案！🎯
