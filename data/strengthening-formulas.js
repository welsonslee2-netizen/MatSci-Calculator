// 材料强化公式模板库
// Material Strengthening Formulas Library

window.MSCLab = window.MSCLab || {};

const StrengtheningFormulas = {
    // 公式列表
    formulas: [
      {
        id: 'solid_solution',
        name: { zh: '固溶强化', en: 'Solid Solution Strengthening' },
        category: 'strengthening',
        latex: '\\Delta\\sigma_{ss} = k_{ss} \\cdot c^{n}',
        expression: 'k_ss * c^n',
        description: {
          zh: '溶质原子引起的晶格畸变阻碍位错运动',
          en: 'Lattice distortion caused by solute atoms impedes dislocation motion'
        },
        parameters: [
          {
            name: 'k_ss',
            symbol: 'k_{ss}',
            name_zh: '固溶强化系数',
            name_en: 'Solid solution strengthening coefficient',
            unit: 'MPa',
            typical_value: 50,
            range: [10, 200]
          },
          {
            name: 'c',
            symbol: 'c',
            name_zh: '溶质浓度',
            name_en: 'Solute concentration',
            unit: 'at.%',
            typical_value: 1,
            range: [0.1, 10]
          },
          {
            name: 'n',
            symbol: 'n',
            name_zh: '浓度指数',
            name_en: 'Concentration exponent',
            unit: '',
            typical_value: 0.5,
            range: [0.3, 1.0]
          }
        ]
      },
      {
        id: 'orowan',
        name: { zh: '析出强化 (Orowan)', en: 'Precipitation Strengthening (Orowan)' },
        category: 'strengthening',
        latex: '\\Delta\\sigma_{or} = \\frac{0.4 \\cdot M \\cdot G \\cdot b}{\\pi \\sqrt{1-\\nu} \\cdot \\lambda} \\ln\\left(\\frac{2r}{b}\\right)',
        expression: '(0.4 * M * G * b) / (pi * sqrt(1 - nu) * lambda) * ln(2 * r / b)',
        description: {
          zh: '位错绕过不可变形析出相产生的强化',
          en: 'Strengthening from dislocations bypassing non-shearable precipitates'
        },
        parameters: [
          {
            name: 'M',
            symbol: 'M',
            name_zh: '泰勒因子',
            name_en: 'Taylor factor',
            unit: '',
            typical_value: 3.06,
            range: [2.5, 3.5]
          },
          {
            name: 'G',
            symbol: 'G',
            name_zh: '剪切模量',
            name_en: 'Shear modulus',
            unit: 'GPa',
            typical_value: 26,
            range: [20, 80]
          },
          {
            name: 'b',
            symbol: 'b',
            name_zh: '柏氏矢量',
            name_en: 'Burgers vector',
            unit: 'nm',
            typical_value: 0.286,
            range: [0.2, 0.4]
          },
          {
            name: 'nu',
            symbol: '\\nu',
            name_zh: '泊松比',
            name_en: 'Poisson\'s ratio',
            unit: '',
            typical_value: 0.33,
            range: [0.25, 0.4]
          },
          {
            name: 'lambda',
            symbol: '\\lambda',
            name_zh: '析出相间距',
            name_en: 'Precipitate spacing',
            unit: 'nm',
            typical_value: 50,
            range: [10, 200]
          },
          {
            name: 'r',
            symbol: 'r',
            name_zh: '析出相半径',
            name_en: 'Precipitate radius',
            unit: 'nm',
            typical_value: 5,
            range: [1, 50]
          }
        ]
      },
      {
        id: 'hall_petch',
        name: { zh: '晶界强化 (Hall-Petch)', en: 'Grain Boundary Strengthening (Hall-Petch)' },
        category: 'strengthening',
        latex: '\\sigma_y = \\sigma_0 + \\frac{k_y}{\\sqrt{d}}',
        expression: 'sigma_0 + k_y / sqrt(d)',
        description: {
          zh: '晶界阻碍位错运动产生的强化',
          en: 'Strengthening from grain boundaries impeding dislocation motion'
        },
        parameters: [
          {
            name: 'sigma_0',
            symbol: '\\sigma_0',
            name_zh: '摩擦应力',
            name_en: 'Friction stress',
            unit: 'MPa',
            typical_value: 50,
            range: [20, 150]
          },
          {
            name: 'k_y',
            symbol: 'k_y',
            name_zh: 'Hall-Petch 系数',
            name_en: 'Hall-Petch coefficient',
            unit: 'MPa·mm^0.5',
            typical_value: 0.5,
            range: [0.1, 1.5]
          },
          {
            name: 'd',
            symbol: 'd',
            name_zh: '晶粒尺寸',
            name_en: 'Grain size',
            unit: 'mm',
            typical_value: 0.01,
            range: [0.001, 0.1]
          }
        ]
      },
      {
        id: 'dislocation',
        name: { zh: '位错强化', en: 'Dislocation Strengthening' },
        category: 'strengthening',
        latex: '\\Delta\\sigma_{dis} = \\alpha \\cdot M \\cdot G \\cdot b \\cdot \\sqrt{\\rho}',
        expression: 'alpha * M * G * b * sqrt(rho)',
        description: {
          zh: '位错密度增加导致的加工硬化',
          en: 'Work hardening from increased dislocation density'
        },
        parameters: [
          {
            name: 'alpha',
            symbol: '\\alpha',
            name_zh: '位错相互作用系数',
            name_en: 'Dislocation interaction coefficient',
            unit: '',
            typical_value: 0.3,
            range: [0.2, 0.5]
          },
          {
            name: 'M',
            symbol: 'M',
            name_zh: '泰勒因子',
            name_en: 'Taylor factor',
            unit: '',
            typical_value: 3.06,
            range: [2.5, 3.5]
          },
          {
            name: 'G',
            symbol: 'G',
            name_zh: '剪切模量',
            name_en: 'Shear modulus',
            unit: 'GPa',
            typical_value: 26,
            range: [20, 80]
          },
          {
            name: 'b',
            symbol: 'b',
            name_zh: '柏氏矢量',
            name_en: 'Burgers vector',
            unit: 'nm',
            typical_value: 0.286,
            range: [0.2, 0.4]
          },
          {
            name: 'rho',
            symbol: '\\rho',
            name_zh: '位错密度',
            name_en: 'Dislocation density',
            unit: 'm^-2',
            typical_value: 1e14,
            range: [1e12, 1e16]
          }
        ]
      }
    ],

    // 获取所有公式
    getAllFormulas: function() {
      return this.formulas;
    },

    // 根据 ID 获取公式
    getFormulaById: function(id) {
      return this.formulas.find(f => f.id === id);
    },

    // 根据分类获取公式
    getFormulasByCategory: function(category) {
      return this.formulas.filter(f => f.category === category);
    },

    // 获取公式的参数名称列表
    getParameterNames: function(formulaId) {
      const formula = this.getFormulaById(formulaId);
      if (!formula) return [];
      return formula.parameters.map(p => p.name);
    },

    // 生成默认参数值
    getDefaultParameters: function(formulaId) {
      const formula = this.getFormulaById(formulaId);
      if (!formula) return {};
      
      const params = {};
      formula.parameters.forEach(p => {
        params[p.name] = p.typical_value;
      });
      return params;
    },

    // 计算公式结果
    calculate: function(formulaId, parameters) {
      const formula = this.getFormulaById(formulaId);
      if (!formula) {
        throw new Error(`Formula not found: ${formulaId}`);
      }

      try {
        // 使用 math.js 计算表达式
        const scope = {};
        
        // 将参数添加到作用域
        Object.keys(parameters).forEach(key => {
          scope[key] = parseFloat(parameters[key]);
        });
        
        // 添加数学常数和函数
        scope.pi = Math.PI;
        scope.sqrt = Math.sqrt;
        scope.ln = Math.log;
        scope.exp = Math.exp;
        scope.sin = Math.sin;
        scope.cos = Math.cos;
        scope.tan = Math.tan;
        scope.log = Math.log10;
        
        // 计算表达式
        const result = math.evaluate(formula.expression, scope);
        return result;
      } catch (error) {
        console.error('Calculation error:', error);
        throw new Error(`计算失败: ${error.message}`);
      }
    },

    // 导出公式为 JSON
    exportFormula: function(formulaId) {
      const formula = this.getFormulaById(formulaId);
      if (!formula) return null;
      return JSON.stringify(formula, null, 2);
    },

    // 从 JSON 导入自定义公式
    importFormula: function(jsonString) {
      try {
        const formula = JSON.parse(jsonString);
        // 验证必要字段
        if (!formula.id || !formula.name || !formula.expression) {
          throw new Error('Invalid formula format');
        }
        return formula;
      } catch (error) {
        console.error('Import error:', error);
        throw new Error(`导入失败: ${error.message}`);
      }
    }
  };

// 暴露到全局
window.StrengtheningFormulas = StrengtheningFormulas;
