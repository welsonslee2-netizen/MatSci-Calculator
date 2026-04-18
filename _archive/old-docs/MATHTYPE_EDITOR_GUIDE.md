# MathType 公式编辑器使用指南

## 📋 概述

这是一个功能完整的 **MathType 式公式编辑器**，提供类似 MathType 的专业数学公式编辑体验。

**文件位置：** `mathtype-editor.html`

---

## 🎯 核心功能

### 1. **分类工具栏**（10个分类标签页）

| 分类 | 图标 | 内容 | 模板数量 |
|------|------|------|---------|
| **代数** | 🔢 | 分数、根号、幂次、组合数、阶乘等 | 16个 |
| **微积分** | ∫ | 积分、求和、极限、导数、梯度等 | 12个 |
| **三角函数** | 📐 | sin, cos, tan, 反三角函数, 双曲函数 | 12个 |
| **希腊字母** | αβ | α-ω 小写，Γ-Ω 大写 | 30个 |
| **符号** | ± | 运算符、关系符、集合符号等 | 22个 |
| **箭头** | → | 各种方向的箭头符号 | 12个 |
| **矩阵** | ▦ | 矩阵、行列式、分段函数 | 6个 |
| **集合** | ∈ | 数集（ℕ,ℤ,ℚ,ℝ,ℂ）、集合运算 | 14个 |
| **逻辑** | ∧ | 逻辑运算符、量词、推理符号 | 10个 |
| **物理** | ⚛ | 物理常数、向量、导数符号 | 10个 |

**总计：144个数学模板**

---

### 2. **公式编辑区**

- 使用 **MathLive** 引擎，支持实时 LaTeX 渲染
- 点击模板自动插入到光标位置
- 支持键盘直接输入 LaTeX 代码
- 自动格式化和语法高亮

---

### 3. **输出面板**（4种格式）

#### 📋 LaTeX 代码
```latex
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```
- 标准的 LaTeX 数学公式代码
- 可直接复制到论文、Markdown 文档中使用

#### 🔧 MathML 代码
```xml
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mfrac>
    <mrow>
      <mo>-</mo>
      <mi>b</mi>
      <mo>±</mo>
      ...
    </mrow>
    <mrow>
      <mn>2</mn>
      <mi>a</mi>
    </mrow>
  </mfrac>
</math>
```
- MathML 格式，用于网页渲染
- 兼容现代浏览器

#### 📊 ASCII Math
```
(-b ± sqrt(b^2 - 4ac))/(2a)
```
- 简化的 ASCII 格式
- 适合快速输入和纯文本环境

#### 🖼️ 公式图片
- 自动生成 SVG 格式的公式图片
- 右键保存为图片文件
- 可直接插入到 Word、PPT 等文档中

---

### 4. **公式复制功能**

每个输出面板都有 **"复制"** 按钮：

1. 点击按钮 → 自动复制到剪贴板
2. 按钮变为 **"✓ 已复制"**（绿色）
3. 2秒后恢复为 **"复制"**

**支持的复制格式：**
- ✅ LaTeX
- ✅ MathML
- ✅ ASCII Math
- ✅ OCR 识别结果

---

### 5. **图片公式识别（OCR）**

#### 使用步骤：

1. **上传图片**
   - 点击上传区域
   - 或拖拽图片到上传区域

2. **预览图片**
   - 图片会显示在预览区

3. **查看识别结果**
   - OCR 识别出的 LaTeX 代码会显示在结果区
   - 点击"复制"按钮复制 LaTeX 代码

#### 支持的图片格式：
- ✅ PNG
- ✅ JPG/JPEG
- ✅ GIF

#### 推荐的 OCR 服务：

| 服务 | 网址 | 特点 |
|------|------|------|
| **Mathpix** | https://mathpix.com/ | 最准确，收费 |
| **SimpleTex** | https://simpletex.cn/ | 国内可用，免费 |
| **InftyReader** | http://www.inftyproject.org/ | 专业数学 OCR |
| **LaTeX-OCR** | https://github.com/lukas-blecher/LaTeX-OCR | 开源免费 |

---

## 🎨 界面布局

