// 🔍 全面诊断脚本 - 检查所有模块的输入功能
(function() {
  console.log('🔍 开始全面诊断...');
  console.log('========================================\n');
  
  const results = {
    mathLive: false,
    classicField: false,
    scientificField: false,
    classicKeypad: false,
    scientificKeypad: false,
    eventsBound: false
  };
  
  // 1. 检查 MathLive
  console.log('1️⃣ 检查 MathLive...');
  if (window.MathLive) {
    console.log('   ✅ MathLive 已加载');
    results.mathLive = true;
  } else {
    console.error('   ❌ MathLive 未加载');
  }
  
  // 2. 检查经典计算器输入框
  console.log('\n2️⃣ 检查经典计算器输入框...');
  const classicField = document.getElementById('classic-expression');
  if (classicField) {
    console.log('   ✅ classic-expression 存在');
    console.log('   类型:', classicField.tagName);
    console.log('   display:', getComputedStyle(classicField).display);
    console.log('   visibility:', getComputedStyle(classicField).visibility);
    console.log('   pointer-events:', getComputedStyle(classicField).pointerEvents);
    results.classicField = true;
  } else {
    console.error('   ❌ classic-expression 不存在');
  }
  
  // 3. 检查科学计算器输入框
  console.log('\n3️⃣ 检查科学计算器输入框...');
  const scientificField = document.getElementById('calc-expression');
  if (scientificField) {
    console.log('   ✅ calc-expression 存在');
    console.log('   类型:', scientificField.tagName);
    console.log('   display:', getComputedStyle(scientificField).display);
    console.log('   visibility:', getComputedStyle(scientificField).visibility);
    console.log('   pointer-events:', getComputedStyle(scientificField).pointerEvents);
    results.scientificField = true;
  } else {
    console.error('   ❌ calc-expression 不存在');
  }
  
  // 4. 检查经典计算器小键盘
  console.log('\n4️⃣ 检查经典计算器小键盘...');
  const classicKeypad = document.getElementById('classic-keypad');
  if (classicKeypad) {
    console.log('   ✅ classic-keypad 存在');
    const buttons = classicKeypad.querySelectorAll('.keypad-button');
    console.log('   按钮数量:', buttons.length);
    if (buttons.length > 0) {
      console.log('   第一个按钮:', buttons[0].textContent.trim());
      console.log('   data-action:', buttons[0].dataset.action);
      console.log('   data-insert:', buttons[0].dataset.insert);
    }
    results.classicKeypad = true;
  } else {
    console.error('   ❌ classic-keypad 不存在');
  }
  
  // 5. 检查科学计算器小键盘
  console.log('\n5️⃣ 检查科学计算器小键盘...');
  const scientificKeypad = document.getElementById('scientific-keypad');
  if (scientificKeypad) {
    console.log('   ✅ scientific-keypad 存在');
    const buttons = scientificKeypad.querySelectorAll('[data-insert], [data-action]');
    console.log('   按钮数量:', buttons.length);
    if (buttons.length > 0) {
      console.log('   第一个按钮:', buttons[0].textContent.trim());
      console.log('   data-action:', buttons[0].dataset.action);
      console.log('   data-insert:', buttons[0].dataset.insert);
    }
    results.scientificKeypad = true;
  } else {
    console.error('   ❌ scientific-keypad 不存在');
  }
  
  // 6. 测试点击事件
  console.log('\n6️⃣ 测试点击事件...');
  let clickTestPassed = false;
  
  if (scientificKeypad) {
    const testButton = scientificKeypad.querySelector('[data-insert]');
    if (testButton) {
      testButton.addEventListener('click', function testHandler() {
        console.log('   ✅ 点击事件触发成功！');
        clickTestPassed = true;
        testButton.removeEventListener('click', testHandler);
      }, { once: true });
      
      setTimeout(() => {
        testButton.click();
        
        setTimeout(() => {
          if (clickTestPassed) {
            console.log('   ✅ 点击测试通过');
            results.eventsBound = true;
          } else {
            console.error('   ❌ 点击测试失败');
          }
          
          // 7. 总结
          console.log('\n========================================');
          console.log('📊 诊断结果总结:');
          console.log('========================================');
          console.log('MathLive:', results.mathLive ? '✅' : '❌');
          console.log('经典输入框:', results.classicField ? '✅' : '❌');
          console.log('科学输入框:', results.scientificField ? '✅' : '❌');
          console.log('经典小键盘:', results.classicKeypad ? '✅' : '❌');
          console.log('科学小键盘:', results.scientificKeypad ? '✅' : '❌');
          console.log('事件绑定:', results.eventsBound ? '✅' : '❌');
          console.log('========================================\n');
          
          if (Object.values(results).every(v => v === true)) {
            console.log('✅ 所有检查通过！如果仍无法输入，请运行 emergency-fix-touch.js');
          } else {
            console.error('❌ 发现问题，请查看上面的错误信息');
          }
        }, 100);
      }, 100);
    }
  }
})();
