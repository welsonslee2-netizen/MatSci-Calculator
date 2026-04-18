// app.js — 主应用逻辑
"use strict";

(function bootstrapApp() {
  // 检查 MSCLab 对象是否已加载
  if (!window.MSCLab) {
    console.error('%c致命错误: MSCLab 对象未加载！', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
    console.error('请检查 data/constants.js, data/elements.js, modules/utils.js, modules/models.js 是否成功加载');
    
    // 显示用户友好的错误提示
    window.addEventListener('DOMContentLoaded', function() {
      const errorMsg = document.createElement('div');
      errorMsg.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#ff6b6b;color:white;padding:1rem;text-align:center;z-index:99999;font-size:1.1rem;';
      errorMsg.innerHTML = '<strong>应用加载失败</strong><br>请刷新页面';
      document.body.insertBefore(errorMsg, document.body.firstChild);
    });
    
    return; // 终止执行
  }
  
  if (!window.MSCLab.Utils || !window.MSCLab.Models) {
    console.error('%c致命错误: Utils 或 Models 模块未加载！', 'color: #ff6b6b; font-size: 14px; font-weight: bold;');
    console.error('MSCLab:', window.MSCLab);
    return; // 终止执行
  }
  
  console.log('%c✅ 依赖检查通过', 'color: #6bcb77; font-weight: bold;');
  
  const Utils = window.MSCLab.Utils;
  const Models = window.MSCLab.Models;
  const constants = window.MSCLab.constantsData || [];
  const elements = window.MSCLab.elementsData || [];
  
  /**
   * 将 MathLive 的 LaTeX 格式转换为 math.js 可计算的格式
   * @param {string} latex - LaTeX 格式的数学表达式
   * @returns {string} - math.js 格式的表达式
   */
  function latexToMathJS(latex) {
    if (!latex) return '';
    
    let expr = latex.trim();
    
    // 0. 清理多余空格
    expr = expr.replace(/\s+/g, ' ');
    
    // 1. 处理函数（按长度降序排列，避免短名匹配干扰长名）
    expr = expr.replace(/\\arcsin/g, 'asin');
    expr = expr.replace(/\\arccos/g, 'acos');
    expr = expr.replace(/\\arctan/g, 'atan');
    expr = expr.replace(/\\arccot/g, 'acot');
    expr = expr.replace(/\\arcsec/g, 'asec');
    expr = expr.replace(/\\arccsc/g, 'acsc');
    expr = expr.replace(/\\arctanh/g, 'atanh');
    expr = expr.replace(/\\sinh/g, 'sinh');
    expr = expr.replace(/\\cosh/g, 'cosh');
    expr = expr.replace(/\\tanh/g, 'tanh');
    expr = expr.replace(/\\coth/g, 'coth');
    expr = expr.replace(/\\sin/g, 'sin');
    expr = expr.replace(/\\cos/g, 'cos');
    expr = expr.replace(/\\tan/g, 'tan');
    expr = expr.replace(/\\cot/g, 'cot');
    expr = expr.replace(/\\sec/g, 'sec');
    expr = expr.replace(/\\csc/g, 'csc');
    expr = expr.replace(/\\ln/g, 'log');  // math.js 的 log 是自然对数
    expr = expr.replace(/\\log_{\\left\(([^)]+)\)}/g, 'log($1,'); // \log_{(base)} -> log(expr, base,
    expr = expr.replace(/\\log_\{([^}]+)\}/g, 'log($1,'); // \log_{base} -> log(expr, base,
    expr = expr.replace(/\\log/g, 'log10');
    expr = expr.replace(/\\exp/g, 'exp');
    expr = expr.replace(/\\sqrt/g, 'sqrt');
    expr = expr.replace(/\\abs/g, 'abs');
    expr = expr.replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, 'combinations($1,$2)'); // C(n,k)
    expr = expr.replace(/\\permutations\{([^}]+)\}\{([^}]+)\}/g, 'permutations($1,$2)'); // P(n,k)
    expr = expr.replace(/\\operatorname\{nPr\}\(/g, 'permutations('); // nPr 函数
    expr = expr.replace(/\\operatorname\{([^}]+)\}/g, '$1');
    
    // 2. 处理常数
    expr = expr.replace(/\\pi/g, 'pi');
    expr = expr.replace(/\\hbar/g, 'hbar');
    expr = expr.replace(/\\e(?![a-zA-Z])/g, 'e');  // 欧拉数（后不跟字母）
    expr = expr.replace(/\\varepsilon_\{0\}/g, 'epsilon0');  // 真空介电常数
    expr = expr.replace(/\\sigma_\{SB\}/g, 'sigmaSB');  // Stefan-Boltzmann 常数
    expr = expr.replace(/e_\{Charge\}/g, 'eCharge');  // 元电荷
    expr = expr.replace(/e_\{\\mathrm\{Charge\}\}/g, 'eCharge');  // 元电荷（MathLive 格式）
    expr = expr.replace(/e_\{\\operatorname\{Charge\}\}/g, 'eCharge');  // 元电荷（MathLive 格式2）
    expr = expr.replace(/m_e/g, 'me');  // 电子质量
    expr = expr.replace(/m_\{e\}/g, 'me');  // 电子质量（MathLive 下标格式）
    expr = expr.replace(/m_\{\\mathrm\{e\}\}/g, 'me');  // 电子质量（MathLive 格式）
    expr = expr.replace(/k_B/g, 'kB');  // 玻尔兹曼常数
    expr = expr.replace(/k_\{B\}/g, 'kB');  // 玻尔兹曼常数（MathLive 下标格式）
    expr = expr.replace(/k_\{\\mathrm\{B\}\}/g, 'kB');  // 玻尔兹曼常数（MathLive 格式）
    expr = expr.replace(/N_A/g, 'Na');  // 阿伏伽德罗常数
    expr = expr.replace(/N_\{A\}/g, 'Na');  // 阿伏伽德罗常数（MathLive 下标格式）
    expr = expr.replace(/N_\{\\mathrm\{A\}\}/g, 'Na');  // 阿伏伽德罗常数（MathLive 格式）
    expr = expr.replace(/\\infty/g, 'Infinity');
    
    // 3. 处理分数 \frac{a}{b} -> (a)/(b)
    expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
    
    // 4. 处理根号 \sqrt[n]{x} 和 \sqrt{x}
    expr = expr.replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, 'nthRoot($2,$1)');
    expr = expr.replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
    
    // 5. 处理括号
    expr = expr.replace(/\\left\(/g, '(');
    expr = expr.replace(/\\right\)/g, ')');
    expr = expr.replace(/\\left\[/g, '[');
    expr = expr.replace(/\\right\]/g, ']');
    expr = expr.replace(/\\left\{/g, '(');   // math.js 用 () 不用 {}
    expr = expr.replace(/\\right\}/g, ')');
    expr = expr.replace(/\\left\|/g, 'abs(');
    expr = expr.replace(/\\right\|/g, ')');
    
    // 5.5 清理 MathLive 占位符 #0（未被替换的）
    expr = expr.replace(/#0/g, '');
    
    // 5.5 处理除号
    expr = expr.replace(/\\div/g, '/');
    
    // 6. 处理幂次 ^{n} -> ^n 和 ^{expr} -> ^(expr)
    expr = expr.replace(/\^\{([^}]+)\}/g, '^($1)');
    expr = expr.replace(/\^(\d)/g, '^$1');
    
    // 7. 处理下标 _{n} -> _n
    expr = expr.replace(/_\{([^}]+)\}/g, '_$1');
    
    // 8. 处理乘号
    expr = expr.replace(/\\cdot/g, '*');
    expr = expr.replace(/\\times/g, '*');
    expr = expr.replace(/\\ast/g, '*');
    
    // 9. 处理 nPr 和 nCr（数学记号）
    expr = expr.replace(/\\mathrm\{P\}\(([^,]+),\s*([^)]+)\)/g, 'permutations($1,$2)');
    expr = expr.replace(/\\mathrm\{C\}\(([^,]+),\s*([^)]+)\)/g, 'combinations($1,$2)');
    
    // 10. 处理极限和求和（简化为数值表达式）
    expr = expr.replace(/\\lim_\{[^}]*\\to[^}]*\}/g, '');
    expr = expr.replace(/\\sum_\{[^}]*\}\^\{[^}]*\}/g, '');
    expr = expr.replace(/\\prod_\{[^}]*\}\^\{[^}]*\}/g, '');
    expr = expr.replace(/\\int_\{[^}]*\}\^\{[^}]*\}/g, '');
    
    // 11. 处理其他特殊符号
    expr = expr.replace(/\\pm/g, '+/-');
    expr = expr.replace(/\\neq/g, '!=');
    expr = expr.replace(/\\leq/g, '<=');
    expr = expr.replace(/\\geq/g, '>=');
    expr = expr.replace(/\\approx/g, '~~');
    expr = expr.replace(/\\partial/g, '');
    expr = expr.replace(/\\infty/g, 'Infinity');
    
    // 12. 插入隐式乘法：数字紧跟变量/函数名的情况
    // 例如 3x -> 3*x, 2sin -> 2*sin, 3( -> 3*(
    // 数字后跟字母（非函数名已知部分）：2a -> 2*a
    expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    // 闭合括号后跟数字或左括号：)2 -> )*2, )( -> )*(
    expr = expr.replace(/\)(\d)/g, ')*$1');
    expr = expr.replace(/\)\(/g, ')*(');
    expr = expr.replace(/\)([a-zA-Z])/g, ')*$1');
    // 数字后跟左括号：3( -> 3*(
    expr = expr.replace(/(\d)\(/g, '$1*(');
    
    // 13. 清理多余空格
    expr = expr.replace(/\s+/g, '');
    
    // 14. 修复可能的连续 * 号
    expr = expr.replace(/\*{2,}/g, '*');
    
    // 15. 修复 log(base, 语法（从步骤 1 的 \log_{base} 转换来的）
    // log(base, expression -> log(expression, base)
    expr = expr.replace(/log\(([^,]+),/g, function(match, base) {
      // 找到匹配的右括号
      const startIdx = expr.indexOf(match);
      if (startIdx === -1) return match;
      const innerStart = startIdx + match.length;
      let depth = 1;
      let i = innerStart;
      for (; i < expr.length; i++) {
        if (expr[i] === '(') depth++;
        if (expr[i] === ')') depth--;
        if (depth === 0) break;
      }
      const basePart = base;
      const exprPart = expr.substring(innerStart, i);
      return 'log(' + exprPart + ',' + basePart + ')';
    });
    
    return expr;
  }
  
  /**
   * 安全地从 math-field 元素获取表达式（自动转换 LaTeX）
   * @param {string} elementId - 元素 ID
   * @returns {string} - math.js 格式的表达式
   */
  function getMathFieldExpression(elementId) {
    const element = getById(elementId);
    if (!element) {
      console.error('元素不存在:', elementId);
      return '';
    }
    
    // 检查是否是 math-field 元素
    if (element.tagName === 'MATH-FIELD') {
      // MathLive 的 value 属性返回 LaTeX 格式
      const latex = element.value || '';
      
      if (!latex) {
        return '';
      }
      
      // 检查是否包含 LaTeX 命令（有反斜杠）
      // 如果没有反斜杠，说明是纯文本格式，直接返回
      if (!latex.includes('\\')) {
        return latex.trim();
      }
      
      // 有 LaTeX 命令，需要转换
      return latexToMathJS(latex);
    } else {
      // 普通 input 元素
      return element.value || '';
    }
  }

  const state = {
    history: [],
    scratchpad: [],
    selectedElement: null,
    compareA: null,
    compareB: null,
    constantFilter: "all",
    language: "en",
    classicAngleMode: "rad",
    activePage: "home",
    analysisPanel: "derivative",
    calcPanel: "evaluate",
    calcAnalysisPanel: "derivative",
    elementPanel: "library",
    visualPanel: "sweep",
    strengthTab: "hall-petch"
  };

  const translations = {
    en: {
      sidebarEyebrow: "Scientific Prototype",
      sidebarCopy: "Materials computation, reference data, and strengthening analysis in one local dashboard.",
      languageLabel: "Language",
      navHome: "Home",
      navClassic: "Classic Calculator",
      navScientific: "Scientific Calculator",
      navAnalysis: "Function Analysis",
      navCalculator: "Scientific Calculator",
      navConstants: "Constants Library",
      navElements: "Elements Library",
      navStrengthening: "Materials Strengthening",
      navVisual: "Visual Lab",
      navPrimaryAria: "Primary navigation",
      mobileNavAria: "Workspace navigation",
      panelNavEyebrow: "Workspaces",
      module01Label: "Module 01",
      module02Label: "Module 02",
      module03Label: "Module 03",
      module04Label: "Module 04",
      module05Label: "Module 05",
      module06Label: "Module 06",
      module07Label: "Module 07",
      classicSectionCopy: "A keypad-first calculator workspace for quick bilingual calculations on desktop and mobile.",
      classicSectionTag: "Keypad-first panel workflow",
      calcSectionTitle: "Scientific Calculator",
      calcSectionCopy: "Supports expression evaluation, scientific notation, common physical constants, and practical one-variable numerical tools.",
      calcSectionTag: "Radians by default for trigonometric functions",
      analysisSectionTitle: "Function Analysis",
      analysisSectionCopy: "Derivative, integration, root solving, and plotting are separated into focused solver panels so each task stays compact on smaller screens.",
      analysisSectionTag: "One focused solver per panel",
      classicEyebrow: "Bilingual Module",
      classicTitle: "Classic Calculator",
      classicCopy: "Symbol-first keypad for bilingual use. Mathematical symbols stay universal while language-specific labels switch cleanly between English and Chinese.",
      classicExpressionLabel: "Expression",
      classicExpressionPlaceholder: "Use the symbol-first keypad above or type directly",
      classicResult: "Result",
      classicMeta: "Symbol-first input with DEG/RAD trig support.",
      classicClear: "Clear",
      classicBack: "Back",
      classicKeypadAria: "Classic calculator keypad",
      expressionConsoleTitle: "Expression Console",
      expressionConsoleCopy: "Use `^` for powers, `sqrt()`, `log()`, `log10()`, `sin()`, `cos()`, `tan()`, and built-in constant aliases.",
      calcEvaluate: "Evaluate",
      calcReset: "Reset",
      expressionLabel: "Expression",
      calcExpressionPlaceholder: "Example: (3.2e3 * sin(pi / 4)) / (R * 298)",
      resultLabel: "Result",
      calcMeta: "Engineering-friendly formatting will appear here after evaluation.",
      readyLabel: "Ready",
      historyTitle: "Recent Calculations",
      historyCopy: "Local session history for quick re-use.",
      historyEmpty: "No calculations yet. Evaluate an expression to seed the history panel.",
      reuseLabel: "Reuse",
      angleDeg: "DEG",
      angleRad: "RAD",
      errorLabel: "Error",
      calcEvalSuccess: "Expression evaluated successfully.",
      calcRawValuePrefix: "Raw value",
      calcCheckSyntax: "Check expression syntax and constant aliases.",
      classicReady: "Classic keypad ready.",
      classicErrorPrefix: "Error",
      pageTitle: "MatSci Calculator Lab",
      pageDescription: "A lightweight materials-science calculator and visualization prototype for students, researchers, and engineers.",
      prototypeVersion: "Prototype v1",
      sidebarCardCopy: "Built with plain HTML, CSS, and JavaScript for lightweight local use with no backend.",
      homeHeroEyebrow: "Materials Engineering Workspace",
      homeHeroTitle: "Run calculations, inspect property data, and explore strengthening models in a single scientific interface.",
      homeHeroCopy: "This prototype is tuned for quick what-if analysis, classroom explanation, and early-stage research workflows. It balances calculator utility with materials-specific teaching visuals.",
      homeHeroPrimary: "Start Calculating",
      homeHeroSecondary: "Open Strengthening Models",
      metricModules: "Main modules",
      metricConstants: "Constants ready",
      metricElements: "Elements seeded",
      metricStrengthening: "Strengthening models",
      workspaceTitle: "Research Scratchpad",
      workspaceCopy: "Selections from the constants and elements libraries land here for future calculator workflows.",
      clearAction: "Clear",
      modulesEyebrow: "Modules",
      modulesTitle: "Core tools in the prototype",
      homeCardCalculatorTitle: "Scientific Calculator",
      homeCardCalculatorCopy: "Evaluate expressions, run derivatives and integrations, solve roots, and plot one-variable functions.",
      homeCardCalculatorLink: "Open module",
      homeCardClassicTitle: "Classic Calculator",
      homeCardClassicCopy: "Use the symbol-first keypad with DEG/RAD switching for quick scientific arithmetic on phones and desktops.",
      homeCardClassicLink: "Open classic panel",
      homeCardAnalysisTitle: "Function Analysis",
      homeCardAnalysisCopy: "Switch between derivative, integral, root-solver, and plotting tools without scrolling through unrelated controls.",
      homeCardAnalysisLink: "Open analysis",
      homeCardConstantsTitle: "Constants Library",
      homeCardConstantsCopy: "Search mathematical, physical, and thermodynamic constants with copy and calculator insertion actions.",
      homeCardConstantsLink: "Browse constants",
      homeCardElementsTitle: "Elements Library",
      homeCardElementsCopy: "Inspect a curated materials-focused elemental database and compare two elements side by side.",
      homeCardElementsLink: "Explore elements",
      homeCardStrengthTitle: "Materials Strengthening",
      homeCardStrengthCopy: "Estimate Hall-Petch, dislocation, cutting, and Orowan contributions with formulas and comparison charts.",
      homeCardStrengthLink: "Study strengthening",
      homeCardVisualTitle: "Visual Lab",
      homeCardVisualCopy: "Run parameter sweeps and live comparison plots to see how key strengthening variables reshape trends.",
      homeCardVisualLink: "Open visual lab",
      scratchpadEmpty: "Use a constant or element action to stage values here.",
      sharedNa: "n/a",
      sharedInf: "Inf",
      sharedNegInf: "-Inf",
      derivativeTitle: "Numerical Derivative",
      derivativeCopy: "Central-difference estimate of \\( f'(x) \\).",
      field_functionFx: "Function \\( f(x) \\)",
      field_pointX: "Point \\( x \\)",
      actionCompute: "Compute",
      derivativeOutputTitle: "Estimated derivative",
      derivativeOutputNote: "Central-difference estimate at the selected x-value.",
      integralTitle: "Definite Integration",
      integralCopy: "Simpson integration of \\( \\int_a^b f(x)\\,dx \\).",
      field_lowerBound: "Lower bound \\( a \\)",
      field_upperBound: "Upper bound \\( b \\)",
      field_subintervals: "Subintervals",
      actionIntegrate: "Integrate",
      integralOutputTitle: "Integral value",
      integralOutputNote: "Simpson rule using the chosen interval and subinterval count.",
      rootTitle: "Equation Root Finder",
      rootCopy: "Secant-method estimate for one-variable roots of \\( f(x)=0 \\).",
      field_initialGuess0: "Initial guess \\( x_0 \\)",
      field_initialGuess1: "Initial guess \\( x_1 \\)",
      field_tolerance: "Tolerance",
      actionFindRoot: "Find Root",
      rootOutputTitle: "Estimated root",
      rootResidualTemplate: "Residual: {residual} after {iterations} iterations.",
      plotterTitle: "Function Plotter",
      plotterCopy: "Plot \\( y=f(x) \\) for quick inspection.",
      analysisTabsAria: "Function analysis panels",
      analysisTabDerivative: "Derivative",
      analysisTabIntegral: "Integral",
      analysisTabRoot: "Root Solver",
      analysisTabPlot: "Plot",
      calcTabEvaluate: "Evaluate",
      calcTabAnalysis: "Derivative / Integral / Root",
      calcTabSymbolic: "Symbolic Calculus",
      calcTabPlot: "Plot f(x)",
      calcTabTaylor: "Taylor Series",
      symTabDerivative: "Derivative",
      symTabPartial: "Partial Derivative",
      symTabIntegral: "Integral",
      symTabODE: "Differential Equation",
      symDerivativeTitle: "Symbolic Derivative",
      symDerivativeCopy: "Compute the symbolic derivative d/dx of f(x). Supports multi-order derivatives.",
      symPartialTitle: "Partial Derivative",
      symPartialCopy: "Compute the partial derivative of a multivariate function f(x, y, z, ...).",
      symIntegralTitle: "Symbolic Integration",
      symIntegralCopy: "Compute the indefinite or definite integral \u222Bf(x)dx.",
      symOdeTitle: "Ordinary Differential Equation",
      symOdeCopy: "Solve first-order ODEs symbolically (e.g., y' = f(x, y)). Input the equation and solve for y.",
      symFieldFx: "Function f(x)",
      symFieldFxy: "Function f(x, y, ...)",
      symFieldVariable: "Variable",
      symFieldOrder: "Order (nth derivative)",
      symFieldDiffVar: "Variable to differentiate",
      symFieldPartialOrder: "Order (nth partial)",
      symFieldLower: "Lower bound (leave empty for indefinite)",
      symFieldUpper: "Upper bound (leave empty for indefinite)",
      symFieldOdeExpr: "ODE: y' = f(x, y)",
      symFieldIndepVar: "Independent variable",
      symFieldDepVar: "Dependent variable",
      symActionDerivative: "Compute Derivative",
      symActionPartial: "Compute Partial",
      symActionAllPartials: "All First Partials",
      symActionIntegrate: "Integrate",
      symActionOde: "Solve ODE",
      symCalcEngine: "Computed using symbolic differentiation (nerdamer)",
      symPartialNote: "Partial derivative with respect to",
      symDetectedVars: "Detected variables",
      symDefiniteIntegral: "Definite Integral",
      symIndefiniteIntegral: "Indefinite Integral",
      symPlusConstant: "plus constant of integration",
      symErrorPrefix: "Error",
      symOdeDirectIntegration: "Direct integration (no y dependence)",
      symOdeCannotIntegrate: "Cannot integrate",
      symOdeSeparation: "Separation of variables (no x dependence)",
      symOdeCannotSolve: "Cannot solve by separation",
      symOdeGeneralHint: "For general ODEs, try separation of variables: rewrite as f\u2081(x)dx = f\u2082(y)dy.",
      symOdeAttempted: "Attempted solution",
      symOdeErrorPrefix: "ODE error",
      taylorTitle: "Taylor / Maclaurin Series",
      taylorCopy: "Expand \\( f(x) \\) around a center point. Compare the series approximation with the original function.",
      taylorCenter: "Center \\( a \\)",
      taylorOrder: "Order (max degree)",
      actionTaylorExpand: "Expand",
      taylorOutputTitle: "Taylor Expansion",
      taylorOutputCoefficients: "Coefficients (n-th derivative at a divided by n!)",
      taylorOutputValue: "Approximation at x = {x}: {value}",
      taylorOutputExact: "Exact value: {exact}",
      taylorOutputError: "Error: {error}",
      taylorPlotTitle: "Taylor Approximation vs Original",
      field_functionYx: "Function \\( y(x) \\)",
      field_xMin: "x minimum",
      field_xMax: "x maximum",
      field_points: "Points",
      actionPlotFunction: "Plot Function",
      plotStatusTitle: "Plot status",
      plotStatusValue: "Rendered {count} samples",
      plotStatusNote: "Invalid points are omitted automatically to keep the curve readable.",
      chartFunctionPlotTitle: "Function Plot",
      axisX: "x",
      axisY: "y",
      calcShortcutsAria: "Calculator shortcuts",
      constantsSectionTitle: "Constants Library",
      constantsSectionCopy: "A searchable seed dataset of mathematical, physical, and thermodynamic constants for fast reuse.",
      searchConstantsLabel: "Search constants",
      searchConstantsPlaceholder: "Search by name, symbol, alias, or category",
      constantFiltersAria: "Constant categories",
      constantCategory_all: "All",
      constantCategory_mathematical: "Mathematical",
      constantCategory_physical: "Physical",
      constantCategory_thermodynamic: "Thermodynamic",
      constantsEmpty: "No constants match the current search and category filter.",
      constantAliasLabel: "alias",
      actionCopyValue: "Copy value",
      actionUseInCalculator: "Use in calculator",
      toastConstantCopied: "{name} copied.",
      toastClipboardUnavailable: "Clipboard copy is unavailable in this browser.",
      toastConstantInserted: "{name} inserted into the calculator.",
      elementsSectionTitle: "Elements Library",
      elementsSectionCopy: "A materials-focused elemental reference with quick comparison support and future-calculator scratchpad actions.",
      elementsSectionTag: "Periodic-table-inspired cards",
      searchElementsLabel: "Search elements",
      searchElementsPlaceholder: "Search by symbol, name, crystal structure, or notes",
      elementsHint: "Click a card to inspect details and stage comparisons.",
      elementsEmpty: "No elements match the current search.",
      elementDetailTitle: "Element Detail",
      elementDetailCopy: "Select a card to inspect materials-relevant properties.",
      elementDetailPlaceholder: "Choose an element to populate this panel.",
      compareTitle: "Compare Two Elements",
      compareCopy: "Set comparison slots A and B from the detail panel.",
      elementsTabsAria: "Elements panels",
      elementsTabLibrary: "Library",
      elementsTabDetail: "Detail",
      elementsTabCompare: "Compare",
      selectedElementEyebrow: "Selected element",
      compareActionA: "Set as compare A",
      compareActionB: "Set as compare B",
      queuePropertiesAction: "Queue key properties",
      compareSlotPrefix: "Slot",
      compareAwaitingSelection: "Awaiting selection",
      compareFieldStructure: "Structure",
      compareFieldDensity: "Density",
      compareFieldMeltingPoint: "Melting point",
      compareFieldElectronegativity: "Electronegativity",
      compareFieldValence: "Valence",
      compareFieldAtomicNumber: "Atomic number",
      compareFieldAtomicWeight: "Atomic weight",
      compareFieldAtomicRadius: "Atomic radius",
      compareFieldCovalentRadius: "Covalent radius",
      compareFieldMetallicRadius: "Metallic radius",
      compareFieldCrystalStructure: "Crystal structure",
      compareFieldCommonValence: "Common valence",
      toastElementAssigned: "{name} assigned to slot {slot}.",
      toastElementStaged: "{name} staged in the workspace.",
      strengthSectionTitle: "Materials Strengthening",
      strengthSectionCopy: "Educational engineering models for microstructural strengthening. Inputs are user-editable, formulas are rendered, and outputs can be compared directly.",
      materialsWorkspaceTitle: "Materials Workspace",
      materialsWorkspaceCopy: "Queued constants and element properties appear here to support future material calculators and teaching workflows.",
      strengthTabsAria: "Strengthening models",
      tabHallPetch: "Hall-Petch",
      tabDislocation: "Dislocation",
      tabCutting: "Cutting",
      tabOrowan: "Orowan",
      tabComparison: "Comparison",
      hpTitle: "Hall-Petch Strengthening",
      hpCopy: "Use a base friction stress and a Hall-Petch coefficient to estimate the grain-size contribution to yield strength.",
      field_baseStress: "Base stress \\( \\sigma_0 \\)",
      field_stressUnit: "Stress unit",
      field_hallPetchCoefficient: "\\( k_y \\) [MPa*m\\(^{1/2}\\)]",
      field_grainSize: "Grain size \\( d \\)",
      field_grainUnit: "Grain size unit",
      actionUpdateModel: "Update Model",
      actionReset: "Reset",
      // Custom Formula Editor
      customFormulaTitle: "Custom Formula Editor",
      customFormulaCopy: "Create and manage custom strengthening formulas with parameter management.",
      formulaName: "Formula Name",
      selectPreset: "Select Preset Template",
      formulaExpression: "Formula Expression (LaTeX)",
      calculationExpression: "Calculation Expression (JavaScript)",
      formulaParameters: "Formula Parameters",
      actionCalculate: "Calculate",
      actionSaveFormula: "Save Formula",
      actionLoadFormula: "Load Formula",
      actionClear: "Clear",
      savedFormulas: "Saved Formulas",
      hpOutputIncrementLabel: "Strength increment",
      hpOutputIncrementNote: "Grain-boundary strengthening contribution.",
      hpOutputTotalLabel: "Total yield estimate",
      hpOutputTotalNote: "Base stress plus Hall-Petch increment.",
      hpOutputGrainLabel: "Converted grain size",
      hpOutputGrainNote: "Internal SI conversion keeps ky consistent.",
      disTitle: "Dislocation Strengthening",
      disCopy: "A compact Taylor-style estimate using shear modulus, Burgers vector, and dislocation density.",
      field_alpha: "\\( \\alpha \\)",
      field_shearModulus: "Shear modulus \\( G \\) [GPa]",
      field_burgersVector: "Burgers vector \\( b \\) [nm]",
      field_dislocationDensity: "Dislocation density \\( \\rho \\) [m\\(^{-2}\\)]",
      disOutputIncrementLabel: "Strength increment",
      disOutputIncrementNote: "Taylor-style estimate from dislocation density.",
      disOutputInterpretationLabel: "Interpretation",
      disOutputInterpretationValue: "Higher \\u03c1 raises \\u0394\\u03c3",
      disOutputInterpretationNote: "The square-root dependence makes density changes influential but sublinear.",
      cutTitle: "Cutting / Shearing-Based Precipitate Strengthening",
      cutCopy: "This simplified educational model blends volume fraction, precipitate size, and APB energy into a qualitative strength estimate.",
      field_precipitateRadius: "Radius \\( r \\) [nm]",
      field_volumeFraction: "Volume fraction \\( f \\)",
      field_apbEnergy: "\\( \\gamma_{APB} \\) [mJ/m\\(^2\\)]",
      field_cuttingCoefficient: "Coefficient \\( k_c \\)",
      cutOutputIncrementLabel: "Strength increment",
      cutOutputIncrementNote: "Simplified precipitate shearing estimate.",
      cutOutputRadiusLabel: "Radius effect",
      cutOutputRadiusValue: "Smaller r -> higher \\u0394\\u03c3",
      cutOutputRadiusNote: "The model strengthens as the obstacle radius decreases.",
      cutOutputModelLabel: "Model note",
      cutOutputModelValue: "Educational simplification",
      cutOutputModelNote: "Use for trend intuition, not literature-grade prediction.",
      chartCutLegend: "Cutting",
      chartCutTitle: "Cutting Sensitivity vs. Radius",
      axisPrecipitateRadius: "Precipitate radius (nm)",
      axisCutStrength: "\\u0394\\u03c3_cut (MPa)",
      orTitle: "Orowan Bypass Strengthening",
      orCopy: "Estimate the bypass strengthening when dislocations loop between particles instead of cutting them.",
      field_interparticleSpacing: "Spacing \\( \\lambda \\) [nm]",
      field_poissonRatio: "Poisson ratio \\( \\nu \\)",
      orOutputIncrementLabel: "Strength increment",
      orOutputIncrementNote: "Looping contribution for non-shearable particles.",
      orOutputSpacingLabel: "Spacing effect",
      orOutputSpacingValue: "Smaller \\u03bb -> higher \\u0394\\u03c3",
      orOutputSpacingNote: "Closer particles tighten the bypass path.",
      orOutputModelLabel: "Model note",
      orOutputModelValue: "Bypass-dominated regime",
      orOutputModelNote: "Useful for contrasting with shearing behavior.",
      chartOrowanLegend: "Orowan",
      chartOrowanTitle: "Orowan Sensitivity vs. Spacing",
      axisInterparticleSpacing: "Interparticle spacing (nm)",
      axisOrowanStrength: "\\u0394\\u03c3_Or (MPa)",
      comparisonPanelTitle: "Strengthening Comparison",
      comparisonPanelCopy: "Compare the current contributions from the four models using the active input values above.",
      comparisonEmpty: "Valid strengthening inputs are required to compare contributions.",
      comparisonSummaryHeading: "Interpretation",
      comparisonSummaryTemplate: "{mechanism} is currently the dominant strengthening contribution at {value} MPa. {detail}",
      comparisonSummaryShearing: "The current precipitate settings favor shearing over bypass.",
      comparisonSummaryBypass: "The current precipitate settings lean toward bypass or non-precipitate mechanisms.",
      comparisonTableMechanism: "Mechanism",
      comparisonTableContribution: "Contribution",
      chartComparisonTitle: "Strengthening Contribution Comparison",
      axisMechanism: "Mechanism",
      axisStrengthIncrement: "\\u0394\\u03c3 (MPa)",
      visualSectionTitle: "Visual Lab",
      visualSectionCopy: "Interactive parameter sweeps and live comparison graphics for strengthening intuition.",
      visualTabsAria: "Visual lab panels",
      visualTabSweep: "Sweep Plot",
      visualTabCompare: "Mechanism Compare",
      visualTabSchematic: "Schematic",
      visualControlTitle: "Parameter Sweep Controls",
      visualControlCopy: "Choose one variable to sweep while keeping the rest fixed at the form values.",
      field_sweepTarget: "Sweep target",
      sweepOptionHallPetch: "Hall-Petch grain size",
      sweepOptionCutting: "Cutting precipitate radius",
      sweepOptionOrowan: "Orowan spacing",
      field_minValue: "Minimum value",
      field_maxValue: "Maximum value",
      field_samples: "Samples",
      field_radiusSlider: "Radius slider [nm]",
      field_spacingSlider: "Spacing slider [nm]",
      actionUpdateVisuals: "Update Visuals",
      visualSchematicTitle: "Precipitate Spacing Schematic",
      visualSchematicCopy: "A simple live sketch to connect slider changes with obstacle size and spacing.",
      schematicAria: "Precipitate spacing schematic",
      chartHallPetchSweepTitle: "Hall-Petch Grain Size Sweep",
      axisGrainSize: "Grain size (um)",
      chartCuttingSweepTitle: "Cutting Radius Sweep",
      chartOrowanSweepTitle: "Orowan Spacing Sweep",
      axisVisualStrength: "Strength increment (MPa)",
      chartVisualCompareTitle: "Cutting vs. Orowan as Radius Changes",
      chartCurrentRadius: "Current radius",
      chartCurrentSpacing: "Current spacing state",
      schematicSpacingPrefix: "spacing ~",
      schematicRadiusPrefix: "radius ~",
      footerNote: "Prototype for scientific exploration and educational calculation. Engineering decisions should still be validated against literature, calibrated models, and experimentally grounded inputs.",
      errorUnknown: "An unexpected error occurred.",
      errorMathJsLoad: "math.js failed to load. Check CDN access or your internet connection.",
      errorExpressionInvalid: "Expression could not be parsed. Check syntax and supported functions.",
      errorScalarOnly: "Expression did not resolve to a real scalar value.",
      errorEmptyExpression: "Enter an expression before evaluating.",
      errorEmptyFunction: "Enter a function expression first.",
      errorInvalidDerivativeInputs: "Provide a finite evaluation point and positive step size.",
      errorInvalidIntegralBounds: "Provide distinct finite integration bounds.",
      errorInvalidIntegralSteps: "Use at least 20 Simpson subintervals.",
      errorInvalidRootGuesses: "Choose two distinct finite starting guesses.",
      errorRootSlopeZero: "Secant slope collapsed near zero. Try different initial guesses.",
      errorRootDiverged: "Root iteration diverged. Try a tighter bracket or different guesses.",
      errorRootNoConvergence: "No root convergence within the iteration limit.",
      errorInvalidPlotRange: "Set a valid increasing x-range.",
      errorPositiveRequired: "{field} must be a positive number.",
      errorUnsupportedLengthUnit: "Unsupported length unit: {unit}",
      errorVolumeFractionRange: "Volume fraction should stay below 1 for this simplified model.",
      errorInvalidPoissonRatio: "Poisson ratio should lie between 0 and 0.49.",
      errorInvalidSweepRange: "Sweep minimum must be lower than the maximum."
    },
    zh: {
      sidebarEyebrow: "\u79d1\u5b66\u539f\u578b",
      sidebarCopy: "\u5728\u4e00\u4e2a\u672c\u5730\u4eea\u8868\u677f\u4e2d\u5b8c\u6210\u6750\u6599\u8ba1\u7b97\u3001\u53c2\u8003\u6570\u636e\u4e0e\u5f3a\u5316\u5206\u6790\u3002",
      languageLabel: "\u8bed\u8a00",
      navHome: "\u4e3b\u9875",
      navClassic: "\u7ecf\u5178\u8ba1\u7b97\u5668",
      navScientific: "\u79d1\u5b66\u8ba1\u7b97\u5668",
      navAnalysis: "\u51fd\u6570\u5206\u6790",
      navCalculator: "\u79d1\u5b66\u8ba1\u7b97\u5668",
      navConstants: "\u5e38\u6570\u5e93",
      navElements: "\u5143\u7d20\u5e93",
      navStrengthening: "\u5f3a\u5316\u6a21\u5757",
      navVisual: "\u53ef\u89c6\u5316\u5b9e\u9a8c\u5ba4",
      navPrimaryAria: "\u4e3b\u5bfc\u822a",
      mobileNavAria: "\u5de5\u4f5c\u533a\u5bfc\u822a",
      panelNavEyebrow: "\u5de5\u4f5c\u533a",
      module01Label: "\u6a21\u5757 01",
      module02Label: "\u6a21\u5757 02",
      module03Label: "\u6a21\u5757 03",
      module04Label: "\u6a21\u5757 04",
      module05Label: "\u6a21\u5757 05",
      module06Label: "\u6a21\u5757 06",
      module07Label: "\u6a21\u5757 07",
      classicSectionCopy: "\u4e3a\u624b\u673a\u548c\u684c\u9762\u573a\u666f\u8bbe\u8ba1\u7684\u952e\u76d8\u4f18\u5148\u8ba1\u7b97\u9762\u677f\uff0c\u4fbf\u4e8e\u5feb\u901f\u53cc\u8bed\u79d1\u5b66\u8ba1\u7b97\u3002",
      classicSectionTag: "\u952e\u76d8\u4f18\u5148\u7684\u9762\u677f\u6d41\u7a0b",
      calcSectionTitle: "\u79d1\u5b66\u8ba1\u7b97\u5668",
      calcSectionCopy: "\u652f\u6301\u8868\u8fbe\u5f0f\u6c42\u503c\u3001\u79d1\u5b66\u8ba1\u6570\u6cd5\u3001\u5e38\u7528\u7269\u7406\u5e38\u6570\u4ee5\u53ca\u5b9e\u7528\u7684\u5355\u53d8\u91cf\u6570\u503c\u5de5\u5177\u3002",
      calcSectionTag: "\u4e09\u89d2\u51fd\u6570\u9ed8\u8ba4\u4f7f\u7528\u5f27\u5ea6",
      analysisSectionTitle: "\u51fd\u6570\u5206\u6790",
      analysisSectionCopy: "\u5c06\u6c42\u5bfc\u3001\u79ef\u5206\u3001\u6c42\u6839\u548c\u7ed8\u56fe\u62c6\u5206\u4e3a\u72ec\u7acb\u6c42\u89e3\u9762\u677f\uff0c\u8ba9\u79fb\u52a8\u7aef\u66f4\u52a0\u7d27\u51d1\u9ad8\u6548\u3002",
      analysisSectionTag: "\u4e00\u4e2a\u9762\u677f\u5bf9\u5e94\u4e00\u4e2a\u5206\u6790\u4efb\u52a1",
      classicEyebrow: "\u53cc\u8bed\u6a21\u5757",
      classicTitle: "\u7ecf\u5178\u8ba1\u7b97\u5668",
      classicCopy: "\u91c7\u7528\u7b26\u53f7\u4f18\u5148\u7684\u952e\u76d8\u8bbe\u8ba1\u3002\u6570\u5b66\u7b26\u53f7\u5728\u82f1\u6587\u548c\u4e2d\u6587\u6a21\u5f0f\u4e0b\u4fdd\u6301\u4e00\u81f4\uff0c\u53ea\u5bf9\u771f\u6b63\u9700\u8981\u7ffb\u8bd1\u7684\u6807\u7b7e\u8fdb\u884c\u5207\u6362\u3002",
      classicExpressionLabel: "\u8868\u8fbe\u5f0f",
      classicExpressionPlaceholder: "\u4f7f\u7528\u4e0a\u65b9\u7b26\u53f7\u952e\u76d8\u6216\u76f4\u63a5\u8f93\u5165",
      classicResult: "\u7ed3\u679c",
      classicMeta: "\u7b26\u53f7\u4f18\u5148\u8f93\u5165\uff0c\u652f\u6301\u89d2\u5ea6/\u5f27\u5ea6\u4e09\u89d2\u51fd\u6570\u3002",
      classicClear: "\u6e05\u9664",
      classicBack: "\u9000\u683c",
      classicKeypadAria: "\u7ecf\u5178\u8ba1\u7b97\u5668\u952e\u76d8",
      expressionConsoleTitle: "\u8868\u8fbe\u5f0f\u63a7\u5236\u53f0",
      expressionConsoleCopy: "\u53ef\u4f7f\u7528 `^` \u8868\u793a\u5e42\uff0c`sqrt()`\u3001`log()`\u3001`log10()`\u3001`sin()`\u3001`cos()`\u3001`tan()` \u4ee5\u53ca\u5185\u7f6e\u5e38\u6570\u522b\u540d\u3002",
      calcEvaluate: "\u6c42\u503c",
      calcReset: "\u91cd\u7f6e",
      expressionLabel: "\u8868\u8fbe\u5f0f",
      calcExpressionPlaceholder: "\u793a\u4f8b\uff1a(3.2e3 * sin(pi / 4)) / (R * 298)",
      resultLabel: "\u7ed3\u679c",
      calcMeta: "\u6c42\u503c\u540e\u5c06\u5728\u6b64\u663e\u793a\u5de5\u7a0b\u53cb\u597d\u7684\u683c\u5f0f\u3002",
      readyLabel: "\u5c31\u7eea",
      historyTitle: "\u6700\u8fd1\u8ba1\u7b97",
      historyCopy: "\u672c\u5730\u4f1a\u8bdd\u5386\u53f2\uff0c\u4fbf\u4e8e\u5feb\u901f\u590d\u7528\u3002",
      historyEmpty: "\u8fd8\u6ca1\u6709\u8ba1\u7b97\u8bb0\u5f55\uff0c\u8bf7\u5148\u6c42\u503c\u4e00\u4e2a\u8868\u8fbe\u5f0f\u3002",
      reuseLabel: "\u91cd\u7528",
      angleDeg: "\u89d2\u5ea6",
      angleRad: "\u5f27\u5ea6",
      errorLabel: "\u9519\u8bef",
      calcEvalSuccess: "\u8868\u8fbe\u5f0f\u6c42\u503c\u6210\u529f\u3002",
      calcRawValuePrefix: "\u539f\u59cb\u503c",
      calcCheckSyntax: "\u8bf7\u68c0\u67e5\u8868\u8fbe\u5f0f\u8bed\u6cd5\u548c\u5e38\u6570\u522b\u540d\u3002",
      classicReady: "\u7ecf\u5178\u952e\u76d8\u5df2\u5c31\u7eea\u3002",
      classicErrorPrefix: "\u9519\u8bef",
      pageTitle: "MatSci Calculator Lab",
      pageDescription: "\u4e3a\u5b66\u751f\u3001\u7814\u7a76\u4eba\u5458\u548c\u5de5\u7a0b\u5e08\u63d0\u4f9b\u7684\u8f7b\u91cf\u7ea7\u6750\u6599\u79d1\u5b66\u8ba1\u7b97\u4e0e\u53ef\u89c6\u5316\u539f\u578b\u3002",
      prototypeVersion: "\u539f\u578b v1",
      sidebarCardCopy: "\u91c7\u7528\u539f\u751f HTML\u3001CSS \u548c JavaScript \u6784\u5efa\uff0c\u65e0\u9700\u540e\u7aef\uff0c\u4fbf\u4e8e\u672c\u5730\u8f7b\u91cf\u4f7f\u7528\u3002",
      homeHeroEyebrow: "\u6750\u6599\u5de5\u7a0b\u5de5\u4f5c\u533a",
      homeHeroTitle: "\u5728\u540c\u4e00\u4e2a\u79d1\u5b66\u754c\u9762\u4e2d\u5b8c\u6210\u8ba1\u7b97\u3001\u5c5e\u6027\u67e5\u8be2\u4e0e\u5f3a\u5316\u673a\u5236\u63a2\u7d22\u3002",
      homeHeroCopy: "\u8be5\u539f\u578b\u9762\u5411\u5feb\u901f what-if \u5206\u6790\u3001\u6559\u5b66\u8bb2\u89e3\u548c\u65e9\u671f\u7814\u7a76\u5de5\u4f5c\u6d41\uff0c\u5728\u5b9e\u7528\u8ba1\u7b97\u4e0e\u6750\u6599\u53ef\u89c6\u5316\u4e4b\u95f4\u4fdd\u6301\u5e73\u8861\u3002",
      homeHeroPrimary: "\u5f00\u59cb\u8ba1\u7b97",
      homeHeroSecondary: "\u6253\u5f00\u5f3a\u5316\u6a21\u5757",
      metricModules: "\u4e3b\u8981\u6a21\u5757",
      metricConstants: "\u5df2\u5185\u7f6e\u5e38\u6570",
      metricElements: "\u5df2\u9884\u7f6e\u5143\u7d20",
      metricStrengthening: "\u5f3a\u5316\u6a21\u578b",
      workspaceTitle: "\u7814\u7a76\u4fbf\u7b7e",
      workspaceCopy: "\u4ece\u5e38\u6570\u5e93\u548c\u5143\u7d20\u5e93\u9009\u4e2d\u7684\u5185\u5bb9\u4f1a\u6682\u5b58\u5728\u8fd9\u91cc\uff0c\u4ee5\u652f\u6301\u540e\u7eed\u8ba1\u7b97\u6d41\u7a0b\u3002",
      clearAction: "\u6e05\u9664",
      modulesEyebrow: "\u6a21\u5757",
      modulesTitle: "\u539f\u578b\u6838\u5fc3\u5de5\u5177",
      homeCardCalculatorTitle: "\u79d1\u5b66\u8ba1\u7b97\u5668",
      homeCardCalculatorCopy: "\u6c42\u503c\u8868\u8fbe\u5f0f\uff0c\u6267\u884c\u5bfc\u6570\u4e0e\u79ef\u5206\uff0c\u6c42\u89e3\u65b9\u7a0b\u6839\u5e76\u7ed8\u5236\u51fd\u6570\u66f2\u7ebf\u3002",
      homeCardCalculatorLink: "\u6253\u5f00\u6a21\u5757",
      homeCardClassicTitle: "\u7ecf\u5178\u8ba1\u7b97\u5668",
      homeCardClassicCopy: "\u4f7f\u7528\u7b26\u53f7\u4f18\u5148\u952e\u76d8\u548c\u89d2\u5ea6/\u5f27\u5ea6\u5207\u6362\uff0c\u5728\u624b\u673a\u548c\u684c\u9762\u7aef\u90fd\u80fd\u5feb\u901f\u8ba1\u7b97\u3002",
      homeCardClassicLink: "\u6253\u5f00\u7ecf\u5178\u9762\u677f",
      homeCardAnalysisTitle: "\u51fd\u6570\u5206\u6790",
      homeCardAnalysisCopy: "\u5728\u6c42\u5bfc\u3001\u79ef\u5206\u3001\u6c42\u6839\u548c\u7ed8\u56fe\u4e4b\u95f4\u5feb\u901f\u5207\u6362\uff0c\u65e0\u9700\u8fde\u7eed\u6eda\u52a8\u7ecf\u8fc7\u4e0d\u76f8\u5173\u7684\u63a7\u4ef6\u3002",
      homeCardAnalysisLink: "\u6253\u5f00\u5206\u6790\u9762\u677f",
      homeCardConstantsTitle: "\u5e38\u6570\u5e93",
      homeCardConstantsCopy: "\u641c\u7d22\u6570\u5b66\u3001\u7269\u7406\u4e0e\u70ed\u529b\u5b66\u5e38\u6570\uff0c\u5e76\u5feb\u901f\u590d\u5236\u6216\u63d2\u5165\u8ba1\u7b97\u5668\u3002",
      homeCardConstantsLink: "\u6d4f\u89c8\u5e38\u6570",
      homeCardElementsTitle: "\u5143\u7d20\u5e93",
      homeCardElementsCopy: "\u67e5\u770b\u9762\u5411\u6750\u6599\u7684\u5143\u7d20\u6570\u636e\u96c6\uff0c\u5e76\u5bf9\u4e24\u4e2a\u5143\u7d20\u8fdb\u884c\u5bf9\u6bd4\u3002",
      homeCardElementsLink: "\u63a2\u7d22\u5143\u7d20",
      homeCardStrengthTitle: "\u6750\u6599\u5f3a\u5316",
      homeCardStrengthCopy: "\u4f30\u7b97 Hall-Petch\u3001\u4f4d\u9519\u3001\u5207\u8fc7\u548c Orowan \u5f3a\u5316\u8d21\u732e\uff0c\u5e76\u8fdb\u884c\u56fe\u8868\u5bf9\u6bd4\u3002",
      homeCardStrengthLink: "\u7814\u7a76\u5f3a\u5316",
      homeCardVisualTitle: "\u53ef\u89c6\u5316\u5b9e\u9a8c\u5ba4",
      homeCardVisualCopy: "\u8fdb\u884c\u53c2\u6570\u626b\u63cf\u548c\u5bf9\u6bd4\u7ed8\u56fe\uff0c\u76f4\u89c2\u89c2\u5bdf\u5173\u952e\u53d8\u91cf\u5bf9\u5f3a\u5316\u8d8b\u52bf\u7684\u5f71\u54cd\u3002",
      homeCardVisualLink: "\u6253\u5f00\u53ef\u89c6\u5316",
      scratchpadEmpty: "\u53ef\u901a\u8fc7\u5e38\u6570\u6216\u5143\u7d20\u64cd\u4f5c\u5c06\u6570\u503c\u6682\u5b58\u5230\u8fd9\u91cc\u3002",
      sharedNa: "\u65e0",
      sharedInf: "\u65e0\u7a77\u5927",
      sharedNegInf: "\u8d1f\u65e0\u7a77\u5927",
      derivativeTitle: "\u6570\u503c\u5bfc\u6570",
      derivativeCopy: "\u4f7f\u7528\u4e2d\u5fc3\u5dee\u5206\u4f30\u7b97 \\( f'(x) \\)\u3002",
      field_functionFx: "\u51fd\u6570 \\( f(x) \\)",
      field_pointX: "\u53d6\u503c\u70b9 \\( x \\)",
      actionCompute: "\u8ba1\u7b97",
      derivativeOutputTitle: "\u5bfc\u6570\u4f30\u503c",
      derivativeOutputNote: "\u5728\u6307\u5b9a x \u70b9\u4f7f\u7528\u4e2d\u5fc3\u5dee\u5206\u8fdb\u884c\u4f30\u7b97\u3002",
      integralTitle: "\u5b9a\u79ef\u5206",
      integralCopy: "\u4f7f\u7528 Simpson \u65b9\u6cd5\u8ba1\u7b97 \\( \\int_a^b f(x)\\,dx \\)\u3002",
      field_lowerBound: "\u4e0b\u9650 \\( a \\)",
      field_upperBound: "\u4e0a\u9650 \\( b \\)",
      field_subintervals: "\u5b50\u533a\u95f4\u6570",
      actionIntegrate: "\u79ef\u5206",
      integralOutputTitle: "\u79ef\u5206\u503c",
      integralOutputNote: "\u57fa\u4e8e\u9009\u5b9a\u533a\u95f4\u548c\u5b50\u533a\u95f4\u6570\u7684 Simpson \u8ba1\u7b97\u7ed3\u679c\u3002",
      rootTitle: "\u65b9\u7a0b\u6c42\u6839",
      rootCopy: "\u4f7f\u7528\u5272\u7ebf\u6cd5\u4f30\u7b97\u4e00\u5143\u65b9\u7a0b \\( f(x)=0 \\) \u7684\u6839\u3002",
      field_initialGuess0: "\u521d\u59cb\u731c\u6d4b \\( x_0 \\)",
      field_initialGuess1: "\u521d\u59cb\u731c\u6d4b \\( x_1 \\)",
      field_tolerance: "\u5bb9\u5dee",
      actionFindRoot: "\u6c42\u6839",
      rootOutputTitle: "\u6839\u7684\u4f30\u503c",
      rootResidualTemplate: "\u6b8b\u5dee\uff1a{residual}\uff0c\u8fed\u4ee3 {iterations} \u6b21\u3002",
      plotterTitle: "\u51fd\u6570\u7ed8\u56fe",
      plotterCopy: "\u5feb\u901f\u7ed8\u5236 \\( y=f(x) \\) \u4ee5\u4fbf\u89c2\u5bdf\u3002",
      analysisTabsAria: "\u51fd\u6570\u5206\u6790\u9762\u677f",
      analysisTabDerivative: "\u5bfc\u6570",
      analysisTabIntegral: "\u79ef\u5206",
      analysisTabRoot: "\u6c42\u6839",
      analysisTabPlot: "\u7ed8\u56fe",
      calcTabEvaluate: "\u8868\u8fbe\u5f0f\u6c42\u503c",
      calcTabAnalysis: "\u5bfc\u6570 / \u79ef\u5206 / \u6c42\u6839",
      calcTabSymbolic: "\u7b26\u53f7\u5fae\u79ef\u5206",
      calcTabPlot: "\u7ed8\u5236 f(x)",
      calcTabTaylor: "Taylor \u5c55\u5f00",
      symTabDerivative: "\u6c42\u5bfc",
      symTabPartial: "\u504f\u5bfc\u6570",
      symTabIntegral: "\u79ef\u5206",
      symTabODE: "\u5fae\u5206\u65b9\u7a0b",
      symDerivativeTitle: "\u7b26\u53f7\u6c42\u5bfc",
      symDerivativeCopy: "\u8ba1\u7b97\u51fd\u6570 f(x) \u7684\u7b26\u53f7\u5bfc\u6570 d/dx\u3002\u652f\u6301\u4efb\u610f\u9636\u5bfc\u6570\u3002",
      symPartialTitle: "\u504f\u5bfc\u6570",
      symPartialCopy: "\u8ba1\u7b97\u591a\u5143\u51fd\u6570 f(x, y, z, ...) \u7684\u504f\u5bfc\u6570\u3002",
      symIntegralTitle: "\u7b26\u53f7\u79ef\u5206",
      symIntegralCopy: "\u8ba1\u7b97\u4e0d\u5b9a\u79ef\u5206\u6216\u5b9a\u79ef\u5206 \u222Bf(x)dx\u3002",
      symOdeTitle: "\u5e38\u5fae\u5206\u65b9\u7a0b",
      symOdeCopy: "\u7b26\u53f7\u6c42\u89e3\u4e00\u9636 ODE\uff08\u4f8b\u5982 y' = f(x, y)\uff09\u3002\u8f93\u5165\u65b9\u7a0b\uff0c\u6c42\u89e3 y\u3002",
      symFieldFx: "\u51fd\u6570 f(x)",
      symFieldFxy: "\u51fd\u6570 f(x, y, ...)",
      symFieldVariable: "\u53d8\u91cf",
      symFieldOrder: "\u9636\u6570\uff08n \u9636\u5bfc\u6570\uff09",
      symFieldDiffVar: "\u6c42\u5bfc\u53d8\u91cf",
      symFieldPartialOrder: "\u9636\u6570\uff08n \u9636\u504f\u5bfc\uff09",
      symFieldLower: "\u4e0b\u754c\uff08\u7559\u7a7a\u4e3a\u4e0d\u5b9a\u79ef\u5206\uff09",
      symFieldUpper: "\u4e0a\u754c\uff08\u7559\u7a7a\u4e3a\u4e0d\u5b9a\u79ef\u5206\uff09",
      symFieldOdeExpr: "ODE: y' = f(x, y)",
      symFieldIndepVar: "\u81ea\u53d8\u91cf",
      symFieldDepVar: "\u56e0\u53d8\u91cf",
      symActionDerivative: "\u8ba1\u7b97\u5bfc\u6570",
      symActionPartial: "\u8ba1\u7b97\u504f\u5bfc",
      symActionAllPartials: "\u6240\u6709\u4e00\u9636\u504f\u5bfc",
      symActionIntegrate: "\u79ef\u5206",
      symActionOde: "\u6c42\u89e3 ODE",
      symCalcEngine: "\u4f7f\u7528\u7b26\u53f7\u8ba1\u7b97\u5f15\u64ce (nerdamer) \u8ba1\u7b97",
      symPartialNote: "\u5bf9",
      symDetectedVars: "\u68c0\u6d4b\u5230\u7684\u53d8\u91cf",
      symDefiniteIntegral: "\u5b9a\u79ef\u5206",
      symIndefiniteIntegral: "\u4e0d\u5b9a\u79ef\u5206",
      symPlusConstant: "\u52a0\u79ef\u5206\u5e38\u6570",
      symErrorPrefix: "\u9519\u8bef",
      symOdeDirectIntegration: "\u76f4\u63a5\u79ef\u5206\uff08\u4e0d\u542b y \u4f9d\u8d56\uff09",
      symOdeCannotIntegrate: "\u65e0\u6cd5\u79ef\u5206",
      symOdeSeparation: "\u5206\u79bb\u53d8\u91cf\u6cd5\uff08\u4e0d\u542b x \u4f9d\u8d56\uff09",
      symOdeCannotSolve: "\u65e0\u6cd5\u901a\u8fc7\u5206\u79bb\u53d8\u91cf\u6c42\u89e3",
      symOdeGeneralHint: "\u5bf9\u4e8e\u4e00\u822c\u5f62\u5f0f\u7684 ODE\uff0c\u8bf7\u5c1d\u8bd5\u5206\u79bb\u53d8\u91cf\u6cd5\uff1a\u6539\u5199\u4e3a f\u2081(x)dx = f\u2082(y)dy\u3002",
      symOdeAttempted: "\u5c1d\u8bd5\u6c42\u89e3",
      symOdeErrorPrefix: "ODE \u9519\u8bef",
      taylorTitle: "Taylor / Maclaurin \u7ea7\u6570\u5c55\u5f00",
      taylorCopy: "\u5728\u6307\u5b9a\u5c55\u5f00\u70b9\u5c06 \\( f(x) \\) \u5c55\u5f00\u4e3a\u5e42\u7ea7\u6570\uff0c\u5e76\u4e0e\u539f\u51fd\u6570\u5bf9\u6bd4\u3002",
      taylorCenter: "\u5c55\u5f00\u4e2d\u5fc3 \\( a \\)",
      taylorOrder: "\u9636\u6570\uff08\u6700\u9ad8\u6b21\u6570\uff09",
      actionTaylorExpand: "\u5c55\u5f00",
      taylorOutputTitle: "Taylor \u5c55\u5f00",
      taylorOutputCoefficients: "\u5c55\u5f00\u7cfb\u6570\uff08f\u00b9\u207f(a)/n!\uff09",
      taylorOutputValue: "\u5728 x = {x} \u5904\u7684\u8fd1\u4f3c\u503c\uff1a{value}",
      taylorOutputExact: "\u7cbe\u786e\u503c\uff1a{exact}",
      taylorOutputError: "\u8bef\u5dee\uff1a{error}",
      taylorPlotTitle: "Taylor \u8fd1\u4f3c\u4e0e\u539f\u51fd\u6570\u5bf9\u6bd4",
      field_functionYx: "\u51fd\u6570 \\( y(x) \\)",
      field_xMin: "x \u6700\u5c0f\u503c",
      field_xMax: "x \u6700\u5927\u503c",
      field_points: "\u53d6\u6837\u70b9\u6570",
      actionPlotFunction: "\u7ed8\u5236\u51fd\u6570",
      plotStatusTitle: "\u7ed8\u56fe\u72b6\u6001",
      plotStatusValue: "\u5df2\u751f\u6210 {count} \u4e2a\u91c7\u6837\u70b9",
      plotStatusNote: "\u4e3a\u4fdd\u6301\u66f2\u7ebf\u53ef\u8bfb\u6027\uff0c\u7cfb\u7edf\u4f1a\u81ea\u52a8\u5ffd\u7565\u65e0\u6548\u70b9\u3002",
      chartFunctionPlotTitle: "\u51fd\u6570\u56fe\u50cf",
      axisX: "x",
      axisY: "y",
      calcShortcutsAria: "\u8ba1\u7b97\u5668\u5feb\u6377\u5e38\u6570",
      constantsSectionTitle: "\u5e38\u6570\u5e93",
      constantsSectionCopy: "\u53ef\u641c\u7d22\u7684\u521d\u59cb\u5e38\u6570\u6570\u636e\u96c6\uff0c\u5305\u542b\u6570\u5b66\u3001\u7269\u7406\u4e0e\u70ed\u529b\u5b66\u5e38\u6570\uff0c\u4fbf\u4e8e\u5feb\u901f\u590d\u7528\u3002",
      searchConstantsLabel: "\u641c\u7d22\u5e38\u6570",
      searchConstantsPlaceholder: "\u6309\u540d\u79f0\u3001\u7b26\u53f7\u3001\u522b\u540d\u6216\u5206\u7c7b\u641c\u7d22",
      constantFiltersAria: "\u5e38\u6570\u5206\u7c7b",
      constantCategory_all: "\u5168\u90e8",
      constantCategory_mathematical: "\u6570\u5b66",
      constantCategory_physical: "\u7269\u7406",
      constantCategory_thermodynamic: "\u70ed\u529b\u5b66",
      constantsEmpty: "\u5f53\u524d\u641c\u7d22\u6761\u4ef6\u4e0b\u672a\u627e\u5230\u5339\u914d\u7684\u5e38\u6570\u3002",
      constantAliasLabel: "\u522b\u540d",
      actionCopyValue: "\u590d\u5236\u6570\u503c",
      actionUseInCalculator: "\u7528\u4e8e\u8ba1\u7b97\u5668",
      toastConstantCopied: "\u5df2\u590d\u5236 {name}\u3002",
      toastClipboardUnavailable: "\u5f53\u524d\u6d4f\u89c8\u5668\u65e0\u6cd5\u4f7f\u7528\u526a\u8d34\u677f\u590d\u5236\u3002",
      toastConstantInserted: "\u5df2\u5c06 {name} \u63d2\u5165\u8ba1\u7b97\u5668\u3002",
      elementsSectionTitle: "\u5143\u7d20\u5e93",
      elementsSectionCopy: "\u9762\u5411\u6750\u6599\u5e94\u7528\u7684\u5143\u7d20\u53c2\u8003\u5e93\uff0c\u652f\u6301\u5feb\u901f\u5bf9\u6bd4\u548c\u540e\u7eed\u8ba1\u7b97\u6d41\u7a0b\u6682\u5b58\u3002",
      elementsSectionTag: "\u5468\u671f\u8868\u98ce\u683c\u5361\u7247",
      searchElementsLabel: "\u641c\u7d22\u5143\u7d20",
      searchElementsPlaceholder: "\u6309\u7b26\u53f7\u3001\u540d\u79f0\u3001\u6676\u4f53\u7ed3\u6784\u6216\u5907\u6ce8\u641c\u7d22",
      elementsHint: "\u70b9\u51fb\u5361\u7247\u53ef\u67e5\u770b\u8be6\u60c5\u5e76\u8fdb\u884c\u5bf9\u6bd4\u6682\u5b58\u3002",
      elementsEmpty: "\u5f53\u524d\u641c\u7d22\u6761\u4ef6\u4e0b\u672a\u627e\u5230\u5339\u914d\u7684\u5143\u7d20\u3002",
      elementDetailTitle: "\u5143\u7d20\u8be6\u60c5",
      elementDetailCopy: "\u9009\u62e9\u5361\u7247\u4ee5\u67e5\u770b\u6750\u6599\u76f8\u5173\u5c5e\u6027\u3002",
      elementDetailPlaceholder: "\u8bf7\u9009\u62e9\u4e00\u4e2a\u5143\u7d20\u4ee5\u586b\u5145\u6b64\u9762\u677f\u3002",
      compareTitle: "\u4e24\u5143\u7d20\u5bf9\u6bd4",
      compareCopy: "\u5728\u8be6\u60c5\u9762\u677f\u4e2d\u5c06\u5143\u7d20\u8bbe\u7f6e\u5230 A \u548c B \u69fd\u4f4d\u3002",
      elementsTabsAria: "\u5143\u7d20\u9762\u677f",
      elementsTabLibrary: "\u5e93",
      elementsTabDetail: "\u8be6\u60c5",
      elementsTabCompare: "\u5bf9\u6bd4",
      selectedElementEyebrow: "\u5df2\u9009\u5143\u7d20",
      compareActionA: "\u8bbe\u4e3a\u5bf9\u6bd4 A",
      compareActionB: "\u8bbe\u4e3a\u5bf9\u6bd4 B",
      queuePropertiesAction: "\u6682\u5b58\u5173\u952e\u5c5e\u6027",
      compareSlotPrefix: "\u69fd\u4f4d",
      compareAwaitingSelection: "\u7b49\u5f85\u9009\u62e9",
      compareFieldStructure: "\u7ed3\u6784",
      compareFieldDensity: "\u5bc6\u5ea6",
      compareFieldMeltingPoint: "\u7194\u70b9",
      compareFieldElectronegativity: "\u7535\u8d1f\u6027",
      compareFieldValence: "\u4ef7\u6001",
      compareFieldAtomicNumber: "\u539f\u5b50\u5e8f\u6570",
      compareFieldAtomicWeight: "\u539f\u5b50\u91cf",
      compareFieldAtomicRadius: "\u539f\u5b50\u534a\u5f84",
      compareFieldCovalentRadius: "\u5171\u4ef7\u534a\u5f84",
      compareFieldMetallicRadius: "\u91d1\u5c5e\u534a\u5f84",
      compareFieldCrystalStructure: "\u6676\u4f53\u7ed3\u6784",
      compareFieldCommonValence: "\u5e38\u89c1\u4ef7\u6001",
      toastElementAssigned: "\u5df2\u5c06 {name} \u5206\u914d\u5230 {slot} \u69fd\u4f4d\u3002",
      toastElementStaged: "\u5df2\u5c06 {name} \u6682\u5b58\u5230\u5de5\u4f5c\u533a\u3002",
      strengthSectionTitle: "\u6750\u6599\u5f3a\u5316",
      strengthSectionCopy: "\u9762\u5411\u6559\u5b66\u4e0e\u5de5\u7a0b\u5206\u6790\u7684\u5fae\u89c2\u7ec4\u7ec7\u5f3a\u5316\u6a21\u578b\u3002\u8f93\u5165\u53ef\u7f16\u8f91\uff0c\u516c\u5f0f\u53ef\u6e32\u67d3\uff0c\u8f93\u51fa\u53ef\u76f4\u63a5\u5bf9\u6bd4\u3002",
      materialsWorkspaceTitle: "\u6750\u6599\u5de5\u4f5c\u533a",
      materialsWorkspaceCopy: "\u5df2\u52a0\u5165\u7684\u5e38\u6570\u548c\u5143\u7d20\u5c5e\u6027\u4f1a\u663e\u793a\u5728\u8fd9\u91cc\uff0c\u4ee5\u652f\u6301\u540e\u7eed\u6750\u6599\u8ba1\u7b97\u4e0e\u6559\u5b66\u6f14\u793a\u3002",
      strengthTabsAria: "\u5f3a\u5316\u6a21\u578b",
      tabHallPetch: "Hall-Petch",
      tabDislocation: "\u4f4d\u9519",
      tabCutting: "\u5207\u8fc7",
      tabOrowan: "Orowan",
      tabComparison: "\u5bf9\u6bd4",
      hpTitle: "Hall-Petch \u5f3a\u5316",
      hpCopy: "\u901a\u8fc7\u57fa\u7840\u6469\u64e6\u5e94\u529b\u548c Hall-Petch \u7cfb\u6570\u4f30\u7b97\u6676\u7c92\u5c3a\u5bf8\u5bf9\u5c48\u670d\u5f3a\u5ea6\u7684\u8d21\u732e\u3002",
      field_baseStress: "\u57fa\u7840\u5e94\u529b \\( \\sigma_0 \\)",
      field_stressUnit: "\u5e94\u529b\u5355\u4f4d",
      field_hallPetchCoefficient: "\\( k_y \\) [MPa*m\\(^{1/2}\\)]",
      field_grainSize: "\u6676\u7c92\u5c3a\u5bf8 \\( d \\)",
      field_grainUnit: "\u6676\u7c92\u5355\u4f4d",
      actionUpdateModel: "\u66f4\u65b0\u6a21\u578b",
      actionReset: "\u91cd\u7f6e",
      // Custom Formula Editor
      customFormulaTitle: "\u81ea\u5b9a\u4e49\u516c\u5f0f\u7f16\u8f91\u5668",
      customFormulaCopy: "\u521b\u5efa\u548c\u7ba1\u7406\u81ea\u5b9a\u4e49\u5f3a\u5316\u516c\u5f0f\uff0c\u652f\u6301\u53c2\u6570\u7ba1\u7406\u3002",
      formulaName: "\u516c\u5f0f\u540d\u79f0",
      selectPreset: "\u9009\u62e9\u9884\u8bbe\u6a21\u677f",
      formulaExpression: "\u516c\u5f0f\u8868\u8fbe\u5f0f (LaTeX)",
      calculationExpression: "\u8ba1\u7b97\u8868\u8fbe\u5f0f (JavaScript)",
      formulaParameters: "\u516c\u5f0f\u53c2\u6570",
      actionCalculate: "\u8ba1\u7b97",
      actionSaveFormula: "\u4fdd\u5b58\u516c\u5f0f",
      actionLoadFormula: "\u52a0\u8f7d\u516c\u5f0f",
      actionClear: "\u6e05\u9664",
      savedFormulas: "\u5df2\u4fdd\u5b58\u7684\u516c\u5f0f",
      hpOutputIncrementLabel: "\u5f3a\u5316\u589e\u91cf",
      hpOutputIncrementNote: "\u6676\u754c\u5f3a\u5316\u8d21\u732e\u3002",
      hpOutputTotalLabel: "\u603b\u5c48\u670d\u4f30\u503c",
      hpOutputTotalNote: "\u57fa\u7840\u5e94\u529b\u4e0e Hall-Petch \u589e\u91cf\u4e4b\u548c\u3002",
      hpOutputGrainLabel: "\u6362\u7b97\u540e\u6676\u7c92\u5c3a\u5bf8",
      hpOutputGrainNote: "\u5185\u90e8\u4f7f\u7528 SI \u5355\u4f4d\u4ee5\u4fdd\u6301 ky \u4e00\u81f4\u3002",
      disTitle: "\u4f4d\u9519\u5f3a\u5316",
      disCopy: "\u4f7f\u7528\u526a\u5207\u6a21\u91cf\u3001 Burgers \u77e2\u91cf\u548c\u4f4d\u9519\u5bc6\u5ea6\u7684 Taylor \u98ce\u683c\u7d27\u51d1\u4f30\u7b97\u3002",
      field_alpha: "\\( \\alpha \\)",
      field_shearModulus: "\u526a\u5207\u6a21\u91cf \\( G \\) [GPa]",
      field_burgersVector: "Burgers \u77e2\u91cf \\( b \\) [nm]",
      field_dislocationDensity: "\u4f4d\u9519\u5bc6\u5ea6 \\( \\rho \\) [m\\(^{-2}\\)]",
      disOutputIncrementLabel: "\u5f3a\u5316\u589e\u91cf",
      disOutputIncrementNote: "\u57fa\u4e8e\u4f4d\u9519\u5bc6\u5ea6\u7684 Taylor \u98ce\u683c\u4f30\u7b97\u3002",
      disOutputInterpretationLabel: "\u89e3\u91ca",
      disOutputInterpretationValue: "\\u03c1 \u8d8a\u9ad8\uff0c\\u0394\\u03c3 \u8d8a\u5927",
      disOutputInterpretationNote: "\u5e73\u65b9\u6839\u4f9d\u8d56\u5173\u7cfb\u4f7f\u5f97\u5bc6\u5ea6\u53d8\u5316\u5f71\u54cd\u663e\u8457\u4f46\u589e\u957f\u5e76\u975e\u7ebf\u6027\u3002",
      cutTitle: "\u5207\u8fc7 / \u526a\u5207\u578b\u6790\u51fa\u5f3a\u5316",
      cutCopy: "\u8be5\u7b80\u5316\u6559\u5b66\u6a21\u578b\u7efc\u5408\u4e86\u4f53\u79ef\u5206\u6570\u3001\u6790\u51fa\u5c3a\u5bf8\u4e0e APB \u80fd\uff0c\u7528\u4e8e\u5b9a\u6027\u4f30\u7b97\u5f3a\u5316\u8d8b\u52bf\u3002",
      field_precipitateRadius: "\u534a\u5f84 \\( r \\) [nm]",
      field_volumeFraction: "\u4f53\u79ef\u5206\u6570 \\( f \\)",
      field_apbEnergy: "\\( \\gamma_{APB} \\) [mJ/m\\(^2\\)]",
      field_cuttingCoefficient: "\u7cfb\u6570 \\( k_c \\)",
      cutOutputIncrementLabel: "\u5f3a\u5316\u589e\u91cf",
      cutOutputIncrementNote: "\u7b80\u5316\u7684\u6790\u51fa\u526a\u5207\u5f3a\u5316\u4f30\u7b97\u3002",
      cutOutputRadiusLabel: "\u534a\u5f84\u6548\u5e94",
      cutOutputRadiusValue: "r \u8d8a\u5c0f -> \\u0394\\u03c3 \u8d8a\u5927",
      cutOutputRadiusNote: "\u5728\u8be5\u6a21\u578b\u4e2d\uff0c\u969c\u788d\u7269\u534a\u5f84\u51cf\u5c0f\u4f1a\u63d0\u9ad8\u5f3a\u5316\u3002",
      cutOutputModelLabel: "\u6a21\u578b\u8bf4\u660e",
      cutOutputModelValue: "\u6559\u5b66\u7b80\u5316\u6a21\u578b",
      cutOutputModelNote: "\u9002\u7528\u4e8e\u8d8b\u52bf\u7406\u89e3\uff0c\u4e0d\u5e94\u76f4\u63a5\u4ee3\u66ff\u6587\u732e\u7ea7\u5b9a\u91cf\u9884\u6d4b\u3002",
      chartCutLegend: "\u5207\u8fc7",
      chartCutTitle: "\u5207\u8fc7\u5f3a\u5316\u5bf9\u534a\u5f84\u7684\u7075\u654f\u5ea6",
      axisPrecipitateRadius: "\u6790\u51fa\u7269\u534a\u5f84 (nm)",
      axisCutStrength: "\\u0394\\u03c3_cut (MPa)",
      orTitle: "Orowan \u7ed5\u8fc7\u5f3a\u5316",
      orCopy: "\u4f30\u7b97\u4f4d\u9519\u5728\u9897\u5b50\u4e4b\u95f4\u7ed5\u8fc7\u800c\u975e\u5207\u8fc7\u65f6\u7684\u5f3a\u5316\u8d21\u732e\u3002",
      field_interparticleSpacing: "\u95f4\u8ddd \\( \\lambda \\) [nm]",
      field_poissonRatio: "\u6cca\u677e\u6bd4 \\( \\nu \\)",
      orOutputIncrementLabel: "\u5f3a\u5316\u589e\u91cf",
      orOutputIncrementNote: "\u4e0d\u53ef\u526a\u5207\u9897\u5b50\u7684\u7ed5\u8fc7\u8d21\u732e\u3002",
      orOutputSpacingLabel: "\u95f4\u8ddd\u6548\u5e94",
      orOutputSpacingValue: "\\u03bb \u8d8a\u5c0f -> \\u0394\\u03c3 \u8d8a\u5927",
      orOutputSpacingNote: "\u9897\u5b50\u95f4\u8ddd\u8d8a\u5c0f\uff0c\u4f4d\u9519\u7ed5\u8fc7\u901a\u9053\u8d8a\u53d7\u9650\u3002",
      orOutputModelLabel: "\u6a21\u578b\u8bf4\u660e",
      orOutputModelValue: "\u7ed5\u8fc7\u4e3b\u5bfc\u673a\u5236",
      orOutputModelNote: "\u9002\u5408\u7528\u6765\u4e0e\u526a\u5207\u673a\u5236\u5f62\u6210\u5bf9\u7167\u3002",
      chartOrowanLegend: "Orowan",
      chartOrowanTitle: "Orowan \u5f3a\u5316\u5bf9\u95f4\u8ddd\u7684\u7075\u654f\u5ea6",
      axisInterparticleSpacing: "\u9897\u5b50\u95f4\u8ddd (nm)",
      axisOrowanStrength: "\\u0394\\u03c3_Or (MPa)",
      comparisonPanelTitle: "\u5f3a\u5316\u5bf9\u6bd4",
      comparisonPanelCopy: "\u4f7f\u7528\u4e0a\u65b9\u5f53\u524d\u53c2\u6570\u5bf9\u56db\u79cd\u5f3a\u5316\u8d21\u732e\u8fdb\u884c\u5bf9\u6bd4\u3002",
      comparisonEmpty: "\u9700\u5148\u8f93\u5165\u6709\u6548\u7684\u5f3a\u5316\u6a21\u578b\u53c2\u6570\u624d\u80fd\u8fdb\u884c\u5bf9\u6bd4\u3002",
      comparisonSummaryHeading: "\u89e3\u91ca",
      comparisonSummaryTemplate: "{mechanism} \u76ee\u524d\u662f\u4e3b\u5bfc\u5f3a\u5316\u8d21\u732e\uff0c\u5f53\u524d\u6570\u503c\u4e3a {value} MPa\u3002{detail}",
      comparisonSummaryShearing: "\u5f53\u524d\u6790\u51fa\u53c2\u6570\u66f4\u504f\u5411\u526a\u5207\u800c\u975e\u7ed5\u8fc7\u3002",
      comparisonSummaryBypass: "\u5f53\u524d\u6790\u51fa\u53c2\u6570\u66f4\u504f\u5411\u7ed5\u8fc7\u6216\u975e\u6790\u51fa\u673a\u5236\u3002",
      comparisonTableMechanism: "\u673a\u5236",
      comparisonTableContribution: "\u8d21\u732e",
      chartComparisonTitle: "\u5f3a\u5316\u8d21\u732e\u5bf9\u6bd4",
      axisMechanism: "\u673a\u5236",
      axisStrengthIncrement: "\\u0394\\u03c3 (MPa)",
      visualSectionTitle: "\u53ef\u89c6\u5316\u5b9e\u9a8c\u5ba4",
      visualSectionCopy: "\u7528\u4e8e\u5f3a\u5316\u673a\u5236\u7406\u89e3\u7684\u4ea4\u4e92\u5f0f\u53c2\u6570\u626b\u63cf\u4e0e\u5bf9\u6bd4\u56fe\u3002",
      visualTabsAria: "\u53ef\u89c6\u5316\u5b9e\u9a8c\u9762\u677f",
      visualTabSweep: "\u626b\u63cf\u56fe",
      visualTabCompare: "\u673a\u5236\u5bf9\u6bd4",
      visualTabSchematic: "\u793a\u610f\u56fe",
      visualControlTitle: "\u53c2\u6570\u626b\u63cf\u63a7\u5236",
      visualControlCopy: "\u9009\u62e9\u4e00\u4e2a\u53d8\u91cf\u8fdb\u884c\u626b\u63cf\uff0c\u5176\u4f59\u53c2\u6570\u4fdd\u6301\u4e3a\u8868\u5355\u4e2d\u7684\u5f53\u524d\u503c\u3002",
      field_sweepTarget: "\u626b\u63cf\u5bf9\u8c61",
      sweepOptionHallPetch: "Hall-Petch \u6676\u7c92\u5c3a\u5bf8",
      sweepOptionCutting: "\u5207\u8fc7\u673a\u5236\u6790\u51fa\u534a\u5f84",
      sweepOptionOrowan: "Orowan \u95f4\u8ddd",
      field_minValue: "\u6700\u5c0f\u503c",
      field_maxValue: "\u6700\u5927\u503c",
      field_samples: "\u6837\u672c\u6570",
      field_radiusSlider: "\u534a\u5f84\u6ed1\u5757 [nm]",
      field_spacingSlider: "\u95f4\u8ddd\u6ed1\u5757 [nm]",
      actionUpdateVisuals: "\u66f4\u65b0\u56fe\u5f62",
      visualSchematicTitle: "\u6790\u51fa\u7269\u95f4\u8ddd\u793a\u610f\u56fe",
      visualSchematicCopy: "\u901a\u8fc7\u7b80\u5355\u52a8\u6001\u793a\u610f\u56fe\u5c06\u6ed1\u5757\u53d8\u5316\u4e0e\u969c\u788d\u7269\u5c3a\u5bf8\u548c\u95f4\u8ddd\u8054\u7cfb\u8d77\u6765\u3002",
      schematicAria: "\u6790\u51fa\u7269\u95f4\u8ddd\u793a\u610f\u56fe",
      chartHallPetchSweepTitle: "Hall-Petch \u6676\u7c92\u5c3a\u5bf8\u626b\u63cf",
      axisGrainSize: "\u6676\u7c92\u5c3a\u5bf8 (um)",
      chartCuttingSweepTitle: "\u5207\u8fc7\u673a\u5236\u534a\u5f84\u626b\u63cf",
      chartOrowanSweepTitle: "Orowan \u95f4\u8ddd\u626b\u63cf",
      axisVisualStrength: "\u5f3a\u5316\u589e\u91cf (MPa)",
      chartVisualCompareTitle: "\u968f\u534a\u5f84\u53d8\u5316\u7684\u5207\u8fc7\u4e0e Orowan \u5bf9\u6bd4",
      chartCurrentRadius: "\u5f53\u524d\u534a\u5f84",
      chartCurrentSpacing: "\u5f53\u524d\u95f4\u8ddd\u72b6\u6001",
      schematicSpacingPrefix: "\u95f4\u8ddd ~",
      schematicRadiusPrefix: "\u534a\u5f84 ~",
      footerNote: "\u8be5\u539f\u578b\u7528\u4e8e\u79d1\u5b66\u63a2\u7d22\u4e0e\u6559\u5b66\u8ba1\u7b97\u3002\u5de5\u7a0b\u51b3\u7b56\u4ecd\u9700\u7ed3\u5408\u6587\u732e\u3001\u6821\u51c6\u6a21\u578b\u4e0e\u5b9e\u9a8c\u8f93\u5165\u8fdb\u884c\u9a8c\u8bc1\u3002",
      errorUnknown: "\u53d1\u751f\u4e86\u672a\u77e5\u9519\u8bef\u3002",
      errorMathJsLoad: "math.js \u672a\u6210\u529f\u52a0\u8f7d\uff0c\u8bf7\u68c0\u67e5 CDN \u8bbf\u95ee\u6216\u7f51\u7edc\u8fde\u63a5\u3002",
      errorExpressionInvalid: "\u8868\u8fbe\u5f0f\u65e0\u6cd5\u89e3\u6790\uff0c\u8bf7\u68c0\u67e5\u8bed\u6cd5\u548c\u53ef\u7528\u51fd\u6570\u3002",
      errorScalarOnly: "\u8868\u8fbe\u5f0f\u672a\u89e3\u6790\u4e3a\u5b9e\u6570\u6807\u91cf\u503c\u3002",
      errorEmptyExpression: "\u8bf7\u5148\u8f93\u5165\u8981\u6c42\u503c\u7684\u8868\u8fbe\u5f0f\u3002",
      errorEmptyFunction: "\u8bf7\u5148\u8f93\u5165\u51fd\u6570\u8868\u8fbe\u5f0f\u3002",
      errorInvalidDerivativeInputs: "\u8bf7\u63d0\u4f9b\u6709\u9650\u7684\u6c42\u5bfc\u70b9\u548c\u6b63\u7684\u6b65\u957f\u3002",
      errorInvalidIntegralBounds: "\u8bf7\u63d0\u4f9b\u4e24\u4e2a\u4e0d\u540c\u7684\u6709\u9650\u79ef\u5206\u4e0a\u4e0b\u9650\u3002",
      errorInvalidIntegralSteps: "\u8bf7\u81f3\u5c11\u4f7f\u7528 20 \u4e2a Simpson \u5b50\u533a\u95f4\u3002",
      errorInvalidRootGuesses: "\u8bf7\u9009\u62e9\u4e24\u4e2a\u4e0d\u540c\u7684\u6709\u9650\u521d\u59cb\u731c\u503c\u3002",
      errorRootSlopeZero: "\u5272\u7ebf\u659c\u7387\u63a5\u8fd1\u96f6\uff0c\u8bf7\u5c1d\u8bd5\u5176\u4ed6\u521d\u59cb\u731c\u503c\u3002",
      errorRootDiverged: "\u6c42\u6839\u8fed\u4ee3\u53d1\u6563\uff0c\u8bf7\u6536\u7f29\u533a\u95f4\u6216\u66f4\u6362\u521d\u59cb\u731c\u503c\u3002",
      errorRootNoConvergence: "\u5728\u9650\u5b9a\u8fed\u4ee3\u6b21\u6570\u5185\u672a\u80fd\u6536\u655b\u3002",
      errorInvalidPlotRange: "\u8bf7\u8bbe\u7f6e\u5408\u6cd5\u4e14\u9012\u589e\u7684 x \u8303\u56f4\u3002",
      errorPositiveRequired: "{field} \u5fc5\u987b\u4e3a\u6b63\u6570\u3002",
      errorUnsupportedLengthUnit: "\u4e0d\u652f\u6301\u7684\u957f\u5ea6\u5355\u4f4d\uff1a{unit}",
      errorVolumeFractionRange: "\u5728\u8be5\u7b80\u5316\u6a21\u578b\u4e2d\uff0c\u4f53\u79ef\u5206\u6570\u5fc5\u987b\u5c0f\u4e8e 1\u3002",
      errorInvalidPoissonRatio: "\u6cca\u677e\u6bd4\u5fc5\u987b\u4f4d\u4e8e 0 \u548c 0.49 \u4e4b\u95f4\u3002",
      errorInvalidSweepRange: "\u626b\u63cf\u6700\u5c0f\u503c\u5fc5\u987b\u5c0f\u4e8e\u6700\u5927\u503c\u3002"
    }
  };

  const defaults = {
    calculatorExpression: "(3.2e3 * sin(pi / 4)) / (R * 298)",
    classicExpression: "sin(\u03c0 \u00f7 4) + 3^2",
    derivative: {
      expression: "x^{3} - 4x + 1",  // LaTeX format
      point: 2
    },
    integral: {
      expression: "\\exp(-x^{2})",  // LaTeX format
      a: 0,
      b: 1,
      steps: 400
    },
    root: {
      expression: "x^{3} - x - 2",  // LaTeX format
      x0: 1,
      x1: 2,
      tolerance: 1e-6
    },
    plot: {
      expression: "\\sin(x) \\cdot \\exp(-0.1x^{2})",  // LaTeX format
      min: -8,
      max: 8,
      points: 240
    },
    taylor: {
      expression: "\\sin(x)",
      center: 0,
      order: 5,
      min: -6,
      max: 6
    },
    calcDerivative: { expression: "x^{3} - 4x + 1", point: 2 },
    calcIntegral: { expression: "\\exp(-x^{2})", a: 0, b: 1, steps: 400 },
    calcRoot: { expression: "x^{3} - x - 2", x0: 1, x1: 2, tolerance: 1e-6 },
    hallPetch: {
      sigma0: 180,
      sigma0Unit: "MPa",
      ky: 0.7,
      grainSize: 12,
      grainUnit: "um"
    },
    dislocation: {
      alpha: 0.24,
      G: 79,
      b: 0.248,
      rho: 2.0e14
    },
    cutting: {
      radius: 12,
      fraction: 0.08,
      apb: 150,
      G: 80,
      b: 0.255,
      k: 0.75
    },
    orowan: {
      G: 80,
      b: 0.255,
      radius: 18,
      spacing: 60,
      nu: 0.30
    },
    visual: {
      target: "hallPetch",
      min: 2,
      max: 80,
      steps: 60,
      radius: 18,
      spacing: 60
    }
  };
  const LANGUAGE_STORAGE_KEY = "msclab-language";

  function getById(id) {
    return document.getElementById(id);
  }

  function t(key) {
    const table = translations[state.language] || translations.en;
    return table[key] || translations.en[key] || key;
  }

  function tf(key, params) {
    let template = t(key);
    Object.keys(params || {}).forEach(function (paramKey) {
      template = template.replaceAll("{" + paramKey + "}", String(params[paramKey]));
    });
    return template;
  }

  function localizedValue(value) {
    if (value && typeof value === "object" && !Array.isArray(value) && ("en" in value || "zh" in value)) {
      return value[state.language] || value.en || value.zh || "";
    }
    return value;
  }

  function searchText(value) {
    if (value === null || value === undefined) {
      return "";
    }
    if (value && typeof value === "object" && !Array.isArray(value) && ("en" in value || "zh" in value)) {
      return [value.en, value.zh].filter(Boolean).join(" ").toLowerCase();
    }
    return String(value).toLowerCase();
  }

  function fieldLabel(fieldKey) {
    return t("field_" + fieldKey);
  }

  function translateError(error) {
    if (!error) {
      return t("errorUnknown");
    }

    const code = error.code || error.message;
    const params = error.params || {};

    switch (code) {
      case "mathJsLoad":
        return t("errorMathJsLoad");
      case "expressionInvalid":
        return t("errorExpressionInvalid");
      case "scalarOnly":
        return t("errorScalarOnly");
      case "emptyExpression":
        return t("errorEmptyExpression");
      case "emptyFunction":
        return t("errorEmptyFunction");
      case "invalidDerivativeInputs":
        return t("errorInvalidDerivativeInputs");
      case "invalidIntegralBounds":
        return t("errorInvalidIntegralBounds");
      case "invalidIntegralSteps":
        return t("errorInvalidIntegralSteps");
      case "invalidRootGuesses":
        return t("errorInvalidRootGuesses");
      case "rootSlopeZero":
        return t("errorRootSlopeZero");
      case "rootDiverged":
        return t("errorRootDiverged");
      case "rootNoConvergence":
        return t("errorRootNoConvergence");
      case "invalidPlotRange":
        return t("errorInvalidPlotRange");
      case "positiveRequired":
        return tf("errorPositiveRequired", { field: fieldLabel(params.field) });
      case "unsupportedLengthUnit":
        return tf("errorUnsupportedLengthUnit", { unit: params.unit || "" });
      case "volumeFractionRange":
        return t("errorVolumeFractionRange");
      case "invalidPoissonRatio":
        return t("errorInvalidPoissonRatio");
      case "invalidSweepRange":
        return t("errorInvalidSweepRange");
      case "clipboardUnavailable":
        return t("toastClipboardUnavailable");
      default:
        return t("errorUnknown");
    }
  }

  function unitText(unit) {
    return localizedValue(unit);
  }

  function constantById(id) {
    return constants.find(function (item) {
      return item.id === id;
    }) || null;
  }

  function elementBySymbol(symbol) {
    return elements.find(function (item) {
      return item.symbol === symbol;
    }) || null;
  }

  function mechanismLabel(id) {
    const map = {
      hallPetch: t("tabHallPetch"),
      dislocation: t("tabDislocation"),
      cutting: t("tabCutting"),
      orowan: t("tabOrowan")
    };
    return map[id] || id;
  }

  function constantCategoryLabel(categoryKey) {
    return t("constantCategory_" + categoryKey);
  }

  function resolveScratchpadItem(item) {
    if (!item) {
      return { label: "", value: "" };
    }

    if (item.kind === "constant") {
      const constant = constantById(item.constantId);
      if (constant) {
        return {
          label: localizedValue(constant.name) + " (" + constant.alias + ")",
          value: Utils.formatNumber(constant.value, 5) + " " + unitText(constant.unit)
        };
      }
    }

    if (item.kind === "element") {
      const element = elementBySymbol(item.symbol);
      if (element) {
        return {
          label: element.symbol + " | " + localizedValue(element.name),
          value: localizedValue(element.crystalStructure) + " | " + formatElementValue(element.density, "g/cm^3")
        };
      }
    }

    return {
      label: item.label || "",
      value: item.value || ""
    };
  }

  const validPages = [
    "home",
    "classic-calculator",
    "scientific-calculator",
    "function-analysis",
    "constants",
    "elements",
    "strengthening",
    "visual-lab"
  ];

  function normalizePageId(pageId) {
    return validPages.indexOf(pageId) >= 0 ? pageId : "home";
  }

  function activePageIdFromHash(hashValue) {
    const pageId = String(hashValue || "").replace(/^#/, "");
    return normalizePageId(pageId || state.activePage);
  }

  function syncPageNavigation() {
    console.log('🔄 同步页面导航，当前页面:', state.activePage);
    
    const buttons = Utils.qsa("[data-page]");
    console.log('   找到导航按钮数量:', buttons.length);
    
    buttons.forEach(function (button) {
      const isActive = button.dataset.page === state.activePage;
      button.classList.toggle("active", isActive);
      if (isActive) {
        console.log('   ✅ 激活按钮:', button.dataset.page);
      }
    });

    const sections = Utils.qsa(".page-section[data-page-id]");
    console.log('   找到页面区块数量:', sections.length);
    
    sections.forEach(function (section) {
      const isActive = section.dataset.pageId === state.activePage;
      const wasActive = section.classList.contains('active');
      section.classList.toggle("active", isActive);
      
      if (isActive && !wasActive) {
        console.log('   ✅ 显示页面:', section.dataset.pageId);
      } else if (!isActive && wasActive) {
        console.log('   ❌ 隐藏页面:', section.dataset.pageId);
      }
    });
    
    // 验证：确保至少有一个页面是active的
    const activeSections = Utils.qsa(".page-section.active");
    console.log('   当前激活的页面数:', activeSections.length);
    if (activeSections.length === 0) {
      console.warn('   ⚠️  警告：没有页面被激活！强制激活首页');
      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.classList.add('active');
      }
    }
  }

  function syncTabState(buttonSelector, panelSelector, buttonAttr, panelAttr, value) {
    Utils.qsa(buttonSelector).forEach(function (button) {
      button.classList.toggle("active", button.dataset[buttonAttr] === value);
    });

    Utils.qsa(panelSelector).forEach(function (panel) {
      panel.classList.toggle("active", panel.dataset[panelAttr] === value);
    });
  }

  function applyLanguage() {
    document.documentElement.lang = state.language === "zh" ? "zh-CN" : "en";
    window.MSCLab.sharedI18n = function (key, fallback) {
      return translations[state.language][key] || translations.en[key] || fallback;
    };

    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
    } catch (error) {
      // Ignore storage errors in restrictive browser contexts.
    }

    document.title = t("pageTitle");
    const descriptionTag = Utils.qs("meta[name=\"description\"]");
    if (descriptionTag) {
      descriptionTag.setAttribute("content", t("pageDescription"));
    }

    Utils.qsa("[data-i18n]").forEach(function (element) {
      const key = element.dataset.i18n;
      element.textContent = t(key);
    });

    Utils.qsa("[data-i18n-placeholder]").forEach(function (element) {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });

    Utils.qsa("[data-i18n-aria-label]").forEach(function (element) {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });

    Utils.qsa("[data-i18n-title]").forEach(function (element) {
      element.setAttribute("title", t(element.dataset.i18nTitle));
    });

    Utils.qsa(".lang-button").forEach(function (button) {
      button.classList.toggle("active", button.dataset.language === state.language);
    });

    syncPageNavigation();

    const calcExpression = getById("calc-expression");
    const classicExpression = getById("classic-expression");

    updateClassicAngleUi();
    renderScratchpad();
    renderHistory();
    renderCalculatorShortcuts();
    renderConstantFilters();
    renderConstants();
    renderElements();
    renderElementDetail();
    renderElementCompare();

    if (calcExpression && calcExpression.value.trim()) {
      evaluateCalculator(false);
    } else if (getById("calc-result-meta")) {
      getById("calc-result-meta").textContent = t("calcMeta");
    }

    if (classicExpression && classicExpression.value.trim()) {
      evaluateClassicCalculator();
    } else {
      getById("classic-result").textContent = "0";
      getById("classic-display-meta").textContent = t("classicMeta");
      setStatusMessage(getById("classic-message"), "", false);
    }

    runDerivative();
    runIntegral();
    runRootFinder();
    plotFunction();
    refreshStrengtheningSuite();
    refreshVisiblePage();
    Utils.typesetMath(document.body);
  }

  function setStatusMessage(element, message, isError) {
    element.textContent = message || "";
    element.classList.toggle("error", Boolean(isError));
  }

  function plotTheme(overrides) {
    return Object.assign({
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: {
        family: "\"IBM Plex Sans\", sans-serif",
        color: "#173047",
        size: 12
      },
      margin: {
        l: 56,
        r: 20,
        t: 38,
        b: 50
      },
      xaxis: {
        gridcolor: "rgba(96, 117, 138, 0.16)",
        zerolinecolor: "rgba(96, 117, 138, 0.18)"
      },
      yaxis: {
        gridcolor: "rgba(96, 117, 138, 0.16)",
        zerolinecolor: "rgba(96, 117, 138, 0.18)"
      },
      legend: {
        orientation: "h",
        x: 0,
        y: 1.14
      }
    }, overrides || {});
  }

  function renderEmptyState(message) {
    return "<div class=\"empty-state\">" + Utils.escapeHtml(message) + "</div>";
  }

  function addScratchpadItem(item) {
    if (!item || !item.key) {
      return;
    }

    state.scratchpad = state.scratchpad.filter(function (entry) {
      return entry.key !== item.key;
    });
    state.scratchpad.unshift(item);
    state.scratchpad = state.scratchpad.slice(0, 8);
    renderScratchpad();
  }

  function renderScratchpad() {
    const containers = [getById("scratchpad-list"), getById("materials-scratchpad")];
    const html = state.scratchpad.length
      ? state.scratchpad.map(function (item) {
          const content = resolveScratchpadItem(item);
          return "<div class=\"scratchpad-item\"><strong>" +
            Utils.escapeHtml(content.label) +
            "</strong><span>" +
            Utils.escapeHtml(content.value) +
            "</span></div>";
        }).join("")
      : renderEmptyState(t("scratchpadEmpty"));

    containers.forEach(function (container) {
      if (container) {
        container.innerHTML = html;
      }
    });
  }

  function addHistory(expression, result, rawLatex) {
    state.history.unshift({
      expression: expression,     // math.js 格式（用于计算和显示）
      result: result,
      latex: rawLatex || ''       // 原始 LaTeX（用于 math-field 回填）
    });
    state.history = state.history.slice(0, 8);
    renderHistory();
  }

  function renderHistory() {
    const container = getById("calc-history");
    if (!container) {
      return;
    }

    if (!state.history.length) {
      container.innerHTML = renderEmptyState(t("historyEmpty"));
      return;
    }

    container.innerHTML = state.history.map(function (entry, index) {
      return (
        "<div class=\"history-item\" data-history-index=\"" + index + "\">" +
          "<div class=\"history-expression\">" +
            "<code>" + Utils.escapeHtml(entry.expression) + "</code>" +
          "</div>" +
          "<div class=\"history-result\">" +
            "<strong>= " + Utils.formatNumber(entry.result, 6, { html: true }) + "</strong>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function renderCalculatorShortcuts() {
    const container = getById("calc-constants-panel");
    if (!container) {
      return;
    }

    container.innerHTML = (window.MSCLab.calculatorShortcutAliases || []).map(function (alias) {
      const constant = constants.find(function (item) {
        return item.alias === alias;
      });
      if (!constant) {
        return "";
      }
      return "<button class=\"constant-chip\" type=\"button\" data-constant-alias=\"" +
        Utils.escapeHtml(alias) +
        "\">" +
        Utils.escapeHtml(constant.symbol) +
        "</button>";
    }).join("");
  }

  function evaluateCalculator(pushToHistory) {
    const expressionField = getById("calc-expression");
    const resultField = getById("calc-result");
    const metaField = getById("calc-result-meta");
    const messageField = getById("calc-message");

    try {
      // 保存原始 LaTeX（math-field 场景）
      const rawLatex = expressionField.tagName === 'MATH-FIELD' ? expressionField.value : '';
      // 使用 getMathFieldExpression 处理 math-field 元素
      const expression = getMathFieldExpression("calc-expression");
      const value = Models.evaluateExpression(expression);
      resultField.innerHTML = Utils.formatNumber(value, 6, { html: true });
      metaField.textContent = t("calcRawValuePrefix") + ": " + value;
      setStatusMessage(messageField, t("calcEvalSuccess"), false);

      if (pushToHistory !== false) {
        addHistory(expression, value, rawLatex);
      }
    } catch (error) {
      resultField.textContent = t("errorLabel");
      metaField.textContent = t("calcCheckSyntax");
      setStatusMessage(messageField, translateError(error), true);
    }
  }

  function getClassicScope() {
    if (state.classicAngleMode === "deg") {
      const toRadians = function (value) {
        return Number(value) * Math.PI / 180;
      };

      return {
        sin: function (value) {
          return Math.sin(toRadians(value));
        },
        cos: function (value) {
          return Math.cos(toRadians(value));
        },
        tan: function (value) {
          return Math.tan(toRadians(value));
        }
      };
    }

    return {};
  }

  function updateClassicAngleUi() {
    const angleLabel = state.classicAngleMode === "deg" ? t("angleDeg") : t("angleRad");
    const toggle = getById("classic-angle-toggle");
    const pill = getById("classic-angle-pill");

    if (toggle) {
      toggle.textContent = angleLabel;
    }
    if (pill) {
      pill.textContent = angleLabel;
    }
  }

  function replaceClassicRange(replacement, start, end, cursorPosition) {
    const field = getById("classic-expression");

    // math-field 元素使用 MathLive API
    if (field.tagName === 'MATH-FIELD') {
      field.focus();
      field.executeCommand('insert', replacement, { selectionMode: 'after' });
      return;
    }

    const value = field.value;
    const safeStart = Math.max(0, start);
    const safeEnd = Math.max(safeStart, end);
    field.value = value.slice(0, safeStart) + replacement + value.slice(safeEnd);
    const nextCursor = typeof cursorPosition === "number" ? cursorPosition : safeStart + replacement.length;
    field.focus();
    field.setSelectionRange(nextCursor, nextCursor);
  }

  function insertClassicText(token, cursorOffset) {
    const field = getById("classic-expression");
    
    if (field.tagName === 'MATH-FIELD') {
      field.focus();
      setTimeout(() => {
        field.executeCommand('insert', token);
      }, 50);
      return;
    }
    
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;
    const cursorPos = typeof cursorOffset === "number" ? start + cursorOffset : start + token.length;
    replaceClassicRange(token, start, end, cursorPos);
  }

  function wrapClassicSelection(prefix, suffix, fallbackText) {
    const field = getById("classic-expression");
    
    // 如果 field 是 math-field，使用 MathLive 的方式
    if (field.tagName === 'MATH-FIELD') {
      const latex = field.value || '';
      const start = field.selectionStart || 0;
      const end = field.selectionEnd || 0;
      
      if (start !== end) {
        // 有选中的文本
        const selected = latex.slice(start, end);
        const replacement = prefix + selected + suffix;
        field.executeCommand('insert', replacement);
        return;
      }
      
      // 没有选中，使用 fallback
      const inner = fallbackText || '';
      field.executeCommand('insert', prefix + inner + suffix);
      return;
    }
    
    // 普通 input 的处理逻辑
    const value = field.value;
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;
    const hasSelection = start !== end;

    if (hasSelection) {
      const selected = value.slice(start, end);
      const replacement = prefix + selected + suffix;
      replaceClassicRange(replacement, start, end, start + replacement.length);
      return;
    }

    if (value.trim()) {
      const replacement = prefix + value + suffix;
      field.value = replacement;
      field.focus();
      field.setSelectionRange(prefix.length + value.length, prefix.length + value.length);
      return;
    }

    const inner = fallbackText || "";
    field.value = prefix + inner + suffix;
    field.focus();
    field.setSelectionRange(prefix.length + inner.length, prefix.length + inner.length);
  }

  function toggleClassicSign() {
    const field = getById("classic-expression");

    // math-field 元素：直接在前面插入负号（或删除已有的）
    if (field.tagName === 'MATH-FIELD') {
      const latex = field.value;
      if (!latex || latex.trim() === '') {
        field.executeCommand('insert', '-');
        return;
      }
      // 如果已有内容，包装为 -(...)
      field.setValue('-\\left(' + latex + '\\right)');
      return;
    }

    const value = field.value.trim();
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;

    if (start !== end) {
      const selected = field.value.slice(start, end);
      replaceClassicRange("(-1*" + selected + ")", start, end, start + selected.length + 6);
      return;
    }

    if (!value) {
      field.value = "-";
      field.focus();
      field.setSelectionRange(1, 1);
      return;
    }

    if (value.startsWith("-")) {
      field.value = value.slice(1);
    } else {
      field.value = "-" + value;
    }

    field.focus();
    const cursor = field.value.length;
    field.setSelectionRange(cursor, cursor);
  }

  function applyPercentToClassic() {
    const field = getById("classic-expression");

    // math-field 元素：包装为 \frac{...}{100}
    if (field.tagName === 'MATH-FIELD') {
      const latex = field.value;
      if (latex && latex.trim()) {
        field.setValue('\\frac{' + latex + '}{100}');
      } else {
        field.executeCommand('insert', '\\frac{}{100}', { selectionMode: 'placeholder' });
      }
      return;
    }

    const value = field.value;
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;

    if (start !== end) {
      const selected = value.slice(start, end);
      replaceClassicRange("((" + selected + ")/100)", start, end, start + selected.length + 8);
      return;
    }

    const delimiters = " +-*/^(),\u00d7\u00f7";
    let tokenStart = start;
    let tokenEnd = start;

    while (tokenStart > 0 && delimiters.indexOf(value[tokenStart - 1]) === -1) {
      tokenStart -= 1;
    }
    while (tokenEnd < value.length && delimiters.indexOf(value[tokenEnd]) === -1) {
      tokenEnd += 1;
    }

    if (tokenStart !== tokenEnd) {
      const token = value.slice(tokenStart, tokenEnd);
      replaceClassicRange("((" + token + ")/100)", tokenStart, tokenEnd, tokenStart + token.length + 8);
      return;
    }

    if (value.trim()) {
      field.value = "((" + value + ")/100)";
      field.focus();
      const cursor = field.value.length;
      field.setSelectionRange(cursor, cursor);
      return;
    }

    insertClassicText("()/100", 1);
  }

  function backspaceClassic() {
    const field = getById("classic-expression");
    
    // 如果 field 是 math-field，使用 MathLive 的 delete 命令
    if (field.tagName === 'MATH-FIELD') {
      field.executeCommand('deleteBackward');
      return;
    }
    
    const value = field.value;
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;

    if (start !== end) {
      replaceClassicRange("", start, end, start);
      return;
    }

    if (start > 0) {
      replaceClassicRange("", start - 1, start, start - 1);
    }
  }

  function evaluateClassicCalculator() {
    const field = getById("classic-expression");
    const resultField = getById("classic-result");
    const metaField = getById("classic-display-meta");
    const messageField = getById("classic-message");

    try {
      // 使用 getMathFieldExpression 处理 math-field 元素
      const expression = getMathFieldExpression("classic-expression");
      const value = Models.evaluateExpression(expression, getClassicScope());
      resultField.innerHTML = Utils.formatNumber(value, 6, { html: true });
      metaField.textContent = t("classicMeta");
      setStatusMessage(messageField, t("classicReady"), false);
    } catch (error) {
      resultField.textContent = t("errorLabel");
      metaField.textContent = t("classicMeta");
      setStatusMessage(messageField, t("classicErrorPrefix") + ": " + translateError(error), true);
    }
  }

  function handleClassicKeypad(action, insertValue) {
    switch (action) {
      case "clear": {
        const field = getById("classic-expression");
        if (field.tagName === 'MATH-FIELD') {
          field.executeCommand('deleteAll');
        } else {
          field.value = "";
        }
        getById("classic-result").textContent = "0";
        getById("classic-display-meta").textContent = t("classicMeta");
        setStatusMessage(getById("classic-message"), "", false);
        return;
      }
      case "backspace":
        backspaceClassic();
        return;
      case "evaluate":
        evaluateClassicCalculator();
        return;
      case "toggle-sign":
        toggleClassicSign();
        return;
      case "square":
        insertClassicText("^{2}");
        return;
      case "sqrt":
        insertClassicText("\\sqrt{", 6);
        return;
      case "power":
        insertClassicText("^{", 2);
        return;
      case "reciprocal":
        wrapClassicSelection("\\frac{1}{", "}", "");
        return;
      case "absolute":
        wrapClassicSelection("\\left|", "\\right|", "");
        return;
      case "percent":
        applyPercentToClassic();
        return;
      case "factorial":
        insertClassicText("!");
        return;
      default:
        if (insertValue) {
          insertClassicText(insertValue);
        }
    }
  }

  function renderToolResult(targetId, title, valueText, extraText) {
    const target = getById(targetId);
    if (!target) {
      return;
    }

    target.classList.remove("error");
    target.innerHTML =
      "<div class=\"stat-card\">" +
        "<small>" + Utils.escapeHtml(title) + "</small>" +
        "<strong>" + valueText + "</strong>" +
        (extraText ? "<div class=\"muted-copy\">" + extraText + "</div>" : "") +
      "</div>";
  }

  function runDerivative() {
    try {
      const value = Models.numericalDerivative(
        getMathFieldExpression("derivative-expression"),
        getById("derivative-point").value
      );
      renderToolResult(
        "derivative-output",
        t("derivativeOutputTitle"),
        Utils.formatNumber(value, 6, { html: true }),
        t("derivativeOutputNote")
      );
    } catch (error) {
      setStatusMessage(getById("derivative-output"), translateError(error), true);
    }
  }

  function runIntegral() {
    try {
      const value = Models.definiteIntegral(
        getMathFieldExpression("integral-expression"),
        getById("integral-a").value,
        getById("integral-b").value,
        getById("integral-steps").value
      );
      renderToolResult(
        "integral-output",
        t("integralOutputTitle"),
        Utils.formatNumber(value, 6, { html: true }),
        t("integralOutputNote")
      );
    } catch (error) {
      setStatusMessage(getById("integral-output"), translateError(error), true);
    }
  }

  function runRootFinder() {
    try {
      const result = Models.findRoot(
        getMathFieldExpression("root-expression"),
        getById("root-x0").value,
        getById("root-x1").value,
        getById("root-tol").value
      );
      renderToolResult(
        "root-output",
        t("rootOutputTitle"),
        Utils.formatNumber(result.root, 6, { html: true }),
        tf("rootResidualTemplate", {
          residual: Utils.formatNumber(result.residual, 4),
          iterations: result.iterations
        })
      );
    } catch (error) {
      setStatusMessage(getById("root-output"), translateError(error), true);
    }
  }

  function plotFunction() {
    const output = getById("plot-output");

    try {
      const sample = Models.sampleFunction(
        getMathFieldExpression("plot-expression"),
        getById("plot-min").value,
        getById("plot-max").value,
        getById("plot-points").value
      );

      if (window.Plotly) {
        window.Plotly.react("calc-plot", [
          {
            x: sample.xs,
            y: sample.ys,
            type: "scatter",
            mode: "lines",
            line: {
              color: "#1f5e87",
              width: 3
            },
            fill: "tozeroy",
            fillcolor: "rgba(31, 94, 135, 0.12)"
          }
        ], plotTheme({
          title: t("chartFunctionPlotTitle"),
          xaxis: { title: t("axisX"), gridcolor: "rgba(96, 117, 138, 0.16)" },
          yaxis: { title: t("axisY"), gridcolor: "rgba(96, 117, 138, 0.16)" }
        }), { responsive: true, displayModeBar: false });
      }

      renderToolResult(
        "plot-output",
        t("plotStatusTitle"),
        tf("plotStatusValue", { count: sample.xs.length }),
        t("plotStatusNote")
      );
    } catch (error) {
      setStatusMessage(output, translateError(error), true);
    }
  }

  // ========== 科学计算器内嵌面板逻辑 ==========

  /* Tab 切换 */
  function activateCalcTab(tabName) {
    state.calcPanel = tabName;
    // 切换 calc-tab buttons
    document.querySelectorAll('#calc-tabs [data-calc-tab]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.calcTab === tabName);
    });
    // 切换 calc-tab panels
    document.querySelectorAll('.calc-tab-panel').forEach(function(panel) {
      panel.classList.toggle('active', panel.dataset.calcPanel === tabName);
    });
    // 切换到 plot 时自动绘制
    if (tabName === 'plot') {
      window.setTimeout(function() { calcPlotFunction(); }, 50);
    }
    // 切换到 taylor 时 typeset
    if (tabName === 'taylor' || tabName === 'analysis') {
      window.setTimeout(function() { Utils.typesetMath(getById('scientific-calculator')); }, 50);
    }
  }

  /* 分析子标签切换 */
  function activateCalcAnalysisTab(tabName) {
    state.calcAnalysisPanel = tabName;
    document.querySelectorAll('[data-analysis-tab]').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.analysisTab === tabName);
    });
    document.querySelectorAll('.analysis-content').forEach(function(panel) {
      panel.classList.toggle('active', panel.dataset.analysisPanel === tabName);
    });
    Utils.typesetMath(getById('scientific-calculator'));
  }

  /* 科学计算器内嵌绘图 */
  function calcPlotFunction() {
    const output = getById("calc-plot-output");
    try {
      const sample = Models.sampleFunction(
        getMathFieldExpression("calc-plot-expression"),
        getById("calc-plot-min").value,
        getById("calc-plot-max").value,
        getById("calc-plot-points").value
      );
      if (window.Plotly) {
        window.Plotly.react("calc-plot", [
          {
            x: sample.xs, y: sample.ys,
            type: "scatter", mode: "lines",
            line: { color: "#1f5e87", width: 3 },
            fill: "tozeroy", fillcolor: "rgba(31, 94, 135, 0.12)",
            name: t("field_functionYx")
          }
        ], plotTheme({
          title: t("chartFunctionPlotTitle"),
          xaxis: { title: t("axisX"), gridcolor: "rgba(96, 117, 138, 0.16)" },
          yaxis: { title: t("axisY"), gridcolor: "rgba(96, 117, 138, 0.16)" }
        }), { responsive: true, displayModeBar: false });
      }
      renderToolResult("calc-plot-output", t("plotStatusTitle"),
        tf("plotStatusValue", { count: sample.xs.length }), t("plotStatusNote"));
    } catch (error) {
      setStatusMessage(output, translateError(error), true);
    }
  }

  /* Taylor 展开 */
  function runCalcTaylor() {
    const output = getById("calc-taylor-series-output");
    try {
      const expr = getMathFieldExpression("calc-taylor-expression");
      const center = getById("calc-taylor-center").value;
      const order = getById("calc-taylor-order").value;
      const result = Models.taylorSeries(expr, center, order);

      // 构建系数表格
      let html = '<div class="stat-card"><small>' + Utils.escapeHtml(t("taylorOutputCoefficients")) + '</small>';
      html += '<div style="margin-top:0.5rem;font-family:var(--font-mono);font-size:0.9rem;overflow-x:auto">';
      html += '<table style="width:100%;border-collapse:collapse"><thead><tr>';
      html += '<th style="text-align:left;padding:0.3rem;border-bottom:1px solid var(--line)">n</th>';
      html += '<th style="text-align:right;padding:0.3rem;border-bottom:1px solid var(--line)">f\u207F(a)/n!</th>';
      html += '</tr></thead><tbody>';
      result.series.forEach(function(s) {
        const coeffStr = Utils.formatNumber(s.coefficient, 8);
        html += '<tr>';
        html += '<td style="padding:0.25rem">' + s.order + '</td>';
        html += '<td style="text-align:right;padding:0.25rem;font-family:var(--font-mono)">' + coeffStr + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div></div>';

      // 误差信息
      const approxStr = Utils.formatNumber(result.value, 8);
      const exactStr = Utils.formatNumber(result.exactValue, 8);
      const errorVal = Math.abs(result.exactValue - result.value);
      const errorStr = Utils.formatNumber(errorVal, 8);
      html += '<div class="stat-card" style="margin-top:0.8rem">';
      html += '<small>' + Utils.escapeHtml(tf("taylorOutputValue", { x: '0', value: approxStr })) + '</small>';
      html += '<div class="muted-copy">' + Utils.escapeHtml(tf("taylorOutputExact", { exact: exactStr })) + '</div>';
      html += '<div class="muted-copy">' + Utils.escapeHtml(tf("taylorOutputError", { error: errorStr })) + '</div>';
      html += '</div>';

      output.classList.remove('error');
      output.innerHTML = html;

      // 绘制对比图
      drawTaylorPlot(expr, center, order, result);
      Utils.typesetMath(output);
    } catch (error) {
      setStatusMessage(output, translateError(error), true);
    }
  }

  function drawTaylorPlot(expression, center, order) {
    const min = Number(getById("calc-taylor-min").value);
    const max = Number(getById("calc-taylor-max").value);
    const points = 200;
    const a = Number(center);
    const fn = Models.sampleFunction(expression, min, max, points);
    const taylorResult = Models.taylorSeries(expression, center, order);

    // 计算 Taylor 近似曲线
    const taylorYs = [];
    for (let i = 0; i < fn.xs.length; i++) {
      const x = fn.xs[i];
      let y = 0;
      for (let k = 0; k < taylorResult.series.length; k++) {
        y += taylorResult.series[k].coefficient * Math.pow(x - a, k);
      }
      taylorYs.push(y);
    }

    if (window.Plotly) {
      window.Plotly.react("calc-taylor-plot", [
        {
          x: fn.xs, y: fn.ys,
          type: "scatter", mode: "lines",
          line: { color: "#1f5e87", width: 2.5 },
          name: "f(x)"
        },
        {
          x: fn.xs, y: taylorYs,
          type: "scatter", mode: "lines",
          line: { color: "#e06060", width: 2, dash: "dash" },
          name: "Taylor (n=" + order + ")"
        }
      ], plotTheme({
        title: t("taylorPlotTitle"),
        xaxis: { title: "x", gridcolor: "rgba(96, 117, 138, 0.16)" },
        yaxis: { title: "y", gridcolor: "rgba(96, 117, 138, 0.16)" }
      }), { responsive: true, displayModeBar: false });
    }
  }

  function renderConstantFilters() {
    const container = getById("constant-filters");
    if (!container) {
      return;
    }

    container.innerHTML = (window.MSCLab.constantCategoryKeys || []).map(function (categoryKey) {
      const activeClass = categoryKey === state.constantFilter ? " chip active" : " chip";
      return "<button class=\"" + activeClass + "\" type=\"button\" data-category=\"" +
        Utils.escapeHtml(categoryKey) +
        "\">" +
        Utils.escapeHtml(constantCategoryLabel(categoryKey)) +
        "</button>";
    }).join("");
  }

  function renderConstants() {
    const search = (getById("constant-search").value || "").trim().toLowerCase();
    const list = getById("constants-list");

    const filtered = constants.filter(function (item) {
      const haystack = [
        searchText(item.name),
        item.symbol,
        item.alias,
        item.categoryKey,
        constantCategoryLabel(item.categoryKey),
        searchText(item.description)
      ].join(" ");

      const matchesSearch = !search || haystack.includes(search);
      const matchesFilter = state.constantFilter === "all" || item.categoryKey === state.constantFilter;
      return matchesSearch && matchesFilter;
    });

    if (!filtered.length) {
      list.innerHTML = renderEmptyState(t("constantsEmpty"));
      return;
    }

    list.innerHTML = filtered.map(function (item) {
      return (
        "<article class=\"constant-card\">" +
          "<div class=\"constant-head\">" +
            "<div>" +
              "<div class=\"tag-badge\">" + Utils.escapeHtml(constantCategoryLabel(item.categoryKey)) + "</div>" +
              "<h3>" + Utils.escapeHtml(localizedValue(item.name)) + "</h3>" +
              "<div class=\"constant-symbol\">" + Utils.escapeHtml(item.symbol) + " | " + Utils.escapeHtml(t("constantAliasLabel")) + ": " + Utils.escapeHtml(item.alias) + "</div>" +
            "</div>" +
          "</div>" +
          "<div class=\"constant-value\">" + Utils.formatNumber(item.value, 6, { html: true }) + "</div>" +
          "<div class=\"muted-copy\">" + Utils.escapeHtml(unitText(item.unit)) + "</div>" +
          "<p class=\"muted-copy\">" + Utils.escapeHtml(localizedValue(item.description)) + "</p>" +
          "<div class=\"constant-actions\">" +
            "<button class=\"button secondary\" type=\"button\" data-copy-constant=\"" + Utils.escapeHtml(item.id) + "\">" + Utils.escapeHtml(t("actionCopyValue")) + "</button>" +
            "<button class=\"button primary\" type=\"button\" data-use-constant=\"" + Utils.escapeHtml(item.id) + "\">" + Utils.escapeHtml(t("actionUseInCalculator")) + "</button>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function formatElementValue(value, suffix) {
    if (value === null || value === undefined || value === "") {
      return t("sharedNa");
    }

    if (typeof value === "number") {
      return Utils.formatNumber(value, 4) + (suffix ? " " + suffix : "");
    }

    return String(localizedValue(value));
  }

  function renderElements() {
    const query = (getById("element-search").value || "").trim().toLowerCase();
    const container = getById("elements-grid");

    const filtered = elements.filter(function (element) {
      const haystack = [
        element.symbol,
        searchText(element.name),
        searchText(element.crystalStructure),
        searchText(element.notes)
      ].join(" ");
      return !query || haystack.includes(query);
    });

    if (!filtered.length) {
      container.innerHTML = renderEmptyState(t("elementsEmpty"));
      return;
    }

    container.innerHTML = filtered.map(function (element) {
      const activeClass = state.selectedElement && state.selectedElement.symbol === element.symbol ? " element-tile active" : " element-tile";
      return (
        "<button class=\"" + activeClass + "\" type=\"button\" data-element-symbol=\"" + Utils.escapeHtml(element.symbol) + "\">" +
          "<div class=\"element-number\">" + element.atomicNumber + "</div>" +
          "<div class=\"element-symbol\">" + Utils.escapeHtml(element.symbol) + "</div>" +
          "<p class=\"element-name\">" + Utils.escapeHtml(localizedValue(element.name)) + "</p>" +
          "<span class=\"element-structure\">" + Utils.escapeHtml(localizedValue(element.crystalStructure)) + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function renderElementDetail() {
    const container = getById("element-detail");
    const element = state.selectedElement;

    if (!element) {
      container.innerHTML = renderEmptyState(t("elementDetailPlaceholder"));
      return;
    }

    const rows = [
      [t("compareFieldAtomicNumber"), formatElementValue(element.atomicNumber)],
      [t("compareFieldAtomicWeight"), formatElementValue(element.atomicWeight)],
      [t("compareFieldCommonValence"), formatElementValue(element.valence)],
      [t("compareFieldAtomicRadius"), formatElementValue(element.atomicRadius, "pm")],
      [t("compareFieldCovalentRadius"), formatElementValue(element.covalentRadius, "pm")],
      [t("compareFieldMetallicRadius"), formatElementValue(element.metallicRadius, "pm")],
      [t("compareFieldElectronegativity"), formatElementValue(element.electronegativity)],
      [t("compareFieldCrystalStructure"), formatElementValue(element.crystalStructure)],
      [t("compareFieldDensity"), formatElementValue(element.density, "g/cm^3")],
      [t("compareFieldMeltingPoint"), formatElementValue(element.meltingPoint, "deg C")]
    ];

    container.innerHTML = (
      "<div class=\"detail-grid\">" +
        "<div class=\"detail-hero\">" +
          "<div>" +
            "<p class=\"eyebrow\">" + Utils.escapeHtml(t("selectedElementEyebrow")) + "</p>" +
            "<h3>" + Utils.escapeHtml(localizedValue(element.name)) + "</h3>" +
            "<p class=\"muted-copy\">" + Utils.escapeHtml(localizedValue(element.notes)) + "</p>" +
          "</div>" +
          "<div class=\"detail-symbol\">" + Utils.escapeHtml(element.symbol) + "</div>" +
        "</div>" +
        "<div class=\"detail-list\">" +
          rows.map(function (row) {
            return "<div class=\"detail-row\"><span>" + Utils.escapeHtml(row[0]) + "</span><strong>" + Utils.escapeHtml(row[1]) + "</strong></div>";
          }).join("") +
        "</div>" +
        "<div class=\"detail-actions\">" +
          "<button class=\"button secondary\" type=\"button\" data-compare-slot=\"A\">" + Utils.escapeHtml(t("compareActionA")) + "</button>" +
          "<button class=\"button secondary\" type=\"button\" data-compare-slot=\"B\">" + Utils.escapeHtml(t("compareActionB")) + "</button>" +
          "<button class=\"button primary\" type=\"button\" data-stage-element=\"true\">" + Utils.escapeHtml(t("queuePropertiesAction")) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function compareSlotMarkup(label, element) {
    if (!element) {
      return "<div class=\"compare-slot\"><h4>" + Utils.escapeHtml(t("compareSlotPrefix") + " " + label) + "</h4><div class=\"empty-state\">" + Utils.escapeHtml(t("compareAwaitingSelection")) + "</div></div>";
    }

    return (
      "<div class=\"compare-slot\">" +
        "<h4>" + Utils.escapeHtml(t("compareSlotPrefix") + " " + label) + "</h4>" +
        "<h5>" + Utils.escapeHtml(element.symbol + " | " + localizedValue(element.name)) + "</h5>" +
        "<div class=\"detail-list\">" +
          "<div class=\"detail-row\"><span>" + Utils.escapeHtml(t("compareFieldStructure")) + "</span><strong>" + Utils.escapeHtml(formatElementValue(element.crystalStructure)) + "</strong></div>" +
          "<div class=\"detail-row\"><span>" + Utils.escapeHtml(t("compareFieldDensity")) + "</span><strong>" + Utils.escapeHtml(formatElementValue(element.density, "g/cm^3")) + "</strong></div>" +
          "<div class=\"detail-row\"><span>" + Utils.escapeHtml(t("compareFieldMeltingPoint")) + "</span><strong>" + Utils.escapeHtml(formatElementValue(element.meltingPoint, "deg C")) + "</strong></div>" +
          "<div class=\"detail-row\"><span>" + Utils.escapeHtml(t("compareFieldElectronegativity")) + "</span><strong>" + Utils.escapeHtml(formatElementValue(element.electronegativity)) + "</strong></div>" +
          "<div class=\"detail-row\"><span>" + Utils.escapeHtml(t("compareFieldValence")) + "</span><strong>" + Utils.escapeHtml(formatElementValue(element.valence)) + "</strong></div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderElementCompare() {
    const container = getById("element-compare");
    container.innerHTML = compareSlotMarkup("A", state.compareA) + compareSlotMarkup("B", state.compareB);
  }

  function readHallPetchParams() {
    return {
      sigma0: getById("hp-sigma0").value,
      sigma0Unit: getById("hp-sigma0-unit").value,
      ky: getById("hp-ky").value,
      grainSize: getById("hp-grain-size").value,
      grainUnit: getById("hp-grain-unit").value
    };
  }

  function readDislocationParams() {
    return {
      alpha: getById("dis-alpha").value,
      G: getById("dis-G").value,
      b: getById("dis-b").value,
      rho: getById("dis-rho").value
    };
  }

  function readCuttingParams() {
    return {
      radius: getById("cut-radius").value,
      fraction: getById("cut-fraction").value,
      apb: getById("cut-apb").value,
      G: getById("cut-G").value,
      b: getById("cut-b").value,
      k: getById("cut-k").value
    };
  }

  function readOrowanParams() {
    return {
      G: getById("or-G").value,
      b: getById("or-b").value,
      radius: getById("or-radius").value,
      spacing: getById("or-spacing").value,
      nu: getById("or-nu").value
    };
  }

  function renderModelOutput(targetId, cards) {
    const container = getById(targetId);
    container.innerHTML = cards.map(function (card) {
      return (
        "<div class=\"stat-card\">" +
          "<small>" + Utils.escapeHtml(card.label) + "</small>" +
          "<strong>" + card.value + "</strong>" +
          "<div class=\"muted-copy\">" + Utils.escapeHtml(card.note) + "</div>" +
        "</div>"
      );
    }).join("");
  }

  function updateHallPetch() {
    const result = Models.hallPetch(readHallPetchParams());
    renderModelOutput("hp-output", [
      {
        label: t("hpOutputIncrementLabel"),
        value: Utils.formatNumber(result.incrementMPa, 5, { html: true }) + " MPa",
        note: t("hpOutputIncrementNote")
      },
      {
        label: t("hpOutputTotalLabel"),
        value: Utils.formatNumber(result.totalYieldMPa, 5, { html: true }) + " MPa",
        note: t("hpOutputTotalNote")
      },
      {
        label: t("hpOutputGrainLabel"),
        value: Utils.formatNumber(result.grainSizeMeters, 5, { html: true }) + " m",
        note: t("hpOutputGrainNote")
      }
    ]);
    Utils.typesetMath(getById("hp-output"));
    return result;
  }

  function updateDislocation() {
    const result = Models.dislocation(readDislocationParams());
    renderModelOutput("dis-output", [
      {
        label: t("disOutputIncrementLabel"),
        value: Utils.formatNumber(result.incrementMPa, 5, { html: true }) + " MPa",
        note: t("disOutputIncrementNote")
      },
      {
        label: t("disOutputInterpretationLabel"),
        value: t("disOutputInterpretationValue"),
        note: t("disOutputInterpretationNote")
      }
    ]);
    return result;
  }

  function updateCutting() {
    const params = readCuttingParams();
    const result = Models.cutting(params);
    renderModelOutput("cut-output", [
      {
        label: t("cutOutputIncrementLabel"),
        value: Utils.formatNumber(result.incrementMPa, 5, { html: true }) + " MPa",
        note: t("cutOutputIncrementNote")
      },
      {
        label: t("cutOutputRadiusLabel"),
        value: t("cutOutputRadiusValue"),
        note: t("cutOutputRadiusNote")
      },
      {
        label: t("cutOutputModelLabel"),
        value: t("cutOutputModelValue"),
        note: t("cutOutputModelNote")
      }
    ]);

    if (window.Plotly) {
      const maxRadius = Math.max(Number(params.radius) * 4, 60);
      const radii = Models.buildRange(2, maxRadius, 60);
      const values = radii.map(function (radius) {
        return Models.cutting(Object.assign({}, params, { radius: radius })).incrementMPa;
      });

      window.Plotly.react("cut-plot", [
        {
          x: radii,
          y: values,
          type: "scatter",
          mode: "lines",
          name: t("chartCutLegend"),
          line: { color: "#1d8f7f", width: 3 }
        }
      ], plotTheme({
        title: t("chartCutTitle"),
        xaxis: { title: t("axisPrecipitateRadius") },
        yaxis: { title: t("axisCutStrength") }
      }), { responsive: true, displayModeBar: false });
    }

    return result;
  }

  function updateOrowan() {
    const params = readOrowanParams();
    const result = Models.orowan(params);
    renderModelOutput("or-output", [
      {
        label: t("orOutputIncrementLabel"),
        value: Utils.formatNumber(result.incrementMPa, 5, { html: true }) + " MPa",
        note: t("orOutputIncrementNote")
      },
      {
        label: t("orOutputSpacingLabel"),
        value: t("orOutputSpacingValue"),
        note: t("orOutputSpacingNote")
      },
      {
        label: t("orOutputModelLabel"),
        value: t("orOutputModelValue"),
        note: t("orOutputModelNote")
      }
    ]);

    if (window.Plotly) {
      const maxSpacing = Math.max(Number(params.spacing) * 3, 200);
      const spacing = Models.buildRange(20, maxSpacing, 60);
      const values = spacing.map(function (value) {
        return Models.orowan(Object.assign({}, params, { spacing: value })).incrementMPa;
      });

      window.Plotly.react("or-plot", [
        {
          x: spacing,
          y: values,
          type: "scatter",
          mode: "lines",
          name: t("chartOrowanLegend"),
          line: { color: "#c47828", width: 3 }
        }
      ], plotTheme({
        title: t("chartOrowanTitle"),
        xaxis: { title: t("axisInterparticleSpacing") },
        yaxis: { title: t("axisOrowanStrength") }
      }), { responsive: true, displayModeBar: false });
    }

    return result;
  }

  function getComparisonEntries() {
    const entries = [];

    try {
      entries.push({ id: "hallPetch", label: mechanismLabel("hallPetch"), value: Models.hallPetch(readHallPetchParams()).incrementMPa });
    } catch (error) {
      // Skip invalid models for comparison.
    }
    try {
      entries.push({ id: "dislocation", label: mechanismLabel("dislocation"), value: Models.dislocation(readDislocationParams()).incrementMPa });
    } catch (error) {
      // Skip invalid models for comparison.
    }
    try {
      entries.push({ id: "cutting", label: mechanismLabel("cutting"), value: Models.cutting(readCuttingParams()).incrementMPa });
    } catch (error) {
      // Skip invalid models for comparison.
    }
    try {
      entries.push({ id: "orowan", label: mechanismLabel("orowan"), value: Models.orowan(readOrowanParams()).incrementMPa });
    } catch (error) {
      // Skip invalid models for comparison.
    }

    return entries;
  }

  function updateComparison() {
    const entries = getComparisonEntries();
    const table = getById("comparison-table");
    const summary = getById("comparison-summary-text");

    if (!entries.length) {
      table.innerHTML = renderEmptyState(t("comparisonEmpty"));
      summary.innerHTML = "";
      if (window.Plotly) {
        window.Plotly.react("comparison-plot", [], plotTheme({
          title: t("chartComparisonTitle"),
          xaxis: { title: t("axisMechanism") },
          yaxis: { title: t("axisStrengthIncrement") }
        }), { responsive: true, displayModeBar: false });
      }
      return;
    }

    const sorted = entries.slice().sort(function (a, b) {
      return b.value - a.value;
    });

    const cuttingEntry = sorted.find(function (item) { return item.id === "cutting"; });
    const orowanEntry = sorted.find(function (item) { return item.id === "orowan"; });
    const detail = cuttingEntry && orowanEntry && cuttingEntry.value > orowanEntry.value
      ? t("comparisonSummaryShearing")
      : t("comparisonSummaryBypass");

    summary.innerHTML =
      "<h4>" + Utils.escapeHtml(t("comparisonSummaryHeading")) + "</h4>" +
      "<p>" + tf("comparisonSummaryTemplate", {
        mechanism: "<strong>" + Utils.escapeHtml(sorted[0].label) + "</strong>",
        value: Utils.formatNumber(sorted[0].value, 4),
        detail: detail
      }) + "</p>";

    table.innerHTML =
      "<table><thead><tr><th>" + Utils.escapeHtml(t("comparisonTableMechanism")) + "</th><th>" + Utils.escapeHtml(t("comparisonTableContribution")) + "</th></tr></thead><tbody>" +
      sorted.map(function (item) {
        return "<tr><td>" + Utils.escapeHtml(item.label) + "</td><td>" + Utils.formatNumber(item.value, 5, { html: true }) + " MPa</td></tr>";
      }).join("") +
      "</tbody></table>";

    if (window.Plotly) {
      window.Plotly.react("comparison-plot", [
        {
          x: entries.map(function (item) { return item.label; }),
          y: entries.map(function (item) { return item.value; }),
          type: "bar",
          marker: {
            color: ["#1f5e87", "#4b7f9f", "#1d8f7f", "#c47828"]
          }
        }
      ], plotTheme({
        title: t("chartComparisonTitle"),
        xaxis: { title: t("axisMechanism") },
        yaxis: { title: t("axisStrengthIncrement") }
      }), { responsive: true, displayModeBar: false });
    }
  }

  function resizePlot(plotId) {
    if (!window.Plotly || !window.Plotly.Plots) {
      return;
    }

    const plot = typeof plotId === "string" ? getById(plotId) : plotId;
    if (!plot) {
      return;
    }

    try {
      window.Plotly.Plots.resize(plot);
    } catch (error) {
      // Ignore resize failures for hidden or uninitialized plots.
    }
  }

  function activateAnalysisTab(tabName) {
    state.analysisPanel = tabName;
    syncTabState("#analysis-tabs [data-analysis-tab]", ".analysis-tab-panel", "analysisTab", "analysisPanel", tabName);
    Utils.typesetMath(getById("function-analysis"));

    if (tabName === "plot") {
      window.setTimeout(function () {
        plotFunction();
        resizePlot("calc-plot");
      }, 0);
    }
  }

  function activateElementPanel(panelName) {
    state.elementPanel = panelName;
    syncTabState("#element-view-tabs [data-element-panel]", ".element-tab-panel", "elementPanel", "elementView", panelName);
  }

  function activateVisualPanel(panelName) {
    state.visualPanel = panelName;
    syncTabState("#visual-tabs [data-visual-panel]", ".visual-tab-panel", "visualPanel", "visualView", panelName);

    window.setTimeout(function () {
      safeUpdateVisualLab();
      if (panelName === "sweep") {
        resizePlot("visual-sweep-plot");
      } else if (panelName === "compare") {
        resizePlot("visual-comparison-plot");
      }
    }, 0);
  }

  function activateStrengthTab(tabName) {
    state.strengthTab = tabName;
    syncTabState("#strength-tabs [data-tab]", "#strengthening [data-strength-panel]", "tab", "strengthPanel", tabName);
    Utils.typesetMath(getById("strengthening"));

    window.setTimeout(function () {
      if (tabName === "cutting") {
        try { updateCutting(); } catch (error) { setStatusMessage(getById("cut-output"), translateError(error), true); }
        resizePlot("cut-plot");
      } else if (tabName === "orowan") {
        try { updateOrowan(); } catch (error) { setStatusMessage(getById("or-output"), translateError(error), true); }
        resizePlot("or-plot");
      } else if (tabName === "comparison") {
        updateComparison();
        resizePlot("comparison-plot");
      }
    }, 0);
  }

  function refreshVisiblePage() {
    if (state.activePage === "function-analysis") {
      activateAnalysisTab(state.analysisPanel);
    } else if (state.activePage === "elements") {
      activateElementPanel(state.elementPanel);
    } else if (state.activePage === "visual-lab") {
      activateVisualPanel(state.visualPanel);
    } else if (state.activePage === "strengthening") {
      activateStrengthTab(state.strengthTab);
    }
  }

  function setActivePage(pageId, updateHash) {
    const nextPage = normalizePageId(pageId);
    const section = Utils.qs(".page-section[data-page-id=\"" + nextPage + "\"]");

    state.activePage = nextPage;
    syncPageNavigation();

    if (section) {
      section.scrollTop = 0;
    }

    if (updateHash !== false) {
      try {
        window.history.replaceState(null, "", "#" + nextPage);
      } catch (error) {
        window.location.hash = nextPage;
      }
    }

    refreshVisiblePage();
  }

  function updateVisualReadouts() {
    getById("visual-radius-readout").textContent = getById("visual-radius").value + " nm";
    getById("visual-spacing-readout").textContent = getById("visual-spacing").value + " nm";
  }

  function renderSchematic(radius, spacing) {
    const svg = getById("precipitate-schematic");
    if (!svg) {
      return;
    }

    const radiusScale = Math.max(10, Math.min(34, Number(radius) * 1.2));
    const spacingScale = Math.max(80, Math.min(170, Number(spacing) * 1.8));
    const centers = [110, 110 + spacingScale, 110 + spacingScale * 2];

    svg.innerHTML =
      "<defs>" +
        "<linearGradient id=\"lineGrad\" x1=\"0\" x2=\"1\">" +
          "<stop offset=\"0%\" stop-color=\"#1f5e87\"/>" +
          "<stop offset=\"100%\" stop-color=\"#1d8f7f\"/>" +
        "</linearGradient>" +
      "</defs>" +
      "<rect x=\"0\" y=\"0\" width=\"600\" height=\"180\" fill=\"#f8fbff\"/>" +
      "<path d=\"M30 115 C120 95, 170 145, 260 115 S420 85, 560 115\" fill=\"none\" stroke=\"url(#lineGrad)\" stroke-width=\"6\" stroke-linecap=\"round\"/>" +
      centers.map(function (center) {
        return "<circle cx=\"" + center + "\" cy=\"92\" r=\"" + radiusScale + "\" fill=\"rgba(196, 120, 40, 0.18)\" stroke=\"#c47828\" stroke-width=\"3\"/>";
      }).join("") +
      "<line x1=\"" + centers[0] + "\" y1=\"142\" x2=\"" + centers[1] + "\" y2=\"142\" stroke=\"#60758a\" stroke-dasharray=\"5 5\" stroke-width=\"2\"/>" +
      "<text x=\"" + ((centers[0] + centers[1]) / 2) + "\" y=\"160\" text-anchor=\"middle\" fill=\"#173047\" font-size=\"14\">" + Utils.escapeHtml(t("schematicSpacingPrefix")) + " " + Utils.escapeHtml(String(spacing)) + " nm</text>" +
      "<text x=\"" + centers[0] + "\" y=\"40\" text-anchor=\"middle\" fill=\"#173047\" font-size=\"14\">" + Utils.escapeHtml(t("schematicRadiusPrefix")) + " " + Utils.escapeHtml(String(radius)) + " nm</text>";
  }

  function updateVisualLab() {
    updateVisualReadouts();

    const target = getById("visual-sweep-target").value;
    const min = getById("visual-min").value;
    const max = getById("visual-max").value;
    const steps = getById("visual-steps").value;
    const visualRadius = Number(getById("visual-radius").value);
    const visualSpacing = Number(getById("visual-spacing").value);

    const range = Models.buildRange(min, max, steps);
    let sweepY = [];
    let sweepTitle = "";
    let xTitle = "";
    let yTitle = t("axisVisualStrength");

    if (target === "hallPetch") {
      const params = readHallPetchParams();
      sweepY = range.map(function (grainSize) {
        return Models.hallPetch(Object.assign({}, params, { grainSize: grainSize, grainUnit: "um" })).incrementMPa;
      });
      sweepTitle = t("chartHallPetchSweepTitle");
      xTitle = t("axisGrainSize");
    } else if (target === "cutting") {
      const params = readCuttingParams();
      sweepY = range.map(function (radius) {
        return Models.cutting(Object.assign({}, params, { radius: radius })).incrementMPa;
      });
      sweepTitle = t("chartCuttingSweepTitle");
      xTitle = t("axisPrecipitateRadius");
    } else {
      const params = readOrowanParams();
      sweepY = range.map(function (spacing) {
        return Models.orowan(Object.assign({}, params, { spacing: spacing })).incrementMPa;
      });
      sweepTitle = t("chartOrowanSweepTitle");
      xTitle = t("axisInterparticleSpacing");
    }

    if (window.Plotly) {
      window.Plotly.react("visual-sweep-plot", [
        {
          x: range,
          y: sweepY,
          type: "scatter",
          mode: "lines",
          line: { color: "#1f5e87", width: 3 },
          fill: "tozeroy",
          fillcolor: "rgba(31, 94, 135, 0.10)"
        }
      ], plotTheme({
        title: sweepTitle,
        xaxis: { title: xTitle },
        yaxis: { title: yTitle }
      }), { responsive: true, displayModeBar: false });

      const compareRadius = Models.buildRange(2, 80, 60);
      const cutParams = Object.assign({}, readCuttingParams(), { radius: visualRadius });
      const orParams = Object.assign({}, readOrowanParams(), { radius: visualRadius, spacing: visualSpacing });
      const cutLine = compareRadius.map(function (radius) {
        return Models.cutting(Object.assign({}, cutParams, { radius: radius })).incrementMPa;
      });
      const orLine = compareRadius.map(function (radius) {
        return Models.orowan(Object.assign({}, orParams, { radius: radius })).incrementMPa;
      });

      window.Plotly.react("visual-comparison-plot", [
        {
          x: compareRadius,
          y: cutLine,
          type: "scatter",
          mode: "lines",
          name: t("chartCutLegend"),
          line: { color: "#1d8f7f", width: 3 }
        },
        {
          x: compareRadius,
          y: orLine,
          type: "scatter",
          mode: "lines",
          name: t("chartOrowanLegend"),
          line: { color: "#c47828", width: 3 }
        },
        {
          x: [visualRadius],
          y: [Models.cutting(cutParams).incrementMPa],
          type: "scatter",
          mode: "markers",
          name: t("chartCurrentRadius"),
          marker: { color: "#173047", size: 10 }
        },
        {
          x: [visualRadius],
          y: [Models.orowan(orParams).incrementMPa],
          type: "scatter",
          mode: "markers",
          name: t("chartCurrentSpacing"),
          marker: { color: "#60758a", size: 10 }
        }
      ], plotTheme({
        title: t("chartVisualCompareTitle"),
        xaxis: { title: t("axisPrecipitateRadius") },
        yaxis: { title: t("axisStrengthIncrement") }
      }), { responsive: true, displayModeBar: false });
    }

    renderSchematic(visualRadius, visualSpacing);
  }

  function safeUpdateVisualLab() {
    try {
      updateVisualLab();
    } catch (error) {
      Utils.showToast(translateError(error));
    }
  }

  function refreshStrengtheningSuite() {
    try { updateHallPetch(); } catch (error) { setStatusMessage(getById("hp-output"), translateError(error), true); }
    try { updateDislocation(); } catch (error) { setStatusMessage(getById("dis-output"), translateError(error), true); }
    try { updateCutting(); } catch (error) { setStatusMessage(getById("cut-output"), translateError(error), true); }
    try { updateOrowan(); } catch (error) { setStatusMessage(getById("or-output"), translateError(error), true); }
    updateComparison();
    safeUpdateVisualLab();
  }

  function bindEvents() {
    getById("language-switcher").addEventListener("click", function (event) {
      const button = event.target.closest("[data-language]");
      if (!button || button.dataset.language === state.language) {
        return;
      }
      state.language = button.dataset.language;
      applyLanguage();
    });

    document.addEventListener("click", function (event) {
      const trigger = event.target.closest("[data-page], [data-page-link]");
      if (!trigger) {
        return;
      }

      const pageId = trigger.dataset.page || trigger.dataset.pageLink;
      if (!pageId) {
        return;
      }

      console.log('%c👆 点击导航:', 'color: #1f5e87; font-weight: bold;', pageId);

      if (trigger.tagName === "A") {
        event.preventDefault();
      }

      setActivePage(pageId, true);
    });

    window.addEventListener("hashchange", function () {
      setActivePage(activePageIdFromHash(window.location.hash), false);
    });

    getById("scratchpad-clear").addEventListener("click", function () {
      state.scratchpad = [];
      renderScratchpad();
    });

    getById("classic-angle-toggle").addEventListener("click", function () {
      state.classicAngleMode = state.classicAngleMode === "rad" ? "deg" : "rad";
      updateClassicAngleUi();
      evaluateClassicCalculator();
    });

    // 经典计算器小键盘
    const classicKeypad = getById("classic-keypad");
    if (classicKeypad) {
      classicKeypad.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;
        
        const field = getById("classic-expression");
        if (!field) return;
        
        const action = button.dataset.action;
        const insertValue = button.dataset.insert;
        
        if (field.tagName === 'MATH-FIELD') {
          field.focus();
          setTimeout(() => {
            if (action === "clear") {
              field.executeCommand('deleteAll');
              getById("classic-result").textContent = "0";
            } else if (action === "backspace") {
              field.executeCommand('deleteBackward');
            } else if (action === "evaluate") {
              evaluateClassicCalculator();
            } else if (action === "percent") {
              applyPercentToClassic();
            } else if (action === "factorial") {
              field.executeCommand('insert', '!');
            } else if (action === "toggle-sign") {
              toggleClassicSign();
            } else if (action === "square") {
              field.executeCommand('insert', '^{2}');
            } else if (action === "sqrt") {
              field.executeCommand('insert', '\\sqrt{', { selectionMode: 'placeholder' });
            } else if (action === "power") {
              field.executeCommand('insert', '^', { selectionMode: 'after' });
            } else if (action === "reciprocal") {
              field.executeCommand('insert', '\\frac{1}{#0}');
            } else if (action === "absolute") {
              field.executeCommand('insert', '\\left| #0 \\right|');
            } else if (insertValue) {
              // 数字和运算符直接插入
              field.executeCommand('insert', insertValue);
            }
          }, 30);
          return;
        }
        
        // 降级：非 math-field 元素，使用原有逻辑
        if (action === "clear") {
          field.setValue('');
          getById("classic-result").textContent = "0";
        } else if (action === "backspace") {
          backspaceClassic();
        } else if (insertValue) {
          const currentValue = field.value;
          field.setValue(currentValue + insertValue);
        }
      });
    }

    getById("classic-expression").addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        evaluateClassicCalculator();
      }
    });

    const classicExpression = getById("classic-expression");
    if (classicExpression && classicExpression.tagName !== 'MATH-FIELD') {
      classicExpression.addEventListener("input", function () {
        setStatusMessage(getById("classic-message"), "", false);
        // 实时格式化数学表达式显示
        const input = this;
        const cursorPos = input.selectionStart;
        const rawValue = input.value;
        const formatted = Utils.formatMathExpression(rawValue);
        
        // 只在需要时更新（避免光标跳动）
        if (formatted !== rawValue) {
          input.value = formatted;
          // 恢复光标位置
          const newCursorPos = cursorPos + (formatted.length - rawValue.length);
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    }

    getById("calc-evaluate").addEventListener("click", function () {
      evaluateCalculator(true);
    });

    // ========== 科学计算器 Tab 切换 ==========
    const calcTabs = getById("calc-tabs");
    if (calcTabs) {
      calcTabs.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-calc-tab]");
        if (btn) activateCalcTab(btn.dataset.calcTab);
      });
    }

    // ========== 分析子标签切换 ==========
    document.querySelectorAll(".analysis-sub-tabs").forEach(function(tabRow) {
      tabRow.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-analysis-tab]");
        if (btn) activateCalcAnalysisTab(btn.dataset.analysisTab);
      });
    });

    // ========== 符号微积分子标签切换 ==========
    document.querySelectorAll("[data-symbolic-tab]").forEach(function(btn) {
      btn.addEventListener("click", function () {
        const tabName = this.dataset.symbolicTab;
        document.querySelectorAll("[data-symbolic-tab]").forEach(function(b) {
          b.classList.toggle("active", b.dataset.symbolicTab === tabName);
        });
        document.querySelectorAll("[data-symbolic-panel]").forEach(function(panel) {
          panel.classList.toggle("active", panel.dataset.symbolicPanel === tabName);
        });
      });
    });

    // ========== 科学计算器内嵌求导 ==========
    getById("calc-derivative-run").addEventListener("click", function () {
      try {
        const value = Models.numericalDerivative(
          getMathFieldExpression("calc-derivative-expression"),
          getById("calc-derivative-point").value
        );
        renderToolResult("calc-derivative-output", t("derivativeOutputTitle"),
          Utils.formatNumber(value, 6, { html: true }), t("derivativeOutputNote"));
      } catch (error) {
        setStatusMessage(getById("calc-derivative-output"), translateError(error), true);
      }
    });

    // ========== 科学计算器内嵌积分 ==========
    getById("calc-integral-run").addEventListener("click", function () {
      try {
        const value = Models.definiteIntegral(
          getMathFieldExpression("calc-integral-expression"),
          getById("calc-integral-a").value,
          getById("calc-integral-b").value,
          getById("calc-integral-steps").value
        );
        renderToolResult("calc-integral-output", t("integralOutputTitle"),
          Utils.formatNumber(value, 6, { html: true }), t("integralOutputNote"));
      } catch (error) {
        setStatusMessage(getById("calc-integral-output"), translateError(error), true);
      }
    });

    // ========== 科学计算器内嵌求根 ==========
    getById("calc-root-run").addEventListener("click", function () {
      try {
        const result = Models.findRoot(
          getMathFieldExpression("calc-root-expression"),
          getById("calc-root-x0").value,
          getById("calc-root-x1").value,
          getById("calc-root-tol").value
        );
        renderToolResult("calc-root-output", t("rootOutputTitle"),
          Utils.formatNumber(result.root, 6, { html: true }),
          tf("rootResidualTemplate", {
            residual: Utils.formatNumber(result.residual, 4),
            iterations: result.iterations
          }));
      } catch (error) {
        setStatusMessage(getById("calc-root-output"), translateError(error), true);
      }
    });

    // ========== 符号微积分模块 ==========
    // LaTeX 到 nerdamer 表达式转换
    function latexToNerdamer(latex) {
      if (!latex) return '';
      let expr = String(latex);
      expr = expr.replace(/\\sin/g, 'sin').replace(/\\cos/g, 'cos').replace(/\\tan/g, 'tan');
      expr = expr.replace(/\\arcsin/g, 'asin').replace(/\\arccos/g, 'acos').replace(/\\arctan/g, 'atan');
      expr = expr.replace(/\\ln/g, 'log').replace(/\\exp/g, 'exp').replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)');
      expr = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)');
      expr = expr.replace(/\\cdot/g, '*').replace(/\\times/g, '*').replace(/\\div/g, '/');
      expr = expr.replace(/\\pi/g, 'pi').replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
      expr = expr.replace(/\\left\|/g, 'abs(').replace(/\\right\|/g, ')');
      expr = expr.replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, 'C($1,$2)');
      expr = expr.replace(/\\operatorname\{([^}]+)\}/g, '$1');
      expr = expr.replace(/\\hbar/g, 'hbar');
      expr = expr.replace(/\\varepsilon_\{0\}/g, 'epsilon0');
      expr = expr.replace(/\\sigma_\{SB\}/g, 'sigmaSB');
      expr = expr.replace(/e_\{Charge\}/g, 'eCharge').replace(/e_\{\\mathrm\{Charge\}\}/g, 'eCharge');
      expr = expr.replace(/m_e/g, 'me').replace(/m_\{e\}/g, 'me');
      expr = expr.replace(/k_B/g, 'kB').replace(/k_\{B\}/g, 'kB');
      expr = expr.replace(/N_A/g, 'Na').replace(/N_\{A\}/g, 'Na');
      expr = expr.replace(/#0/g, '').replace(/\s+/g, ' ').trim();
      return expr;
    }

    // 渲染符号结果（使用 MathJax）
    function renderSymbolicResult(outputId, title, expression, extra) {
      const el = getById(outputId);
      if (!el) return;
      const latex = expression.toString().replace(/\*/g, '\\cdot ');
      let html = '<div class="result-item">';
      html += '<div class="result-label">' + title + '</div>';
      html += '<div class="result-value" style="font-family:var(--font-math)">\\(' + latex + '\\)</div>';
      if (extra) html += '<div style="margin-top:0.5rem;font-size:0.88rem;color:var(--muted)">' + extra + '</div>';
      html += '</div>';
      el.innerHTML = html;
      // 触发 MathJax 重新渲染
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([el]).catch(function() {});
      }
    }

    // nerdamer 就绪检查（等待 CDN 加载完成）
    function requireNerdamer(callback) {
      if (typeof window.nerdamer !== 'undefined') {
        callback();
      } else {
        window.addEventListener('nerdamer-ready', callback, { once: true });
        // 如果事件已经触发过了（先加载完再绑定），直接调用
        setTimeout(function() {
          if (typeof window.nerdamer !== 'undefined') callback();
        }, 200);
      }
    }

    // 符号求导
    getById("sym-deriv-run").addEventListener("click", function () {
      requireNerdamer(function() {
      try {
        const expr = latexToNerdamer(getMathFieldExpression("sym-deriv-expression"));
        const variable = getById("sym-deriv-var").value.trim() || 'x';
        const order = parseInt(getById("sym-deriv-order").value) || 1;
        const nerd = window.nerdamer;
        let result = nerd.diff(expr, variable, order);
        const label = order === 1
          ? 'd/d' + variable + ' [' + expr + ']'
          : 'd^' + order + '/d' + variable + '^' + order + ' [' + expr + ']';
        renderSymbolicResult("sym-deriv-output", label, result.toString(),
          t('symCalcEngine'));
      } catch (error) {
        setStatusMessage(getById("sym-deriv-output"), t('symErrorPrefix') + ' ' + error.message, true);
      }
      });
    });

    // 偏导数
    getById("sym-partial-run").addEventListener("click", function () {
      requireNerdamer(function() {
      try {
        const expr = latexToNerdamer(getMathFieldExpression("sym-partial-expression"));
        const variable = getById("sym-partial-var").value.trim() || 'x';
        const order = parseInt(getById("sym-partial-order").value) || 1;
        const nerd = window.nerdamer;
        let result = nerd.diff(expr, variable, order);
        const label = '∂' + (order > 1 ? '^' + order : '') + '/∂' + variable + (order > 1 ? '^' + order : '') + ' [' + expr + ']';
        renderSymbolicResult("sym-partial-output", label, result.toString(),
          t('symPartialNote') + ' ' + variable);
      } catch (error) {
        setStatusMessage(getById("sym-partial-output"), t('symErrorPrefix') + ' ' + error.message, true);
      }
      });
    });

    // 所有一阶偏导
    getById("sym-partial-mixed").addEventListener("click", function () {
      requireNerdamer(function() {
      try {
        const expr = latexToNerdamer(getMathFieldExpression("sym-partial-expression"));
        const nerd = window.nerdamer;
        const knownNames = ['sin','cos','tan','asin','acos','atan','log','exp','sqrt','abs',
          'pi','e','hbar','epsilon0','sigmaSB','eCharge','me','kB','Na','R','c','h',
          'ceil','floor','round','sign','mod','max','min','pow'];
        const varSet = new Set();
        const matches = expr.match(/\b([a-zA-Z])\b/g) || [];
        matches.forEach(function(m) {
          if (!knownNames.includes(m) && m.length === 1) varSet.add(m);
        });
        const variables = Array.from(varSet);
        if (variables.length === 0) variables.push('x');
        let html = '';
        variables.forEach(function(v) {
          try {
            const result = nerd.diff(expr, v);
            html += '<div class="result-item">';
            html += '<div class="result-label">\u2202f/\u2202' + v + '</div>';
            html += '<div class="result-value" style="font-family:var(--font-math)">\\(' + result.toString().replace(/\*/g, '\\cdot ') + '\\)</div>';
            html += '</div>';
          } catch(e) {
            html += '<div class="result-item"><div class="result-label">\u2202f/\u2202' + v + '</div><div style="color:var(--danger)">' + e.message + '</div></div>';
          }
        });
        const el = getById("sym-partial-output");
        el.innerHTML = '<div style="margin-bottom:0.5rem;color:var(--muted)">' + t('symDetectedVars') + ': ' + variables.join(', ') + '</div>' + html;
        if (window.MathJax && MathJax.typesetPromise) {
          MathJax.typesetPromise([el]).catch(function() {});
        }
      } catch (error) {
        setStatusMessage(getById("sym-partial-output"), t('symErrorPrefix') + ' ' + error.message, true);
      }
      });
    });

    // 符号积分
    getById("sym-integ-run").addEventListener("click", function () {
      requireNerdamer(function() {
      try {
        const expr = latexToNerdamer(getMathFieldExpression("sym-integ-expression"));
        const variable = getById("sym-integ-var").value.trim() || 'x';
        const nerd = window.nerdamer;
        const lower = getById("sym-integ-lower").value.trim();
        const upper = getById("sym-integ-upper").value.trim();
        if (lower !== '' && upper !== '') {
          const result = nerd.integrate(expr, variable, lower, upper);
          renderSymbolicResult("sym-integ-output", t('symDefiniteIntegral'), result.toString(),
            '\u222B [' + lower + ', ' + upper + '] ' + expr + ' d' + variable);
        } else {
          const result = nerd.integrate(expr, variable);
          renderSymbolicResult("sym-integ-output", t('symIndefiniteIntegral'),
            result.toString() + ' + C',
            '\u222B ' + expr + ' d' + variable + ' (' + t('symPlusConstant') + ')');
        }
      } catch (error) {
        setStatusMessage(getById("sym-integ-output"), t('symErrorPrefix') + ' ' + error.message, true);
      }
      });
    });

    // 微分方程求解（一阶 ODE：dy/dx = f(x,y)）
    getById("sym-ode-run").addEventListener("click", function () {
      requireNerdamer(function() {
      try {
        const f = getById("sym-ode-expression").value.trim();
        const xVar = getById("sym-ode-xvar").value.trim() || 'x';
        const yVar = getById("sym-ode-yvar").value.trim() || 'y';
        const nerd = window.nerdamer;

        let html = '';
        const odeLabel = 'd' + yVar + '/d' + xVar + ' = ' + f;

        let hasY = f.includes(yVar);
        let hasX = false;
        for (let i = 0; i < f.length; i++) {
          if (f[i] === xVar && (i === 0 || !/[a-zA-Z]/.test(f[i-1]))) {
            hasX = true;
            break;
          }
        }

        if (!hasY) {
          try {
            const integral = nerd.integrate(f, xVar);
            html += '<div class="result-item">';
            html += '<div class="result-label">' + odeLabel + '</div>';
            html += '<div class="result-value" style="font-family:var(--font-math)">\\(' + yVar + ' = ' + integral.toString().replace(/\*/g, '\\cdot ') + ' + C\\)</div>';
            html += '<div style="margin-top:0.5rem;font-size:0.88rem;color:var(--muted)">' + t('symOdeDirectIntegration') + '</div>';
            html += '</div>';
          } catch(e) {
            html += '<div class="result-item"><div style="color:var(--warning)">' + t('symOdeCannotIntegrate') + ': ' + e.message + '</div></div>';
          }
        } else if (!hasX) {
          try {
            const integral = nerd.integrate('1/(' + f + ')', yVar);
            html += '<div class="result-item">';
            html += '<div class="result-label">' + odeLabel + '</div>';
            html += '<div class="result-value" style="font-family:var(--font-math)">\\(' + integral.toString().replace(/\*/g, '\\cdot ') + ' = ' + xVar + ' + C\\)</div>';
            html += '<div style="margin-top:0.5rem;font-size:0.88rem;color:var(--muted)">' + t('symOdeSeparation') + '</div>';
            html += '</div>';
          } catch(e) {
            html += '<div class="result-item"><div style="color:var(--warning)">' + t('symOdeCannotSolve') + ': ' + e.message + '</div></div>';
          }
        } else {
          html += '<div class="result-item">';
          html += '<div class="result-label">' + odeLabel + '</div>';
          html += '<div style="color:var(--warning);font-size:0.9rem">' + t('symOdeGeneralHint') + '</div>';
          html += '</div>';
          try {
            const simpleY = nerd.solve(yVar + '*(' + xVar + ')=(' + f + ')', yVar);
            if (simpleY && simpleY.length > 0) {
              html += '<div class="result-item" style="margin-top:0.5rem">';
              html += '<div class="result-label">' + t('symOdeAttempted') + '</div>';
              html += '<div class="result-value" style="font-family:var(--font-math)">\\(' + yVar + ' = ' + simpleY.toString().replace(/\*/g, '\\cdot ') + '\\)</div>';
              html += '</div>';
            }
          } catch(e) { /* skip */ }
        }

        const el = getById("sym-ode-output");
        el.innerHTML = html;
        if (window.MathJax && MathJax.typesetPromise) {
          MathJax.typesetPromise([el]).catch(function() {});
        }
      } catch (error) {
        setStatusMessage(getById("sym-ode-output"), t('symOdeErrorPrefix') + ' ' + error.message, true);
      }
      });
    });

    // ========== 科学计算器内嵌绘图 ==========
    getById("calc-plot-run").addEventListener("click", calcPlotFunction);

    // ========== Taylor 展开 ==========
    getById("calc-taylor-run").addEventListener("click", runCalcTaylor);

    // 科学计算器小键盘
    const scientificKeypad = getById("scientific-keypad");
    if (scientificKeypad) {
      scientificKeypad.addEventListener("click", function (event) {
        const button = event.target.closest("button");
        if (!button) return;
        
        const field = getById("calc-expression");
        if (!field || field.tagName !== 'MATH-FIELD') return;
        
        const insertValue = button.dataset.insert;
        const action = button.dataset.action;
        
        field.focus();
        
        setTimeout(() => {
          if (action === "calc-clear") {
            field.executeCommand('deleteAll');
          } else if (action === "calc-backspace") {
            field.executeCommand('deleteBackward');
          } else if (action === "calc-evaluate") {
            evaluateCalculator(true);
          } else if (insertValue) {
            // #? 占位符替换为空的 LaTeX 占位符 #0，MathLive 会自动创建可编辑占位符
            const cleanValue = insertValue.replace(/#\?/g, '#0');
            // 使用 executeCommand 正确插入 LaTeX，保持数学结构
            field.executeCommand('insert', cleanValue);
          }
        }, 30);
      });
    }

    // ✅ 科学计算器表达式输入框 - 实时格式化（仅适用于普通 input）
    const calcExpression = getById("calc-expression");
    if (calcExpression && calcExpression.tagName !== 'MATH-FIELD') {
      calcExpression.addEventListener("input", function () {
        const input = this;
        const cursorPos = input.selectionStart;
        const rawValue = input.value;
        const formatted = Utils.formatMathExpression(rawValue);
        
        if (formatted !== rawValue) {
          input.value = formatted;
          const newCursorPos = cursorPos + (formatted.length - rawValue.length);
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
    }

    getById("calc-clear").addEventListener("click", function () {
      const field = getById("calc-expression");
      if (field.tagName === 'MATH-FIELD') {
        field.setValue(defaults.calculatorExpression);
      } else {
        field.value = defaults.calculatorExpression;
      }
      evaluateCalculator(false);
    });

    getById("calc-history-clear").addEventListener("click", function () {
      state.history = [];
      renderHistory();
    });

    getById("calc-history").addEventListener("click", function (event) {
      const button = event.target.closest("[data-history-index]");
      if (!button) {
        return;
      }
      const entry = state.history[Number(button.dataset.historyIndex)];
      if (entry) {
        const field = getById("calc-expression");
        // 优先使用保存的 LaTeX 格式（math-field 需要 LaTeX 才能正确渲染）
        if (field.tagName === 'MATH-FIELD' && entry.latex) {
          field.setValue(entry.latex);
        } else if (field.tagName === 'MATH-FIELD') {
          field.setValue(entry.expression);
        } else {
          field.value = entry.expression;
        }
        evaluateCalculator(false);
      }
    });

    getById("calc-constants-panel").addEventListener("click", function (event) {
      const button = event.target.closest("[data-constant-alias]");
      if (!button) {
        return;
      }
      const alias = button.dataset.constantAlias;
      const field = getById("calc-expression");
      
      // 如果是 math-field，需要特殊处理
      if (field.tagName === 'MATH-FIELD') {
        field.executeCommand('insert', alias);
      } else {
        Utils.insertAtCursor(field, field.value ? " " + alias + " " : alias);
      }
    });

    // ========== 公式操作功能 ==========
    
    // 复制 LaTeX 格式
    const copyLatexBtn = getById("copy-latex");
    if (copyLatexBtn) {
      copyLatexBtn.addEventListener("click", function() {
        const field = getById("calc-expression");
        if (field && field.tagName === 'MATH-FIELD') {
          const latex = field.getValue('latex');
          copyToClipboard(latex, 'LaTeX');
        }
      });
    }

    // 复制 MathML 格式
    const copyMathmlBtn = getById("copy-mathml");
    if (copyMathmlBtn) {
      copyMathmlBtn.addEventListener("click", function() {
        const field = getById("calc-expression");
        if (field && field.tagName === 'MATH-FIELD') {
          const mathml = field.getValue('math-ml');
          copyToClipboard(mathml, 'MathML');
        }
      });
    }

    // 复制纯文本
    const copyTextBtn = getById("copy-text");
    if (copyTextBtn) {
      copyTextBtn.addEventListener("click", function() {
        const field = getById("calc-expression");
        if (field && field.tagName === 'MATH-FIELD') {
          const text = field.getValue('ascii-math');
          copyToClipboard(text, '纯文本');
        }
      });
    }

    // OCR 识别公式
    const ocrBtn = getById("ocr-formula");
    const ocrFileInput = getById("ocr-file-input");
    
    if (ocrBtn && ocrFileInput) {
      ocrBtn.addEventListener("click", function() {
        ocrFileInput.click();
      });

      ocrFileInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (!file) return;

        // 显示加载提示
        Utils.showToast('正在识别公式...', false);

        // 读取图片文件
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result;
          recognizeFormula(imageData);
        };
        reader.readAsDataURL(file);

        // 重置 input 以便可以重复选择同一文件
        ocrFileInput.value = '';
      });
    }

    /**
     * 复制到剪贴板
     */
    function copyToClipboard(text, format) {
      if (!text) {
        Utils.showToast('没有可复制的内容', true);
        return;
      }

      navigator.clipboard.writeText(text).then(function() {
        Utils.showToast(`已复制 ${format} 格式到剪贴板`, false);
      }).catch(function(err) {
        console.error('复制失败:', err);
        // 降级方案：使用传统方法
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          Utils.showToast(`已复制 ${format} 格式到剪贴板`, false);
        } catch (err) {
          Utils.showToast('复制失败，请手动复制', true);
        }
        document.body.removeChild(textarea);
      });
    }

    /**
     * 识别图片中的公式（OCR）
     */
    function recognizeFormula(imageData) {
      // 这里可以使用第三方 OCR API，如 MathPix、InftyReader 等
      // 目前提供一个模拟实现，实际使用时需要替换为真实的 API 调用
      
      console.log('开始 OCR 识别...');
      
      // 提供一个演示版本，如果用户未配置真实 API，则使用模拟数据
      // 在实际部署时，应配置真实的 OCR API
      
      // 检查是否配置了 API 密钥
      const hasApiKey = false; // 这里应该检查用户是否配置了 API 密钥
      
      if (!hasApiKey) {
        // 演示模式：插入一个示例公式
        setTimeout(() => {
          const field = getById("calc-expression");
          if (field && field.tagName === 'MATH-FIELD') {
            field.setValue('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
            Utils.showToast('演示模式：已插入二次方程求根公式', false);
          }
        }, 1500);
        return;
      }
      
      // 示例：使用真实的 OCR API（需要注册 API key）
      fetch('https://api.mathpix.com/v3/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'app_id': 'YOUR_APP_ID',  // 需要替换为实际的 app_id
          'app_key': 'YOUR_APP_KEY'  // 需要替换为实际的 app_key
        },
        body: JSON.stringify({
          src: imageData,
          formats: ['latex'],
          data_options: {
            include_asciimath: true
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.latex_styled) {
          const field = getById("calc-expression");
          if (field && field.tagName === 'MATH-FIELD') {
            field.setValue(data.latex_styled);
            Utils.showToast('公式识别成功！', false);
          }
        } else {
          Utils.showToast('未能识别公式，请尝试其他图片', true);
        }
      })
      .catch(error => {
        console.error('OCR 识别失败:', error);
        // 如果 API 不可用，提供手动输入的提示
        Utils.showToast('OCR 服务暂不可用，请手动输入公式', true);
        
        // 演示模式：插入一个示例公式
        setTimeout(() => {
          const field = getById("calc-expression");
          if (field && field.tagName === 'MATH-FIELD') {
            field.setValue('\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}');
            Utils.showToast('已插入示例公式（二次方程求根公式）', false);
          }
        }, 1500);
      });
    }

    // 初始化完成后，设置 MathLive 事件监听器
    initializeMathFieldWithRetry();

    /**
     * 带重试机制的 MathField 初始化
     */
    function initializeMathFieldWithRetry(retryCount = 0, maxRetries = 20) {
      
      // 检查 MathLive 是否加载
      if (!window.MathLive) {
        console.warn(`⚠️ MathLive 尚未加载`);
        if (retryCount < maxRetries) {
          setTimeout(() => initializeMathFieldWithRetry(retryCount + 1, maxRetries), 200);
        } else {
          console.error('❌ MathLive 加载超时，请检查网络连接');
        }
        return;
      }
      
      // 检查 custom elements 是否注册
      if (!customElements.get('math-field')) {
        console.warn(`⚠️ math-field 自定义元素未注册`);
        if (retryCount < maxRetries) {
          setTimeout(() => initializeMathFieldWithRetry(retryCount + 1, maxRetries), 200);
        } else {
          console.error('❌ math-field 元素注册超时');
        }
        return;
      }
      
      // 获取元素
      const calcExpressionField = getById("calc-expression");
      if (!calcExpressionField) {
        console.warn(`⚠️ calc-expression 元素未找到`);
        if (retryCount < maxRetries) {
          setTimeout(() => initializeMathFieldWithRetry(retryCount + 1, maxRetries), 200);
        } else {
          console.error('❌ calc-expression 元素查找超时');
        }
        return;
      }
      
      // 检查元素类型
      if (calcExpressionField.tagName !== 'MATH-FIELD') {
        console.warn(`⚠️ 元素类型不正确: ${calcExpressionField.tagName}`);
        if (retryCount < maxRetries) {
          setTimeout(() => initializeMathFieldWithRetry(retryCount + 1, maxRetries), 200);
        } else {
          console.error('❌ 元素类型验证超时');
        }
        return;
      }
      
      // 所有检查通过，初始化事件监听器
      console.log('✅ MathLive 和 math-field 元素已就绪');
      initializeMathFieldEventListeners(calcExpressionField);
    }

    /**
     * 初始化 MathField 事件监听器
     */
    function initializeMathFieldEventListeners(calcExpressionField) {
      
      // 获取 Shadow DOM 内部的 input 元素
      function getInternalInput() {
        const shadowRoot = calcExpressionField.shadowRoot;
        if (!shadowRoot) return null;
        return shadowRoot.querySelector('input') || 
               shadowRoot.querySelector('[contenteditable]') ||
               shadowRoot.querySelector('textarea');
      }
      
      // 强制聚焦修复：直接聚焦到内部 input
      function forceFocus(field) {
        field.focus();
        
        setTimeout(() => {
          const internalInput = getInternalInput();
          if (internalInput) {
            internalInput.focus();
          }
        }, 50);
        
        setTimeout(() => field.focus(), 100);
        setTimeout(() => {
          const internalInput = getInternalInput();
          if (internalInput) internalInput.focus();
        }, 150);
      }
      
      // ✅ 删除这个事件监听器，它会导致无限循环
      // calcExpressionField.addEventListener('click', function(event) {
      //   console.log('👆 MathField 被点击');
      //   event.preventDefault();
      //   event.stopPropagation();
      //   forceFocus(this);
      // }, true);
      
      // ✅ 删除 mousedown 事件监听器，它会阻止所有交互
      // calcExpressionField.addEventListener('mousedown', function(event) {
      //   console.log('🖱️ MathField 鼠标按下');
      //   event.preventDefault();  // ❌ 这会阻止手机键盘和页面小键盘
      //   event.stopPropagation();
      // }, true);
      
      calcExpressionField.addEventListener('focus', function() {
        // 立即聚焦到内部 input
        setTimeout(() => {
          const internalInput = getInternalInput();
          if (internalInput && document.activeElement === this) {
            internalInput.focus();
          }
        }, 10);
        
        // 添加视觉反馈
        this.style.boxShadow = '0 0 0 3px rgba(31, 94, 135, 0.2)';
        this.style.borderColor = '#1f5e87';
      });
      
      calcExpressionField.addEventListener('blur', function() {
        // MathField 失去焦点
        this.style.boxShadow = '';
        this.style.borderColor = '';
      });
      
      calcExpressionField.addEventListener('input', function() {
        // MathField 输入变化
      });
      
      // ✅ 删除所有键盘事件监听器，它们会阻止输入
      // calcExpressionField.addEventListener('keydown', function(event) {
      //   console.log('🔘 按键:', event.key, '| Code:', event.code);
      //   event.stopPropagation();
      // }, true);
      
      // calcExpressionField.addEventListener('keypress', function(event) {
      //   console.log('🔤 字符输入:', event.key);
      // });
      
      console.log('✅ MathField 事件监听器设置完成');
    }

    getById("derivative-run").addEventListener("click", runDerivative);
    getById("integral-run").addEventListener("click", runIntegral);
    getById("root-run").addEventListener("click", runRootFinder);
    getById("plot-run").addEventListener("click", plotFunction);

    getById("derivative-reset").addEventListener("click", function () {
      const exprField = getById("derivative-expression");
      if (exprField.tagName === 'MATH-FIELD') {
        exprField.value = defaults.derivative.expression;  // math-field 接受 LaTeX
      } else {
        exprField.value = defaults.derivative.expression;
      }
      getById("derivative-point").value = defaults.derivative.point;
      runDerivative();
    });

    getById("integral-reset").addEventListener("click", function () {
      const exprField = getById("integral-expression");
      if (exprField.tagName === 'MATH-FIELD') {
        exprField.value = defaults.integral.expression;
      } else {
        exprField.value = defaults.integral.expression;
      }
      getById("integral-a").value = defaults.integral.a;
      getById("integral-b").value = defaults.integral.b;
      getById("integral-steps").value = defaults.integral.steps;
      runIntegral();
    });

    getById("root-reset").addEventListener("click", function () {
      const exprField = getById("root-expression");
      if (exprField.tagName === 'MATH-FIELD') {
        exprField.value = defaults.root.expression;
      } else {
        exprField.value = defaults.root.expression;
      }
      getById("root-x0").value = defaults.root.x0;
      getById("root-x1").value = defaults.root.x1;
      getById("root-tol").value = defaults.root.tolerance;
      runRootFinder();
    });

    getById("plot-reset").addEventListener("click", function () {
      const exprField = getById("plot-expression");
      if (exprField.tagName === 'MATH-FIELD') {
        exprField.value = defaults.plot.expression;
      } else {
        exprField.value = defaults.plot.expression;
      }
      getById("plot-min").value = defaults.plot.min;
      getById("plot-max").value = defaults.plot.max;
      getById("plot-points").value = defaults.plot.points;
      plotFunction();
    });

    // 函数分析小键盘事件处理
    document.querySelectorAll('.analysis-keypad').forEach(keypad => {
      keypad.addEventListener('click', function(event) {
        const button = event.target.closest('[data-insert], [data-action]');
        if (!button) return;

        const targetId = button.dataset.target;
        const field = getById(targetId);
        if (!field) return;

        const insertValue = button.dataset.insert;
        const action = button.dataset.action;

        // 聚焦到 math-field
        field.focus();

        if (action === 'clear-field') {
          // 清除输入
          if (field.tagName === 'MATH-FIELD') {
            field.executeCommand('deleteAll');
          } else {
            field.value = '';
          }
          return;
        }

        if (action === 'backspace-field') {
          // 退格
          if (field.tagName === 'MATH-FIELD') {
            field.executeCommand('deleteBackward');
          } else {
            const start = field.selectionStart || 0;
            const end = field.selectionEnd || 0;
            if (start !== end) {
              field.value = field.value.substring(0, start) + field.value.substring(end);
              field.setSelectionRange(start, start);
            } else if (start > 0) {
              field.value = field.value.substring(0, start - 1) + field.value.substring(start);
              field.setSelectionRange(start - 1, start - 1);
            }
          }
          return;
        }

        if (insertValue) {
          // 插入文本
          if (field.tagName === 'MATH-FIELD') {
            // 处理 #? 占位符，替换为空字符串
            const cleanValue = insertValue.replace(/#\?/g, '');
            field.executeCommand('insert', cleanValue);
          } else {
            const start = field.selectionStart || 0;
            const end = field.selectionEnd || 0;
            field.value = field.value.substring(0, start) + insertValue + field.value.substring(end);
            const newCursorPos = start + insertValue.length;
            field.setSelectionRange(newCursorPos, newCursorPos);
          }
        }
      });
    });

    getById("constant-search").addEventListener("input", Utils.debounce(renderConstants, 120));
    getById("constant-filters").addEventListener("click", function (event) {
      const button = event.target.closest("[data-category]");
      if (!button) {
        return;
      }
      state.constantFilter = button.dataset.category;
      renderConstantFilters();
      renderConstants();
    });

    getById("constants-list").addEventListener("click", function (event) {
      const copyButton = event.target.closest("[data-copy-constant]");
      const useButton = event.target.closest("[data-use-constant]");

      if (copyButton) {
        const constant = constantById(copyButton.dataset.copyConstant);
        if (constant) {
          Utils.copyText(String(constant.value))
            .then(function () {
              Utils.showToast(tf("toastConstantCopied", { name: localizedValue(constant.name) }));
            })
            .catch(function (error) {
              Utils.showToast(translateError(error));
            });
        }
      }

      if (useButton) {
        const constant = constantById(useButton.dataset.useConstant);
        if (constant) {
          addScratchpadItem({
            key: "constant:" + constant.id,
            kind: "constant",
            constantId: constant.id
          });
          const calcField = getById("calc-expression");
          if (calcField.tagName === 'MATH-FIELD') {
            calcField.focus();
            calcField.executeCommand('insert', (calcField.value ? " " : "") + constant.alias + " ");
          } else {
            Utils.insertAtCursor(calcField, calcField.value ? " " + constant.alias + " " : constant.alias);
          }
          setActivePage("scientific-calculator", true);
          Utils.showToast(tf("toastConstantInserted", { name: localizedValue(constant.name) }));
        }
      }
    });

    getById("element-search").addEventListener("input", Utils.debounce(renderElements, 120));
    getById("analysis-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-analysis-tab]");
      if (!button) {
        return;
      }
      activateAnalysisTab(button.dataset.analysisTab);
    });

    getById("element-view-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-element-panel]");
      if (!button) {
        return;
      }
      activateElementPanel(button.dataset.elementPanel);
    });

    getById("visual-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-visual-panel]");
      if (!button) {
        return;
      }
      activateVisualPanel(button.dataset.visualPanel);
    });

    getById("elements-grid").addEventListener("click", function (event) {
      const tile = event.target.closest("[data-element-symbol]");
      if (!tile) {
        return;
      }
      state.selectedElement = elements.find(function (item) {
        return item.symbol === tile.dataset.elementSymbol;
      }) || null;
      renderElements();
      renderElementDetail();
      activateElementPanel("detail");
    });

    getById("element-detail").addEventListener("click", function (event) {
      const compareButton = event.target.closest("[data-compare-slot]");
      const stageButton = event.target.closest("[data-stage-element]");

      if (compareButton && state.selectedElement) {
        if (compareButton.dataset.compareSlot === "A") {
          state.compareA = state.selectedElement;
        } else {
          state.compareB = state.selectedElement;
        }
        renderElementCompare();
        activateElementPanel("compare");
        Utils.showToast(tf("toastElementAssigned", {
          name: localizedValue(state.selectedElement.name),
          slot: compareButton.dataset.compareSlot
        }));
      }

      if (stageButton && state.selectedElement) {
        addScratchpadItem({
          key: "element:" + state.selectedElement.symbol,
          kind: "element",
          symbol: state.selectedElement.symbol
        });
        Utils.showToast(tf("toastElementStaged", { name: localizedValue(state.selectedElement.name) }));
      }
    });

    getById("comparison-clear").addEventListener("click", function () {
      state.compareA = null;
      state.compareB = null;
      renderElementCompare();
      activateElementPanel("compare");
    });

    getById("strength-tabs").addEventListener("click", function (event) {
      const button = event.target.closest("[data-tab]");
      if (!button) {
        return;
      }
      activateStrengthTab(button.dataset.tab);
    });

    ["hp-run", "dis-run", "cut-run", "or-run"].forEach(function (id) {
      getById(id).addEventListener("click", refreshStrengtheningSuite);
    });

    getById("hp-reset").addEventListener("click", function () {
      getById("hp-sigma0").value = defaults.hallPetch.sigma0;
      getById("hp-sigma0-unit").value = defaults.hallPetch.sigma0Unit;
      getById("hp-ky").value = defaults.hallPetch.ky;
      getById("hp-grain-size").value = defaults.hallPetch.grainSize;
      getById("hp-grain-unit").value = defaults.hallPetch.grainUnit;
      refreshStrengtheningSuite();
    });

    getById("dis-reset").addEventListener("click", function () {
      getById("dis-alpha").value = defaults.dislocation.alpha;
      getById("dis-G").value = defaults.dislocation.G;
      getById("dis-b").value = defaults.dislocation.b;
      getById("dis-rho").value = defaults.dislocation.rho;
      refreshStrengtheningSuite();
    });

    getById("cut-reset").addEventListener("click", function () {
      getById("cut-radius").value = defaults.cutting.radius;
      getById("cut-fraction").value = defaults.cutting.fraction;
      getById("cut-apb").value = defaults.cutting.apb;
      getById("cut-G").value = defaults.cutting.G;
      getById("cut-b").value = defaults.cutting.b;
      getById("cut-k").value = defaults.cutting.k;
      refreshStrengtheningSuite();
    });

    getById("or-reset").addEventListener("click", function () {
      getById("or-G").value = defaults.orowan.G;
      getById("or-b").value = defaults.orowan.b;
      getById("or-radius").value = defaults.orowan.radius;
      getById("or-spacing").value = defaults.orowan.spacing;
      getById("or-nu").value = defaults.orowan.nu;
      refreshStrengtheningSuite();
    });

    getById("visual-run").addEventListener("click", safeUpdateVisualLab);
    getById("visual-reset").addEventListener("click", function () {
      getById("visual-sweep-target").value = defaults.visual.target;
      getById("visual-min").value = defaults.visual.min;
      getById("visual-max").value = defaults.visual.max;
      getById("visual-steps").value = defaults.visual.steps;
      getById("visual-radius").value = defaults.visual.radius;
      getById("visual-spacing").value = defaults.visual.spacing;
      safeUpdateVisualLab();
    });

    ["visual-radius", "visual-spacing"].forEach(function (id) {
      getById(id).addEventListener("input", safeUpdateVisualLab);
    });

    ["visual-sweep-target", "visual-min", "visual-max", "visual-steps"].forEach(function (id) {
      getById(id).addEventListener("change", safeUpdateVisualLab);
    });
  }

  function init() {
    console.log('%c🚀 应用初始化开始...', 'color: #1f5e87; font-weight: bold;');
    console.log('   MathLive 状态:', window.MathLive ? '✅ 已加载' : '❌ 未加载');
    console.log('   mathjs 状态:', typeof math !== 'undefined' ? '✅ 已加载' : '❌ 未加载');
    console.log('   Plotly 状态:', typeof Plotly !== 'undefined' ? '✅ 已加载' : '❌ 未加载');
    
    try {
      const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage === "en" || storedLanguage === "zh") {
        state.language = storedLanguage;
        console.log('✅ 语言设置:', state.language);
      }
    } catch (error) {
      console.warn('⚠️  语言设置失败:', error.message);
    }

    try {
      state.activePage = activePageIdFromHash(window.location.hash);
      console.log('✅ 当前页面:', state.activePage);
    } catch (error) {
      console.error('❌ 页面ID解析失败:', error);
      state.activePage = 'home';
    }
    
    try {
      const classicField = getById("classic-expression");
      if (classicField.tagName === 'MATH-FIELD') {
        classicField.setValue(defaults.classicExpression);
      } else {
        classicField.value = defaults.classicExpression;
      }
      console.log('✅ 经典计算器表达式初始化');
    } catch (error) {
      console.error('❌ 经典计算器初始化失败:', error);
    }
    
    try {
      renderScratchpad();
      console.log('✅ Scratchpad渲染完成');
    } catch (error) {
      console.error('❌ renderScratchpad失败:', error);
    }
    
    try {
      renderHistory();
      console.log('✅ 历史记录渲染完成');
    } catch (error) {
      console.error('❌ renderHistory失败:', error);
    }
    
    try {
      renderCalculatorShortcuts();
      console.log('✅ 计算器快捷方式渲染完成');
    } catch (error) {
      console.error('❌ renderCalculatorShortcuts失败:', error);
    }
    
    try {
      renderConstantFilters();
      console.log('✅ 常数过滤器渲染完成');
    } catch (error) {
      console.error('❌ renderConstantFilters失败:', error);
    }
    
    try {
      renderConstants();
      console.log('✅ 常数列表渲染完成');
    } catch (error) {
      console.error('❌ renderConstants失败:', error);
    }
    
    try {
      renderElements();
      console.log('✅ 元素列表渲染完成');
    } catch (error) {
      console.error('❌ renderElements失败:', error);
    }
    
    try {
      renderElementDetail();
      console.log('✅ 元素详情渲染完成');
    } catch (error) {
      console.error('❌ renderElementDetail失败:', error);
    }
    
    try {
      renderElementCompare();
      console.log('✅ 元素对比渲染完成');
    } catch (error) {
      console.error('❌ renderElementCompare失败:', error);
    }
    
    try {
      bindEvents();
      console.log('✅ 事件绑定完成');
    } catch (error) {
      console.error('❌ bindEvents失败:', error);
    }
    
    try {
      applyLanguage();
      console.log('✅ 语言应用完成');
    } catch (error) {
      console.error('❌ applyLanguage失败:', error);
    }
    
    console.log('✅ MathLive 公式编辑器已集成');
  
    try {
      setActivePage(state.activePage, false);
      console.log('%c✅ 页面激活完成:', 'color: #6bcb77; font-weight: bold;', state.activePage);
    } catch (error) {
      console.error('❌ setActivePage失败:', error);
    }
    
    console.log('%c🎉 应用初始化完成！', 'color: #6bcb77; font-size: 14px; font-weight: bold;');
    
    // 初始化自定义公式管理器
    if (typeof CustomFormulaManager !== 'undefined') {
      CustomFormulaManager.init();
      console.log('✅ 自定义公式管理器已初始化');
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})(); // end bootstrapApp
