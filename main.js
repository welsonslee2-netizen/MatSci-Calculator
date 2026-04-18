/**
 * MatSci Calculator Lab — Vite 入口文件
 * 
 * 统一导入所有本地化依赖，无任何 CDN 引用。
 * 加载顺序：字体 → mathjs → Plotly → MathLive → MathJax → nerdamer → 业务模块 → app.js
 */

// 1. 字体 — 全部通过 npm @fontsource 包本地加载
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/stix-two-text/400.css';
import '@fontsource/stix-two-text/400-italic.css';
import '@fontsource/stix-two-text/600.css';
import '@fontsource/stix-two-text/600-italic.css';
import '@fontsource/stix-two-text/700.css';
import '@fontsource/stix-two-math/400.css';

// 2. 数学计算引擎 — 挂载到 window.math
import { create, all } from 'mathjs';
window.math = create(all);

// 3. 图表库 — 挂载到 window.Plotly
import Plotly from 'plotly.js-dist-min';
window.Plotly = Plotly;

// 4. 公式编辑器 — MathLive 自动注册 <math-field> Web Component
import 'mathlive';

// 5. MathJax 配置（必须在加载 tex-svg 之前）
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)'], ['$', '$']],
    displayMath: [['\\[', '\\]']]
  },
  svg: {
    fontCache: 'global'
  },
  startup: {
    ready: () => {
      MathJax.startup.defaultReady();
      // 触发自定义事件，通知业务代码 MathJax 已就绪
      window.dispatchEvent(new CustomEvent('mathjax-ready'));
    }
  }
};

// 6. MathJax — 从本地 npm 包加载（替代 CDN）
import 'mathjax/es5/tex-svg.js';

// 7. 符号计算引擎 — nerdamer（从本地 npm 包加载，替代 CDN）
// nerdamer 是 UMD 格式，import 后自动挂载到 window.nerdamer
import 'nerdamer/nerdamer.core.js';
import 'nerdamer/Algebra.js';
import 'nerdamer/Calculus.js';
import 'nerdamer/Solve.js';

// nerdamer 加载完成后通知业务代码
if (typeof window.nerdamer !== 'undefined') {
  window.dispatchEvent(new CustomEvent('nerdamer-ready'));
}

// 8. 业务数据模块（IIFE，自动挂载到 window.MSCLab）
import './data/constants.js';
import './data/elements.js';
import './data/strengthening-formulas.js';
import './modules/utils.js';
import './modules/models.js';
import './modules/custom-formula-manager.js';

// 9. 主应用逻辑
import './app.js';
