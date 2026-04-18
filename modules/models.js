// modules/models.js — 计算模型
window.MSCLab = window.MSCLab || {};

  const unitFactors = {
    stress: {
      MPa: 1,
      GPa: 1000
    },
    length: {
      m: 1,
      mm: 1e-3,
      um: 1e-6,
      nm: 1e-9
    }
  };

  function createError(code, params) {
    const error = new Error(code);
    error.code = code;
    error.params = params || {};
    return error;
  }

  function ensureMath() {
    if (!window.math) {
      throw createError("mathJsLoad");
    }
  }

  function normalizeExpression(expression) {
    let normalized = String(expression || "")
      // Unicode 字符替换
      .replaceAll("\u03c0", "pi")
      .replaceAll("\u0127", "hbar")
      .replaceAll("\u210f", "hbar")
      .replaceAll("\u03b50", "epsilon0")
      .replaceAll("\u03b5_0", "epsilon0")
      .replaceAll("\u00d7", "*")
      .replaceAll("\u00f7", "/")
      .replaceAll("\u221a", "sqrt")
      .replaceAll("\u2212", "-")
      .replaceAll("N_A", "Na")
      .replaceAll("k_B", "kB")
      .replaceAll("m_e", "me")
      .replaceAll("\u03c3_B", "sigmaSB")
      .replaceAll("\u03c3", "sigmaSB")
      
      // LaTeX 命令替换
      .replaceAll("\\sin(", "sin(")
      .replaceAll("\\cos(", "cos(")
      .replaceAll("\\tan(", "tan(")
      .replaceAll("\\arcsin(", "asin(")
      .replaceAll("\\arccos(", "acos(")
      .replaceAll("\\arctan(", "atan(")
      .replaceAll("\\ln(", "log(")
      .replaceAll("\\log(", "log10(")
      .replaceAll("\\exp(", "exp(")
      .replaceAll("\\sqrt{", "sqrt(")
      .replaceAll("\\frac{", "(")
      .replaceAll("\\left|", "abs(")
      .replaceAll("\\right|", ")")
      .replaceAll("\\pi", "pi")
      .replaceAll("\\cdot", "*")
      .replaceAll("\\times", "*")
      .replaceAll("\\div", "/")
      .replaceAll("\\pm", "+")
      .replaceAll("\\infty", "Infinity")
      
      // 清理 MathLive 占位符
      .replaceAll("#0", "")
      
      // 移除 LaTeX 格式符号
      .replaceAll("}", ")")
      .replaceAll("^{", "^(")
      .replaceAll("_{", "_(");

    // 处理百分号
    while (/\(([^()]+)\)%/.test(normalized)) {
      normalized = normalized.replace(/\(([^()]+)\)%/g, "(($1)/100)");
    }

    normalized = normalized.replace(/([A-Za-z0-9_.]+)%/g, "($1/100)");
    return normalized;
  }

  function baseScope(extraScope) {
    const scope = {
      pi: 3.141592653589793,
      e: 2.718281828459045,
      Na: 6.02214076e23,
      kB: 1.380649e-23,
      h: 6.62607015e-34,
      hbar: 1.054571817e-34,
      R: 8.31446261815324,
      eCharge: 1.602176634e-19,
      c: 299792458,
      epsilon0: 8.8541878128e-12,
      me: 9.1093837015e-31,
      sigmaSB: 5.670374419e-8,
      ln: function (value) {
        return Math.log(value);
      },
      log: function (value) {
        return Math.log10(value);
      },
      log10: function (value) {
        return Math.log10(value);
      },
      nPr: function (nValue, rValue) {
        const n = Number(nValue);
        const r = Number(rValue);
        return window.math.factorial(n) / window.math.factorial(n - r);
      },
      nCr: function (nValue, rValue) {
        const n = Number(nValue);
        const r = Number(rValue);
        return window.math.factorial(n) / (window.math.factorial(r) * window.math.factorial(n - r));
      }
    };

    return Object.assign(scope, extraScope || {});
  }

  function coerceNumber(result) {
    ensureMath();

    if (typeof result === "number") {
      return result;
    }

    try {
      const converted = window.math.number(result);
      if (typeof converted === "number" && Number.isFinite(converted)) {
        return converted;
      }
    } catch (error) {
      // Fall through to explicit error below.
    }

    throw createError("scalarOnly");
  }

  function evaluateExpression(expression, extraScope) {
    ensureMath();
    const normalized = normalizeExpression(expression);

    if (!normalized.trim()) {
      throw createError("emptyExpression");
    }

    try {
      const result = window.math.evaluate(normalized, baseScope(extraScope));
      return coerceNumber(result);
    } catch (error) {
      if (error && error.code) {
        throw error;
      }
      throw createError("expressionInvalid");
    }
  }

  function compileExpression(expression, extraScope) {
    ensureMath();
    const normalized = normalizeExpression(expression);

    if (!normalized.trim()) {
      throw createError("emptyFunction");
    }

    let compiled = null;

    try {
      compiled = window.math.compile(normalized);
    } catch (error) {
      if (error && error.code) {
        throw error;
      }
      throw createError("expressionInvalid");
    }

    return function (xValue) {
      try {
        const result = compiled.evaluate(baseScope(Object.assign({}, extraScope || {}, { x: xValue })));
        return coerceNumber(result);
      } catch (error) {
        if (error && error.code) {
          throw error;
        }
        throw createError("expressionInvalid");
      }
    };
  }

  function numericalDerivative(expression, xValue, step) {
    const x = Number(xValue);
    const h = Number(step || 1e-5);

    if (!Number.isFinite(x) || !Number.isFinite(h) || h <= 0) {
      throw createError("invalidDerivativeInputs");
    }

    const fn = compileExpression(expression);
    return (fn(x + h) - fn(x - h)) / (2 * h);
  }

  function definiteIntegral(expression, aValue, bValue, subintervals) {
    const a = Number(aValue);
    const b = Number(bValue);
    let n = Number(subintervals || 400);

    if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) {
      throw createError("invalidIntegralBounds");
    }

    if (!Number.isFinite(n) || n < 20) {
      throw createError("invalidIntegralSteps");
    }

    n = Math.round(n);
    if (n % 2 !== 0) {
      n += 1;
    }

    const fn = compileExpression(expression);
    const h = (b - a) / n;
    let sum = fn(a) + fn(b);

    for (let i = 1; i < n; i += 1) {
      const x = a + i * h;
      sum += fn(x) * (i % 2 === 0 ? 2 : 4);
    }

    return (h / 3) * sum;
  }

  function findRoot(expression, x0Value, x1Value, tolerance, maxIterations) {
    const fn = compileExpression(expression);
    let x0 = Number(x0Value);
    let x1 = Number(x1Value);
    const tol = Number(tolerance || 1e-6);
    const maxIter = Number(maxIterations || 100);

    if (!Number.isFinite(x0) || !Number.isFinite(x1) || x0 === x1) {
      throw createError("invalidRootGuesses");
    }

    for (let iteration = 0; iteration < maxIter; iteration += 1) {
      const f0 = fn(x0);
      const f1 = fn(x1);
      const denominator = f1 - f0;

      if (Math.abs(denominator) < 1e-15) {
        throw createError("rootSlopeZero");
      }

      const next = x1 - f1 * (x1 - x0) / denominator;

      if (!Number.isFinite(next)) {
        throw createError("rootDiverged");
      }

      if (Math.abs(next - x1) < tol) {
        return {
          root: next,
          iterations: iteration + 1,
          residual: fn(next)
        };
      }

      x0 = x1;
      x1 = next;
    }

    throw createError("rootNoConvergence");
  }

  function sampleFunction(expression, minValue, maxValue, count) {
    const min = Number(minValue);
    const max = Number(maxValue);
    const points = Math.max(20, Math.round(Number(count || 200)));

    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
      throw createError("invalidPlotRange");
    }

    const fn = compileExpression(expression);
    const xs = [];
    const ys = [];

    for (let i = 0; i < points; i += 1) {
      const x = min + (i / (points - 1)) * (max - min);
      let y = null;

      try {
        y = fn(x);
        if (!Number.isFinite(y) || Math.abs(y) > 1e12) {
          y = null;
        }
      } catch (error) {
        y = null;
      }

      xs.push(x);
      ys.push(y);
    }

    return { xs: xs, ys: ys };
  }

  function assertPositive(value, label) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      throw createError("positiveRequired", { field: label });
    }
    return numeric;
  }

  function toMeters(value, unit) {
    const factor = unitFactors.length[unit];
    if (!factor) {
      throw createError("unsupportedLengthUnit", { unit: unit });
    }
    return assertPositive(value, "length") * factor;
  }

  function hallPetch(params) {
    const sigma0 = assertPositive(params.sigma0, "baseStress") * (unitFactors.stress[params.sigma0Unit] || 1);
    const ky = assertPositive(params.ky, "hallPetchCoefficient");
    const grainSizeMeters = toMeters(params.grainSize, params.grainUnit || "um");
    const incrementMPa = ky / Math.sqrt(grainSizeMeters);

    return {
      incrementMPa: incrementMPa,
      totalYieldMPa: sigma0 + incrementMPa,
      grainSizeMeters: grainSizeMeters
    };
  }

  function dislocation(params) {
    const alpha = assertPositive(params.alpha, "alpha");
    const shearModulus = assertPositive(params.G, "shearModulus");
    const burgers = assertPositive(params.b, "burgersVector");
    const rho = assertPositive(params.rho, "dislocationDensity");
    const incrementMPa = alpha * shearModulus * burgers * Math.sqrt(rho) / 1e6;

    return {
      incrementMPa: incrementMPa
    };
  }

  function cutting(params) {
    const radiusNm = assertPositive(params.radius, "precipitateRadius");
    const fraction = assertPositive(params.fraction, "volumeFraction");
    const gammaApb = assertPositive(params.apb, "apbEnergy");
    const shearModulus = assertPositive(params.G, "shearModulus");
    const burgers = assertPositive(params.b, "burgersVector");
    const coefficient = assertPositive(params.k, "cuttingCoefficient");

    if (fraction >= 1) {
      throw createError("volumeFractionRange");
    }

    const radiusMeters = radiusNm * 1e-9;
    const burgersMeters = burgers * 1e-9;
    const shearPa = shearModulus * 1e9;
    const gammaJ = gammaApb * 1e-3;
    const apbTerm = Math.sqrt(gammaJ / (shearPa * burgersMeters));
    const sizeTerm = Math.sqrt(burgersMeters / radiusMeters);
    const deltaPa = coefficient * shearPa * Math.sqrt(fraction) * sizeTerm * apbTerm;

    return {
      incrementMPa: deltaPa / 1e6
    };
  }

  function orowan(params) {
    const shearModulus = assertPositive(params.G, "shearModulus");
    const burgers = assertPositive(params.b, "burgersVector");
    const radiusNm = assertPositive(params.radius, "precipitateRadius");
    const spacingNm = assertPositive(params.spacing, "interparticleSpacing");
    const poisson = Number(params.nu);

    if (!Number.isFinite(poisson) || poisson <= 0 || poisson >= 0.49) {
      throw createError("invalidPoissonRatio");
    }

    const shearPa = shearModulus * 1e9;
    const burgersMeters = burgers * 1e-9;
    const radiusMeters = radiusNm * 1e-9;
    const spacingMeters = spacingNm * 1e-9;
    const logTerm = Math.log(Math.max(radiusMeters / burgersMeters, 1.01));
    const deltaPa = (0.4 * shearPa * burgersMeters * logTerm) /
      (Math.PI * spacingMeters * Math.sqrt(1 - poisson));

    return {
      incrementMPa: deltaPa / 1e6
    };
  }

  function buildRange(minValue, maxValue, stepsValue) {
    const min = Number(minValue);
    const max = Number(maxValue);
    const steps = Math.max(10, Math.round(Number(stepsValue || 50)));

    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
      throw createError("invalidSweepRange");
    }

    const values = [];
    for (let index = 0; index < steps; index += 1) {
      values.push(min + (index / (steps - 1)) * (max - min));
    }
    return values;
  }

  /**
   * Taylor 级数展开
   * 使用数值微分计算导数，构建 Taylor 多项式
   * @param {string} expression - f(x) 的表达式
   * @param {number} center - 展开中心 a
   * @param {number} order - 最高阶数 n（即展开到 (x-a)^n 项）
   * @param {number} xValue - 评估点 x（可选，默认 0）
   * @returns {object} { series: [{coeff, term}], value: number }
   */
  function taylorSeries(expression, center, order, xValue) {
    const a = Number(center);
    const n = Math.max(1, Math.min(Math.round(Number(order)), 20));
    const x = xValue !== undefined ? Number(xValue) : 0;
    const fn = compileExpression(expression);
    const h = 1e-5;

    // 计算 f^(k)(a) / k! 的系数
    const series = [];
    for (let k = 0; k <= n; k++) {
      let derivK;
      if (k === 0) {
        derivK = fn(a);
      } else {
        // 使用 n 阶有限差分近似 n 阶导数
        // 对于 k 阶导数，使用中心差分递归
        derivK = nthDerivative(fn, a, k, h);
      }

      const coeff = derivK / factorial(k);
      series.push({
        order: k,
        coefficient: coeff,
        // 泰勒项在 x 处的值
        termValue: coeff * Math.pow(x - a, k),
        // LaTeX 字符串描述
        latex: k === 0
          ? formatNum(coeff)
          : (Math.abs(coeff) < 1e-14) ? '' : formatNum(coeff) + (k === 1 ? 'x' : 'x^{' + k + '}')
      });
    }

    // 总和
    let totalValue = 0;
    for (let i = 0; i < series.length; i++) {
      totalValue += series[i].termValue;
    }

    return {
      series: series,
      value: totalValue,
      exactValue: fn(x)
    };
  }

  /**
   * n 阶数值导数（递归中心差分）
   */
  function nthDerivative(fn, x, n, h) {
    if (n === 0) return fn(x);
    if (n === 1) return (fn(x + h) - fn(x - h)) / (2 * h);

    // 使用递推公式近似高阶导数
    let result = 0;
    for (let k = 0; k <= n; k++) {
      const sign = (k % 2 === 0) ? 1 : -1;
      const binom = factorial(n) / (factorial(k) * factorial(n - k));
      const fx = fn(x + (n / 2 - k) * h);
      result += sign * binom * fx;
    }
    return result / Math.pow(h, n);
  }

  function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  function formatNum(val) {
    if (Math.abs(val) < 1e-14) return '0';
    if (Math.abs(val - Math.round(val)) < 1e-10) return String(Math.round(val));
    return val.toPrecision(6).replace(/\.?0+$/, '');
  }

  window.MSCLab.Models = {
    evaluateExpression: evaluateExpression,
    numericalDerivative: numericalDerivative,
    definiteIntegral: definiteIntegral,
    findRoot: findRoot,
    sampleFunction: sampleFunction,
    taylorSeries: taylorSeries,
    hallPetch: hallPetch,
    dislocation: dislocation,
    cutting: cutting,
    orowan: orowan,
    buildRange: buildRange
  };
