/**
 * MathLive 输入问题 - 一键修复脚本
 * 
 * 使用方法：
 * 1. 打开主应用页面 (index.html)
 * 2. 按 F12 打开控制台
 * 3. 复制此文件全部内容
 * 4. 粘贴到控制台并按 Enter
 * 5. 按照提示操作
 */

(function quickFix() {
  console.log('%c🔧 MathLive 一键修复', 'color: #1f5e87; font-size: 18px; font-weight: bold;');
  console.log('='.repeat(60));
  
  // 步骤 1: 检查 MathLive
  console.log('\n步骤 1: 检查 MathLive...');
  if (!window.MathLive) {
    console.error('❌ MathLive 未加载！请刷新页面重试。');
    console.log('💡 提示: 按 Ctrl+Shift+R 强制刷新');
    return;
  }
  console.log('✅ MathLive 已加载');
  
  // 步骤 2: 获取 math-field 元素
  console.log('\n步骤 2: 查找 math-field 元素...');
  const field = document.getElementById('calc-expression');
  if (!field) {
    console.error('❌ 找不到 calc-expression 元素！');
    console.log('💡 提示: 请确保在"科学计算器"页面');
    return;
  }
  console.log('✅ 找到元素:', field);
  
  // 步骤 3: 检查元素类型
  console.log('\n步骤 3: 检查元素类型...');
  if (field.tagName !== 'MATH-FIELD') {
    console.error('❌ 元素类型错误:', field.tagName);
    console.log('💡 提示: MathLive 可能未正确初始化，请刷新页面');
    return;
  }
  console.log('✅ 元素类型正确: MATH-FIELD');
  
  // 步骤 4: 移除可能阻止点击的样式
  console.log('\n步骤 4: 修复样式...');
  field.style.pointerEvents = 'auto';
  field.style.cursor = 'text';
  field.style.userSelect = 'text';
  field.style.zIndex = '9999';
  field.style.position = 'relative';
  console.log('✅ 样式已修复');
  
  // 步骤 5: 添加事件监听器
  console.log('\n步骤 5: 添加事件监听器...');
  
  // 移除旧的监听器（如果有）
  const newField = field.cloneNode(true);
  field.parentNode.replaceChild(newField, field);
  
  // 重新获取元素
  const newFieldElement = document.getElementById('calc-expression');
  
  // 添加点击事件
  newFieldElement.addEventListener('click', function(e) {
    console.log('👆 点击事件触发');
    this.focus();
    e.stopPropagation();
  });
  
  // 添加焦点事件
  newFieldElement.addEventListener('focus', function() {
    console.log('✅ 获得焦点');
    this.style.boxShadow = '0 0 0 4px rgba(31, 94, 135, 0.3)';
    this.style.borderColor = '#1f5e87';
  });
  
  // 添加失焦事件
  newFieldElement.addEventListener('blur', function() {
    console.log('❌ 失去焦点');
    this.style.boxShadow = '';
    this.style.borderColor = '';
  });
  
  // 添加输入事件
  newFieldElement.addEventListener('input', function() {
    console.log('⌨️ 输入变化:', this.getValue());
  });
  
  // 添加键盘事件
  newFieldElement.addEventListener('keydown', function(e) {
    console.log('🔘 按键:', e.key);
  });
  
  console.log('✅ 事件监听器已添加');
  
  // 步骤 6: 测试功能
  console.log('\n步骤 6: 测试功能...');
  setTimeout(() => {
    try {
      newFieldElement.focus();
      console.log('✅ 聚焦成功');
      
      newFieldElement.executeCommand('insert', 'x');
      console.log('✅ 插入测试字符成功');
      console.log('当前值:', newFieldElement.getValue());
      
      console.log('\n' + '='.repeat(60));
      console.log('%c🎉 修复完成！', 'color: #28a745; font-size: 16px; font-weight: bold;');
      console.log('='.repeat(60));
      console.log('\n✅ 现在请尝试：');
      console.log('   1. 点击表达式输入框');
      console.log('   2. 使用键盘输入公式');
      console.log('   3. 观察控制台日志');
      console.log('\n💡 如果仍然无法输入，请截图控制台日志并发给我');
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
      console.log('\n⚠️ 自动修复失败，请手动检查');
    }
  }, 500);
  
})();