```
┌─────────────────────────────────────────────┐
│  📐 MathType 公式编辑器                      │
│  [🗑️清空] [↩️撤销] [↪️重做]                 │
├─────────────────────────────────────────────┤
│ [🔢代数] [∫微积分] [📐三角] [αβ希腊] ...    │  ← 分类标签
├─────────────────────────────────────────────┤
│  a/b   √x   xⁿ   Σ    ∫   lim              │  ← 模板面板
│  sin   cos   tan   ln   log   exp           │
│  α     β     γ     π    e    i              │
├─────────────────────────────────────────────┤
│  📝 公式编辑区                              │
│  ┌─────────────────────────────────────┐    │
│  │  (实时渲染的公式)                   │    │  ← 编辑区
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  📋 LaTeX 代码           [复制]             │
│  🔧 MathML 代码          [复制]             │  ← 输出面板
│  📊 ASCII Math           [复制]             │
│  🖼️ 公式图片                                │
├─────────────────────────────────────────────┤
│  📷 图片公式识别（OCR）                     │
│  ┌─────────────────────────────────────┐    │
│  │  📤 点击或拖拽图片到此处             │    │  ← OCR 区域
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 💡 使用技巧

### 1. **快速输入分数**

**方法1：使用模板**
1. 切换到"代数"标签页
2. 点击 `a/b` 模板
3. 输入分子
4. 按 `Tab` 键跳到分母
5. 输入分母

**方法2：键盘输入**
```
\frac{分子}{分母}
```

### 2. **嵌套公式**

**示例：二次方程求根公式**

```latex
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```

**操作步骤：**
1. 输入 `x = `
2. 点击 `a/b` 模板
3. 输入 `-b`
4. 点击 `±` 符号（符号分类）
5. 点击 `√x` 模板
6. 输入 `b^2 - 4ac`
7. 按 `Tab` 跳到分母
8. 输入 `2a`

### 3. **使用希腊字母**

**示例：麦克斯韦方程组**

```latex
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
```

**操作步骤：**
1. 切换到"希腊字母"标签页
2. 点击 `∇` (nabla)
3. 切换到"符号"标签页
4. 点击 `·` (cdot)
5. 输入 `\mathbf{E} = `
6. 点击 `a/b` 模板
7. 切换到"希腊字母"
8. 点击 `ρ` (rho)
9. 按 `Tab` 跳到分母
10. 输入 `\varepsilon_0`

### 4. **矩阵输入**

**示例：2×2 矩阵**

```latex
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
```

**操作步骤：**
1. 切换到"矩阵"标签页
2. 点击 `( )` 模板（圆括号矩阵）
3. 输入 `a & b \\ c & d`
   - `&` 分隔列
   - `\\` 分隔行

### 5. **分段函数**

**示例：**

```latex
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
```

**操作步骤：**
1. 输入 `f(x) = `
2. 切换到"矩阵"标签页
3. 点击 `cases` 模板
4. 输入 `x^2 & x \geq 0 \\ -x & x < 0`

---

## ⌨️ 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + Z` | 撤销 |
| `Ctrl + Y` | 重做 |
| `Tab` | 在占位符之间跳转 |
| `Enter` | 换行（在矩阵中） |

---

## 🔧 工具栏按钮

### 🗑️ 清空
- 清空整个公式编辑区
- 同时清空所有输出面板

### ↩️ 撤销
- 撤销上一步操作
- 支持多次撤销

### ↪️ 重做
- 重做已撤销的操作
- 支持多次重做

---

## 📊 模板分类详解

### 1. 代数（Algebra）

| 模板 | LaTeX | 说明 |
|------|-------|------|
| a/b | `\frac{#?}{#?}` | 分数 |
| √x | `\sqrt{#?}` | 平方根 |
| ⁿ√x | `\sqrt[#?]{#?}` | n次根 |
| x² | `^2` | 平方 |
| x³ | `^3` | 立方 |
| xⁿ | `^n` | n次幂 |
| xₙ | `_n` | 下标 |
| C(n,k) | `\binom{n}{k}` | 组合数 |
| n! | `n!` | 阶乘 |
| |x| | `|#?|` | 绝对值 |
| ⌊x⌋ | `\lfloor #? \rfloor` | 向下取整 |
| ⌈x⌉ | `\lceil #? \rceil` | 向上取整 |
| x̄ | `\overline{#?}` | 平均值 |
| x̂ | `\hat{#?}` | 帽子符号 |
| x̃ | `\tilde{#?}` | 波浪符号 |

### 2. 微积分（Calculus）

| 模板 | LaTeX | 说明 |
|------|-------|------|
| ∫ | `\int_{#?}^{#?}` | 定积分 |
| ∬ | `\iint_{#?}^{#?}` | 二重积分 |
| ∭ | `\iiint_{#?}^{#?}` | 三重积分 |
| ∮ | `\oint_{#?}` | 环路积分 |
| Σ | `\sum_{#?}^{#?}` | 求和 |
| Π | `\prod_{#?}^{#?}` | 求积 |
| lim | `\lim_{x \to #?}` | 极限 |
| d/dx | `\frac{d}{dx}` | 导数 |
| ∂/∂x | `\frac{\partial}{\partial x}` | 偏导数 |
| ∇ | `\nabla` | 梯度 |
| ∞ | `\infty` | 无穷大 |
| ∂ | `\partial` | 偏微分 |

