// modules/utils.js — 工具函数
window.MSCLab = window.MSCLab || {};

  const state = {
    toastTimer: null
  };

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function sharedText(key, fallback) {
    const translator = window.MSCLab && window.MSCLab.sharedI18n;
    if (typeof translator === "function") {
      return translator(key, fallback);
    }
    return fallback;
  }

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatNumber(value, digits, options) {
    const precision = typeof digits === "number" ? digits : 4;
    const settings = options || {};

    if (value === null || value === undefined || value === "") {
      return sharedText("sharedNa", "n/a");
    }

    if (typeof value !== "number" || Number.isNaN(value)) {
      return String(value);
    }

    if (!Number.isFinite(value)) {
      return value > 0 ? sharedText("sharedInf", "Inf") : sharedText("sharedNegInf", "-Inf");
    }

    const magnitude = Math.abs(value);
    if (magnitude === 0) {
      return "0";
    }

    if (magnitude >= 1e5 || magnitude < 1e-3) {
      const parts = value.toExponential(precision).split("e");
      const exponent = Number(parts[1]);
      if (settings.html) {
        return parts[0] + " x 10<sup>" + exponent + "</sup>";
      }
      return parts[0] + "e" + exponent;
    }

    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: precision,
      minimumFractionDigits: magnitude < 10 ? Math.min(precision, 3) : 0
    }).format(value);
  }

  function formatValueWithUnit(value, unit, digits, options) {
    const formatted = formatNumber(value, digits, options);
    return unit ? formatted + " " + unit : formatted;
  }

  function showToast(message) {
    const toast = qs("#toast");
    if (!toast) {
      return;
    }

    toast.textContent = message;
    toast.classList.add("visible");

    if (state.toastTimer) {
      window.clearTimeout(state.toastTimer);
    }

    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove("visible");
    }, 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    const error = new Error("clipboardUnavailable");
    error.code = "clipboardUnavailable";
    return Promise.reject(error);
  }

  function insertAtCursor(textarea, token) {
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const current = textarea.value;
    const insert = token;

    textarea.value = current.slice(0, start) + insert + current.slice(end);
    const cursor = start + insert.length;
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);
  }

  function debounce(fn, delay) {
    let timer = null;
    return function () {
      const args = arguments;
      const context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function typesetMath(scope) {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      return window.MathJax.typesetPromise(scope ? [scope] : undefined).catch(function () {
        return null;
      });
    }
    return Promise.resolve();
  }

  // 将数学表达式转换为可视化格式（支持上标/下标）
  function formatMathExpression(expression) {
    if (!expression) return '';
    
    let formatted = String(expression);
    
    // 替换 ^2, ^3 等为 Unicode 上标
    const superscripts = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻', '+': '⁺', '=': '⁼', '(': '⁽', ')': '⁾'
    };
    
    // 处理 x^n 格式（n 为多位数字）
    formatted = formatted.replace(/\^(\d+)/g, (match, digits) => {
      return digits.split('').map(d => superscripts[d] || d).join('');
    });
    
    // 处理简单的上标（单个字符）
    formatted = formatted.replace(/\^([0-9])/g, (match, digit) => {
      return superscripts[digit] || digit;
    });
    
    // 替换常用数学符号
    formatted = formatted
      .replace(/pi/g, 'π')
      .replace(/sqrt\(/g, '√(')
      .replace(/times/g, '×')
      .replace(/div/g, '÷')
      .replace(/leq/g, '≤')
      .replace(/geq/g, '≥')
      .replace(/neq/g, '≠')
      .replace(/approx/g, '≈')
      .replace(/infinity|inf/g, '∞');
    
    return formatted;
  }

  // 更新输入框的可视化显示
  function updateMathDisplay(inputElement, displayElement) {
    if (!inputElement || !displayElement) return;
    
    const rawValue = inputElement.value || inputElement.textContent || '';
    const formatted = formatMathExpression(rawValue);
    
    if (displayElement.tagName === 'INPUT' || displayElement.tagName === 'TEXTAREA') {
      // 如果是输入框，直接设置值
      displayElement.value = formatted;
    } else {
      // 如果是其他元素，设置 textContent
      displayElement.textContent = formatted;
    }
  }

  window.MSCLab.Utils = {
    qs: qs,
    qsa: qsa,
    escapeHtml: escapeHtml,
    formatNumber: formatNumber,
    formatValueWithUnit: formatValueWithUnit,
    showToast: showToast,
    copyText: copyText,
    insertAtCursor: insertAtCursor,
    debounce: debounce,
    typesetMath: typesetMath,
    formatMathExpression: formatMathExpression,
    updateMathDisplay: updateMathDisplay
  };
