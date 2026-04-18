/**
 * 快速诊断脚本 - 请立即执行
 * 
 * 使用方法：
 * 1. 打开 index.html
 * 2. 按 F12 打开控制台
 * 3. 复制以下内容
 * 4. 粘贴到控制台并按 Enter
 * 5. 将输出结果告诉我
 */

(function() {
  console.log('%c🔍 快速诊断', 'color: #ff0000; font-size: 20px; font-weight: bold;');
  console.log('='.repeat(70));
  
  const results = [];
  
  // 1. MathLive 状态
  results.push('1️⃣ MathLive 加载: ' + (window.MathLive ? '✅ YES' : '❌ NO'));
  
  // 2. 元素存在性
  const field = document.getElementById('calc-expression');
  results.push('2️⃣ 元素存在: ' + (field ? '✅ YES' : '❌ NO'));
  
  if (!field) {
    console.log(results.join('\n'));
    console.log('\n❌ 找不到 calc-expression 元素！');
    console.log('💡 请确保在"科学计算器"页面');
    return;
  }
  
  // 3. 元素类型
  results.push('3️⃣ 元素类型: ' + field.tagName);
  
  // 4. 样式检查
  const style = window.getComputedStyle(field);
  results.push('4️⃣ pointer-events: ' + style.pointerEvents);
  results.push('   user-select: ' + style.userSelect);
  results.push('   display: ' + style.display);
  results.push('   visibility: ' + style.visibility);
  
  // 5. 测试聚焦
  try {
    field.focus();
    const hasFocus = document.activeElement === field;
    results.push('5️⃣ 聚焦测试: ' + (hasFocus ? '✅ SUCCESS' : '❌ FAILED'));
  } catch (e) {
    results.push('5️⃣ 聚焦测试: ❌ ERROR - ' + e.message);
  }
  
  // 6. 测试插入（仅当是 MATH-FIELD 时）
  if (field.tagName === 'MATH-FIELD') {
    try {
      field.executeCommand('insert', 'test');
      results.push('6️⃣ 插入测试: ✅ SUCCESS');
      results.push('   当前值: ' + field.getValue());
    } catch (e) {
      results.push('6️⃣ 插入测试: ❌ ERROR - ' + e.message);
    }
  } else {
    results.push('6️⃣ 插入测试: ⚠️  跳过（不是 MATH-FIELD）');
  }
  
  // 输出结果
  console.log('\n' + results.join('\n'));
  console.log('\n' + '='.repeat(70));
  
  // 判断问题
  if (!window.MathLive) {
    console.log('%c❌ 问题: MathLive 未加载', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('💡 解决方案: 检查网络连接，刷新页面');
  } else if (field.tagName !== 'MATH-FIELD') {
    console.log('%c❌ 问题: math-field 元素未正确注册', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('💡 解决方案: 等待几秒后刷新，或检查 MathLive 版本');
  } else {
    console.log('%c✅ MathLive 和元素都正常', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('💡 如果仍无法输入，可能是:');
    console.log('   - 输入法问题（切换到英文）');
    console.log('   - 浏览器扩展干扰（禁用所有扩展）');
    console.log('   - 操作系统键盘设置问题');
  }
  
  console.log('\n📋 请将以上输出结果复制并发给我');
})();