### 3. 三角函数（Trigonometry）

| 模板 | LaTeX | 说明 |
|------|-------|------|
| sin | `\sin(#?)` | 正弦 |
| cos | `\cos(#?)` | 余弦 |
| tan | `\tan(#?)` | 正切 |
| cot | `\cot(#?)` | 余切 |
| sec | `\sec(#?)` | 正割 |
| csc | `\csc(#?)` | 余割 |
| asin | `\arcsin(#?)` | 反正弦 |
| acos | `\arccos(#?)` | 反余弦 |
| atan | `\arctan(#?)` | 反正切 |
| sinh | `\sinh(#?)` | 双曲正弦 |
| cosh | `\cosh(#?)` | 双曲余弦 |
| tanh | `\tanh(#?)` | 双曲正切 |

### 4. 希腊字母（Greek Letters）

#### 小写字母（24个）
α β γ δ ε ζ η θ ι κ λ μ ν ξ π ρ σ τ υ φ χ ψ ω

#### 大写字母（7个）
Γ Δ Θ Λ Σ Φ Ψ Ω

### 5. 符号（Symbols）

| 符号 | LaTeX | 说明 |
|------|-------|------|
| ± | `\pm` | 正负 |
| × | `\times` | 乘号 |
| ÷ | `\div` | 除号 |
| · | `\cdot` | 点乘 |
| ≤ | `\leq` | 小于等于 |
| ≥ | `\geq` | 大于等于 |
| ≠ | `\neq` | 不等于 |
| ≈ | `\approx` | 约等于 |
| ≡ | `\equiv` | 恒等于 |
| ∝ | `\propto` | 正比于 |
| ∀ | `\forall` | 任意 |
| ∃ | `\exists` | 存在 |

### 6. 箭头（Arrows）

| 箭头 | LaTeX | 说明 |
|------|-------|------|
| → | `\rightarrow` | 右箭头 |
| ← | `\leftarrow` | 左箭头 |
| ↔ | `\leftrightarrow` | 左右箭头 |
| ⇒ | `\Rightarrow` | 右双线箭头 |
| ⇐ | `\Leftarrow` | 左双线箭头 |
| ⇔ | `\Leftrightarrow` | 双向箭头 |
| ↑ | `\uparrow` | 上箭头 |
| ↓ | `\downarrow` | 下箭头 |
| ↦ | `\mapsto` | 映射 |

### 7. 矩阵（Matrices）

| 模板 | LaTeX | 说明 |
|------|-------|------|
| ( ) | `\begin{pmatrix} ... \end{pmatrix}` | 圆括号矩阵 |
| [ ] | `\begin{bmatrix} ... \end{bmatrix}` | 方括号矩阵 |
| \| \| | `\begin{vmatrix} ... \end{vmatrix}` | 行列式 |
| { } | `\begin{Bmatrix} ... \end{Bmatrix}` | 花括号矩阵 |
| cases | `\begin{cases} ... \end{cases}` | 分段函数 |

### 8. 集合（Sets）

| 符号 | LaTeX | 说明 |
|------|-------|------|
| ℕ | `\mathbb{N}` | 自然数集 |
| ℤ | `\mathbb{Z}` | 整数集 |
| ℚ | `\mathbb{Q}` | 有理数集 |
| ℝ | `\mathbb{R}` | 实数集 |
| ℂ | `\mathbb{C}` | 复数集 |
| ∈ | `\in` | 属于 |
| ⊂ | `\subset` | 子集 |
| ∪ | `\cup` | 并集 |
| ∩ | `\cap` | 交集 |
| ∅ | `\emptyset` | 空集 |

### 9. 逻辑（Logic）

| 符号 | LaTeX | 说明 |
|------|-------|------|
| ∧ | `\land` | 逻辑与 |
| ∨ | `\lor` | 逻辑或 |
| ¬ | `\neg` | 逻辑非 |
| ⇒ | `\implies` | 蕴含 |
| ⇔ | `\iff` | 当且仅当 |
| ∀ | `\forall` | 全称量词 |
| ∃ | `\exists` | 存在量词 |
| ∴ | `\therefore` | 所以 |
| ∵ | `\because` | 因为 |

### 10. 物理（Physics）

