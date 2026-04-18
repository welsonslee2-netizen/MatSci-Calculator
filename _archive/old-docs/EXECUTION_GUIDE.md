# 🚀 MatSci Calculator Lab - 测试与完善执行指南

## 📋 总体策略

**核心原则**: 先保证功能正确性，再优化用户体验，最后考虑性能和安全。

**预计时间**: 3-5天完整测试周期

---

## 📅 Day 1: 自动化测试 + 核心功能验证

### 上午（2-3小时）

#### 步骤1: 运行自动化测试套件
```bash
# 1. 在浏览器中打开 test-suite.html
# 文件路径: d:\MatSci Calculator Lab - 副本\test-suite.html

# 2. 点击 "运行全部测试" 按钮
# 3. 记录所有失败的测试项
```

**预期输出**: 
- ✅ 数据完整性检查应全部通过
- ✅ 数学函数验证应全部通过
- ⚠️ UI组件可能有部分失败（如果DOM未完全加载）

#### 步骤2: 运行浏览器控制台诊断
```javascript
// 1. 打开 index.html
// 2. 按 F12 打开开发者工具
// 3. 切换到 Console 标签
// 4. 复制 quick-test.js 的全部内容并粘贴执行

// 或者直接在Console中输入:
load('quick-test.js')  // 如果支持
```

**检查重点**:
- [ ] 所有模块是否正确加载
- [ ] 数学计算结果是否准确
- [ ] 强化模型是否正常工作
- [ ] 是否有JavaScript错误

#### 步骤3: 记录问题
打开 `BUG_TRACKER.md`，为每个发现的问题创建条目：

```markdown
### 问题 #001
- **发现日期**: 2026-04-16
- **模块**: 科学计算器
- **严重程度**: 🔴高
- **状态**: ⏳ 待确认
- **描述**: sin(π/2) 计算结果不为1
- **复现步骤**: 
  1. 打开科学计算器
  2. 输入表达式: sin(pi/2)
  3. 点击 Evaluate
- **预期行为**: 结果应为 1
- **实际行为**: 结果显示 0.9999999999999999
- **环境**: Chrome 120, Windows 11
```

---

### 下午（3-4小时）

#### 步骤4: 经典计算器手动测试

按照 `TESTING_PLAN.md` 中的"经典计算器"章节逐项测试：

**快速检查清单**:
```
□ 基础四则运算 (2+3, 10-4, 6×7, 15÷3)
□ 运算优先级 (2+3×4 应等于 14)
□ DEG/RAD 切换
□ 三角函数 (sin, cos, tan)
□ 对数函数 (ln, log)
□ 幂运算 (x^y, x², √x)
□ 特殊功能 (n!, |x|, 1/x, %)
□ 常数插入 (π, e)
□ Clear 和 Backspace
□ 括号匹配
□ 错误处理 (除以零等)
```

**测试技巧**:
- 使用已知答案的简单算式验证
- 尝试边界值（极大数、极小数）
- 测试连续操作（不清空直接输入新表达式）

#### 步骤5: 科学计算器测试

**关键测试用例**:
```javascript
// 在表达式框中测试以下公式:

1. 基础表达式
   (3.2e3 * sin(pi / 4)) / (R * 298)
   预期: ≈ 0.913086

2. 嵌套函数
   sqrt(log10(1000) + ln(e^2))
   预期: ≈ 2.236

3. 复杂运算
   Na * kB * 298
   预期: ≈ 2478.9 J/mol

4. 科学计数法
   1.5e-10 * 6.022e23
   预期: ≈ 9.033e13
```

**验证历史记录**:
- [ ] 每次计算后出现在历史列表
- [ ] 点击 "Reuse" 能回填表达式
- [ ] Clear 能清空历史

---

## 📅 Day 2: 高级功能测试

### 上午（3小时）

#### 步骤6: 函数分析模块测试

**导数测试**:
```
输入: f(x) = x^3 - 4*x + 1
测试点: x = 2
预期: f'(2) = 3*(2^2) - 4 = 8
实际操作: 
  1. 切换到 Derivative Tab
  2. 输入表达式和x值
  3. 点击 Compute
  4. 检查结果是否接近 8
```

**积分测试**:
```
输入: ∫₀¹ e^(-x²) dx
子区间: 400
预期: ≈ 0.7468
注意: 这是高斯积分，无解析解，数值解应接近误差函数值
```

**求根测试**:
```
方程: x³ - x - 2 = 0
初始猜测: x₀=1, x₁=2
预期根: x ≈ 1.5214
验证: 将根代入原方程，结果应接近0
```

