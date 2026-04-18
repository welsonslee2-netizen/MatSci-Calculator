// 自定义公式管理器
// Custom Formula Manager

window.MSCLab = window.MSCLab || {};

  const CustomFormulaManager = {
    // 当前编辑的公式
    currentFormula: null,
    
    // 已保存的公式列表
    savedFormulas: [],

    // 初始化
    init: function() {
      this.loadSavedFormulas();
      this.bindEvents();
      this.renderSavedFormulasList();
    },

    // 绑定事件
    bindEvents: function() {
      const self = this;
      
      // 预设模板选择
      const presetSelect = document.getElementById('formula-preset-select');
      if (presetSelect) {
        presetSelect.addEventListener('change', function() {
          self.loadPresetTemplate(this.value);
        });
      }

      // 计算按钮
      const calcBtn = document.getElementById('calculate-custom-formula');
      if (calcBtn) {
        calcBtn.addEventListener('click', function() {
          self.calculateCurrentFormula();
        });
      }

      // 保存公式按钮
      const saveBtn = document.getElementById('save-custom-formula');
      if (saveBtn) {
        saveBtn.addEventListener('click', function() {
          self.saveCurrentFormula();
        });
      }

      // 加载公式按钮
      const loadBtn = document.getElementById('load-custom-formula');
      if (loadBtn) {
        loadBtn.addEventListener('click', function() {
          self.showLoadDialog();
        });
      }

      // 清除按钮
      const clearBtn = document.getElementById('clear-custom-formula');
      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          self.clearCurrentFormula();
        });
      }
    },

    // 加载预设模板
    loadPresetTemplate: function(formulaId) {
      if (!formulaId) return;
      
      const formula = StrengtheningFormulas.getFormulaById(formulaId);
      if (!formula) {
        console.error('Formula not found:', formulaId);
        return;
      }

      // 填充表单
      document.getElementById('custom-formula-name').value = 
        typeof formula.name === 'object' ? formula.name.en : formula.name;
      
      const latexField = document.getElementById('custom-formula-latex');
      if (latexField && latexField.tagName === 'MATH-FIELD') {
        latexField.setValue(formula.latex);
      }
      
      document.getElementById('custom-formula-expression').value = formula.expression;

      // 生成参数输入框
      this.generateParameterInputs(formula);
      
      // 保存当前公式
      this.currentFormula = Object.assign({}, formula);
    },

    // 生成参数输入框
    generateParameterInputs: function(formula) {
      const container = document.getElementById('parameters-list');
      if (!container) return;

      container.innerHTML = '';

      formula.parameters.forEach(param => {
        const paramDiv = document.createElement('div');
        paramDiv.className = 'parameter-input-group';
        
        paramDiv.innerHTML = `
          <label>
            <span class="field-label">
              ${param.symbol || param.name} 
              (${typeof param.name_zh === 'string' ? param.name_zh : param.name.zh})
              ${param.unit ? `[${param.unit}]` : ''}
            </span>
            <input type="number" 
                   data-param-name="${param.name}" 
                   value="${param.typical_value}" 
                   step="0.01"
                   min="${param.range ? param.range[0] : ''}"
                   max="${param.range ? param.range[1] : ''}">
          </label>
        `;
        
        container.appendChild(paramDiv);
      });
    },

    // 获取当前参数值
    getCurrentParameters: function() {
      const params = {};
      const inputs = document.querySelectorAll('#parameters-list input[data-param-name]');
      
      inputs.forEach(input => {
        const paramName = input.dataset.paramName;
        params[paramName] = parseFloat(input.value);
      });
      
      return params;
    },

    // 计算当前公式
    calculateCurrentFormula: function() {
      try {
        const expression = document.getElementById('custom-formula-expression').value;
        const parameters = this.getCurrentParameters();
        
        if (!expression) {
          alert('Please enter a calculation expression');
          return;
        }

        // 使用 math.js 计算
        const scope = Object.assign({}, parameters);
        scope.pi = Math.PI;
        scope.sqrt = Math.sqrt;
        scope.ln = Math.log;
        scope.exp = Math.exp;
        scope.sin = Math.sin;
        scope.cos = Math.cos;
        scope.tan = Math.tan;
        scope.log = Math.log10;
        scope.pow = Math.pow;
        
        const result = math.evaluate(expression, scope);
        
        // 显示结果
        this.displayResult(result, parameters);
        
      } catch (error) {
        console.error('Calculation error:', error);
        alert(`Calculation failed: ${error.message}`);
      }
    },

    // 显示计算结果
    displayResult: function(result, parameters) {
      const resultDiv = document.getElementById('custom-formula-result');
      if (!resultDiv) return;

      let html = '<div class="result-item">';
      html += `<div class="result-label">Result</div>`;
      html += `<div class="result-value">${result.toFixed(4)}</div>`;
      html += '</div>';

      // 显示参数值
      html += '<div class="parameters-summary">';
      html += '<h5>Parameters Used:</h5><ul>';
      for (const [key, value] of Object.entries(parameters)) {
        html += `<li><strong>${key}</strong> = ${value}</li>`;
      }
      html += '</ul></div>';

      resultDiv.innerHTML = html;
    },

    // 保存当前公式
    saveCurrentFormula: function() {
      const name = document.getElementById('custom-formula-name').value.trim();
      if (!name) {
        alert('Please enter a formula name');
        return;
      }

      const latexField = document.getElementById('custom-formula-latex');
      const latex = latexField && latexField.tagName === 'MATH-FIELD' 
        ? latexField.getValue() 
        : '';
      
      const expression = document.getElementById('custom-formula-expression').value;
      const parameters = this.getCurrentParameters();

      const formula = {
        id: 'custom_' + Date.now(),
        name: name,
        latex: latex,
        expression: expression,
        parameters: Object.keys(parameters).map(key => ({
          name: key,
          symbol: key,
          typical_value: parameters[key]
        })),
        created_at: new Date().toISOString()
      };

      this.savedFormulas.push(formula);
      this.saveToLocalStorage();
      this.renderSavedFormulasList();
      
      alert('Formula saved successfully!');
    },

    // 保存到 localStorage
    saveToLocalStorage: function() {
      try {
        localStorage.setItem('custom_formulas', JSON.stringify(this.savedFormulas));
      } catch (e) {
        console.error('Failed to save formulas:', e);
      }
    },

    // 从 localStorage 加载
    loadSavedFormulas: function() {
      try {
        const data = localStorage.getItem('custom_formulas');
        if (data) {
          this.savedFormulas = JSON.parse(data);
        }
      } catch (e) {
        console.error('Failed to load formulas:', e);
        this.savedFormulas = [];
      }
    },

    // 渲染已保存的公式列表
    renderSavedFormulasList: function() {
      const container = document.getElementById('saved-formulas-list');
      if (!container) return;

      if (this.savedFormulas.length === 0) {
        container.innerHTML = '<p class="empty-message">No saved formulas yet.</p>';
        return;
      }

      let html = '<div class="formulas-grid">';
      this.savedFormulas.forEach((formula, index) => {
        html += `
          <div class="formula-card-item">
            <h5>${formula.name}</h5>
            <div class="formula-actions">
              <button class="button small" onclick="CustomFormulaManager.loadFormula(${index})">Load</button>
              <button class="button small secondary" onclick="CustomFormulaManager.deleteFormula(${index})">Delete</button>
            </div>
          </div>
        `;
      });
      html += '</div>';

      container.innerHTML = html;
    },

    // 加载已保存的公式
    loadFormula: function(index) {
      const formula = this.savedFormulas[index];
      if (!formula) return;

      document.getElementById('custom-formula-name').value = formula.name;
      
      const latexField = document.getElementById('custom-formula-latex');
      if (latexField && latexField.tagName === 'MATH-FIELD') {
        latexField.setValue(formula.latex || '');
      }
      
      document.getElementById('custom-formula-expression').value = formula.expression;

      // 生成参数输入
      const params = {};
      formula.parameters.forEach(p => {
        params[p.name] = p.typical_value;
      });
      
      this.generateParameterInputsFromParams(params);
      
      this.currentFormula = formula;
    },

    // 从参数对象生成输入框
    generateParameterInputsFromParams: function(params) {
      const container = document.getElementById('parameters-list');
      if (!container) return;

      container.innerHTML = '';

      for (const [key, value] of Object.entries(params)) {
        const paramDiv = document.createElement('div');
        paramDiv.className = 'parameter-input-group';
        
        paramDiv.innerHTML = `
          <label>
            <span class="field-label">${key}</span>
            <input type="number" 
                   data-param-name="${key}" 
                   value="${value}" 
                   step="0.01">
          </label>
        `;
        
        container.appendChild(paramDiv);
      }
    },

    // 删除公式
    deleteFormula: function(index) {
      if (confirm('Are you sure you want to delete this formula?')) {
        this.savedFormulas.splice(index, 1);
        this.saveToLocalStorage();
        this.renderSavedFormulasList();
      }
    },

    // 清除当前公式
    clearCurrentFormula: function() {
      document.getElementById('custom-formula-name').value = '';
      
      const latexField = document.getElementById('custom-formula-latex');
      if (latexField && latexField.tagName === 'MATH-FIELD') {
        latexField.setValue('');
      }
      
      document.getElementById('custom-formula-expression').value = '';
      document.getElementById('parameters-list').innerHTML = '';
      document.getElementById('custom-formula-result').innerHTML = '';
      document.getElementById('formula-preset-select').value = '';
      
      this.currentFormula = null;
    },

    // 显示加载对话框（简单实现）
    showLoadDialog: function() {
      alert('Use the "Saved Formulas" section below to load formulas.');
    }
  };


// 暴露到全局
window.CustomFormulaManager = CustomFormulaManager;
