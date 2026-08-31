(function() {
  if (window.soul) window.soul.remove();
  if (window.btn) window.btn.remove();
  if (window.controlsToggleBtn) window.controlsToggleBtn.remove();
  if (window.platforms && Array.isArray(window.platforms)) window.platforms.forEach(p => p.el.remove());
  if (window.purpleLines && Array.isArray(window.purpleLines)) window.purpleLines.forEach(l => l.remove());
  if (window.purpleVertLines && Array.isArray(window.purpleVertLines)) window.purpleVertLines.forEach(l => l.remove());
  if (window.bullets && Array.isArray(window.bullets)) window.bullets.forEach(b => b.el.remove());

  // 1. SYSTEM INITIALIZATION REGISTERS
  window.currentMode = 'red'; 
  window.platforms = []; window.purpleLines = []; window.purpleVertLines = []; window.bullets = [];
  window.targetLineIdx = 1; window.targetVertLineIdx = 1;
  window.lineSwitchCooldown = false; window.vertLineSwitchCooldown = false;
  window.moveX = 0; window.moveY = 0; window.vx = 0; window.vy = 0;
  window.isJumping = false; window.uiVisible = true; window.keys = {};
  
  // Bravery Kinetic Vectors
  window.orangeCharge = 0; window.orangeVx = 0;
  window.isCharging = false; window.zBtnPressed = false; window.clickCooldown = false;

  // 2. SPAWN SOUL CANVAS LAYER
  window.soul = document.createElement('div');
  soul.innerText = '❤️'; soul.style.position = 'fixed'; soul.style.zIndex = '9999999';
  soul.style.fontSize = '24px'; soul.style.pointerEvents = 'none';
  soul.style.filter = 'drop-shadow(0 0 8px #ff0000)';
  window.x = window.innerWidth / 2; window.y = window.innerHeight / 2;
  soul.style.left = window.x + 'px'; soul.style.top = window.y + 'px';
  document.body.appendChild(soul);

  // 3. CORE MODE SWITCHER BUTTON
  window.btn = document.createElement('button');
  btn.innerText = '❤️ DETERMINATION'; btn.style.position = 'fixed'; btn.style.top = '10px'; btn.style.right = '70px'; 
  btn.style.zIndex = '10000000'; btn.style.padding = '10px 15px'; btn.style.fontFamily = '"Courier New", monospace';
  btn.style.fontSize = '12px'; btn.style.fontWeight = 'bold'; btn.style.backgroundColor = '#000';
  btn.style.color = '#ff0000'; btn.style.border = '2px solid #ff0000'; btn.style.borderRadius = '5px';
  document.body.appendChild(btn);

  // 4. ON-SCREEN INTERFACE HUD CONTROLLER
  window.controlsToggleBtn = document.createElement('button');
  controlsToggleBtn.innerText = '⚙️ UI: SHOW'; controlsToggleBtn.style.position = 'fixed'; controlsToggleBtn.style.top = '10px'; controlsToggleBtn.style.left = '70px'; 
  controlsToggleBtn.style.zIndex = '10000000'; controlsToggleBtn.style.padding = '10px 15px'; controlsToggleBtn.style.fontFamily = '"Courier New", monospace';
  controlsToggleBtn.style.fontSize = '12px'; controlsToggleBtn.style.fontWeight = 'bold'; controlsToggleBtn.style.backgroundColor = '#222';
  controlsToggleBtn.style.color = '#fff'; controlsToggleBtn.style.border = '2px solid #fff'; controlsToggleBtn.style.borderRadius = '5px';
  document.body.appendChild(controlsToggleBtn);

  window.controlsToggleBtn.addEventListener('click', () => {
    window.uiVisible = !window.uiVisible;
    if (window.stickContainer && window.zBtn) {
      const d = window.uiVisible ? 'block' : 'none';
      window.stickContainer.style.display = d; window.zBtn.style.display = d;
    }
    window.controlsToggleBtn.innerText = window.uiVisible ? '⚙️ UI: SHOW' : '⚙️ UI: HIDE';
  });
})();
(function() {
  window.setupPerseveranceGrid = function() {
    const h = window.innerHeight; const w = window.innerWidth;
    window.lineYPositions = [h * 0.4, h * 0.55, h * 0.7];
    window.lineYPositions.forEach(lineY => {
      const line = document.createElement('div');
      line.style.position = 'fixed'; line.style.left = '0'; line.style.top = (lineY + 10) + 'px';
      line.style.width = '100vw'; line.style.height = '4px'; line.style.backgroundColor = '#d11aff';
      line.style.boxShadow = '0 0 8px #d11aff'; line.style.zIndex = '9999997';
      document.body.appendChild(line); window.purpleLines.push(line);
    });
    window.lineXPositions = [w * 0.35, w * 0.5, w * 0.65];
    window.lineXPositions.forEach(lineX => {
      const line = document.createElement('div');
      line.style.position = 'fixed'; line.style.top = '0'; line.style.left = (lineX + 10) + 'px';
      line.style.width = '4px'; line.style.height = '100vh'; line.style.backgroundColor = '#d11aff';
      line.style.boxShadow = '0 0 8px #d11aff'; line.style.zIndex = '9999996';
      document.body.appendChild(line); window.purpleVertLines.push(line);
    });
    window.targetLineIdx = 1; window.targetVertLineIdx = 1;
    window.y = window.lineYPositions[window.targetLineIdx]; window.x = window.lineXPositions[window.targetVertLineIdx];
  };

  window.fireJusticePellet = function() {
    if (window.currentMode !== 'yellow') return;
    const bullet = document.createElement('div');
    bullet.style.position = 'fixed'; bullet.style.width = '8px'; bullet.style.height = '14px';
    bullet.style.backgroundColor = '#ffff00'; bullet.style.boxShadow = '0 0 6px #ffff00';
    bullet.style.borderRadius = '3px'; bullet.style.zIndex = '10000001'; bullet.style.pointerEvents = 'none'; 
    const bx = window.x + 8; const by = window.y - 15;
    bullet.style.left = bx + 'px'; bullet.style.top = by + 'px';
    document.body.appendChild(bullet); window.bullets.push({ el: bullet, x: bx, y: by });
  };

  window.btn.addEventListener('click', () => {
    if (window.platforms) window.platforms.forEach(p => p.el.remove()); window.platforms = [];
    if (window.purpleLines) window.purpleLines.forEach(l => l.remove()); window.purpleLines = [];
    if (window.purpleVertLines) window.purpleVertLines.forEach(l => l.remove()); window.purpleVertLines = [];
    window.bullets.forEach(b => b.el.remove()); window.bullets = [];
    window.soul.style.filter = 'none';
    window.orangeCharge = 0; window.orangeVx = 0; window.isCharging = false;

    if (window.currentMode === 'red') {
      window.currentMode = 'blue'; btn.innerText = '💙 INTEGRITY'; btn.style.color = '#00bcff'; btn.style.borderColor = '#00bcff'; soul.innerText = '💙'; soul.style.filter = 'drop-shadow(0 0 8px #00bcff)'; window.vy = 0; soul.style.transform = 'none';
    } else if (window.currentMode === 'blue') {
      window.currentMode = 'purple'; btn.innerText = '💜 PERSEVERANCE'; btn.style.color = '#d11aff'; btn.style.borderColor = '#d11aff'; soul.innerText = '💜'; soul.style.filter = 'drop-shadow(0 0 8px #d11aff)'; window.setupPerseveranceGrid(); soul.style.transform = 'none';
    } else if (window.currentMode === 'purple') {
      window.currentMode = 'yellow'; btn.innerText = '💛 JUSTICE'; btn.style.color = '#ffff00'; btn.style.borderColor = '#ffff00'; soul.innerText = '💛'; soul.style.filter = 'drop-shadow(0 0 8px #ffff00)'; soul.style.transform = 'scaleY(-1)';
    } else if (window.currentMode === 'yellow') {
      window.currentMode = 'orange'; btn.innerText = '🧡 BRAVERY'; btn.style.color = '#ff9900'; btn.style.borderColor = '#ff9900'; soul.innerText = '🧡'; soul.style.filter = 'drop-shadow(0 0 8px #ff9900)'; soul.style.transform = 'rotate(-90deg)'; 
    } else {
      window.currentMode = 'red'; btn.innerText = '❤️ DETERMINATION'; btn.style.color = '#ff0000'; btn.style.borderColor = '#ff0000'; soul.innerText = '❤️'; soul.style.filter = 'drop-shadow(0 0 8px #ff0000)'; soul.style.transform = 'none';
    }
  });

  // 5. TOUCH HUD INTERFACE MOUNT
  window.stickContainer = document.createElement('div');
  stickContainer.style.position = 'fixed'; stickContainer.style.bottom = '40px'; stickContainer.style.left = '40px';
  stickContainer.style.width = '100px'; stickContainer.style.height = '100px'; stickContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  stickContainer.style.border = '2px solid rgba(255, 255, 255, 0.6)'; stickContainer.style.borderRadius = '50%'; stickContainer.style.zIndex = '10000000'; stickContainer.style.touchAction = 'none';
  document.body.appendChild(stickContainer);

  const stick = document.createElement('div');
  stick.style.position = 'absolute'; stick.style.top = '25px'; stick.style.left = '25px'; stick.style.width = '50px'; stick.style.height = '50px'; stick.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; stick.style.borderRadius = '50%';
  stickContainer.appendChild(stick);

  window.zBtn = document.createElement('button');
  zBtn.innerText = 'Z'; zBtn.style.position = 'fixed'; zBtn.style.bottom = '60px'; zBtn.style.right = '40px'; zBtn.style.width = '70px'; zBtn.style.height = '70px'; zBtn.style.zIndex = '10000000';
  zBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; zBtn.style.color = '#fff'; zBtn.style.border = '3px solid #fff'; zBtn.style.borderRadius = '50%'; zBtn.style.fontSize = '24px'; zBtn.style.fontWeight = 'bold'; zBtn.style.fontFamily = '"Courier New", monospace'; zBtn.style.touchAction = 'none';
  document.body.appendChild(zBtn);

  let stickActive = false;
  stickContainer.addEventListener('pointerdown', (e) => { stickActive = true; handleStickMove(e); });
  window.addEventListener('pointermove', (e) => { if (stickActive) handleStickMove(e); });
  window.addEventListener('pointerup', () => {
    if (!stickActive) return;
    stickActive = false; stick.style.transform = 'translate(0px, 0px)'; window.moveX = 0; 
    if (window.currentMode === 'blue' && window.vy < -3) { window.vy = -3; }
    window.moveY = 0;
  });

  function handleStickMove(e) {
    const rect = stickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2; const centerY = rect.top + rect.height / 2;
    let dx = e.clientX - centerX; let dy = e.clientY - centerY;
    const distance = Math.sqrt(dx*dx + dy*dy); const maxRadius = 35;
    if (distance > maxRadius) { dx = (dx / distance) * maxRadius; dy = (dy / distance) * maxRadius; }
    stick.style.transform = `translate(${dx}px, ${dy}px)`;
    if (Math.abs(dx) < 8) window.moveX = 0; else window.moveX = dx > 0 ? 1 : -1;
    if (Math.abs(dy) < 8) window.moveY = 0; else window.moveY = dy > 0 ? 1 : -1;
    if (window.currentMode === 'blue' && dy < -20 && !window.isJumping) { window.vy = -15; window.isJumping = true; }
  }

  function handleActionTrigger() {
    if (window.currentMode === 'yellow') { window.fireJusticePellet(); } 
    else if (window.currentMode === 'orange') { window.zBtnPressed = true; } 
    else {
      const target = document.elementFromPoint(window.x + 12, window.y + 12);
      if (target && target !== window.btn && target !== window.zBtn && target !== window.controlsToggleBtn && !stickContainer.contains(target) && typeof target.click === 'function') { target.click(); }
    }
  }

  zBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); handleActionTrigger(); });
  zBtn.addEventListener('pointerup', () => { window.zBtnPressed = false; });

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase(); window.keys[k] = true;
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'z', 'enter'].includes(k)) { e.preventDefault(); }
    if (k === 'z' || k === 'enter' || k === ' ') { handleActionTrigger(); }
    if (window.currentMode === 'blue' && (k === 'w' || k === 'arrowup') && !window.isJumping) { window.vy = -15; window.isJumping = true; }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase(); window.keys[k] = false;
    if (k === 'z' || k === 'enter' || k === ' ') { window.zBtnPressed = false; }
    if (window.currentMode === 'blue' && (k === 'w' || k === 'arrowup') && window.vy < -3) { window.vy = -3; }
  });
})();
(function() {
  const platformSpeed = 3.5; let spawnTimer = 0;

  function spawnPlatform() {
    const pEl = document.createElement('div');
    pEl.style.position = 'fixed'; pEl.style.backgroundColor = '#00bcff'; pEl.style.border = '2px solid #ffffff'; pEl.style.boxShadow = '0 0 10px #00bcff'; pEl.style.zIndex = '9999998';
    const width = Math.random() * 90 + 90; const height = 15; const startX = window.innerWidth;
    const minHeight = window.innerHeight * 0.55; const maxHeight = window.innerHeight - 80; const startY = Math.random() * (maxHeight - minHeight) + minHeight;
    pEl.style.width = width + 'px'; pEl.style.height = height + 'px'; pEl.style.left = startX + 'px'; pEl.style.top = startY + 'px';
    document.body.appendChild(pEl); window.platforms.push({ el: pEl, x: startX, y: startY, w: width, h: height });
  }

  const baseSpeed = 6; const gravity = 0.55; const bulletSpeed = 12;

  function findValidClickableElement(el) {
    while (el && el !== document.body) {
      const tag = el.tagName.toLowerCase();
      if (['button', 'a', 'input', 'select', 'textarea'].includes(tag) || el.getAttribute('role') === 'button' || el.onclick || el.classList.contains('clickable') || el.style.cursor === 'pointer') { return el; }
      el = el.parentElement;
    }
    return null;
  }

  function mainEngineLoop() {
    const screenWidth = window.innerWidth; const screenHeight = window.innerHeight;
    let inputX = 0; let inputY = 0;
    if (window.keys['a'] || window.keys['arrowleft']) inputX = -1;
    if (window.keys['d'] || window.keys['arrowright']) inputX = 1;
    if (window.keys['w'] || window.keys['arrowup']) inputY = -1;
    if (window.keys['s'] || window.keys['arrowdown']) inputY = 1;
    if (inputX === 0 && inputY === 0) { inputX = window.moveX; inputY = window.moveY; }

    if (window.currentMode === 'red' || window.currentMode === 'yellow') {
      window.x += inputX * baseSpeed; window.y += inputY * baseSpeed;
    } else if (window.currentMode === 'blue') {
      window.x += inputX * baseSpeed; window.vy += gravity; window.y += window.vy;
      spawnTimer++; if (spawnTimer % 80 === 0) { spawnPlatform(); }
      window.platforms.forEach(p => { p.x -= platformSpeed; p.el.style.left = p.x + 'px'; });
      let onPlatform = false; const soulBottom = window.y + 24; const soulRight = window.x + 24;
      for (let i = 0; i < window.platforms.length; i++) {
        const p = window.platforms[i];
        if (soulRight >= p.x && window.x <= p.x + p.w && soulBottom >= p.y && soulBottom <= p.y + p.h + 8 && window.vy >= 0) {
          window.y = p.y - 24; window.vy = 0; window.isJumping = false; onPlatform = true; window.x -= platformSpeed; break;
        }
      }
      window.platforms = window.platforms.filter(p => { if (p.x + p.w < 0) { p.el.remove(); return false; } return true; });
      if (!onPlatform && window.y >= screenHeight - 35) { window.y = screenHeight - 35; window.vy = 0; window.isJumping = false; }
    } else if (window.currentMode === 'purple') {
      let tickY = 0; let tickX = 0;
      if (window.keys['w'] || window.keys['arrowup'] || window.moveY < -0.5) tickY = -1;
      if (window.keys['s'] || window.keys['arrowdown'] || window.moveY > 0.5) tickY = 1;
      if (window.keys['a'] || window.keys['arrowleft'] || window.moveX < -0.5) tickX = -1;
      if (window.keys['d'] || window.keys['arrowright'] || window.moveX > 0.5) tickX = 1;

      if (!window.lineSwitchCooldown && tickY !== 0) {
        if (tickY === -1 && window.targetLineIdx > 0) window.targetLineIdx--;
        if (tickY === 1 && window.targetLineIdx < 2) window.targetLineIdx++;
        window.lineSwitchCooldown = true; setTimeout(() => window.lineSwitchCooldown = false, 200);
      }
      if (!window.vertLineSwitchCooldown && tickX !== 0) {
        if (tickX === -1 && window.targetVertLineIdx > 0) window.targetVertLineIdx--;
        if (tickX === 1 && window.targetVertLineIdx < 2) window.targetVertLineIdx++;
        window.vertLineSwitchCooldown = true; setTimeout(() => window.vertLineSwitchCooldown = false, 200);
      }
      window.y += (window.lineYPositions[window.targetLineIdx] - window.y) * 0.25;
      window.x += (window.lineXPositions[window.targetVertLineIdx] - window.x) * 0.25;
      let scrollY = 0;
      if (window.keys['w'] || window.keys['arrowup'] || window.moveY < -0.2) scrollY = -8;
      if (window.keys['s'] || window.keys['arrowdown'] || window.moveY > 0.2) scrollY = 8;
      if (scrollY !== 0) { window.scrollBy({ top: scrollY, behavior: 'auto' }); }
    } else if (window.currentMode === 'orange') {
      window.y += inputY * baseSpeed;
      const inputFiring = window.keys['z'] || window.keys['enter'] || window.keys[' '] || window.zBtnPressed;
      
      if (inputFiring) {
        window.isCharging = true; window.orangeCharge = Math.min(window.orangeCharge + 0.5, 28);
        window.soul.style.filter = `drop-shadow(0 0 ${8 + window.orangeCharge}px #ff9900)`;

        const chargeTarget = document.elementFromPoint(window.x + 12, window.y + 12);
        if (chargeTarget) {
          const checkActionable = findValidClickableElement(chargeTarget);
          if (checkActionable && typeof checkActionable.click === 'function' && !window.clickCooldown) {
            
            // Flash effect for bravery soul like the one for justice
            const origBg = checkActionable.style.backgroundColor;
            checkActionable.style.backgroundColor = "#00cbff"; 
            setTimeout(() => { checkActionable.style.backgroundColor = origBg; }, 120);
            
            checkActionable.click();
            window.clickCooldown = true; setTimeout(() => window.clickCooldown = false, 300);
          }
        }
      } else {
        if (window.isCharging && window.orangeCharge > 0) {
          window.orangeVx = window.orangeCharge; window.orangeCharge = 0; window.isCharging = false;
          window.soul.style.filter = 'drop-shadow(0 0 8px #ff9900)';
        }
      }

      if (window.orangeVx === 0) {
        window.x += inputX * baseSpeed;
      } else {
        window.x += window.orangeVx;
        const leadingEdgeX = window.orangeVx > 0 ? (window.x + 28) : (window.x - 8);
        const dashTarget = document.elementFromPoint(leadingEdgeX, window.y + 12);
        if (dashTarget) {
          const checkActionable = findValidClickableElement(dashTarget);
          if (checkActionable && typeof checkActionable.click === 'function' && !window.clickCooldown) {
            
            // TIMED DECAY FLASH REGISTER LIKE JUSTICE SOUL MODE
            const origBg = checkActionable.style.backgroundColor;
            checkActionable.style.backgroundColor = "#00cbff"; 
            setTimeout(() => { checkActionable.style.backgroundColor = origBg; }, 120);
            
            if (typeof checkActionable.dispatchEvent === 'function') {
              checkActionable.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
            } else { checkActionable.click(); }
            
            window.clickCooldown = true; setTimeout(() => window.clickCooldown = false, 300);
            window.orangeVx = window.orangeVx > 0 ? -7 : 7; 
          }
        }
        window.orangeVx *= 0.82; if (Math.abs(window.orangeVx) < 0.25) window.orangeVx = 0;
      }
      if (window.x > screenWidth) { window.x = -20; } else if (window.x < -24) { window.x = screenWidth; }
    }


    if (window.currentMode === 'yellow' && window.bullets.length > 0) {
      window.bullets.forEach((b) => {
        b.y -= bulletSpeed; b.el.style.top = b.y + 'px';
        const pointTarget = document.elementFromPoint(b.x + 4, b.y);
        if (pointTarget && pointTarget !== window.soul && pointTarget !== window.btn && pointTarget !== window.controlsToggleBtn && !window.stickContainer.contains(pointTarget) && pointTarget !== window.zBtn && pointTarget !== b.el) {
          const actionableElement = findValidClickableElement(pointTarget);
          if (actionableElement && typeof actionableElement.click === 'function') {
            const origBg = actionableElement.style.backgroundColor;
            actionableElement.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            setTimeout(() => { actionableElement.style.backgroundColor = origBg; }, 120);
            actionableElement.click(); b.y = -100;
          }
        }
      });
      window.bullets = window.bullets.filter(b => { if (b.y < 0) { b.el.remove(); return false; } return true; });
    }

    if (window.currentMode !== 'orange') { window.x = Math.max(0, Math.min(screenWidth - 24, window.x)); }
    window.y = Math.max(0, Math.min(screenHeight - 35, window.y));
    window.soul.style.left = window.x + 'px'; window.soul.style.top = window.y + 'px';
    requestAnimationFrame(mainEngineLoop);
  }
  mainEngineLoop();
})();
