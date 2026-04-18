/**
 * 终极焦点诊断 - 深度检查
 * 
 * 使用方法：
 * 1. 确保在"科学计算器"页面
 * 2. 按 F12 打开控制台
 * 3. 复制以下内容粘贴并执行
 * 4. 将完整输出发给我
 */

(function() {
  console.log('%c🔍 终极焦点诊断', 'color: #ff0000; font-size: 24px; font-weight: bold;');
  console.log('='.repeat(80));
  
  const field = document.getElementById('calc-expression');
  
  if (!field) {
    console.error('❌ 找不到 calc-expression 元素');
    return;
  }
  
  if (field.tagName !== 'MATH-FIELD') {
    console.error('❌ 元素类型不是 MATH-FIELD: ' + field.tagName);
    return;
  }
  
  const results = [];
  
  results.push('\n📊 MathLive 状态:');
  results.push('  • MathLive 已加载: ' + (window.MathLive ? '✅' : '❌'));
  results.push('  • 自定义元素已注册: ' + (customElements.get('math-field') ? '✅' : '❌'));
  results.push('  • 元素 ID: ' + field.id);
  
  // 检查 Shadow DOM
  const shadowRoot = field.shadowRoot;
  results.push('\n🌳 Shadow DOM:');
  results.push('  • 存在: ' + (shadowRoot ? '✅' : '❌'));
  
  if (shadowRoot) {
    results.push('  • 模式: ' + (field.attachShadow ? 'attached' : 'closed'));
    
    // 查找内部 input 元素
    const internalInput = shadowRoot.querySelector('input, textarea, [contenteditable]');
    results.push('  • 内部可输入元素: ' + (internalInput ? '✅ ' + internalInput.tagName : '❌'));
    
    if (internalInput) {
      results.push('    - ID: ' + (internalInput.id || 'none'));
      results.push('    - type: ' + (internalInput.type || 'none'));
      results.push('    - readonly: ' + (internalInput.readOnly || false));
      results.push('    - disabled: ' + (internalInput.disabled || false));
      results.push('    - tabIndex: ' + internalInput.tabIndex);
      results.push('    - style.pointerEvents: ' + window.getComputedStyle(internalInput).pointerEvents);
    }
  }
  
  // 检查 tabindex
  results.push('\n🎯 TabIndex 属性:');
  results.push('  • tabindex: ' + field.getAttribute('tabindex'));
  results.push('  • contenteditable: ' + field.getAttribute('contenteditable'));
  
  // 检查 MathLive 配置
  results.push('\n⚙️ MathLive 配置:');
  results.push('  • virtualKeyboardMode: ' + (field.virtualKeyboardMode || field.getAttribute('virtual-keyboard-mode') || 'not set'));
  results.push('  • smartMode: ' + (field.smartMode !== undefined ? field.smartMode : 'not set'));
  results.push('  • readOnly: ' + (field.readOnly !== undefined ? field.readOnly : 'not set'));
  
  // 检查可用方法
  results.push('\n🔧 MathLive API:');
  results.push('  • focus: ' + (typeof field.focus === 'function' ? '✅' : '❌'));
  results.push('  • blur: ' + (typeof field.blur === 'function' ? '✅' : '❌'));
  results.push('  • executeCommand: ' + (typeof field.executeCommand === 'function' ? '✅' : '❌'));
  results.push('  • getValue: ' + (typeof field.getValue === 'function' ? '✅' : '❌'));
  results.push('  • setValue: ' + (typeof field.setValue === 'function' ? '✅' : '❌'));
  
  // 测试聚焦
  results.push('\n 聚焦测试:');
  
  try {
    // 记录聚焦前的状态
    const beforeActiveElement = document.activeElement;
    results.push('  • 聚焦前 activeElement: ' + beforeActiveElement.tagName);
    
    // 尝试聚焦
    field.focus();
    
    // 立即检查
    setTimeout(() => {
      const afterActiveElement = document.activeElement;
      results.push('  • 聚焦后 activeElement: ' + afterActiveElement.tagName);
      results.push('  • 聚焦成功: ' + (afterActiveElement === field ? '✅' : '❌'));
      
      // 检查 shadow DOM 内部的 activeElement
      if (shadowRoot && shadowRoot.activeElement) {
        results.push('  • shadowRoot.activeElement: ' + shadowRoot.activeElement.tagName);
      } else if (shadowRoot) {
        results.push('  • shadowRoot.activeElement: null');
      }
      
      // 测试插入
      results.push('\n📝 插入测试:');
      try {
        const beforeValue = field.getValue();
        field.executeCommand('insert', 'test123');
        const afterValue = field.getValue();
        results.push('  • 插入前: ' + beforeValue);
        results.push('  • 插入后: ' + afterValue);
        results.push('  • 插入成功: ' + (beforeValue !== afterValue ? '✅' : '❌'));
      } catch (e) {
        results.push('  • 插入失败: ' + e.message);
      }
      
      // 输出所有结果
      console.log('\n' + results.join('\n'));
      console.log('\n' + '='.repeat(80));
      
      // 诊断结论
      console.log('\n%c🎯 诊断结论:', 'color: #ff0000; font-size: 18px; font-weight: bold;');
      
      if (afterActiveElement !== field) {
        console.log('%c❌ 问题: field.focus() 无法让 MATH-FIELD 成为 activeElement', 'color: red; font-weight: bold;');
        console.log('💡 可能原因:');
        console.log('   1. MathLive 的 shadow DOM 内部有 input，但 tabindex 设置不正确');
        console.log('   2. 外部 CSS 阻止了聚焦（检查 pointer-events, user-select）');
        console.log('   3. MathLive 版本 bug');
        console.log('\n💡 解决方案:');
        console.log('   - 方案 1: 直接聚焦到 shadow DOM 内部的 input 元素');
        console.log('   - 方案 2: 降级 MathLive 版本到 0.96.0');
        console.log('   - 方案 3: 使用普通 textarea 替代 math-field');
      } else {
        console.log('%c✅ 聚焦成功，问题可能在键盘输入', 'color: green; font-weight: bold;');
      }
      
      // 提供修复代码
      console.log('\n%c🔧 自动修复尝试:', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');
      
      // 尝试直接聚焦 shadow DOM 内部元素
      if (shadowRoot && internalInput) {
        console.log('正在尝试直接聚焦 shadow DOM 内部的 input...');
        internalInput.focus();
        setTimeout(() => {
          console.log('聚焦后 shadowRoot.activeElement:', shadowRoot.activeElement ? shadowRoot.activeElement.tagName : 'null');
          if (shadowRoot.activeElement === internalInput) {
            console.log('✅ 成功聚焦到内部元素！现在尝试输入');
            internalInput.click();
          } else {
            console.log('❌ 仍然无法聚焦内部元素');
          }
        }, 100);
      }
      
    }, 50);
    
  } catch (e) {
    results.push('  • 聚焦测试错误: ' + e.message);
    console.log('\n' + results.join('\n'));
    console.error(e);
  }
})();
