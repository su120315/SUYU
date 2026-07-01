document.addEventListener('DOMContentLoaded', function() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const modal = document.getElementById('toolModal');
  const modalTitle = document.getElementById('toolModalTitle');
  const modalBody = document.getElementById('toolModalBody');
  const modalClose = document.getElementById('toolModalClose');
  const modalOverlay = document.getElementById('toolModalOverlay');

  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.addEventListener('click', function() {
      const tool = this.dataset.tool;
      openTool(tool);
    });
  });

  function closeModal() {
    modal.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // 键盘弹出时，聚焦输入框自动滚动到可视区域
  modalBody.addEventListener('focusin', function(e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      setTimeout(function() {
        e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 300);
    }
  });

  const tools = {
    calculator: { title: '计算器', render: renderCalculator },
    timer: { title: '倒计时 / 番茄钟', render: renderTimer },
    base64: { title: 'Base64 编解码', render: renderBase64 },
    json: { title: 'JSON 格式化', render: renderJson },
    color: { title: '颜色工具', render: renderColor },
    baseconv: { title: '进制转换', render: renderBaseConv },
    password: { title: '密码生成器', render: renderPassword },
    qrcode: { title: '二维码生成', render: renderQrcode },
    typing: { title: '打字速度测试', render: renderTyping },
    quote: { title: '随机名言', render: renderQuote },
    encoding: { title: '编码转换', render: renderEncoding },
    xtc: { title: 'XTC校验码', render: renderXtc }
  };

  function openTool(toolName) {
    const tool = tools[toolName];
    if (tool && tool.external) {
      window.open('https://utf8.bz6.top', '_blank');
      return;
    }
    if (!tool) return;
    modalTitle.textContent = tool.title;
    modalBody.innerHTML = '';
    tool.render(modalBody);
    modal.classList.add('active');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    setTimeout(function() { modalBody.scrollTop = 0; }, 50);
  }

  function renderCalculator(container) {
    container.innerHTML = `
      <div class="calc-display">
        <div class="calc-expression" id="calcExpr"></div>
        <div class="calc-result" id="calcResult">0</div>
      </div>
      <div class="calc-keys">
        <button class="calc-btn clear" data-action="clear">C</button>
        <button class="calc-btn clear" data-action="back">←</button>
        <button class="calc-btn op" data-val="%">%</button>
        <button class="calc-btn op" data-val="/">÷</button>
        <button class="calc-btn" data-val="7">7</button>
        <button class="calc-btn" data-val="8">8</button>
        <button class="calc-btn" data-val="9">9</button>
        <button class="calc-btn op" data-val="*">×</button>
        <button class="calc-btn" data-val="4">4</button>
        <button class="calc-btn" data-val="5">5</button>
        <button class="calc-btn" data-val="6">6</button>
        <button class="calc-btn op" data-val="-">−</button>
        <button class="calc-btn" data-val="1">1</button>
        <button class="calc-btn" data-val="2">2</button>
        <button class="calc-btn" data-val="3">3</button>
        <button class="calc-btn op" data-val="+">+</button>
        <button class="calc-btn" data-val="0">0</button>
        <button class="calc-btn" data-val=".">.</button>
        <button class="calc-btn equals" data-action="equals">=</button>
      </div>
    `;

    let expression = '';
    const exprEl = container.querySelector('#calcExpr');
    const resultEl = container.querySelector('#calcResult');

    // 安全数学解析（支持 + - * / % 和括号）
    function safeEval(expr) {
      // 替换 % 为 /100 (在数字后面时)
      expr = expr.replace(/(\d+)%/g, '($1/100)');
      // 只允许数字、运算符、括号、小数点
      if (!/^[\d+\-*/().%\s]+$/.test(expr)) throw new Error('Invalid');
      // 用 Function 替代 eval（沙箱化）
      return new Function('return (' + expr + ')')();
    }

    function updateDisplay() {
      exprEl.textContent = expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
      try {
        if (expression) {
          const r = safeEval(expression);
          if (!isNaN(r) && isFinite(r)) {
            resultEl.textContent = Math.round(r * 1e10) / 1e10;
          } else {
            resultEl.textContent = '错误';
          }
        } else {
          resultEl.textContent = '0';
        }
      } catch(e) {
        resultEl.textContent = '错误';
      }
    }

    container.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.dataset.action;
        const val = this.dataset.val;
        if (action === 'clear') { expression = ''; }
        else if (action === 'back') { expression = expression.slice(0, -1); }
        else if (action === 'equals') {
          try {
            const r = safeEval(expression);
            if (!isNaN(r) && isFinite(r)) {
              expression = String(Math.round(r * 1e10) / 1e10);
            }
          } catch(e) {}
        }
        else if (val !== undefined) {
          const ops = ['+', '-', '*', '/', '%', '.'];
          const last = expression.slice(-1);
          if (ops.includes(val) && ops.includes(last)) {
            expression = expression.slice(0, -1) + val;
          } else {
            expression += val;
          }
        }
        updateDisplay();
      });
    });
  }

  function renderTimer(container) {
    container.innerHTML = `
      <div class="timer-topbar">
        <div class="timer-modes">
          <button class="timer-mode active" data-mode="countdown">倒计时</button>
          <button class="timer-mode" data-mode="clock">时钟</button>
          <button class="timer-mode" data-mode="stopwatch">秒表</button>
        </div>
        <button class="timer-fullscreen" id="timerFullscreen" title="全屏">
          <i data-lucide="maximize"></i>
        </button>
      </div>
      <div class="timer-display">
        <div class="timer-time" id="timerTime">25:00</div>
        <div class="timer-label" id="timerLabel">专注时间</div>
      </div>
      <div class="timer-presets" id="timerPresets">
        <button class="timer-preset active" data-min="25" data-label="专注时间">番茄 25min</button>
        <button class="timer-preset" data-min="5" data-label="短休息">休息 5min</button>
        <button class="timer-preset" data-min="15" data-label="长休息">长休 15min</button>
        <button class="timer-preset" data-min="60" data-label="学习时间">学习 60min</button>
        <button class="timer-preset timer-custom-btn" id="timerCustomBtn">
          <i data-lucide="settings-2" style="width:14px;height:14px;vertical-align:middle;margin-right:4px;"></i>自定义
        </button>
      </div>
      <div class="timer-custom-input" id="timerCustomInput">
        <div class="timer-custom-row">
          <div class="timer-custom-field">
            <input type="number" id="customMin" min="0" max="999" value="25">
            <span>分</span>
          </div>
          <div class="timer-custom-sep">:</div>
          <div class="timer-custom-field">
            <input type="number" id="customSec" min="0" max="59" value="0">
            <span>秒</span>
          </div>
          <button class="timer-custom-set" id="timerCustomSet">确定</button>
        </div>
      </div>
      <div class="timer-controls">
        <button class="timer-btn primary" id="timerStart">开始</button>
        <button class="timer-btn secondary" id="timerReset">重置</button>
      </div>
    `;

    let mode = 'countdown';
    let totalSeconds = 25 * 60;
    let remaining = totalSeconds;
    let timerId = null;
    let running = false;
    let stopwatchMs = 0;
    let stopwatchStart = 0;
    const timeEl = container.querySelector('#timerTime');
    const labelEl = container.querySelector('#timerLabel');
    const presetsEl = container.querySelector('#timerPresets');
    const startBtn = container.querySelector('#timerStart');
    const resetBtn = container.querySelector('#timerReset');

    function format(s) {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = (s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    }

    function formatClock() {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    function formatStopwatch(ms) {
      const totalSec = Math.floor(ms / 1000);
      const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
      const s = (totalSec % 60).toString().padStart(2, '0');
      const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
      return `${m}:${s}.${cs}`;
    }

    function updateDisplay() {
      if (mode === 'countdown') {
        timeEl.textContent = format(remaining);
      } else if (mode === 'clock') {
        timeEl.textContent = formatClock();
      } else if (mode === 'stopwatch') {
        timeEl.textContent = formatStopwatch(stopwatchMs);
      }
    }

    function stopTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      running = false;
      startBtn.textContent = mode === 'stopwatch' ? '开始' : '开始';
    }

    function switchMode(newMode) {
      mode = newMode;
      stopTimer();

      container.querySelectorAll('.timer-mode').forEach(b => b.classList.remove('active'));
      container.querySelector(`[data-mode="${newMode}"]`).classList.add('active');

      if (newMode === 'countdown') {
        presetsEl.style.display = 'flex';
        labelEl.textContent = '专注时间';
        remaining = totalSeconds;
        startBtn.textContent = '开始';
        resetBtn.style.display = '';
        startBtn.style.display = '';
        hideCustomInput();
      } else if (newMode === 'clock') {
        presetsEl.style.display = 'none';
        labelEl.textContent = new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
        startBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        timerId = setInterval(updateDisplay, 1000);
      } else if (newMode === 'stopwatch') {
        presetsEl.style.display = 'none';
        labelEl.textContent = '秒表计时';
        stopwatchMs = 0;
        startBtn.style.display = '';
        startBtn.textContent = '开始';
        resetBtn.style.display = '';
      }
      updateDisplay();
    }

    container.querySelectorAll('.timer-mode').forEach(btn => {
      btn.addEventListener('click', function() {
        switchMode(this.dataset.mode);
      });
    });

    container.querySelectorAll('.timer-preset:not(.timer-custom-btn)').forEach(btn => {
      btn.addEventListener('click', function() {
        container.querySelectorAll('.timer-preset').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        totalSeconds = parseInt(this.dataset.min) * 60;
        remaining = totalSeconds;
        labelEl.textContent = this.dataset.label;
        stopTimer();
        updateDisplay();
        hideCustomInput();
      });
    });

    const customBtn = container.querySelector('#timerCustomBtn');
    const customInputEl = container.querySelector('#timerCustomInput');
    const customMinInput = container.querySelector('#customMin');
    const customSecInput = container.querySelector('#customSec');
    const customSetBtn = container.querySelector('#timerCustomSet');

    function showCustomInput() {
      customInputEl.style.display = 'flex';
      customMinInput.value = Math.floor(totalSeconds / 60);
      customSecInput.value = totalSeconds % 60;
      setTimeout(() => customMinInput.focus(), 50);
    }

    function hideCustomInput() {
      customInputEl.style.display = 'none';
    }

    customBtn.addEventListener('click', function() {
      container.querySelectorAll('.timer-preset').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      if (customInputEl.style.display === 'flex') {
        hideCustomInput();
      } else {
        showCustomInput();
      }
    });

    function applyCustomTime() {
      let m = parseInt(customMinInput.value) || 0;
      let s = parseInt(customSecInput.value) || 0;
      if (m < 0) m = 0;
      if (s < 0) s = 0;
      if (s > 59) s = 59;
      if (m > 999) m = 999;
      totalSeconds = m * 60 + s;
      if (totalSeconds <= 0) totalSeconds = 1;
      remaining = totalSeconds;
      labelEl.textContent = `自定义 ${m}分${s}秒`;
      stopTimer();
      updateDisplay();
    }

    customSetBtn.addEventListener('click', applyCustomTime);

    customMinInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') applyCustomTime();
    });
    customSecInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') applyCustomTime();
    });

    startBtn.addEventListener('click', function() {
      if (mode === 'countdown') {
        if (running) {
          stopTimer();
        } else {
          if (remaining <= 0) remaining = totalSeconds;
          running = true;
          startBtn.textContent = '暂停';
          timerId = setInterval(() => {
            remaining--;
            updateDisplay();
            if (remaining <= 0) {
              stopTimer();
              try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                o.frequency.value = 800;
                g.gain.setValueAtTime(0.3, ctx.currentTime);
                g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                o.start(); o.stop(ctx.currentTime + 0.5);
              } catch(e) {}
              alert('时间到啦！⏰');
            }
          }, 1000);
        }
      } else if (mode === 'stopwatch') {
        if (running) {
          stopTimer();
          stopwatchMs += Date.now() - stopwatchStart;
        } else {
          running = true;
          stopwatchStart = Date.now();
          startBtn.textContent = '暂停';
          timerId = setInterval(() => {
            const current = stopwatchMs + Date.now() - stopwatchStart;
            timeEl.textContent = formatStopwatch(current);
          }, 10);
        }
      }
    });

    resetBtn.addEventListener('click', function() {
      stopTimer();
      if (mode === 'countdown') {
        remaining = totalSeconds;
      } else if (mode === 'stopwatch') {
        stopwatchMs = 0;
      }
      updateDisplay();
    });

    const fsBtn = container.querySelector('#timerFullscreen');
    let isFullscreen = false;

    function enterFullscreen() {
      const modalContent = document.querySelector('.tool-modal-content');
      if (modalContent) {
        modalContent.classList.add('timer-fs');
      }
      isFullscreen = true;
      fsBtn.innerHTML = '<i data-lucide="minimize"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function exitFullscreen() {
      const modalContent = document.querySelector('.tool-modal-content');
      if (modalContent) {
        modalContent.classList.remove('timer-fs');
      }
      isFullscreen = false;
      fsBtn.innerHTML = '<i data-lucide="maximize"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    fsBtn.addEventListener('click', function() {
      if (isFullscreen) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
    });

    updateDisplay();
  }

  function renderBase64(container) {
    container.innerHTML = `
      <div class="text-tool-label">原始文本</div>
      <textarea class="text-tool-area" id="b64Input" placeholder="输入要编码/解码的文字..."></textarea>
      <div class="text-tool-row">
        <button class="text-tool-btn primary" id="b64Encode">编码 → Base64</button>
        <button class="text-tool-btn" id="b64Decode">Base64 → 解码</button>
        <button class="text-tool-btn" id="b64Copy">复制结果</button>
      </div>
      <div class="text-tool-label">结果</div>
      <textarea class="text-tool-area" id="b64Output" placeholder="结果会显示在这里..." readonly></textarea>
      <div class="text-tool-status" id="b64Status"></div>
    `;

    const input = container.querySelector('#b64Input');
    const output = container.querySelector('#b64Output');
    const status = container.querySelector('#b64Status');

    function showStatus(msg, type) {
      status.textContent = msg;
      status.className = 'text-tool-status ' + type;
      setTimeout(() => { status.textContent = ''; status.className = 'text-tool-status'; }, 2000);
    }

    container.querySelector('#b64Encode').addEventListener('click', function() {
      try {
        output.value = btoa(unescape(encodeURIComponent(input.value)));
        showStatus('编码成功 ✅', 'success');
      } catch(e) {
        showStatus('编码失败 ❌', 'error');
      }
    });

    container.querySelector('#b64Decode').addEventListener('click', function() {
      try {
        output.value = decodeURIComponent(escape(atob(input.value.trim())));
        showStatus('解码成功 ✅', 'success');
      } catch(e) {
        showStatus('解码失败：输入不是有效的 Base64 ❌', 'error');
      }
    });

    container.querySelector('#b64Copy').addEventListener('click', function() {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value).catch(() => {
        output.select(); document.execCommand('copy');
      });
      showStatus('已复制到剪贴板 📋', 'success');
    });
  }

  function renderJson(container) {
    container.innerHTML = `
      <div class="text-tool-label">JSON 内容</div>
      <textarea class="text-tool-area" id="jsonInput" placeholder='{"name": "suyu", "age": 14}'></textarea>
      <div class="text-tool-row">
        <button class="text-tool-btn primary" id="jsonFormat">格式化</button>
        <button class="text-tool-btn" id="jsonMinify">压缩</button>
        <button class="text-tool-btn" id="jsonCopy">复制</button>
        <button class="text-tool-btn" id="jsonClear">清空</button>
      </div>
      <div class="text-tool-label">结果</div>
      <textarea class="text-tool-area" id="jsonOutput" placeholder="结果会显示在这里..." readonly></textarea>
      <div class="text-tool-status" id="jsonStatus"></div>
    `;

    const input = container.querySelector('#jsonInput');
    const output = container.querySelector('#jsonOutput');
    const status = container.querySelector('#jsonStatus');

    function showStatus(msg, type) {
      status.textContent = msg;
      status.className = 'text-tool-status ' + type;
      setTimeout(() => { status.textContent = ''; status.className = 'text-tool-status'; }, 2000);
    }

    container.querySelector('#jsonFormat').addEventListener('click', function() {
      try {
        const obj = JSON.parse(input.value);
        output.value = JSON.stringify(obj, null, 2);
        showStatus('格式化成功 ✅', 'success');
      } catch(e) {
        showStatus('JSON 格式错误：' + e.message + ' ❌', 'error');
      }
    });

    container.querySelector('#jsonMinify').addEventListener('click', function() {
      try {
        const obj = JSON.parse(input.value);
        output.value = JSON.stringify(obj);
        showStatus('压缩成功 ✅', 'success');
      } catch(e) {
        showStatus('JSON 格式错误：' + e.message + ' ❌', 'error');
      }
    });

    container.querySelector('#jsonCopy').addEventListener('click', function() {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value).catch(() => {
        output.select(); document.execCommand('copy');
      });
      showStatus('已复制到剪贴板 📋', 'success');
    });

    container.querySelector('#jsonClear').addEventListener('click', function() {
      input.value = '';
      output.value = '';
    });
  }

  function renderColor(container) {
    container.innerHTML = `
      <div class="color-picker-row">
        <div class="color-preview" id="colorPreview" style="background: #6366f1;"></div>
        <div class="color-input-group">
          <label>HEX</label>
          <input type="text" id="colorHex" value="#6366f1">
        </div>
        <div class="color-input-group" style="flex:0.6;">
          <label>取色</label>
          <input type="color" id="colorNative" value="#6366f1" style="width:100%;height:36px;border:none;border-radius:8px;cursor:pointer;">
        </div>
      </div>
      <div class="color-values">
        <div class="color-value-item">
          <label>RGB</label>
          <span id="colorRgb">rgb(99, 102, 241)</span>
        </div>
        <div class="color-value-item">
          <label>HSL</label>
          <span id="colorHsl">hsl(239, 84%, 67%)</span>
        </div>
        <div class="color-value-item">
          <label>R</label>
          <span id="colorR">99</span>
        </div>
        <div class="color-value-item">
          <label>G</label>
          <span id="colorG">102</span>
        </div>
        <div class="color-value-item">
          <label>B</label>
          <span id="colorB">241</span>
        </div>
        <div class="color-value-item">
          <label>亮度</label>
          <span id="colorLum">67%</span>
        </div>
      </div>
    `;

    const preview = container.querySelector('#colorPreview');
    const hexInput = container.querySelector('#colorHex');
    const nativePicker = container.querySelector('#colorNative');

    nativePicker.addEventListener('input', function() {
      hexInput.value = this.value;
      updateFromHex(this.value);
    });

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) { h = s = 0; }
      else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function updateColor(hex) {
      if (!/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return;
      if (!hex.startsWith('#')) hex = '#' + hex;
      const { r, g, b } = hexToRgb(hex);
      const hsl = rgbToHsl(r, g, b);
      preview.style.background = hex;
      container.querySelector('#colorRgb').textContent = `rgb(${r}, ${g}, ${b})`;
      container.querySelector('#colorHsl').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      container.querySelector('#colorR').textContent = r;
      container.querySelector('#colorG').textContent = g;
      container.querySelector('#colorB').textContent = b;
      container.querySelector('#colorLum').textContent = hsl.l + '%';
    }

    hexInput.addEventListener('input', function() {
      updateColor(this.value);
    });
  }

  function renderBaseConv(container) {
    container.innerHTML = `
      <div class="baseconv-grid">
        <div class="baseconv-item">
          <label>十进制</label>
          <input type="text" id="bc10" value="255">
        </div>
        <div class="baseconv-item">
          <label>二进制</label>
          <input type="text" id="bc2">
        </div>
        <div class="baseconv-item">
          <label>八进制</label>
          <input type="text" id="bc8">
        </div>
        <div class="baseconv-item">
          <label>十六进制</label>
          <input type="text" id="bc16">
        </div>
      </div>
    `;

    const inputs = {
      2: container.querySelector('#bc2'),
      8: container.querySelector('#bc8'),
      10: container.querySelector('#bc10'),
      16: container.querySelector('#bc16')
    };

    function convert(fromBase, value) {
      value = value.trim();
      if (!value) {
        Object.values(inputs).forEach(i => { if (i !== inputs[fromBase]) i.value = ''; });
        return;
      }
      try {
        const dec = parseInt(value, fromBase);
        if (isNaN(dec)) throw new Error();
        for (const base in inputs) {
          if (parseInt(base) !== fromBase) {
            inputs[base].value = dec.toString(parseInt(base)).toUpperCase();
          }
        }
      } catch(e) {}
    }

    for (const base in inputs) {
      inputs[base].addEventListener('input', function() {
        convert(parseInt(base), this.value);
      });
    }

    convert(10, '255');
  }

  function renderPassword(container) {
    container.innerHTML = `
      <div class="password-output">
        <input type="text" id="pwOutput" readonly>
        <button class="password-copy" id="pwCopy">复制</button>
      </div>
      <div class="password-options">
        <div class="password-option">
          <label>密码长度</label>
          <input type="number" id="pwLen" value="16" min="4" max="64">
        </div>
        <div class="password-option">
          <label>大写字母 (A-Z)</label>
          <input type="checkbox" id="pwUpper" checked>
        </div>
        <div class="password-option">
          <label>小写字母 (a-z)</label>
          <input type="checkbox" id="pwLower" checked>
        </div>
        <div class="password-option">
          <label>数字 (0-9)</label>
          <input type="checkbox" id="pwNum" checked>
        </div>
        <div class="password-option">
          <label>特殊符号 (!@#$...)</label>
          <input type="checkbox" id="pwSym">
        </div>
      </div>
      <button class="password-generate" id="pwGen">生成密码</button>
    `;

    const output = container.querySelector('#pwOutput');

    function generate() {
      const len = parseInt(container.querySelector('#pwLen').value) || 16;
      const upper = container.querySelector('#pwUpper').checked;
      const lower = container.querySelector('#pwLower').checked;
      const num = container.querySelector('#pwNum').checked;
      const sym = container.querySelector('#pwSym').checked;

      let chars = '';
      if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (num) chars += '0123456789';
      if (sym) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

      let pw = '';
      const arr = new Uint32Array(len);
      crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) {
        pw += chars[arr[i] % chars.length];
      }
      output.value = pw;
    }

    container.querySelector('#pwGen').addEventListener('click', generate);
    container.querySelector('#pwCopy').addEventListener('click', function() {
      if (!output.value) return;
      navigator.clipboard.writeText(output.value).catch(() => {
        output.select(); document.execCommand('copy');
      });
      this.textContent = '已复制';
      setTimeout(() => this.textContent = '复制', 1500);
    });

    generate();
  }

  function renderQrcode(container) {
    container.innerHTML = `
      <div class="qrcode-input">
        <label>输入文字或链接</label>
        <textarea id="qrText" placeholder="https://su120315.github.io/SUYU/"></textarea>
      </div>
      <button class="qrcode-generate" id="qrGen">生成二维码</button>
      <div class="qrcode-output" id="qrOutput">
        <span style="color: var(--text-muted); font-size: 0.9rem;">点击上方按钮生成二维码</span>
      </div>
    `;

    const output = container.querySelector('#qrOutput');

    container.querySelector('#qrGen').addEventListener('click', function() {
      const text = container.querySelector('#qrText').value.trim();
      if (!text) { alert('请输入内容'); return; }
      output.innerHTML = '';
      const qrContainer = document.createElement('div');
      qrContainer.style.cssText = 'display:flex;justify-content:center;';
      output.appendChild(qrContainer);
      try {
        new QRCode(qrContainer, {
          text: text,
          width: 220,
          height: 220,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
        const dlBtn = document.createElement('button');
        dlBtn.className = 'text-tool-btn';
        dlBtn.style.marginTop = '12px';
        dlBtn.textContent = '⬇ 下载二维码';
        dlBtn.addEventListener('click', () => {
          const img = qrContainer.querySelector('img');
          if (img) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = img.src;
            link.click();
          }
        });
        output.appendChild(dlBtn);
      } catch(e) {
        output.innerHTML = '<span style="color:#ef4444;">生成失败，请重试</span>';
      }
    });
  }

  /* 打字速度测试 */
  function renderTyping(container) {
    const text = '君子曰：学不可以已。青，取之于蓝，而青于蓝；冰，水为之，而寒于水。木直中绳，輮以为轮，其曲中规。虽有槁暴，不复挺者，輮使之然也。故木受绳则直，金就砺则利，君子博学而日参省乎己，则知明而行无过矣。吾尝终日而思矣，不如须臾之所学也；吾尝跂而望矣，不如登高之博见也。';

    container.innerHTML = `
      <div class="typing-container">
        <div class="typing-source" id="typingSource">${text.split('').map(function(c) {
          if (c === '\n') return '<br>';
          return '<span class="typing-char">' + c + '</span>';
        }).join('')}</div>
        <div class="typing-stats">
          <div class="typing-stat">
            <div class="typing-stat-value" id="typingTime">0s</div>
            <div class="typing-stat-label">已用时间</div>
          </div>
          <div class="typing-stat">
            <div class="typing-stat-value" id="typingSpeed">0</div>
            <div class="typing-stat-label">字/分钟</div>
          </div>
          <div class="typing-stat">
            <div class="typing-stat-value" id="typingAccuracy">100%</div>
            <div class="typing-stat-label">准确率</div>
          </div>
          <div class="typing-stat">
            <div class="typing-stat-value" id="typingProgress">0/${text.length}</div>
            <div class="typing-stat-label">进度</div>
          </div>
        </div>
        <textarea class="typing-input" id="typingInput" placeholder="在此处打字对照输入..." disabled></textarea>
        <div class="typing-actions">
          <button class="typing-btn primary" id="typingStart">开始</button>
          <button class="typing-btn secondary" id="typingReset">重置</button>
        </div>
      </div>
    `;

    var chars = container.querySelectorAll('.typing-char');
    var inputEl = container.querySelector('#typingInput');
    var startBtn = container.querySelector('#typingStart');
    var resetBtn = container.querySelector('#typingReset');
    var timeEl = container.querySelector('#typingTime');
    var speedEl = container.querySelector('#typingSpeed');
    var accuracyEl = container.querySelector('#typingAccuracy');
    var progressEl = container.querySelector('#typingProgress');

    var started = false;
    var finished = false;
    var startTime = 0;
    var timerInterval = null;
    var currentIndex = 0;
    var totalCorrect = 0;
    var totalWrong = 0;

    /* 更新统计 */
    function updateStats() {
      if (!started || finished) return;
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      timeEl.textContent = elapsed + 's';
      var minutes = elapsed / 60;
      if (minutes > 0) {
        speedEl.textContent = Math.round(currentIndex / minutes);
      }
      var total = totalCorrect + totalWrong;
      if (total > 0) {
        accuracyEl.textContent = Math.round(totalCorrect / total * 100) + '%';
      }
      progressEl.textContent = currentIndex + '/' + text.length;
    }

    /* 停止计时 */
    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    /* 重置状态 */
    function resetAll() {
      stopTimer();
      started = false;
      finished = false;
      currentIndex = 0;
      totalCorrect = 0;
      totalWrong = 0;
      inputEl.value = '';
      inputEl.disabled = true;
      startBtn.textContent = '开始';
      timeEl.textContent = '0s';
      speedEl.textContent = '0';
      accuracyEl.textContent = '100%';
      progressEl.textContent = '0/' + text.length;
      chars.forEach(function(c) {
        c.className = 'typing-char';
      });
      if (chars.length > 0) {
        chars[0].classList.add('current');
      }
    }

    /* 检查输入 */
    function checkInput() {
      if (finished) return;
      var val = inputEl.value;
      var len = val.length;
      /* 限制不能超过原文长度 */
      if (len > text.length) {
        inputEl.value = val.substring(0, text.length);
        len = text.length;
      }

      var correct = 0;
      var wrong = 0;

      for (var i = 0; i < chars.length; i++) {
        chars[i].classList.remove('correct', 'wrong', 'current');
      }

      for (var i = 0; i < len; i++) {
        if (val[i] === text[i]) {
          chars[i].classList.add('correct');
          correct++;
        } else {
          chars[i].classList.add('wrong');
          wrong++;
        }
      }

      if (len < chars.length) {
        chars[len].classList.add('current');
      }

      currentIndex = len;
      totalCorrect = correct;
      totalWrong = wrong;

      /* 判断是否完成 */
      if (len >= text.length) {
        finished = true;
        stopTimer();
        inputEl.disabled = true;
        startBtn.textContent = '完成 ✓';
        /* 最终统计 */
        var elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed > 0) {
          speedEl.textContent = Math.round(text.length / (elapsed / 60));
        }
        var total = totalCorrect + totalWrong;
        if (total > 0) {
          accuracyEl.textContent = Math.round(totalCorrect / total * 100) + '%';
        }
        timeEl.textContent = elapsed + 's';
        progressEl.textContent = text.length + '/' + text.length;
      }

      updateStats();
    }

    startBtn.addEventListener('click', function() {
      if (finished) {
        resetAll();
        return;
      }
      if (!started) {
        started = true;
        inputEl.disabled = false;
        inputEl.focus();
        startBtn.textContent = '进行中...';
        startTime = Date.now();
        timerInterval = setInterval(updateStats, 500);
      }
    });

    resetBtn.addEventListener('click', resetAll);

    inputEl.addEventListener('input', checkInput);

    /* 初始化高亮第一个字符 */
    if (chars.length > 0) {
      chars[0].classList.add('current');
    }
  }

  /* 随机名言 */
  function renderQuote(container) {
    var quotes = [
      { text: '学而不思则罔，思而不学则殆。', source: '《论语·为政》' },
      { text: '千里之行，始于足下。', source: '《老子·第六十四章》' },
      { text: '天行健，君子以自强不息。', source: '《周易·乾卦》' },
      { text: '己所不欲，勿施于人。', source: '《论语·颜渊》' },
      { text: '知之为知之，不知为不知，是知也。', source: '《论语·为政》' },
      { text: '业精于勤，荒于嬉；行成于思，毁于随。', source: '韩愈《进学解》' },
      { text: '路漫漫其修远兮，吾将上下而求索。', source: '屈原《离骚》' },
      { text: '人生自古谁无死，留取丹心照汗青。', source: '文天祥《过零丁洋》' },
      { text: '天生我材必有用，千金散尽还复来。', source: '李白《将进酒》' },
      { text: '纸上得来终觉浅，绝知此事要躬行。', source: '陆游《冬夜读书示子聿》' },
      { text: '海内存知己，天涯若比邻。', source: '王勃《送杜少府之任蜀州》' },
      { text: '大鹏一日同风起，扶摇直上九万里。', source: '李白《上李邕》' },
      { text: '山重水复疑无路，柳暗花明又一村。', source: '陆游《游山西村》' },
      { text: '不畏浮云遮望眼，自缘身在最高层。', source: '王安石《登飞来峰》' },
      { text: '宝剑锋从磨砺出，梅花香自苦寒来。', source: '《警世贤文》' },
      { text: '书到用时方恨少，事非经过不知难。', source: '《增广贤文》' },
      { text: '有志者，事竟成。', source: '《后汉书·耿弇传》' },
      { text: '勿以恶小而为之，勿以善小而不为。', source: '《三国志·蜀书·先主传》' },
      { text: '三人行，必有我师焉。', source: '《论语·述而》' },
      { text: '温故而知新，可以为师矣。', source: '《论语·为政》' },
      { text: '博学之，审问之，慎思之，明辨之，笃行之。', source: '《中庸·第二十章》' },
      { text: '长风破浪会有时，直挂云帆济沧海。', source: '李白《行路难》' }
    ];

    container.innerHTML = `
      <div class="quote-container">
        <div class="quote-display" id="quoteDisplay">
          <div class="quote-text" id="quoteText">点击下方按钮随机获取名言</div>
          <div class="quote-source" id="quoteSource"></div>
        </div>
        <button class="quote-btn" id="quoteBtn">
          <i data-lucide="shuffle"></i>
          随机显示
        </button>
      </div>
    `;

    var quoteText = container.querySelector('#quoteText');
    var quoteSource = container.querySelector('#quoteSource');
    var quoteDisplay = container.querySelector('#quoteDisplay');

    container.querySelector('#quoteBtn').addEventListener('click', function() {
      var idx = Math.floor(Math.random() * quotes.length);
      var q = quotes[idx];
      quoteText.textContent = q.text;
      quoteSource.textContent = '—— ' + q.source;

      /* 淡入动画 */
      quoteDisplay.classList.remove('quote-fade-in');
      /* 触发回流以重新播放动画 */
      void quoteDisplay.offsetWidth;
      quoteDisplay.classList.add('quote-fade-in');
    });
  }

  /* ==================== UTF-8 编码转换工具 ==================== */
  function renderEncoding(modalBody) {
    modalBody.innerHTML = '';
    modalBody.className = 'modal-body enc-container';

    // --- 编码表 ---
    var ENCODINGS = [
      ['auto', '自动识别'],
      ['utf-8', 'UTF-8'],
      ['utf-16le', 'UTF-16 LE'],
      ['utf-16be', 'UTF-16 BE'],
      ['gb18030', 'GB18030 / GBK / GB2312'],
      ['big5', 'Big5'],
      ['shift_jis', 'Shift-JIS'],
      ['euc-jp', 'EUC-JP'],
      ['euc-kr', 'EUC-KR'],
      ['windows-1252', 'Windows-1252'],
      ['iso-8859-1', 'ISO-8859-1']
    ];

    var ALIASES = {
      'gbk': 'gb18030', 'gb2312': 'gb18030', 'cp936': 'gb18030',
      'ansi': 'windows-1252', 'latin1': 'iso-8859-1', 'latin-1': 'iso-8859-1',
      'sjis': 'shift_jis', 'shift-jis': 'shift_jis',
      'utf16le': 'utf-16le', 'utf16be': 'utf-16be', 'utf8': 'utf-8'
    };

    var files = [];
    var fileIdCounter = 0;

    // --- 工具函数 ---
    function normalizeEncoding(enc) {
      if (!enc || enc === 'auto') return null;
      var lower = enc.toLowerCase().replace(/[^a-z0-9]/g, '');
      var alias = ALIASES[lower];
      return alias || lower;
    }

    function detectBom(bytes) {
      if (bytes.length >= 4 && bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 0xFE && bytes[3] === 0xFF) return 'utf-32be';
      if (bytes.length >= 4 && bytes[0] === 0xFF && bytes[1] === 0xFE && bytes[2] === 0 && bytes[3] === 0) return 'utf-32le';
      if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) return 'utf-16be';
      if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) return 'utf-16le';
      if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) return 'utf-8';
      return null;
    }

    // TextDecoder wrapper with iconv-lite-like fallback for GB/Big5/Shift-JIS
    function decodeBytes(bytes, enc) {
      if (!enc || enc === 'utf-8') {
        // Try UTF-8 first
        try {
          return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        } catch(e) {
          return null;
        }
      }
      if (enc === 'utf-16le' || enc === 'utf-16be') {
        try {
          return new TextDecoder(enc, { fatal: true }).decode(bytes);
        } catch(e) {
          return null;
        }
      }
      // For CJK encodings, use a simple byte-table approach
      // Try the encoding directly
      try {
        var dec = new TextDecoder(enc, { fatal: false });
        var result = dec.decode(bytes);
        // Check if result has too many replacement characters
        var repCount = (result.match(/\uFFFD/g) || []).length;
        if (repCount > bytes.length * 0.3) return null;
        return result;
      } catch(e) {
        return null;
      }
    }

    function decodeWith(bytes, enc) {
      if (enc === 'auto' || !enc) {
        // Auto-detect
        var bom = detectBom(bytes);
        if (bom) {
          var bomLen = bom === 'utf-8' ? 3 : (bom === 'utf-16le' || bom === 'utf-16be' ? 2 : 4);
          var result = decodeBytes(bytes.slice(bomLen), bom);
          if (result !== null) return { text: result, encoding: bom, bom: true };
        }
        // Try UTF-8
        var r = decodeBytes(bytes, 'utf-8');
        if (r !== null) return { text: r, encoding: 'utf-8', bom: false };
        // Try GB18030
        r = decodeBytes(bytes, 'gb18030');
        if (r !== null) return { text: r, encoding: 'gb18030', bom: false };
        // Try Big5
        r = decodeBytes(bytes, 'big5');
        if (r !== null) return { text: r, encoding: 'big5', bom: false };
        // Try Shift-JIS
        r = decodeBytes(bytes, 'shift_jis');
        if (r !== null) return { text: r, encoding: 'shift_jis', bom: false };
        // Try UTF-16
        r = decodeBytes(bytes, 'utf-16le');
        if (r !== null) return { text: r, encoding: 'utf-16le', bom: false };
        // Fallback: latin-1 (never fails)
        r = decodeBytes(bytes, 'iso-8859-1');
        return { text: r || '', encoding: 'iso-8859-1', bom: false };
      }
      var r = decodeBytes(bytes, enc);
      if (r !== null) return { text: r, encoding: enc, bom: false };
      return { text: '', encoding: enc, bom: false, error: '解码失败' };
    }

    function scoreText(text) {
      if (!text || text.length === 0) return 0;
      var score = 0;
      var total = text.length;
      var replacementCount = 0;
      var cjkCount = 0;
      var controlCount = 0;
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        if (code === 0xFFFD) replacementCount++;
        else if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF) || (code >= 0x20000 && code <= 0x2A6DF)) cjkCount++;
        else if (code < 0x20 && code !== 0x09 && code !== 0x0A && code !== 0x0D) controlCount++;
      }
      score += (total - replacementCount) / total * 60;
      score += cjkCount / total * 30;
      score -= controlCount / total * 50;
      return Math.max(0, Math.min(100, score));
    }

    function isProbablyBinary(bytes) {
      var control = 0;
      var limit = Math.min(bytes.length, 512);
      for (var i = 0; i < limit; i++) {
        var b = bytes[i];
        if (b === 0 || (b < 8) || (b > 13 && b < 32)) control++;
      }
      return control > limit * 0.3;
    }

    function encodeUtf8(text, addBom) {
      var encoder = new TextEncoder();
      var encoded = encoder.encode(text);
      if (addBom) {
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        var result = new Uint8Array(bom.length + encoded.length);
        result.set(bom);
        result.set(encoded, bom.length);
        return result;
      }
      return encoded;
    }

    function buildOutputName(originalName) {
      var lastDot = originalName.lastIndexOf('.');
      var name = lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
      return name + '_utf8.txt';
    }

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(2) + ' MB';
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    function crc32(data) {
      var table = crc32.table || (crc32.table = makeCrcTable());
      var crc = 0xFFFFFFFF;
      for (var i = 0; i < data.length; i++) {
        crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
      }
      return (crc ^ 0xFFFFFFFF) >>> 0;
    }

    function makeCrcTable() {
      var table = new Uint32Array(256);
      for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) {
          c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c;
      }
      return table;
    }

    function dosTime(date) {
      return (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
    }

    function dosDate(date) {
      return ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    }

    // --- Simple ZIP generation (store method, no compression) ---
    function makeZip(entries) {
      // entries: [{name, data: Uint8Array}]
      var localHeaders = [];
      var centralHeaders = [];
      var offset = 0;
      var outChunks = [];

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var nameBytes = new TextEncoder().encode(entry.name);
        var crc = crc32(entry.data);
        var compSize = entry.data.length;
        var uncompSize = entry.data.length;
        var now = new Date();

        // Local file header
        var local = new Uint8Array(30 + nameBytes.length);
        local.set([0x50, 0x4B, 0x03, 0x04], 0); // signature
        local[4] = 20; local[5] = 0;  // version needed
        local[6] = 0; local[7] = 0;   // flags
        local[8] = 0; local[9] = 0;   // compression: store
        local[10] = dosTime(now) & 0xFF; local[11] = (dosTime(now) >> 8) & 0xFF;
        local[12] = dosDate(now) & 0xFF; local[13] = (dosDate(now) >> 8) & 0xFF;
        local[14] = crc & 0xFF; local[15] = (crc >> 8) & 0xFF;
        local[16] = (crc >> 16) & 0xFF; local[17] = (crc >> 24) & 0xFF;
        local[18] = compSize & 0xFF; local[19] = (compSize >> 8) & 0xFF;
        local[20] = (compSize >> 16) & 0xFF; local[21] = (compSize >> 24) & 0xFF;
        local[22] = uncompSize & 0xFF; local[23] = (uncompSize >> 8) & 0xFF;
        local[24] = (uncompSize >> 16) & 0xFF; local[25] = (uncompSize >> 24) & 0xFF;
        local[26] = nameBytes.length & 0xFF; local[27] = (nameBytes.length >> 8) & 0xFF;
        local.set(nameBytes, 30);

        outChunks.push(local);
        outChunks.push(entry.data);

        // Central directory header
        var central = new Uint8Array(46 + nameBytes.length);
        central.set([0x50, 0x4B, 0x01, 0x02], 0);
        central[4] = 20; central[5] = 0;  // version made by
        central[6] = 20; central[7] = 0;  // version needed
        central[8] = 0; central[9] = 0;   // flags
        central[10] = 0; central[11] = 0;  // compression: store
        central[12] = dosTime(now) & 0xFF; central[13] = (dosTime(now) >> 8) & 0xFF;
        central[14] = dosDate(now) & 0xFF; central[15] = (dosDate(now) >> 8) & 0xFF;
        central[16] = crc & 0xFF; central[17] = (crc >> 8) & 0xFF;
        central[18] = (crc >> 16) & 0xFF; central[19] = (crc >> 24) & 0xFF;
        central[20] = compSize & 0xFF; central[21] = (compSize >> 8) & 0xFF;
        central[22] = (compSize >> 16) & 0xFF; central[23] = (compSize >> 24) & 0xFF;
        central[24] = uncompSize & 0xFF; central[25] = (uncompSize >> 8) & 0xFF;
        central[26] = (uncompSize >> 16) & 0xFF; central[27] = (uncompSize >> 24) & 0xFF;
        central[28] = nameBytes.length & 0xFF; central[29] = (nameBytes.length >> 8) & 0xFF;
        central[30] = 0; central[31] = 0; // extra field length
        central[32] = 0; central[33] = 0; // file comment length
        central[34] = 0; central[35] = 0; // disk number start
        central[36] = 0; central[37] = 0; // internal attrs
        central[38] = 0; central[39] = 0; central[40] = 0; central[41] = 0; // external attrs
        central[42] = offset & 0xFF; central[43] = (offset >> 8) & 0xFF;
        central[44] = (offset >> 16) & 0xFF; central[45] = (offset >> 24) & 0xFF;
        central.set(nameBytes, 46);

        centralHeaders.push(central);
        offset += local.length + entry.data.length;
      }

      // End of central directory record
      var totalEntries = entries.length;
      var centralOffset = offset;
      var centralSize = 0;
      for (var i = 0; i < centralHeaders.length; i++) {
        centralSize += centralHeaders[i].length;
      }

      var eocd = new Uint8Array(22);
      eocd.set([0x50, 0x4B, 0x05, 0x06], 0);
      eocd[4] = 0; eocd[5] = 0; // disk number
      eocd[6] = 0; eocd[7] = 0; // disk with central
      eocd[8] = totalEntries & 0xFF; eocd[9] = (totalEntries >> 8) & 0xFF; // entries on disk
      eocd[10] = totalEntries & 0xFF; eocd[11] = (totalEntries >> 8) & 0xFF; // total entries
      eocd[12] = centralSize & 0xFF; eocd[13] = (centralSize >> 8) & 0xFF;
      eocd[14] = (centralSize >> 16) & 0xFF; eocd[15] = (centralSize >> 24) & 0xFF;
      eocd[16] = centralOffset & 0xFF; eocd[17] = (centralOffset >> 8) & 0xFF;
      eocd[18] = (centralOffset >> 16) & 0xFF; eocd[19] = (centralOffset >> 24) & 0xFF;
      eocd[20] = 0; eocd[21] = 0; // comment length

      // Concatenate all
      var totalLength = offset + centralSize + 22;
      var zip = new Uint8Array(totalLength);
      var pos = 0;
      for (var i = 0; i < outChunks.length; i++) {
        zip.set(outChunks[i], pos);
        pos += outChunks[i].length;
      }
      for (var i = 0; i < centralHeaders.length; i++) {
        zip.set(centralHeaders[i], pos);
        pos += centralHeaders[i].length;
      }
      zip.set(eocd, pos);

      return zip;
    }

    function downloadBlob(data, filename, mime) {
      var blob = new Blob([data], { type: mime || 'application/octet-stream' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
    }

    // --- Toast ---
    function showToast(message, type) {
      var toast = document.createElement('div');
      toast.className = 'enc-toast';
      if (type === 'error') toast.style.borderLeftColor = '#ef4444';
      else if (type === 'warning') toast.style.borderLeftColor = '#f59e0b';
      else toast.style.borderLeftColor = '#22c55e';
      toast.textContent = message;
      var container = modalBody.querySelector('.enc-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'enc-toast-container';
        modalBody.appendChild(container);
      }
      container.appendChild(toast);
      setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
      }, 3000);
    }

    // --- Render UI ---
    function render() {
      modalBody.innerHTML = '';
      modalBody.className = 'modal-body enc-container';

      // Stats
      var stats = document.createElement('div');
      stats.className = 'enc-stats';
      stats.id = 'encStats';
      stats.innerHTML = '<span>已处理: <strong id="encCount">0</strong></span><span class="enc-stats-sep">|</span><span>总大小: <strong id="encSize">0 B</strong></span><span class="enc-stats-sep">|</span><span>警告: <strong id="encWarnings">0</strong></span>';
      modalBody.appendChild(stats);

      // Controls
      var controls = document.createElement('div');
      controls.className = 'enc-controls';

      var encLabel = document.createElement('label');
      encLabel.className = 'enc-label';
      encLabel.textContent = '源编码:';
      controls.appendChild(encLabel);

      var select = document.createElement('select');
      select.className = 'enc-select';
      select.id = 'encSelect';
      for (var i = 0; i < ENCODINGS.length; i++) {
        var opt = document.createElement('option');
        opt.value = ENCODINGS[i][0];
        opt.textContent = ENCODINGS[i][1];
        select.appendChild(opt);
      }
      controls.appendChild(select);

      var bomLabel = document.createElement('label');
      bomLabel.className = 'enc-bom-label';
      var bomCheck = document.createElement('input');
      bomCheck.type = 'checkbox';
      bomCheck.id = 'encBom';
      bomCheck.className = 'enc-bom-check';
      bomLabel.appendChild(bomCheck);
      bomLabel.appendChild(document.createTextNode(' 输出 UTF-8 BOM'));
      controls.appendChild(bomLabel);

      var clearBtn = document.createElement('button');
      clearBtn.className = 'enc-btn secondary';
      clearBtn.textContent = '清空';
      clearBtn.style.marginLeft = 'auto';
      clearBtn.addEventListener('click', function() {
        files = [];
        renderTable();
        updateStats();
      });
      controls.appendChild(clearBtn);

      modalBody.appendChild(controls);

      // Drop zone
      var dropzone = document.createElement('div');
      dropzone.className = 'enc-dropzone';
      dropzone.id = 'encDropzone';
      dropzone.innerHTML = '<div class="enc-dropzone-content"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p>拖拽文件到此处，或 <strong>点击选择文件</strong></p><p class="enc-dropzone-hint">支持 .txt .csv .json .xml .html .js .css .md 等文本文件</p></div>';
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
      fileInput.accept = '.txt,.csv,.json,.xml,.html,.htm,.js,.ts,.jsx,.tsx,.css,.scss,.less,.md,.yml,.yaml,.log,.ini,.cfg,.conf,.bat,.sh,.ps1,.sql,.php,.py,.java,.c,.cpp,.h,.hpp,.rb,.go,.rs,.swift,.kt,.gradle,.properties,.env,.gitignore,.dockerfile,.vue,.svelte,.astro,.svg';
      fileInput.style.display = 'none';
      fileInput.id = 'encFileInput';
      dropzone.appendChild(fileInput);

      dropzone.addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') fileInput.click();
      });

      dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('enc-dragover');
      });

      dropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('enc-dragover');
      });

      dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('enc-dragover');
        if (e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files);
        }
      });

      fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
          handleFiles(this.files);
          this.value = '';
        }
      });

      modalBody.appendChild(dropzone);

      // Action buttons
      var actions = document.createElement('div');
      actions.className = 'enc-actions';

      var zipBtn = document.createElement('button');
      zipBtn.className = 'enc-btn primary';
      zipBtn.id = 'encZipBtn';
      zipBtn.textContent = '下载全部 ZIP';
      zipBtn.addEventListener('click', downloadAllZip);
      actions.appendChild(zipBtn);

      var reportBtn = document.createElement('button');
      reportBtn.className = 'enc-btn secondary';
      reportBtn.textContent = '复制报告';
      reportBtn.addEventListener('click', copyReport);
      actions.appendChild(reportBtn);

      modalBody.appendChild(actions);

      // Table
      var tableWrap = document.createElement('div');
      tableWrap.className = 'enc-table-wrap';
      var table = document.createElement('table');
      table.className = 'enc-table';
      table.id = 'encTable';
      var thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>文件名</th><th>大小</th><th>识别编码</th><th>状态</th><th>操作</th></tr>';
      table.appendChild(thead);
      var tbody = document.createElement('tbody');
      tbody.id = 'encTbody';
      table.appendChild(tbody);
      tableWrap.appendChild(table);
      modalBody.appendChild(tableWrap);

      // Preview area
      var preview = document.createElement('div');
      preview.className = 'enc-preview';
      preview.id = 'encPreview';
      preview.style.display = 'none';
      var previewHeader = document.createElement('div');
      previewHeader.className = 'enc-preview-header';
      var previewTitle = document.createElement('span');
      previewTitle.className = 'enc-preview-title';
      previewTitle.id = 'encPreviewTitle';
      previewHeader.appendChild(previewTitle);
      var previewClose = document.createElement('button');
      previewClose.className = 'enc-preview-close';
      previewClose.innerHTML = '✕';
      previewClose.addEventListener('click', function() { preview.style.display = 'none'; });
      previewHeader.appendChild(previewClose);
      preview.appendChild(previewHeader);
      var previewBody = document.createElement('div');
      previewBody.className = 'enc-preview-body';
      previewBody.id = 'encPreviewBody';
      preview.appendChild(previewBody);
      modalBody.appendChild(preview);

      // Toast container (appended last)
      var toastContainer = document.createElement('div');
      toastContainer.className = 'enc-toast-container';
      modalBody.appendChild(toastContainer);

      updateStats();
    }

    // --- Handle Files ---
    function handleFiles(fileList) {
      var pending = [];
      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        // Dedup by name
        var exists = false;
        for (var j = 0; j < files.length; j++) {
          if (files[j].name === file.name) { exists = true; break; }
        }
        if (exists) {
          showToast('跳过重复文件: ' + file.name, 'warning');
          continue;
        }
        pending.push(file);
      }

      pending.forEach(function(file) {
        var reader = new FileReader();
        var myId = fileIdCounter++;
        var entry = { id: myId, name: file.name, size: file.size, file: file, status: '处理中...', encoding: '-', error: null, data: null, text: null };
        files.push(entry);
        renderTable();
        updateStats();

        reader.onload = function(e) {
          var bytes = new Uint8Array(e.target.result);
          if (isProbablyBinary(bytes)) {
            entry.status = '跳过 (二进制)';
            entry.error = 'binary';
            renderTable();
            updateStats();
            return;
          }

          var enc = document.getElementById('encSelect').value;
          var result = decodeWith(bytes, enc);
          entry.data = bytes;
          entry.text = result.text;
          entry.encoding = result.encoding;
          if (result.error) {
            entry.status = '失败';
            entry.error = result.error;
          } else {
            entry.status = '就绪 ✓';
          }
          renderTable();
          updateStats();
        };
        reader.onerror = function() {
          entry.status = '读取失败';
          entry.error = 'read_error';
          renderTable();
          updateStats();
        };
        reader.readAsArrayBuffer(file);
      });

      if (pending.length > 0) {
        showToast('已添加 ' + pending.length + ' 个文件', 'success');
      }
    }

    // --- Render Table ---
    function renderTable() {
      var tbody = document.getElementById('encTbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      files.forEach(function(entry) {
        var tr = document.createElement('tr');
        tr.dataset.id = entry.id;

        // Name
        var tdName = document.createElement('td');
        tdName.className = 'enc-td-name';
        tdName.textContent = entry.name;
        tr.appendChild(tdName);

        // Size
        var tdSize = document.createElement('td');
        tdSize.textContent = formatBytes(entry.size);
        tr.appendChild(tdSize);

        // Encoding
        var tdEnc = document.createElement('td');
        tdEnc.textContent = entry.encoding || '-';
        tr.appendChild(tdEnc);

        // Status
        var tdStatus = document.createElement('td');
        tdStatus.className = entry.status === '就绪 ✓' ? 'enc-status-ok' : (entry.status === '跳过 (二进制)' ? 'enc-status-skip' : 'enc-status-err');
        tdStatus.textContent = entry.status;
        tr.appendChild(tdStatus);

        // Actions
        var tdActions = document.createElement('td');

        if (entry.status === '就绪 ✓' && entry.text !== null) {
          // Preview button
          var previewBtn = document.createElement('button');
          previewBtn.className = 'enc-btn small';
          previewBtn.textContent = '预览';
          previewBtn.addEventListener('click', function() {
            previewText(entry);
          });
          tdActions.appendChild(previewBtn);

          // Download button
          var dlBtn = document.createElement('button');
          dlBtn.className = 'enc-btn small secondary';
          dlBtn.textContent = '下载';
          dlBtn.style.marginLeft = '6px';
          dlBtn.addEventListener('click', function() {
            var addBom = document.getElementById('encBom').checked;
            var utf8Bytes = encodeUtf8(entry.text, addBom);
            var outName = buildOutputName(entry.name);
            downloadBlob(utf8Bytes, outName, 'text/plain;charset=utf-8');
            showToast('已下载: ' + outName, 'success');
          });
          tdActions.appendChild(dlBtn);
        }

        // Delete button
        var delBtn = document.createElement('button');
        delBtn.className = 'enc-btn small danger';
        delBtn.textContent = '✕';
        delBtn.style.marginLeft = '6px';
        delBtn.addEventListener('click', function() {
          var idx = -1;
          for (var i = 0; i < files.length; i++) {
            if (files[i].id === entry.id) { idx = i; break; }
          }
          if (idx >= 0) {
            files.splice(idx, 1);
            renderTable();
            updateStats();
          }
        });
        tdActions.appendChild(delBtn);

        tr.appendChild(tdActions);
        tbody.appendChild(tr);
      });
    }

    // --- Update Stats ---
    function updateStats() {
      var countEl = document.getElementById('encCount');
      var sizeEl = document.getElementById('encSize');
      var warnEl = document.getElementById('encWarnings');
      if (!countEl) return;

      var totalSize = 0;
      var warnings = 0;
      var ready = 0;
      files.forEach(function(f) {
        totalSize += f.size;
        if (f.status === '就绪 ✓') ready++;
        if (f.error) warnings++;
      });
      countEl.textContent = ready + '/' + files.length;
      sizeEl.textContent = formatBytes(totalSize);
      warnEl.textContent = warnings;

      var zipBtn = document.getElementById('encZipBtn');
      if (zipBtn) {
        zipBtn.disabled = ready === 0;
        zipBtn.style.opacity = ready === 0 ? '0.5' : '1';
        zipBtn.style.cursor = ready === 0 ? 'not-allowed' : 'pointer';
      }
    }

    // --- Preview Text ---
    function previewText(entry) {
      var preview = document.getElementById('encPreview');
      var title = document.getElementById('encPreviewTitle');
      var body = document.getElementById('encPreviewBody');
      if (!preview || !title || !body) return;
      title.textContent = entry.name + ' (' + entry.encoding + ')';
      body.textContent = entry.text;
      preview.style.display = 'block';
    }

    // --- Download All ZIP ---
    function downloadAllZip() {
      var readyFiles = [];
      for (var i = 0; i < files.length; i++) {
        if (files[i].status === '就绪 ✓' && files[i].text !== null) {
          readyFiles.push(files[i]);
        }
      }
      if (readyFiles.length === 0) {
        showToast('没有可下载的文件', 'error');
        return;
      }

      var addBom = document.getElementById('encBom').checked;
      var entries = [];
      for (var i = 0; i < readyFiles.length; i++) {
        var entry = readyFiles[i];
        var utf8Bytes = encodeUtf8(entry.text, addBom);
        var outName = buildOutputName(entry.name);
        entries.push({ name: outName, data: utf8Bytes });
      }

      var zipData = makeZip(entries);
      downloadBlob(zipData, 'converted_utf8.zip', 'application/zip');
      showToast('已下载 ' + entries.length + ' 个文件 (ZIP)', 'success');
    }

    // --- Copy Report ---
    function copyReport() {
      if (files.length === 0) {
        showToast('没有文件', 'error');
        return;
      }
      var lines = ['编码转换报告', '============', '', '文件名 | 大小 | 识别编码 | 状态', '---|---|---|---'];
      files.forEach(function(f) {
        lines.push(f.name + ' | ' + formatBytes(f.size) + ' | ' + (f.encoding || '-') + ' | ' + f.status);
      });
      lines.push('', '---');
      lines.push('总计: ' + files.length + ' 个文件');

      navigator.clipboard.writeText(lines.join('\n')).then(function() {
        showToast('报告已复制到剪贴板', 'success');
      }).catch(function() {
        showToast('复制失败', 'error');
      });
    }

    // Initialize
    render();
  }
}