**绘图测试**:
```
函数: y = sin(x) * exp(-0.1*x²)
范围: x ∈ [-8, 8]
点数: 240
检查:
  □ Plotly图表正常显示
  □ 可以缩放和平移
  □ 曲线光滑无断点
  □ 坐标轴标签正确
```

#### 步骤7: 常数库测试

**搜索功能**:
```
测试用例:
1. 搜索 "Avogadro" → 应显示阿伏伽德罗常数
2. 搜索 "N_A" → 应显示相同结果
3. 搜索 "Na" (别名) → 应显示相同结果
4. 搜索不存在的词 → 显示空状态提示
```

**分类筛选**:
```
□ All - 显示全部10个常数
□ Mathematical - 只显示 pi, e
□ Physical - 显示物理常数
□ Thermodynamic - 显示气体常数、玻尔兹曼常数
```

**操作功能**:
```
□ Copy value - 点击后Toast提示，粘贴验证
□ Use in calculator - 点击后跳转到科学计算器并填入
```

---

### 下午（3-4小时）

#### 步骤8: 元素库测试

**Library视图**:
```
□ 18个元素卡片全部显示
□ 每个卡片显示: 原子序数、符号、名称、晶体结构
□ 悬停有视觉反馈
□ 点击卡片切换到Detail视图
```

**搜索测试**:
```
1. 搜索 "Fe" → 显示 Iron
2. 搜索 "Iron" 或 "铁" → 显示 Iron
3. 搜索 "BCC" → 显示所有BCC结构元素
4. 搜索 "superalloy" → 显示相关元素
```

**Detail视图**:
```
选择一个元素（如Fe），检查:
□ 所有属性正确显示
□ 中英文切换正常
□ Compare A/B 按钮可点击
□ 点击后Compare视图更新
```

**Compare视图**:
```
1. 设置 Slot A = Fe
2. 设置 Slot B = Ni
3. 检查对比表格:
   □ 两列并排显示
   □ 所有属性对齐
   □ 差异明显可见
4. 点击 Clear 清空
```

#### 步骤9: 材料强化模型测试

**Hall-Petch模型**:
```
默认值测试:
  σ₀ = 180 MPa
  k_y = 0.7 MPa·m^0.5
  d = 12 μm
  
手动计算验证:
  d_m = 12 × 10^-6 m
  Δσ_HP = 0.7 / √(12e-6) ≈ 202.07 MPa
  σ_y = 180 + 202.07 ≈ 382.07 MPa
  
检查UI显示是否一致
```

**单位切换测试**:
```
晶粒尺寸:
  □ 12 μm = 0.012 mm = 1.2e-5 m = 12000 nm
  □ 切换单位后重新计算，结果应一致

应力单位:
  □ 180 MPa = 0.18 GPa
  □ 切换后结果应一致
```

**其他三个模型**:
```
□ Dislocation - 验证默认值计算
□ Cutting - 验证默认值计算 + Plotly图表
□ Orowan - 验证默认值计算 + Plotly图表

Comparison视图:
  □ 汇总表格显示四种机制
  □ 柱状图清晰对比
  □ 数据与各模型单独计算一致
```

**边界条件**:
```
尝试无效输入:
  □ 负的应力值 → 应报错
  □ 体积分数 ≥ 1 → 应报错
  □ 泊松比 > 0.49 → 应报错
  □ 零或负的晶粒尺寸 → 应报错
```

---

## 📅 Day 3: 可视化 + 响应式 + 跨浏览器

### 上午（3小时）

#### 步骤10: 可视化实验室测试

**参数扫描**:
```
1. 选择 Hall-Petch grain size
2. 设置范围: 2-80, 60个样本
3. 点击 Update Visuals
4. 检查 Sweep Plot:
   □ 曲线平滑
   □ 坐标轴标签正确
   □ 图例清晰
```

**滑动条联动**:
```
□ Radius slider: 移动时读数实时更新
□ Spacing slider: 移动时读数实时更新
□ 改变后点击 Update Visuals 图表更新
```

**Schematic视图**:
```
□ SVG示意图正常渲染
□ 改变Radius slider，示意图中圆圈大小变化
□ 改变Spacing slider，间距变化
□ 视觉效果直观易懂
```

#### 步骤11: 全局功能测试

**导航系统**:
```
桌面端:
  □ 侧边栏点击切换页面
  □ URL hash同步更新
  □ 浏览器前进/后退正常

移动端 (<1080px):
  □ 底部导航栏显示
  □ 点击切换页面
  □ 当前页面对应按钮高亮
```

