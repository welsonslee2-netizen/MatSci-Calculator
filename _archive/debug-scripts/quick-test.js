/**
 * MatSci Calculator Lab - 浏览器控制台快速测试脚本
 * 
 * 使用方法：
 * 1. 打开 index.html
 * 2. 按 F12 打开开发者工具
 * 3. 切换到 Console 标签
 * 4. 复制粘贴此文件内容并回车执行
 */

(function() {
  console.log('%c🧪 MatSci Calculator Lab - 快速诊断脚本', 'color: #1f5e87; font-size: 16px; font-weight: bold;');
  console.log('%c开始执行全面检查...\n', 'color: #60758a;');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: []
  };
  
  function logTest(name, passed, detail = '') {
    const icon = passed ? '✅' : '❌';
    const status = passed ? 'PASS' : 'FAIL';
    const color = passed ? '#6bcb77' : '#ff6b6b';
    
    console.log(`%c${icon} [${status}] ${name}`, `color: ${color}; font-weight: bold;`);
    if (detail) {
      console.log(`   ${detail}`);
    }
    
    results.tests.push({ name, passed, detail });
    if (passed) results.passed++;
    else results.failed++;
  }
  
  function logWarning(message) {
    console.warn(`⚠️  ${message}`);
    results.warnings++;
  }
  
  // ==================== 1. 模块加载检查 ====================
  console.group('%c📦 模块加载检查', 'color: #1f5e87; font-weight: bold;');
  
  // 检查全局命名空间
  if (window.MSCLab) {
    logTest('MSCLab 命名空间', true);
  } else {
    logTest('MSCLab 命名空间', false, '全局对象未定义，检查脚本加载顺序');
  }
  
  // 检查数据模块
  if (window.MSCLab && window.MSCLab.constantsData) {
    const count = window.MSCLab.constantsData.length;
    logTest('常数数据', true, `已加载 ${count} 个常数`);
  } else {
    logTest('常数数据', false, 'constantsData 未定义');
  }
  
  if (window.MSCLab && window.MSCLab.elementsData) {
    const count = window.MSCLab.elementsData.length;
    logTest('元素数据', true, `已加载 ${count} 个元素`);
  } else {
    logTest('元素数据', false, 'elementsData 未定义');
  }
  
  // 检查工具模块
  if (window.MSCLab && window.MSCLab.Utils) {
    const utils = Object.keys(window.MSCLab.Utils);
    logTest('工具函数模块', true, `可用函数: ${utils.join(', ')}`);
  } else {
    logTest('工具函数模块', false, 'Utils 模块未加载');
  }
  
  // 检查计算模型
  if (window.MSCLab && window.MSCLab.Models) {
    const models = Object.keys(window.MSCLab.Models);
    logTest('计算模型模块', true, `可用模型: ${models.join(', ')}`);
  } else {
    logTest('计算模型模块', false, 'Models 模块未加载');
  }
  
  // 检查第三方库
  if (window.math) {
    logTest('math.js 库', true, `版本: ${window.math.version || '未知'}`);
  } else {
    logTest('math.js 库', false, 'math.js 未加载，检查CDN连接');
  }
  
  if (window.Plotly) {
    logTest('Plotly 库', true, '图表库已就绪');
  } else {
    logTest('Plotly 库', false, 'Plotly 未加载');
  }
  
  if (window.MathJax) {
    logTest('MathJax 库', true, '公式渲染库已就绪');
  } else {
    logTest('MathJax 库', false, 'MathJax 未加载');
  }
  
  console.groupEnd();
  
  // ==================== 2. 数学计算验证 ====================
  console.group('%c🔢 数学计算验证', 'color: #1f5e87; font-weight: bold;');
  
  if (window.MSCLab && window.MSCLab.Models) {
    const Models = window.MSCLab.Models;
    
    // 基础运算
    try {
      const r1 = Models.evaluateExpression('2 + 3 * 4');
      logTest('混合运算优先级: 2+3*4', r1 === 14, `结果: ${r1}`);
    } catch (e) {
      logTest('混合运算优先级', false, e.message);
    }
    
    // 三角函数
    try {
      const r2 = Models.evaluateExpression('sin(pi/2)');
      logTest('三角函数: sin(π/2)', Math.abs(r2 - 1) < 0.0001, `结果: ${r2.toFixed(6)}`);
    } catch (e) {
      logTest('三角函数', false, e.message);
    }
    
    // 对数
    try {
      const r3 = Models.evaluateExpression('log10(1000)');
      logTest('常用对数: log₁₀(1000)', r3 === 3, `结果: ${r3}`);
    } catch (e) {
      logTest('常用对数', false, e.message);
    }
    
    // 自然对数
    try {
      const r4 = Models.evaluateExpression('ln(e^2)');
      logTest('自然对数: ln(e²)', Math.abs(r4 - 2) < 0.0001, `结果: ${r4.toFixed(6)}`);
    } catch (e) {
      logTest('自然对数', false, e.message);
    }
    
    // 科学计数法
    try {
      const r5 = Models.evaluateExpression('1.5e-10 * 6.022e23');
      const expected = 1.5e-10 * 6.022e23;
      logTest('科学计数法', Math.abs(r5 - expected) / expected < 0.0001, `结果: ${r5.toExponential(4)}`);
    } catch (e) {
      logTest('科学计数法', false, e.message);
    }
    
    // 导数计算
    try {
      const deriv = Models.numericalDerivative('x^2', 3, 1e-5);
      logTest('数值导数: d(x²)/dx @ x=3', Math.abs(deriv - 6) < 0.01, `结果: ${deriv.toFixed(4)} (预期≈6)`);
    } catch (e) {
      logTest('数值导数', false, e.message);
    }
    
    // 积分计算
    try {
      const integral = Models.definiteIntegral('x^2', 0, 1, 100);
      logTest('定积分: ∫₀¹x²dx', Math.abs(integral - 1/3) < 0.001, `结果: ${integral.toFixed(4)} (预期≈0.333)`);
    } catch (e) {
      logTest('定积分', false, e.message);
    }
    
    // 求根
    try {
      const root = Models.findRoot('x^2 - 4', 1, 3, 1e-6);
      logTest('方程求根: x²-4=0', Math.abs(root.root - 2) < 0.001, `结果: ${root.root.toFixed(4)} (迭代${root.iterations}次)`);
    } catch (e) {
      logTest('方程求根', false, e.message);
    }
  }
  
  console.groupEnd();
  
  // ==================== 3. 材料强化模型验证 ====================
  console.group('%c🔬 材料强化模型验证', 'color: #1f5e87; font-weight: bold;');
  
  if (window.MSCLab && window.MSCLab.Models) {
    const Models = window.MSCLab.Models;
    
    // Hall-Petch
    try {
      const hp = Models.hallPetch({
        sigma0: 180,
        sigma0Unit: 'MPa',
        ky: 0.7,
        grainSize: 12,
        grainUnit: 'um'
      });
      
      const valid = hp.incrementMPa > 0 && hp.totalYieldMPa > 180;
      logTest('Hall-Petch模型', valid, 
        `Δσ=${hp.incrementMPa.toFixed(2)} MPa, σ_y=${hp.totalYieldMPa.toFixed(2)} MPa`);
    } catch (e) {
      logTest('Hall-Petch模型', false, e.message);
    }
    
    // Dislocation
    try {
      const dis = Models.dislocation({
        alpha: 0.24,
        G: 79,
        b: 0.248,
        rho: 2.0e14
      });
      
      logTest('位错强化模型', dis.incrementMPa > 0, 
        `Δσ=${dis.incrementMPa.toFixed(2)} MPa`);
    } catch (e) {
      logTest('位错强化模型', false, e.message);
    }
    
    // Cutting
    try {
      const cut = Models.cutting({
        radius: 12,
        fraction: 0.08,
        apb: 150,
        G: 80,
        b: 0.255,
        k: 0.75
      });
      
      logTest('切割强化模型', cut.incrementMPa > 0, 
        `Δσ=${cut.incrementMPa.toFixed(2)} MPa`);
    } catch (e) {
      logTest('切割强化模型', false, e.message);
    }
    
    // Orowan
    try {
      const or = Models.orowan({
        G: 80,
        b: 0.255,
        radius: 18,
        spacing: 60,
        nu: 0.30
      });
      
      logTest('Orowan强化模型', or.incrementMPa > 0, 
        `Δσ=${or.incrementMPa.toFixed(2)} MPa`);
    } catch (e) {
      logTest('Orowan强化模型', false, e.message);
    }
    
    // 边界条件测试
    let errorCaught = false;
    try {
      Models.hallPetch({
        sigma0: -100,
        sigma0Unit: 'MPa',
        ky: 0.7,
        grainSize: 12,
        grainUnit: 'um'
      });
    } catch (e) {
      errorCaught = true;
    }
    logTest('负值输入检测', errorCaught, '应拒绝负的应力值');
    
  }
  
  console.groupEnd();
  
  // ==================== 4. UI组件检查 ====================
  console.group('%c🎨 UI组件检查', 'color: #1f5e87; font-weight: bold;');
  
  const pages = [
    { id: 'home', name: '首页' },
    { id: 'classic-calculator', name: '经典计算器' },
    { id: 'scientific-calculator', name: '科学计算器' },
    { id: 'function-analysis', name: '函数分析' },
    { id: 'constants', name: '常数库' },
    { id: 'elements', name: '元素库' },
    { id: 'strengthening', name: '材料强化' },
    { id: 'visual-lab', name: '可视化实验室' }
  ];
  
  pages.forEach(page => {
    const el = document.getElementById(page.id);
    logTest(`${page.name}页面`, el !== null, el ? 'DOM元素存在' : 'DOM元素缺失');
  });
  
  // 导航按钮
  const navButtons = document.querySelectorAll('.nav-link');
  logTest('侧边栏导航', navButtons.length >= 7, `找到 ${navButtons.length} 个导航按钮`);
  
  // 移动端导航
  const mobileNav = document.querySelector('.mobile-nav');
  logTest('移动端导航', mobileNav !== null, mobileNav ? '已实现' : '缺失');
  
  // Toast提示
  const toast = document.getElementById('toast');
  logTest('Toast提示组件', toast !== null, toast ? '已实现' : '缺失');
  
  console.groupEnd();
  
  // ==================== 5. 性能检查 ====================
  console.group('%c⚡ 性能检查', 'color: #1f5e87; font-weight: bold;');
  
  // 页面加载时间
  if (performance.timing) {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    
    if (loadTime > 0) {
      const fast = loadTime < 2000;
      logTest('页面加载时间', fast, `${loadTime}ms (DOM就绪: ${domReady}ms)`);
      if (!fast) logWarning('页面加载超过2秒，考虑优化资源加载');
    }
  }
  
  // 内存使用（如果支持）
  if (performance.memory) {
    const mem = performance.memory;
    const usedMB = (mem.usedJSHeapSize / 1048576).toFixed(2);
    const totalMB = (mem.totalJSHeapSize / 1048576).toFixed(2);
    logTest('JavaScript堆内存', true, `已用: ${usedMB} MB / 总计: ${totalMB} MB`);
    
    if (mem.usedJSHeapSize > 50 * 1048576) {
      logWarning('内存使用超过50MB，可能存在内存泄漏');
    }
  } else {
    logTest('内存监控', false, '当前浏览器不支持performance.memory API');
  }
  
  console.groupEnd();
  
  // ==================== 总结报告 ====================
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #1f5e87;');
  console.log('%c📊 测试总结报告', 'color: #1f5e87; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #1f5e87;');
  
  const totalTests = results.passed + results.failed;
  const passRate = totalTests > 0 ? ((results.passed / totalTests) * 100).toFixed(1) : 0;
  
  console.log(`%c总测试数: %c${totalTests}`, 'color: #60758a;', 'color: #1f5e87; font-weight: bold; font-size: 16px;');
  console.log(`%c✅ 通过: %c${results.passed}`, 'color: #60758a;', 'color: #6bcb77; font-weight: bold; font-size: 16px;');
  console.log(`%c❌ 失败: %c${results.failed}`, 'color: #60758a;', 'color: #ff6b6b; font-weight: bold; font-size: 16px;');
  console.log(`%c⚠️  警告: %c${results.warnings}`, 'color: #60758a;', 'color: #ffa502; font-weight: bold; font-size: 16px;');
  console.log(`%c通过率: %c${passRate}%`, 'color: #60758a;', `color: ${passRate >= 90 ? '#6bcb77' : passRate >= 70 ? '#ffa502' : '#ff6b6b'}; font-weight: bold; font-size: 18px;`);
  
  if (results.failed === 0) {
    console.log('\n%c🎉 所有测试通过！应用状态良好。', 'color: #6bcb77; font-size: 14px; font-weight: bold;');
  } else {
    console.log('\n%c⚠️  发现失败测试，请检查上述错误详情。', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
    console.log('%c建议：查看 BUG_TRACKER.md 记录问题并开始修复。', 'color: #60758a; font-style: italic;');
  }
  
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #1f5e87;');
  
  // 返回结果供进一步分析
  window._testResults = results;
  console.log('%c💡 提示: 测试结果已保存到 window._testResults，可在控制台进一步分析', 'color: #60758a; font-style: italic;');
  
})();