// ============================================================
// XTC校验码计算器 (来源: https://github.com/OnesoftQwQ/XTCADBCode-Web)
// ============================================================
function renderXtc(container) {
  container.innerHTML = `
    <div class="xtc-container">
      <div class="xtc-header">
        <p>输入校验码后，点击计算即可获取校验码</p>
      </div>
      <div class="xtc-input-group">
        <label class="xtc-label">输入校验码：</label>
        <input type="text" id="xtcCodeInput" class="xtc-input" placeholder="请输入校验码..." maxlength="20">
      </div>
      <div class="xtc-mode-selector">
        <button type="button" class="xtc-mode-btn active" data-mode="adb">ADB</button>
        <button type="button" class="xtc-mode-btn" data-mode="zj">自检</button>
      </div>
      <button type="button" class="xtc-calc-btn" id="xtcCalcBtn">计算</button>
      <div id="xtcResult" class="xtc-result hidden">
        <div class="xtc-result-title"></div>
        <div class="xtc-result-value"></div>
      </div>
      <div class="xtc-tips">
        <h4>提示</h4>
        <p>如果你的手表在输入校验码后提示"验证中"，代表你的手表已经升级到V3版本校验码，V3校验码当前除了小天才官方外无法计算，请使用QMMI打开ADB。</p>
        <p>请勿在群里问"为什么提示验证中"！</p>
      </div>
      <div class="xtc-footer">
        <a href="https://github.com/OnesoftQwQ/XTCADBCode-Web" target="_blank" rel="noopener">源码: OnesoftQwQ/XTCADBCode-Web (GitHub)</a>
      </div>
    </div>
  `;

  const input = container.querySelector('#xtcCodeInput');
  const calcBtn = container.querySelector('#xtcCalcBtn');
  const resultDiv = container.querySelector('#xtcResult');
  const resultTitle = resultDiv.querySelector('.xtc-result-title');
  const resultValue = resultDiv.querySelector('.xtc-result-value');
  const modeBtns = container.querySelectorAll('.xtc-mode-btn');
  let currentMode = 'adb';

  // Mode switching
  modeBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      modeBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
    });
  });

  // Enter key support
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcBtn.click();
  });

  calcBtn.addEventListener('click', function() {
    const code = input.value.trim();
    if (!code) {
      showXtcError('请输入校验码');
      return;
    }
    if (!/^\d+$/.test(code)) {
      showXtcError('校验码必须为数字');
      return;
    }
    const result = getXtcCode(code, currentMode);
    if (result === '') {
      showXtcError('计算失败，请检查输入格式');
    } else {
      showXtcSuccess(result);
    }
  });

  function showXtcError(msg) {
    resultDiv.className = 'xtc-result xtc-result-error';
    resultTitle.textContent = '错误';
    resultValue.textContent = msg;
    resultDiv.classList.remove('hidden');
  }

  function showXtcSuccess(val) {
    resultDiv.className = 'xtc-result xtc-result-success';
    resultTitle.textContent = '计算结果';
    resultValue.textContent = val;
    resultDiv.classList.remove('hidden');
  }
}