**语言切换**:
```
1. 点击 EN/中文 切换
2. 检查所有UI文本:
   □ 导航菜单
   □ 按钮标签
   □ 表单标签
   □ 提示信息
3. 检查数据字段:
   □ 元素名称
   □ 常数描述
   □ 备注信息
4. 刷新页面，语言应保持
```

**Scratchpad工作区**:
```
1. 从常数库添加几个常数
2. 从元素库添加几个元素
3. 检查Home页和Strengthening页:
   □ 项目正确显示
   □ 点击Clear清空
```

---

### 下午（3-4小时）

#### 步骤12: 响应式布局测试

**Chrome DevTools设备模拟**:
```
1. 按 F12 打开开发者工具
2. 点击设备切换图标 (Ctrl+Shift+M)
3. 测试以下预设:

桌面端:
  □ 1920×1080 (Full HD)
  □ 1366×768 (常见笔记本)
  □ 1280×720 (小屏幕桌面)

平板端:
  □ iPad Pro (1024×1366)
  □ iPad Air (820×1180)
  □ Surface Pro (912×1368)

手机端:
  □ iPhone 14 Pro (393×852)
  □ Samsung Galaxy S20 (360×800)
  □ Pixel 5 (393×851)
```

**检查要点**:
```
每个断点检查:
  □ 无水平滚动条（除非有意设计）
  □ 文字不换行错位
  □ 按钮可点击（不小于44×44px）
  □ 输入框宽度合适
  □ 图表自适应容器
  □ 导航易用
```

**关键断点验证**:
```css
/* 在styles.css中定义的断点 */
1280px - 模块卡片从5列变为3列
1080px - 侧边栏折叠，底部导航出现
820px  - 单列布局，Tab横向滚动
560px  - 超小屏幕优化
```

#### 步骤13: 跨浏览器测试

**必须测试的浏览器**:
```
1. Chrome/Edge (Chromium内核)
   - 最新版本
   - 检查DevTools Console无错误

2. Firefox
   - 最新版本
   - 特别注意CSS Grid兼容性

3. Safari (如有Mac设备)
   - macOS Safari
   - iOS Safari (真机最佳)
   - 注意-webkit前缀
```

**快速兼容性检查**:
```javascript
// 在每个浏览器的Console中运行:
console.log('User Agent:', navigator.userAgent);
console.log('MSCLab loaded:', !!window.MSCLab);
console.log('math.js loaded:', !!window.math);
console.log('Plotly loaded:', !!window.Plotly);
console.log('MathJax loaded:', !!window.MathJax);

// 运行 quick-test.js 对比结果
```

**已知兼容性问题**:
```
⚠️ Safari可能的问题:
  - backdrop-filter支持不佳（降级为纯色背景）
  - CSS Grid gap需要-webkit前缀
  - Date.toLocaleString格式不同

⚠️ Firefox可能的问题:
  - clip-path语法差异
  - scroll-behavior需要prefix

⚠️ 移动端通用:
  - 100vh包含地址栏 → 使用100dvh
  - 触摸事件延迟 → 使用touch-action: manipulation
  - 软键盘弹出挤压布局 → 测试输入框聚焦
```

---

## 📅 Day 4-5: 问题修复 + 回归测试

### Day 4: 集中修复

#### 优先级排序
```
🔴 高优先级（今天必须修复）:
  - 计算结果错误
  - 应用崩溃或白屏
  - 主要功能不可用
  - 数据丢失

🟡 中优先级（本周内修复）:
  - UI布局错乱
  - 次要功能异常
  - 性能问题
  - 浏览器兼容性

🟢 低优先级（后续优化）:
  - 视觉细节
  - 文案优化
  - 边缘场景
```

#### 修复流程
```
1. 在 BUG_TRACKER.md 中选择一个问题
2. 定位代码位置
3. 修改代码
4. 保存并刷新浏览器
5. 验证修复
6. 更新Bug状态为 ✅已修复
7. 记录解决方案
```

#### 常见修复示例

**问题: 数学计算错误**
```javascript
// 错误代码
const result = ky / Math.sqrt(grainSize);  // grainSize单位是μm

// 修复
const grainSizeMeters = grainSize * 1e-6;  // 转换为米
const result = ky / Math.sqrt(grainSizeMeters);
```

**问题: UI元素重叠**
```css
/* 错误代码 */
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
}

/* 修复 */
.container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);  /* 防止溢出 */
}
```

**问题: 移动端导航不显示**
```css
/* 检查媒体查询 */
@media (max-width: 1080px) {
  .mobile-nav {
    display: grid;  /* 确保生效 */
  }
  
  .sidebar-nav-block {
    display: none;  /* 隐藏桌面导航 */
  }
}
```

---

