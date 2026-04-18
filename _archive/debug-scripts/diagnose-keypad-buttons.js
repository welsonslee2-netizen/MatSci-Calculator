// 诊断小键盘按钮是否可用
(function() {
  console.log('🔍 诊断小键盘按钮可用性');
  console.log('========================================');
  
  // 检查科学计算器小键盘
  const scientificKeypad = document.getElementById('scientific-keypad');
  if (!scientificKeypad) {
    console.error('❌ 找不到 scientific-keypad 元素');
    return;
  }
  
  console.log('✅ 找到 scientific-keypad');
  
  // 获取所有按钮
  const buttons = scientificKeypad.querySelectorAll('button[data-insert], button[data-action]');
  console.log(`✅ 找到 ${buttons.length} 个按钮`);
  
  // 检查每个按钮的状态
  console.log('\n📋 按钮状态检查:');
  let clickableCount = 0;
  let notClickableCount = 0;
  
  buttons.forEach((button, index) => {
    const style = window.getComputedStyle(button);
    const rect = button.getBoundingClientRect();
    
    const isVisible = style.display !== 'none' && 
                     style.visibility !== 'hidden' && 
                     rect.width > 0 && 
                     rect.height > 0;
    
    const pointerEvents = style.pointerEvents;
    const zIndex = style.zIndex;
    
    const isClickable = isVisible && pointerEvents !== 'none';
    
    if (isClickable) {
      clickableCount++;
    } else {
      notClickableCount++;
      console.warn(`  ⚠️  按钮 ${index + 1} (${button.textContent.trim()}):`, {
        display: style.display,
        visibility: style.visibility,
        pointerEvents: pointerEvents,
        width: rect.width,
        height: rect.height,
        zIndex: zIndex
      });
    }
  });
  
  console.log(`\n✅ 可点击: ${clickableCount}`);
  console.log(`⚠️  不可点击: ${notClickableCount}`);
  
  // 检查是否有 CSS 遮挡
  console.log('\n🔍 检查 CSS 层级:');
  const keypadStyle = window.getComputedStyle(scientificKeypad);
  console.log('  scientific-keypad z-index:', keypadStyle.zIndex);
  console.log('  scientific-keypad pointer-events:', keypadStyle.pointerEvents);
  console.log('  scientific-keypad position:', keypadStyle.position);
  
  // 检查父容器
  const parent = scientificKeypad.parentElement;
  if (parent) {
    const parentStyle = window.getComputedStyle(parent);
    console.log('  父容器 z-index:', parentStyle.zIndex);
    console.log('  父容器 overflow:', parentStyle.overflow);
  }
  
  // 测试点击事件
  console.log('\n🧪 测试点击事件:');
  let clickTestPassed = false;
  
  const testButton = buttons[0];
  if (testButton) {
    testButton.addEventListener('click', function testHandler(e) {
      console.log('✅ 点击事件触发成功!');
      console.log('   按钮:', this.textContent.trim());
      console.log('   data-insert:', this.dataset.insert);
      clickTestPassed = true;
      testButton.removeEventListener('click', testHandler);
    }, { once: true });
    
    // 模拟点击
    setTimeout(() => {
      testButton.click();
      
      setTimeout(() => {
        if (clickTestPassed) {
          console.log('✅ 点击测试通过');
        } else {
          console.error('❌ 点击测试失败 - 事件没有被触发');
        }
      }, 100);
    }, 100);
  }
  
  // 检查 math-field 状态
  const field = document.getElementById('calc-expression');
  if (field) {
    console.log('\n📝 输入框状态:');
    console.log('  tagName:', field.tagName);
    console.log('  display:', window.getComputedStyle(field).display);
    console.log('  pointer-events:', window.getComputedStyle(field).pointerEvents);
    console.log('  z-index:', window.getComputedStyle(field).zIndex);
    
    if (field.tagName === 'MATH-FIELD') {
      console.log('  ✅ 是 MATH-FIELD 元素');
      console.log('  shadowRoot:', field.shadowRoot ? '存在' : '不存在');
    }
  } else {
    console.error('\n❌ 找不到 calc-expression 元素');
  }
  
  console.log('\n========================================');
  console.log('💡 建议:');
  console.log('   1. 如果按钮显示但不可点击，检查 CSS z-index 和 pointer-events');
  console.log('   2. 如果点击事件不触发，检查是否有其他元素遮挡');
  console.log('   3. 强制刷新页面 (Ctrl+Shift+R) 清除缓存');
})();