| 符号 | LaTeX | 说明 |
|------|-------|------|
| ℏ | `\hbar` | 约化普朗克常数 |
| ° | `\degree` | 度 |
| x⃗ | `\vec{#?}` | 向量 |
| ẋ | `\dot{#?}` | 时间导数 |
| ẍ | `\ddot{#?}` | 二阶时间导数 |

---

## 🎯 实际应用示例

### 示例1：二次方程求根公式

**目标公式：**
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

**操作步骤：**
1. 输入 `x = `
2. 切换到"代数"标签
3. 点击 `a/b` 模板
4. 输入 `-b`
5. 切换到"符号"标签
6. 点击 `±`
7. 切换到"代数"标签
8. 点击 `√x` 模板
9. 输入 `b^2 - 4ac`
10. 按 `Tab` 跳到分母
11. 输入 `2a`

**LaTeX 代码：**
```latex
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
```

---

### 示例2：高斯积分

**目标公式：**
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

**操作步骤：**
1. 切换到"微积分"标签
2. 点击 `∫` 模板
3. 输入 `-`
4. 切换到"符号"标签
5. 点击 `∞`
6. 按 `Tab` 跳到上限
7. 点击 `∞`
8. 输入 ` e^{-x^2} dx = `
9. 切换到"代数"标签
10. 点击 `√x` 模板
11. 切换到"希腊字母"标签
12. 点击 `π`

**LaTeX 代码：**
```latex
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
```

---

### 示例3：麦克斯韦方程组

**目标公式：**
$$\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}$$

**操作步骤：**
1. 切换到"微积分"标签
2. 点击 `∇`
3. 切换到"符号"标签
4. 点击 `·`
5. 输入 `\mathbf{E} = `
6. 切换到"代数"标签
7. 点击 `a/b` 模板
8. 切换到"希腊字母"标签
9. 点击 `ρ`
10. 按 `Tab` 跳到分母
11. 输入 `\varepsilon_0`

**LaTeX 代码：**
```latex
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
```

---

### 示例4：分段函数

**目标公式：**
$$f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}$$

**操作步骤：**
1. 输入 `f(x) = `
2. 切换到"矩阵"标签
3. 点击 `cases` 模板
4. 输入 `x^2 & x \geq 0 \\ -x & x < 0`
   - 第一个 `&` 前是函数表达式
   - 第一个 `&` 后是条件
   - `\\` 分隔第二行

**LaTeX 代码：**
```latex
f(x) = \begin{cases} x^2 & x \geq 0 \\ -x & x < 0 \end{cases}
```

---

### 示例5：矩阵运算

**目标公式：**
$$\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \begin{pmatrix} 5 \\ 6 \end{pmatrix} = \begin{pmatrix} 17 \\ 39 \end{pmatrix}$$

**操作步骤：**
1. 切换到"矩阵"标签
2. 点击 `( )` 模板
3. 输入 `1 & 2 \\ 3 & 4`
4. 输入 ` `（空格）
5. 再次点击 `( )` 模板
6. 输入 `5 \\ 6`
7. 输入 ` = `
8. 第三次点击 `( )` 模板
9. 输入 `17 \\ 39`

**LaTeX 代码：**
```latex
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \begin{pmatrix} 5 \\ 6 \end{pmatrix} = \begin{pmatrix} 17 \\ 39 \end{pmatrix}
```

---

## 📷 OCR 图片识别集成指南

### 方案1：Mathpix API（推荐）

**优点：**
- ✅ 最准确的数学公式 OCR
- ✅ 支持复杂公式
- ✅ 提供 API

**缺点：**
- ❌ 收费（免费额度有限）

**集成步骤：**

1. 注册 Mathpix 账号：https://mathpix.com/
2. 获取 API Key
3. 在 `mathtype-editor.html` 中添加：

```javascript
async function recognizeFormula(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('options_json', JSON.stringify({
    'convert_to_latex': true
  }));

  const response = await fetch('https://api.mathpix.com/v3/text', {
    method: 'POST',
    headers: {
      'app_id': 'YOUR_APP_ID',
      'app_key': 'YOUR_APP_KEY'
    },
    body: formData
  });

  const data = await response.json();
  return data.text; // LaTeX code
}
```

### 方案2：SimpleTex（国内可用）

**优点：**
- ✅ 免费
- ✅ 国内访问快
- ✅ 中文支持好

**缺点：**
- ❌ 准确率略低于 Mathpix

**网址：** https://simpletex.cn/

### 方案3：LaTeX-OCR（开源）

**优点：**
- ✅ 完全免费
- ✅ 可本地部署
- ✅ 开源代码