### Day 5: 回归测试 + 最终验证

#### 步骤14: 全面回归测试
```
重新运行 Day 1-3 的所有测试用例
确保:
  □ 已修复的问题不再复现
  □ 修复未引入新问题
  □ 所有模块正常工作
```

#### 步骤15: 性能基准测试
```javascript
// 在Console中运行:

// 1. 页面加载时间
performance.mark('start');
location.reload();
// 页面加载完成后:
performance.mark('end');
performance.measure('load', 'start', 'end');
const measures = performance.getEntriesByName('load');
console.log('Load time:', measures[0].duration, 'ms');

// 2. 内存使用
if (performance.memory) {
  console.log('JS Heap:', 
    (performance.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
}

// 3. 图表渲染时间
console.time('Plotly render');
// 触发一次绘图
document.getElementById('plot-run').click();
// 等待完成后查看时间
```

**性能目标**:
```
□ 首次加载 < 3秒（良好网络）
□ 页面切换 < 500ms
□ 图表渲染 < 1秒
□ 内存占用 < 100MB
□ 无内存泄漏（长时间使用后内存稳定）
```

#### 步骤16: 最终检查清单

```markdown
## 发布前检查清单

### 功能完整性
- [ ] 所有7个模块正常工作
- [ ] 所有计算结果准确
- [ ] 错误处理友好
- [ ] 数据持久化（如已实现）

### 用户体验
- [ ] 导航流畅
- [ ] 加载状态提示
- [ ] 错误提示清晰
- [ ] Toast反馈及时

### 视觉设计
- [ ] 所有页面布局正确
- [ ] 颜色对比度足够
- [ ] 字体大小可读
- [ ] 动画流畅

### 响应式
- [ ] 桌面端 (>1280px) ✓
- [ ] 平板端 (820-1280px) ✓
- [ ] 手机端 (<820px) ✓
- [ ] 超小屏幕 (<560px) ✓

### 兼容性
- [ ] Chrome/Edge ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] 移动浏览器 ✓

### 性能
- [ ] 加载时间达标
- [ ] 无内存泄漏
- [ ] 滚动流畅
- [ ] 图表渲染快速

### 代码质量
- [ ] Console无错误
- [ ] Console无警告（理想）
- [ ] 代码注释清晰
- [ ] 变量命名规范

### 文档
- [ ] README.md 最新
- [ ] TESTING_PLAN.md 完成
- [ ] BUG_TRACKER.md 更新
- [ ] 已知问题记录
```

---

## 🎯 成功标准

### 最小可行产品 (MVP)
```
✅ 所有计算结果准确
✅ 无严重bug（崩溃、数据错误）
✅ 主流浏览器可用
✅ 移动端基本可用
```

### 推荐发布标准
```
✅ MVP标准 +
✅ 所有测试用例通过率 ≥ 90%
✅ 无明显UI问题
✅ 性能指标达标
✅ 跨浏览器兼容
```

### 优秀标准
```
✅ 推荐标准 +
✅ 所有测试用例通过率 ≥ 95%
✅ 性能优异
✅ 无障碍访问支持
✅ 完善的错误处理
✅ 详细的文档
```

---

## 📞 遇到问题怎么办？

### 调试技巧
```javascript
// 1. 打印调试信息
console.log('Variable value:', variable);
console.table(object);  // 表格形式显示对象
console.trace();  // 打印调用栈

// 2. 断点调试
debugger;  // 代码中插入，DevTools会暂停

// 3. 监控DOM变化
const observer = new MutationObserver(callback);
observer.observe(element, { childList: true, subtree: true });

// 4. 监听事件
element.addEventListener('click', (e) => {
  console.log('Clicked:', e.target);
}, true);  // 捕获阶段
```

### 寻求帮助
```
1. 查阅 MDN Web Docs: https://developer.mozilla.org/
2. Stack Overflow: https://stackoverflow.com/
3. 各库官方文档:
   - math.js: https://mathjs.org/
   - Plotly: https://plotly.com/javascript/
   - MathJax: https://www.mathjax.org/
4. 浏览器兼容性: https://caniuse.com/
```

---

## 📝 每日总结模板

```markdown
## Day X 工作总结

### 日期: 2026-04-XX

### 完成事项
1. 
2. 
3. 

### 发现的问题
- 问题 #XXX: [简述]
- 问题 #XXX: [简述]

### 已修复的问题
- 问题 #XXX: [简述及解决方案]

### 遇到的困难
- 
- 

### 明日计划
1. 
2. 
3. 

### 备注
- 
```

---

**祝您测试顺利！有任何问题随时记录在 BUG_TRACKER.md 中。** 🚀
