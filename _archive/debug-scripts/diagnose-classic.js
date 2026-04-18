/**
 * 经典计算器输入框诊断
 * 
 * 使用方法：
 * 1. 确保在"经典计算器"页面
 * 2. 按 F12 打开控制台
 * 3. 复制以下内容粘贴并执行
 * 4. 告诉我输出结果
 */

(function() {
  console.log('%c🔍 经典计算器诊断', 'color: #ff0000; font-size: 20px; font-weight: bold;');
  console.log('='.repeat(70));
  
  // 获取输入框
  const expressionInput = document.getElementById('classic-expression');
  const result = [];
  
  result.push('1️⃣ 输入框存在: ' + (expressionInput ? '✅ YES' : '❌ NO'));
  
  if (!expressionInput) {
    console.log(result.join('\n'));
    console.log('\n❌ 找不到 classic-expression 元素！');
    console.log('💡 请确保在"经典计算器"页面');
    return;
  }
  
  result.push('2️⃣ 元素类型: ' + expressionInput.tagName);
  
  // 检查样式
  const style = window.getComputedStyle(expressionInput);
  result.push('3️⃣ pointer-events: ' + style.pointerEvents);
  result.push('   user-select: ' + style.userSelect);
  result.push('   display: ' + style.display);
  result.push('   visibility: ' + style.visibility);
  
  // 测试聚焦
  try {
    expressionInput.focus();
    const hasFocus = document.activeElement === expressionInput;
    result.push('4️⃣ 聚焦测试: ' + (hasFocus ? '✅ SUCCESS' : '❌ FAILED'));
    result.push('   activeElement: ' + document.activeElement.tagName);
  } catch (e) {
    result.push('4️⃣ 聚焦测试: ❌ ERROR - ' + e.message);
  }
  
  // 测试输入
  try {
    expressionInput.value = '123';
    result.push('5️⃣ 值设置测试: ✅ SUCCESS');
    result.push('   当前值: ' + expressionInput.value);
  } catch (e) {
    result.push('5️⃣ 值设置测试: ❌ ERROR - ' + e.message);
  }
  
  // 输出
  console.log('\n' + result.join('\n'));
  console.log('\n' + '='.repeat(70));
  
  if (!hasFocus) {
    console.log('%c❌ 问题: 无法聚焦', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('💡 可能被其他元素遮挡或禁用了');
  } else {
    console.log('%c✅ 输入框正常', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('💡 请尝试：');
    console.log('   1. 点击输入框');
    console.log('   2. 切换到英文输入法');
    console.log('   3. 直接键盘输入数字或运算符');
  }
})();
