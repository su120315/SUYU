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
    qrcode: { title: '二维码生成', render: renderQrcode }
  };

  function openTool(toolName) {
    const tool = tools[toolName];
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

    function updateDisplay() {
      exprEl.textContent = expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
      try {
        if (expression) {
          const r = eval(expression.replace(/%/g, '/100'));
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
            const r = eval(expression.replace(/%/g, '/100'));
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
      output.select();
      document.execCommand('copy');
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
      output.select();
      document.execCommand('copy');
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
      output.select();
      document.execCommand('copy');
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
    const text = container.querySelector('#qrText');

    container.querySelector('#qrGen').addEventListener('click', function() {
      const t = text.value.trim();
      if (!t) { alert('请输入内容'); return; }
      output.innerHTML = '';
      const canvas = document.createElement('canvas');
      output.appendChild(canvas);

      if (window.QRCode) {
        window.QRCode.toCanvas(canvas, t, {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        }, function(err) {
          if (err) {
            output.innerHTML = '<span style="color:#ef4444;">生成失败，请重试</span>';
          }
        });
      } else {
        output.innerHTML = '<span style="color:#f59e0b;">QRCode 库加载中，请稍候再试...</span>';
      }
    });
  }
});
