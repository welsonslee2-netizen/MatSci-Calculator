// ============================================
// 终极修复脚本 - 强制显示所有页面
// ============================================

console.log('%c🔧 开始终极修复...', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');

// 步骤1: 移除所有可能冲突的 CSS 规则
const existingStyles = document.querySelectorAll('style[data-page-fix]');
existingStyles.forEach(s => s.remove());

// 步骤2: 注入最高优先级的 CSS
const fixStyle = document.createElement('style');
fixStyle.setAttribute('data-page-fix', 'true');
fixStyle.textContent = `
  /* 最高优先级覆盖 */
  .page-section {
    display: none !important;
    position: relative !important;
    z-index: 1 !important;
  }
  
  .page-section.active {
    display: grid !important;
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
    z-index: 10 !important;
    min-height: 100px !important;
  }
  
  /* 确保父容器不隐藏子元素 */
  .main-content {
    overflow: auto !important;
    height: auto !important;
    min-height: 100% !important;
  }
`;
document.head.appendChild(fixStyle);

console.log('✅ CSS 规则已注入');

// 步骤3: 重置所有页面状态
console.log('\n📋 重置页面状态...');
const allPages = document.querySelectorAll('.page-section');
allPages.forEach(page => {
  page.classList.remove('active');
  // 清除所有内联样式
  page.style.cssText = '';
});
console.log(`   已重置 ${allPages.length} 个页面`);

// 步骤4: 强制显示首页
const homePage = document.getElementById('home');
if (homePage) {
  homePage.classList.add('active');
  homePage.style.display = 'grid';
  console.log('✅ 首页已激活');
}

// 步骤5: 验证修复
console.log('\n🔍 验证修复结果:');
setTimeout(() => {
  const activePages = document.querySelectorAll('.page-section.active');
  console.log(`   激活的页面数: ${activePages.length}`);
  
  activePages.forEach(page => {
    const computed = getComputedStyle(page);
    console.log(`   ${page.id}:`);
    console.log(`     - display: ${computed.display}`);
    console.log(`     - visibility: ${computed.visibility}`);
    console.log(`     - height: ${computed.height}`);
    console.log(`     - children: ${page.children.length}`);
  });
  
  if (activePages.length > 0) {
    console.log('\n%c✅ 修复完成！请检查页面是否显示', 'color: #6bcb77; font-size: 14px; font-weight: bold;');
    console.log('   如果仍然看不到，请检查上面输出的 display 值');
  } else {
    console.log('\n%c❌ 没有页面被激活', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
  }
}, 100);

// 步骤6: 重新绑定导航事件（确保万无一失）
console.log('\n🔄 重新绑定导航事件...');
document.querySelectorAll('[data-page]').forEach(btn => {
  // 移除旧的事件监听器（克隆节点）
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  // 添加新的事件监听器
  newBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const pageId = this.dataset.page;
    console.log(`👆 点击: ${pageId}`);
    
    // 隐藏所有页面
    document.querySelectorAll('.page-section').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    
    // 显示目标页面
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      target.style.display = 'grid';
      target.scrollTop = 0;
      console.log(`✅ 已切换到: ${pageId}`);
      
      // 验证
      setTimeout(() => {
        const computed = getComputedStyle(target);
        console.log(`   实际 display: ${computed.display}`);
      }, 50);
    } else {
      console.error(`❌ 找不到页面: ${pageId}`);
    }
    
    // 更新按钮状态
    document.querySelectorAll('[data-page]').forEach(b => {
      b.classList.toggle('active', b.dataset.page === pageId);
    });
  });
});

console.log('✅ 导航事件已重新绑定');
console.log('\n%c🎉 终极修复完成！现在尝试点击导航按钮', 'color: #6bcb77; font-size: 16px; font-weight: bold;');
