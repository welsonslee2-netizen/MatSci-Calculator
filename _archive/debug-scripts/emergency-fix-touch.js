// 🚨 紧急修复：移除所有日志，简化聚焦逻辑
(function() {
  console.log('🚨 执行紧急修复...');
  
  // ==================== 禁用所有 console.log（提升性能）====================
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // 只保留错误日志
  console.log = function() {};
  console.warn = function() {};
  // console.error 保持不变
  
  // ==================== 科学计算器小键盘 ====================
  const scientificKeypad = document.getElementById('scientific-keypad');
  const scientificField = document.getElementById('calc-expression');
  
  if (scientificKeypad && scientificField) {
    // 克隆节点清除旧监听器
    const newKeypad = scientificKeypad.cloneNode(true);
    scientificKeypad.parentNode.replaceChild(newKeypad, scientificKeypad);
    
    // 简化的事件处理（无日志）
    const handleTouch = function(event) {
      if (event.type === 'touchstart') {
        event.preventDefault();
      }
      
      const button = event.target.closest('[data-insert], [data-action]');
      if (!button) return;
      
      // 简单聚焦
      if (scientificField.tagName === 'MATH-FIELD') {
        scientificField.focus();
        setTimeout(() => {
          const shadowRoot = scientificField.shadowRoot;
          if (shadowRoot) {
            const input = shadowRoot.querySelector('input, [contenteditable]');
            if (input) input.focus();
          }
        }, 50);
      }
      
      // 处理操作
      const action = button.dataset.action;
      const insertValue = button.dataset.insert;
      
      if (action === 'calc-clear' && scientificField.tagName === 'MATH-FIELD') {
        scientificField.executeCommand('deleteAll');
        return;
      }
      
      if (action === 'calc-backspace' && scientificField.tagName === 'MATH-FIELD') {
        scientificField.executeCommand('deleteBackward');
        return;
      }
      
      if (insertValue && scientificField.tagName === 'MATH-FIELD') {
        const cleanValue = insertValue.replace(/#\?/g, '');
        setTimeout(() => {
          scientificField.executeCommand('insert', cleanValue);
        }, 100);
      }
    };
    
    newKeypad.addEventListener('click', handleTouch);
    newKeypad.addEventListener('touchstart', handleTouch, { passive: false });
    
    console.log('✅ 科学计算器小键盘已修复');
  }
  
  // ==================== 经典计算器小键盘 ====================
  const classicKeypad = document.getElementById('classic-keypad');
  const classicField = document.getElementById('classic-expression');
  
  if (classicKeypad && classicField) {
    // 克隆节点
    const newClassicKeypad = classicKeypad.cloneNode(true);
    classicKeypad.parentNode.replaceChild(newClassicKeypad, classicKeypad);
    
    const handleClassicTouch = function(event) {
      if (event.type === 'touchstart') {
        event.preventDefault();
      }
      
      const button = event.target.closest('.keypad-button');
      if (!button) return;
      
      // 简单聚焦
      if (classicField.tagName === 'MATH-FIELD') {
        classicField.focus();
        setTimeout(() => {
          const shadowRoot = classicField.shadowRoot;
          if (shadowRoot) {
            const input = shadowRoot.querySelector('input, [contenteditable]');
            if (input) input.focus();
          }
        }, 50);
      }
      
      // 调用原有的处理函数
      const action = button.dataset.action;
      const insertValue = button.dataset.insert;
      
      if (action === 'clear' && classicField.tagName === 'MATH-FIELD') {
        classicField.executeCommand('deleteAll');
        return;
      }
      
      if (action === 'backspace' && classicField.tagName === 'MATH-FIELD') {
        classicField.executeCommand('deleteBackward');
        return;
      }
      
      if (insertValue && classicField.tagName === 'MATH-FIELD') {
        const cleanValue = insertValue.replace(/#\?/g, '');
        setTimeout(() => {
          classicField.executeCommand('insert', cleanValue);
        }, 100);
      }
    };
    
    newClassicKeypad.addEventListener('click', handleClassicTouch);
    newClassicKeypad.addEventListener('touchstart', handleClassicTouch, { passive: false });
    
    console.log('✅ 经典计算器小键盘已修复');
  }
  
  console.log('✅ 紧急修复完成！请测试小键盘按钮');
  console.log('💡 提示：所有日志已禁用以提升性能');
})();
