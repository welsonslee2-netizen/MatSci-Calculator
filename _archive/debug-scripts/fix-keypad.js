// 强力修复小键盘按钮点击问题
(function() {
  console.log('🔧 强力修复小键盘按钮...');
  console.log('================================================================================');
  
  // ==================== 科学计算器 ====================
  const scientificKeypad = document.getElementById('scientific-keypad');
  const scientificField = document.getElementById('calc-expression');
  
  if (scientificKeypad && scientificField) {
    console.log('✅ 找到 scientific-keypad 和 calc-expression');
    
    // 克隆节点清除旧监听器
    const newScientificKeypad = scientificKeypad.cloneNode(true);
    scientificKeypad.parentNode.replaceChild(newScientificKeypad, scientificKeypad);
    
    // 添加新的事件监听器（使用捕获阶段确保最先执行）
    newScientificKeypad.addEventListener('click', function(event) {
      const button = event.target.closest('button[data-insert], button[data-action]');
      
      if (!button) {
        console.log('⚠️  点击的不是小键盘按钮');
        return;
      }
      
      console.log('\n🔘 科学计算器按钮点击');
      console.log('   按钮:', button.textContent.trim());
      console.log('   data-insert:', button.dataset.insert);
      console.log('   data-action:', button.dataset.action);
      
      // 关键修复1：先聚焦
      if (scientificField.tagName === 'MATH-FIELD') {
        console.log('🎯 聚焦到 MATH-FIELD');
        
        // 方法1：直接调用 focus
        scientificField.focus();
        
        // 方法2：延迟后再次聚焦到内部 input
        setTimeout(() => {
          const shadowRoot = scientificField.shadowRoot;
          if (shadowRoot) {
            const internalInput = shadowRoot.querySelector('input, [contenteditable]');
            if (internalInput) {
              console.log('🎯 聚焦到内部 input');
              internalInput.focus();
              // ❌ 删除 click() 和 select() 避免无限循环
              // internalInput.click();
              // internalInput.select();
            }
          }
        }, 50);
        
        // 方法3：再延迟一次确保聚焦成功
        setTimeout(() => {
          const shadowRoot = scientificField.shadowRoot;
          if (shadowRoot) {
            const internalInput = shadowRoot.querySelector('input, [contenteditable]');
            if (internalInput) {
              internalInput.focus();
            }
          }
        }, 150);
      } else {
        console.log('📝 普通 input，使用 field.focus()');
        scientificField.focus();
      }
      
      // 处理 action
      const action = button.dataset.action;
      if (action === 'calc-clear') {
        console.log('🧹 清除操作');
        if (scientificField.tagName === 'MATH-FIELD') {
          scientificField.executeCommand('deleteAll');
        } else {
          scientificField.value = '';
        }
        return;
      }
      
      if (action === 'calc-backspace') {
        console.log('⌫ 退格操作');
        if (scientificField.tagName === 'MATH-FIELD') {
          scientificField.executeCommand('deleteBackward');
        }
        return;
      }
      
      if (action === 'calc-evaluate') {
        console.log('🟰 计算操作');
        // 这里需要调用评估函数，暂时跳过
        return;
      }
      
      // 处理插入
      const insertValue = button.dataset.insert;
      if (insertValue) {
        console.log('➕ 插入:', insertValue);
        
        // 清理占位符
        let cleanValue = insertValue.replace(/#\?/g, '');
        
        // 延迟插入，确保聚焦完成
        setTimeout(() => {
          if (scientificField.tagName === 'MATH-FIELD') {
            scientificField.executeCommand('insert', cleanValue);
            console.log('✅ 插入成功:', cleanValue);
            console.log('   当前值:', scientificField.getValue());
          } else {
            const start = scientificField.selectionStart || 0;
            const end = scientificField.selectionEnd || 0;
            scientificField.value = scientificField.value.substring(0, start) + 
                                   cleanValue + 
                                   scientificField.value.substring(end);
            const newCursorPos = start + cleanValue.length;
            scientificField.setSelectionRange(newCursorPos, newCursorPos);
            console.log('✅ 插入成功（普通 input）:', cleanValue);
          }
        }, 100);
      } else {
        console.warn('⚠️  没有 insertValue 或 action');
      }
    }, true); // 使用捕获阶段
    
    console.log('✅ 科学计算器小键盘修复完成');
  } else {
    console.error('❌ 找不到 scientific-keypad 或 calc-expression');
  }
  
  // ==================== 经典计算器 ====================
  const classicKeypad = document.getElementById('classic-keypad');
  const classicField = document.getElementById('classic-expression');
  
  if (classicKeypad && classicField) {
    console.log('✅ 找到 classic-keypad 和 classic-expression');
    
    // 克隆节点清除旧监听器
    const newClassicKeypad = classicKeypad.cloneNode(true);
    classicKeypad.parentNode.replaceChild(newClassicKeypad, classicKeypad);
    
    // 添加新的事件监听器
    newClassicKeypad.addEventListener('click', function(event) {
      const button = event.target.closest('.keypad-button');
      
      if (!button) {
        console.log('⚠️  点击的不是经典计算器按钮');
        return;
      }
      
      console.log('\n🔘 经典计算器按钮点击');
      console.log('   按钮:', button.textContent.trim());
      console.log('   data-action:', button.dataset.action);
      console.log('   data-insert:', button.dataset.insert);
      
      // 先聚焦
      if (classicField.tagName === 'MATH-FIELD') {
        console.log('🎯 聚焦到 MATH-FIELD');
        classicField.focus();
        
        setTimeout(() => {
          const shadowRoot = classicField.shadowRoot;
          if (shadowRoot) {
            const internalInput = shadowRoot.querySelector('input, [contenteditable]');
            if (internalInput) {
              console.log('🎯 聚焦到内部 input');
              internalInput.focus();
              // ❌ 删除 click() 避免无限循环
              // internalInput.click();
            }
          }
        }, 50);
      } else {
        classicField.focus();
      }
      
      // 处理按钮点击
      const action = button.dataset.action;
      const insertValue = button.dataset.insert;
      
      if (action === 'clear') {
        console.log('🧹 清除操作');
        if (classicField.tagName === 'MATH-FIELD') {
          classicField.executeCommand('deleteAll');
        } else {
          classicField.value = '';
        }
        return;
      }
      
      if (action === 'backspace') {
        console.log('⌫ 退格操作');
        if (classicField.tagName === 'MATH-FIELD') {
          classicField.executeCommand('deleteBackward');
        }
        return;
      }
      
      if (action === 'evaluate') {
        console.log('🟰 计算操作');
        return;
      }
      
      if (insertValue) {
        console.log('➕ 插入:', insertValue);
        
        setTimeout(() => {
          if (classicField.tagName === 'MATH-FIELD') {
            let cleanValue = insertValue.replace(/#\?/g, '');
            classicField.executeCommand('insert', cleanValue);
            console.log('✅ 插入成功:', cleanValue);
            console.log('   当前值:', classicField.getValue());
          }
        }, 100);
      }
    }, true); // 使用捕获阶段
    
    console.log('✅ 经典计算器小键盘修复完成');
  } else {
    console.error('❌ 找不到 classic-keypad 或 classic-expression');
  }
  
  console.log('================================================================================');
  console.log('✅ 修复完成！');
  console.log('\n📋 现在请点击小键盘按钮测试');
  console.log('   - 查看控制台是否有 "🔘 按钮点击" 日志');
  console.log('   - 查看是否有 "✅ 插入成功" 日志');
  console.log('   - 查看输入框是否有内容');
})();
