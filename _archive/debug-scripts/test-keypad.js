/**
 * 小键盘按钮测试脚本
 * 
 * 使用方法：
 * 1. 打开 index.html
2. 按 F12 打开控制台
3. 复制以下内容粘贴并执行
4. 点击小键盘按钮，观察控制台输出
 */

(function() {
  console.log('%c🔧 小键盘按钮测试', 'color: #00ff00; font-size: 20px; font-weight: bold;');
  console.log('='.repeat(70));
  
  // 获取元素
  const keypad = document.getElementById('scientific-keypad');
  const field = document.getElementById('calc-expression');
  
  if (!keypad) {
    console.error('❌ 找不到 scientific-keypad 元素');
    return;
  }
  
  if (!field) {
    console.error('❌ 找不到 calc-expression 元素');
    return;
  }
  
  console.log('✅ scientific-keypad 找到');
  console.log('✅ calc-expression 找到, tagName:', field.tagName);
  
  // 检查按钮
  const buttons = keypad.querySelectorAll('button[data-insert], button[data-action]');
  console.log('✅ 找到按钮数量:', buttons.length);
  
  // 检查 MathLive
  if (field.tagName === 'MATH-FIELD') {
    console.log('✅ 是 MATH-FIELD 元素');
    console.log('   shadowRoot:', field.shadowRoot ? '存在' : '不存在');
    
    if (field.shadowRoot) {
      const internalInput = field.shadowRoot.querySelector('input, [contenteditable]');
      console.log('   内部 input:', internalInput ? '存在' : '不存在');
    }
  }
  
  // 添加测试监听器
  console.log('\n📝 现在请点击小键盘按钮，观察控制台输出...\n');
  
  keypad.addEventListener('click', function(event) {
    const button = event.target.closest('button[data-insert], button[data-action]');
    if (!button) {
      console.log('⚠️  点击的不是按钮');
      return;
    }
    
    console.log('🔘 按钮点击事件触发!');
    console.log('   按钮文本:', button.textContent.trim());
    console.log('   data-insert:', button.dataset.insert);
    console.log('   data-action:', button.dataset.action);
    
    // 尝试聚焦
    if (field.tagName === 'MATH-FIELD') {
      console.log('   尝试聚焦到 math-field...');
      field.focus();
      
      setTimeout(() => {
        console.log('   聚焦后 activeElement:', document.activeElement.tagName);
        
        // 尝试直接聚焦内部 input
        if (field.shadowRoot) {
          const internalInput = field.shadowRoot.querySelector('input, [contenteditable]');
          if (internalInput) {
            console.log('   尝试聚焦到内部 input...');
            internalInput.focus();
            internalInput.click();
            
            setTimeout(() => {
              console.log('   内部 input 聚焦后 activeElement:', 
                         field.shadowRoot.activeElement ? field.shadowRoot.activeElement.tagName : 'null');
            }, 50);
          }
        }
        
        // 尝试插入
        if (button.dataset.insert) {
          console.log('   尝试插入:', button.dataset.insert);
          try {
            field.executeCommand('insert', button.dataset.insert);
            console.log('   ✅ 插入成功!');
            console.log('   当前值:', field.getValue());
          } catch (e) {
            console.error('   ❌ 插入失败:', e.message);
          }
        }
      }, 100);
    }
  }, true); // 使用捕获阶段
  
  console.log('✅ 测试监听器已添加');
  console.log('👆 现在点击小键盘按钮测试');
})();
