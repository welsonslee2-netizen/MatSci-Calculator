// ============================================
// 强制修复脚本 - 直接修改样式
// ============================================

console.log('%c🔧 开始强制修复...', 'color: #ff6b6b; font-size: 16px; font-weight: bold;');

// 1. 检查 .main-content 的实际样式
const mainContent = document.querySelector('.main-content');
if (mainContent) {
  const computed = getComputedStyle(mainContent);
  console.log('\n修复前 .main-content:');
  console.log('  overflow:', computed.overflow);
  console.log('  height:', computed.height);
  console.log('  display:', computed.display);
  
  // 强制修改
  mainContent.style.overflow = 'auto';
  mainContent.style.height = 'auto';
  mainContent.style.minHeight = '100%';
  
  console.log('\n修复后 .main-content:');
  console.log('  overflow:', computed.overflow);
}

// 2. 检查 .page-section 的实际样式
const activePage = document.querySelector('.page-section.active');
if (activePage) {
  const computed = getComputedStyle(activePage);
  console.log('\n修复前激活页面:');
  console.log('  display:', computed.display);
  console.log('  position:', computed.position);
  console.log('  top:', computed.top);
  console.log('  height:', computed.height);
  
  // 强制修改
  activePage.style.position = 'relative';
  activePage.style.top = '0';
  activePage.style.left = '0';
  
  console.log('\n修复后激活页面:');
  console.log('  position:', activePage.style.position);
  console.log('  top:', activePage.style.top);
}

// 3. 注入最高优先级的CSS
const fixStyle = document.createElement('style');
fixStyle.textContent = `
  .main-content {
    overflow: auto !important;
    height: auto !important;
  }
  
  .page-section {
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
  }
  
  .page-section.active {
    display: grid !important;
  }
`;
document.head.appendChild(fixStyle);
console.log('\n✅ CSS 已注入');

// 4. 验证修复结果
setTimeout(() => {
  console.log('\n🔍 验证修复结果:');
  
  const mc = document.querySelector('.main-content');
  if (mc) {
    const mcComputed = getComputedStyle(mc);
    console.log('.main-content:');
    console.log('  overflow:', mcComputed.overflow);
    console.log('  height:', mcComputed.height);
  }
  
  const page = document.querySelector('.page-section.active');
  if (page) {
    const pageComputed = getComputedStyle(page);
    const rect = page.getBoundingClientRect();
    console.log('激活页面:', page.id);
    console.log('  display:', pageComputed.display);
    console.log('  position:', pageComputed.position);
    console.log('  top:', pageComputed.top);
    console.log('  rect.top:', rect.top);
    console.log('  rect.height:', rect.height);
    console.log('  children:', page.children.length);
    
    if (rect.height > 0 && rect.top >= 0) {
      console.log('\n✅ 修复成功！页面应该可见了');
    } else {
      console.warn('\n⚠️ 页面可能仍然不可见');
    }
  }
  
  console.log('\n📋 现在测试页面切换：');
  console.log('   点击导航按钮，看是否显示内容');
}, 100);

// 5. 重新绑定导航事件
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const pageId = this.dataset.page;
    console.log('\n👆 切换到:', pageId);
    
    // 隐藏所有
    document.querySelectorAll('.page-section').forEach(p => {
      p.classList.remove('active');
      p.style.cssText = '';
    });
    
    // 显示目标
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      target.style.position = 'relative';
      target.style.top = '0';
      
      // 验证
      setTimeout(() => {
        const rect = target.getBoundingClientRect();
        console.log('  rect.top:', rect.top);
        console.log('  rect.height:', rect.height);
        console.log('  children:', target.children.length);
      }, 50);
    }
    
    // 更新按钮
    document.querySelectorAll('[data-page]').forEach(b => {
      b.classList.toggle('active', b.dataset.page === pageId);
    });
  });
});

console.log('\n✅ 导航事件已绑定');
console.log('\n🎉 修复完成！请测试页面切换');