**缺点：**
- ❌ 需要 GPU
- ❌ 部署复杂

**GitHub：** https://github.com/lukas-blecher/LaTeX-OCR

---

## 🚀 与主项目集成

### 方法1：在新标签页打开

在主项目的导航栏添加链接：

```html
<a href="mathtype-editor.html" target="_blank">📐 公式编辑器</a>
```

### 方法2：嵌入到主项目

在 `index.html` 中添加一个 iframe：

```html
<iframe src="mathtype-editor.html" 
        style="width: 100%; height: 800px; border: none;">
</iframe>
```

### 方法3：复制公式到主项目

1. 在 MathType 编辑器中编辑公式
2. 点击"复制"按钮（LaTeX 格式）
3. 粘贴到主项目的输入框中
4. MathLive 会自动渲染

---

##  自定义主题

### 修改颜色方案

在 `mathtype-editor.html` 的 `<style>` 部分修改：

```css
/* 主色调 */
.title-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 改为红色主题 */
.title-bar {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

/* 改为绿色主题 */
.title-bar {
  background: linear-gradient(135deg, #26de81 0%, #20bf6b 100%);
}
```

### 修改字体大小

```css
#formula-editor {
  font-size: 24px; /* 调整公式大小 */
}

.template-item {
  font-size: 24px; /* 调整模板显示大小 */
}
```

---

## 🐛 常见问题

### Q1: 点击模板后没有反应？

**A:** 
- 确保页面已完全加载
- 检查浏览器控制台是否有错误
- 尝试刷新页面（Ctrl + F5）

### Q2: 公式显示不正确？

**A:**
- 检查 LaTeX 语法是否正确
- 确保所有括号都匹配
- 使用输出面板查看 LaTeX 代码

### Q3: 复制按钮不工作？

**A:**
- 确保浏览器支持 Clipboard API
- 使用 HTTPS 或 localhost 访问
- 手动选择文本复制（Ctrl + C）

### Q4: OCR 功能无法使用？

**A:**
- OCR 功能需要集成第三方 API
- 参考"OCR 图片识别集成指南"部分
- 目前显示的是提示信息

### Q5: 如何保存公式？

**A:**
- **LaTeX 代码：** 点击"复制"按钮，粘贴到文本文件
- **公式图片：** 右键点击图片，选择"保存图片"
- **MathML 代码：** 点击"复制"按钮，保存为 `.mml` 文件

---

## 📚 学习资源

### LaTeX 数学公式教程

- [Overleaf LaTeX 教程](https://www.overleaf.com/learn/latex/Mathematical_expressions)
- [LaTeX Math Symbols](https://en.wikibooks.org/wiki/LaTeX/Mathematics)
- [Detexify](http://detexify.kirelabs.org/) - 手写识别 LaTeX 符号

### MathLive 文档

- [MathLive GitHub](https://github.com/cortex-js/mathlive)
- [MathLive Commands](https://cortexjs.io/mathlive/reference/commands/)
- [MathLive API](https://cortexjs.io/mathlive/reference/mathfield/)

### 数学公式参考

- [Comprehensive LaTeX Symbol List](https://ctan.org/pkg/comprehensive)
- [The Not So Short Introduction to LaTeX](https://tobi.oetiker.ch/lshort/lshort.pdf)

---

## 📝 版本历史

### v1.0 (2026-04-16)
- ✅ 10个分类标签页
- ✅ 144个数学模板
- ✅ MathLive 公式编辑器
- ✅ 4种输出格式（LaTeX、MathML、ASCII、图片）
- ✅ 复制功能
- ✅ OCR 图片识别框架
- ✅ 撤销/重做功能
- ✅ 响应式设计

---

## 🎯 后续优化计划

### 短期（1-2周）
- [ ] 集成 Mathpix OCR API
- [ ] 添加公式历史记录
- [ ] 添加公式收藏功能
- [ ] 支持公式搜索

### 中期（1-2个月）
- [ ] 添加更多模板分类
- [ ] 支持自定义模板
- [ ] 公式验证和纠错
- [ ] 导出为 Word 格式

### 长期（3-6个月）
- [ ] 协作编辑功能
- [ ] 云端同步
- [ ] 移动端适配
- [ ] 离线使用支持

---

## 📞 反馈与支持

如果在使用过程中遇到任何问题，或有改进建议，请随时反馈！

**文件位置：** `d:\MatSci Calculator Lab - 副本\mathtype-editor.html`

**使用方法：** 直接在浏览器中打开该文件即可使用

---

**最后更新时间：** 2026-04-16  
**版本：** v1.0  
**作者：** MatSci Calculator Lab Team