// XTC校验码计算核心算法 (移植自 OnesoftQwQ/XTCADBCode-Web)
function getXtcCode(code, mode) {
  if (code.length === 8) {
    var result = null;
    while (true) {
      result = v2(code, mode);
      if (result != null && result != code) break;
    }
    return result;
  } else {
    return v1(code, mode);
  }
}

function v1(code, mode) {
  try {
    if (mode === 'adb') {
      var i1 = parseInt(code.substring(0, 2));
      var i2 = parseInt(code.substring(2, 4));
      var i3 = parseInt(code.substring(4, 6));
      var i4 = parseInt(code.substring(6, 8));
      var i5 = parseInt(code.substring(8));
      var i6 = i5 ^ (i3 + i4);
      var i7 = i4 ^ i6;
      var i8 = i3 ^ i6;
      var i9 = i1 ^ i6;
      var i10 = i2 ^ i6;
      var i = '';
      for (var _x = 0; _x < [i9, i10, i8, i7, i6].length; _x++) {
        var x = [i9, i10, i8, i7, i6][_x];
        i += x.toString().length === 1 ? '0' + x.toString() : x.toString();
      }
      var i1_2 = parseInt(i.substring(0, 2));
      var i2_2 = parseInt(i.substring(2, 4));
      var i3_2 = parseInt(i.substring(4, 6));
      var i4_2 = parseInt(i.substring(6, 8));
      var i5_2 = parseInt(i.substring(8));
      var i6_2 = i4_2 ^ i3_2;
      var i7_2 = i5_2 ^ i3_2;
      var i8_2 = i3_2 ^ (i6_2 + i7_2);
      var i9_2 = i1_2 ^ i7_2;
      var i10_2 = i2_2 ^ i7_2;
      var i2_result = '';
      for (var _x2 = 0; _x2 < [i9_2, i10_2, i6_2, i7_2, i8_2].length; _x2++) {
        var x2 = [i9_2, i10_2, i6_2, i7_2, i8_2][_x2];
        i2_result += x2.toString().length === 1 ? '0' + x2.toString() : x2.toString();
      }
      return i2_result;
    } else if (mode === 'zj') {
      var j1 = parseInt(code.substring(0, 2));
      var j2 = parseInt(code.substring(2, 4));
      var j3 = parseInt(code.substring(4));
      var j5 = j3 ^ (j1 + j2);
      var j6 = j1 ^ j5;
      var j4 = j2 ^ j5;
      var j = '';
      for (var _x3 = 0; _x3 < [j6, j4, j5].length; _x3++) {
        var x3 = [j6, j4, j5][_x3];
        j += x3.toString().length === 1 ? '0' + x3.toString() : x3.toString();
      }
      var j1_2 = parseInt(j.substring(0, 2));
      var j2_2 = parseInt(j.substring(2, 4));
      var j3_2 = parseInt(j.substring(4));
      var j5_2 = j2_2 ^ j1_2;
      var j6_2 = j3_2 ^ j1_2;
      var j4_2 = j1_2 ^ (j5_2 + j6_2);
      var j2_result = '';
      for (var _x4 = 0; _x4 < [j5_2, j6_2, j4_2].length; _x4++) {
        var x4 = [j5_2, j6_2, j4_2][_x4];
        j2_result += x4.toString().length === 1 ? '0' + x4.toString() : x4.toString();
      }
      return j2_result;
    }
  } catch (e) {
    return '';
  }
  return '';
}

function v2(code, mode) {
  try {
    var num = mode === 'adb' ? 2 : 1;
    if (/^\d+$/.test(code)) {
      var key = parseInt(code[7]) ^ num;
      var v7 = (parseInt(code[key]) - key + 10) % 10;
      var result1 = '';
      for (var i = 0; i < 7; i++) {
        var curKey = v7;
        if (i === key) {
          result1 += v7.toString();
        } else {
          var curInt = parseInt(code[i]);
          result1 += ((curInt + 10 - curKey) % 10).toString();
        }
      }
      var keyId = Math.floor(Math.random() * 7);
      var keyValue = parseInt(result1[keyId]);
      var result = '';
      for (var _i = 0; _i < 7; _i++) {
        var curK = _i === keyId ? keyId : keyValue;
        var curInt2 = parseInt(result1[_i]);
        result += ((curInt2 + curK) % 10).toString();
      }
      result += (num ^ keyId).toString();
      return result;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}
