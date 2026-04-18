/**
 * MathLive 输入问题诊断脚本
 * 
 * 使用方法：
 * 1. 打开浏览器控制台（F12）
 * 2. 复制此文件内容并粘贴到控制台
 * 3. 按 Enter 执行
 * 4. 查看输出结果
 */

(function diagnoseMathLiveInput() {
  console.log('%c🔍 MathLive 输入问题诊断', 'color: #1f5e87; font-size: 16px; font-weight: bold;');
  console.log('='.repeat(60));
  
  // 1. 检查 MathLive 库是否加载
  console.log('\n1️⃣ 检查 MathLive 库加载状态...');
  if (window.MathLive) {
    console.log('   ✅ MathLive 已加载');
    console.log('   版本:', window.MathLive.version || '未知');
  } else {
    console.log('   ❌ MathLive 未加载！');
    console.log('   请检查 index.html 中是否正确引入了 MathLive 库');
    return;
  }
  
  // 2. 检查 math-field 元素
  console.log('\n2️⃣ 检查 math-field 元素...');
  const calcExpression = document.getElementById('calc-expression');
  if (!calcExpression) {
    console.log('   ❌ 找不到 calc-expression 元素！');
    return;
  }
  
  console.log('   ✅ 找到 calc-expression 元素');
  console.log('   标签名:', calcExpression.tagName);
  console.log('   类名:', calcExpression.className);
  
  if (calcExpression.tagName !== 'MATH-FIELD') {
    console.log('   ❌ 元素不是 MATH-FIELD 类型！');
    console.log('   当前类型:', calcExpression.tagName);
    return;
  }
  
  console.log('   ✅ 元素是 MATH-FIELD 类型');
  
  // 3. 检查元素属性
  console.log('\n3️⃣ 检查元素属性...');
  console.log('   virtual-keyboard-mode:', calcExpression.getAttribute('virtual-keyboard-mode'));
  console.log('   spellcheck:', calcExpression.getAttribute('spellcheck'));
  console.log('   placeholder:', calcExpression.getAttribute('placeholder'));
  
  // 4. 检查当前值
  console.log('\n4️⃣ 检查当前值...');
  try {
    const value = calcExpression.getValue();
    console.log('   当前 LaTeX 值:', value || '(空)');
  } catch (error) {
    console.log('   ❌ 无法获取值:', error.message);
  }
  
  // 5. 检查样式
  console.log('\n5️⃣ 检查计算样式...');
  const computedStyle = window.getComputedStyle(calcExpression);
  console.log('   display:', computedStyle.display);
  console.log('   visibility:', computedStyle.visibility);
  console.log('   pointer-events:', computedStyle.pointerEvents);
  console.log('   user-select:', computedStyle.userSelect);
  console.log('   cursor:', computedStyle.cursor);
  
  // 6. 检查事件监听器
  console.log('\n6️⃣ 检查事件监听器...');
  const events = ['click', 'focus', 'blur', 'input', 'keydown'];
  events.forEach(eventName => {
    const listeners = getEventListeners ? getEventListeners(calcExpression)[eventName] : null;
    if (listeners && listeners.length > 0) {
      console.log(`   ✅ ${eventName}: ${listeners.length} 个监听器`);
    } else {
      console.log(`   ⚠️  ${eventName}: 无监听器或无法检测`);
    }
  });
  
  // 7. 测试焦点功能
  console.log('\n7️⃣ 测试焦点功能...');
  try {
    calcExpression.focus();
    console.log('   ✅ focus() 调用成功');
    
    setTimeout(() => {
      const hasFocus = document.activeElement === calcExpression;
      console.log('   当前是否有焦点:', hasFocus ? '✅ 是' : '❌ 否');
      
      if (!hasFocus) {
        console.log('   ⚠️  元素无法获得焦点，可能被其他元素遮挡或禁用');
      }
    }, 100);
  } catch (error) {
    console.log('   ❌ focus() 调用失败:', error.message);
  }
  
  // 8. 测试插入功能
  console.log('\n8️⃣ 测试插入功能...');
  try {
    calcExpression.executeCommand('insert', 'x');
    console.log('   ✅ executeCommand 调用成功');
    console.log('   插入后的值:', calcExpression.getValue());
  } catch (error) {
    console.log('   ❌ executeCommand 调用失败:', error.message);
  }
  
  // 9. 检查父元素
  console.log('\n9️⃣ 检查父元素...');
  const parent = calcExpression.parentElement;
  if (parent) {
    console.log('   父元素标签:', parent.tagName);
    console.log('   父元素类名:', parent.className);
    const parentStyle = window.getComputedStyle(parent);
    console.log('   父元素 display:', parentStyle.display);
    console.log('   父元素 overflow:', parentStyle.overflow);
  }
  
  // 10. 检查 z-index
  console.log('\n🔟 检查层级关系...');
  console.log('   calc-expression z-index:', computedStyle.zIndex);
  
  // 总结和建议
  console.log('\n' + '='.repeat(60));
  console.log('%c📋 诊断总结与建议', 'color: #1f5e87; font-size: 14px; font-weight: bold;');
  console.log('='.repeat(60));
  
  const issues = [];
  
  if (calcExpression.tagName !== 'MATH-FIELD') {
    issues.push('❌ math-field 元素未正确注册，请检查 MathLive 库加载');
  }
  
  if (computedStyle.display === 'none') {
    issues.push('❌ 元素被隐藏（display: none）');
  }
  
  if (computedStyle.visibility === 'hidden') {
    issues.push('❌ 元素不可见（visibility: hidden）');
  }
  
  if (computedStyle.pointerEvents === 'none') {
    issues.push('❌ 元素禁用了鼠标事件（pointer-events: none）');
  }
  
  if (computedStyle.userSelect === 'none') {
    issues.push('⚠️  元素禁用了文本选择（user-select: none）');
  }
  
  if (issues.length === 0) {
    console.log('✅ 未发现明显问题');
    console.log('\n💡 建议操作：');
    console.log('   1. 尝试点击表达式输入框');
    console.log('   2. 观察控制台是否有 "MathField 被点击" 和 "MathField 获得焦点" 日志');
    console.log('   3. 尝试键盘输入，观察是否有 "按键:" 日志');
    console.log('   4. 如果仍然无法输入，请提供控制台完整日志');
  } else {
    console.log('发现以下问题：');
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
})();
