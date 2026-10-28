/**
 * ANWESHA JOSHI — UNIVERSE THEME PORTFOLIO
 * Interactive Cosmic Logic: Starfield, Constellations, CLI Console, Web Audio Synth, Gravitational Cursor
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initUniverseCanvas();
  initConstellationGraph();
  initRoleTyping();
  initInteractiveTerminal();
  initCardSpotlight();
  initFilterTabs();
  initStatsCounter();
  initSimulations();
  initContactTransmission();
  initHeaderScrollAndNav();
  initCosmicAudioSynth();
  initCopyEmail();
});

/* ==========================================================================
   1. CUSTOM GRAVITATIONAL CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth lag for ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover detection for interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea, select, .term-chip, .skill-card, .mission-card');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hover-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hover-link'));
  });
}

/* ==========================================================================
   2. 3D UNIVERSE CANVAS & WARP ENGINE
   ========================================================================== */
let isWarpMode = false;

function initUniverseCanvas() {
  const canvas = document.getElementById('universeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Starfield generation
  const STAR_COUNT = 450;
  const stars = [];
  const starColors = ['#ffffff', '#a5f3fc', '#c084fc', '#fbcfe8', '#fde047', '#38bdf8'];

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      radius: Math.random() * 1.5 + 0.4,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      twinkle: Math.random() * Math.PI * 2,
      speedTwinkle: 0.02 + Math.random() * 0.03
    });
  }

  // Shooting stars (Comets)
  const comets = [];
  function spawnComet() {
    if (comets.length < 2 && Math.random() < 0.015) {
      comets.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.4),
        len: 80 + Math.random() * 120,
        speed: 9 + Math.random() * 14,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
        life: 0
      });
    }
  }

  // Mouse parallax / gravity effect
  let targetOffsetX = 0;
  let targetOffsetY = 0;
  let offsetX = 0;
  let offsetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetOffsetX = (e.clientX - width / 2) * 0.04;
    targetOffsetY = (e.clientY - height / 2) * 0.04;
  });

  // Warp speed toggle
  const warpBtn = document.getElementById('warpToggleBtn');
  if (warpBtn) {
    warpBtn.addEventListener('click', () => {
      toggleWarpMode();
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    offsetX += (targetOffsetX - offsetX) * 0.05;
    offsetY += (targetOffsetY - offsetY) * 0.05;

    const baseSpeed = isWarpMode ? 28 : 0.8;
    const cx = width / 2 + offsetX;
    const cy = height / 2 + offsetY;

    // Draw Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const prevZ = s.z;
      s.z -= baseSpeed;

      if (s.z <= 0) {
        s.z = width;
        s.x = (Math.random() - 0.5) * width * 2;
        s.y = (Math.random() - 0.5) * height * 2;
      }

      const k = 250 / s.z;
      const px = s.x * k + cx;
      const py = s.y * k + cy;

      if (px < 0 || px > width || py < 0 || py > height) continue;

      s.twinkle += s.speedTwinkle;
      const alpha = isWarpMode ? 0.9 : 0.4 + 0.6 * Math.sin(s.twinkle);

      if (isWarpMode) {
        // Draw motion streaks during warp
        const prevK = 250 / prevZ;
        const oldPx = s.x * prevK + cx;
        const oldPy = s.y * prevK + cy;

        ctx.beginPath();
        ctx.moveTo(oldPx, oldPy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.radius * 1.5;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(px, py, s.radius * (1 - s.z / width) * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      }
    }

    // Spawn & Render Comets
    spawnComet();
    for (let i = comets.length - 1; i >= 0; i--) {
      const c = comets[i];
      c.x += Math.cos(c.angle) * c.speed;
      c.y += Math.sin(c.angle) * c.speed;
      c.life++;
      c.opacity -= 0.012;

      if (c.opacity <= 0 || c.x > width + 200 || c.y > height + 200) {
        comets.splice(i, 1);
        continue;
      }

      const tailX = c.x - Math.cos(c.angle) * c.len;
      const tailY = c.y - Math.sin(c.angle) * c.len;

      const grad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
      grad.addColorStop(0.3, `rgba(0, 247, 255, ${c.opacity * 0.8})`);
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  render();
}

function toggleWarpMode() {
  isWarpMode = !isWarpMode;
  document.body.classList.toggle('warp-mode', isWarpMode);
  const warpBtn = document.getElementById('warpToggleBtn');
  if (warpBtn) {
    warpBtn.classList.toggle('active', isWarpMode);
    warpBtn.querySelector('.btn-text').textContent = isWarpMode ? 'HYPERSPACE' : 'WARP';
  }
}

/* ==========================================================================
   3. NEURAL CONSTELLATION GRAPH
   ========================================================================== */
function initConstellationGraph() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 260;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = [
    { id: 'python', label: 'Python (AI Core)', x: 0.15, y: 0.45, color: '#00d2ff', r: 9, pulse: 0 },
    { id: 'java', label: 'Java (Systems)', x: 0.35, y: 0.72, color: '#f72585', r: 8, pulse: 1 },
    { id: 'ml', label: 'Machine Learning', x: 0.5, y: 0.28, color: '#ffd166', r: 12, pulse: 2 },
    { id: 'dl', label: 'Neural Networks', x: 0.68, y: 0.65, color: '#9d4edd', r: 10, pulse: 3 },
    { id: 'cli', label: 'CLI Mastery', x: 0.22, y: 0.2, color: '#06d6a0', r: 7, pulse: 4 },
    { id: 'git', label: 'Git Flow', x: 0.85, y: 0.38, color: '#ffbe0b', r: 8, pulse: 5 },
    { id: 'comms', label: 'Pro Communication', x: 0.8, y: 0.78, color: '#00f7ff', r: 8, pulse: 6 }
  ];

  // Connections representing neural data pathways
  const links = [
    [0, 2], [0, 4], [0, 3], // Python to ML, CLI, Neural
    [1, 0], [1, 5], [1, 6], // Java to Python, Git, Comms
    [2, 3], [2, 5],         // ML to Neural, Git
    [3, 6],                 // Neural to Comms
    [4, 5],                 // CLI to Git
    [5, 6]                  // Git to Comms
  ];

  let hoveredNode = null;
  let mousePos = { x: -100, y: -100 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;

    hoveredNode = null;
    nodes.forEach((n) => {
      const nx = n.x * canvas.width;
      const ny = n.y * canvas.height;
      const dist = Math.hypot(nx - mousePos.x, ny - mousePos.y);
      if (dist < n.r + 15) {
        hoveredNode = n;
      }
    });
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredNode = null;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Links
    links.forEach(([i, j]) => {
      const n1 = nodes[i];
      const n2 = nodes[j];
      const x1 = n1.x * canvas.width;
      const y1 = n1.y * canvas.height;
      const x2 = n2.x * canvas.width;
      const y2 = n2.y * canvas.height;

      const isHighlighted = hoveredNode && (hoveredNode === n1 || hoveredNode === n2);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isHighlighted ? 'rgba(0, 247, 255, 0.85)' : 'rgba(157, 78, 221, 0.22)';
      ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
      ctx.stroke();

      // Signal pulse packet traveling along the wire
      const time = Date.now() * 0.0015;
      const t = (Math.sin(time + i + j) + 1) / 2;
      const packetX = x1 + (x2 - x1) * t;
      const packetY = y1 + (y2 - y1) * t;

      ctx.beginPath();
      ctx.arc(packetX, packetY, isHighlighted ? 3 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isHighlighted ? '#ffffff' : 'rgba(0, 247, 255, 0.7)';
      ctx.fill();
    });

    // Draw Nodes
    nodes.forEach((n) => {
      const nx = n.x * canvas.width;
      const ny = n.y * canvas.height;
      const isHover = hoveredNode === n;

      n.pulse += 0.03;
      const pulseSize = Math.sin(n.pulse) * 2;

      // Glow halo
      ctx.beginPath();
      ctx.arc(nx, ny, n.r + 8 + pulseSize + (isHover ? 6 : 0), 0, Math.PI * 2);
      ctx.fillStyle = isHover ? 'rgba(0, 247, 255, 0.25)' : 'rgba(157, 78, 221, 0.12)';
      ctx.fill();

      // Node Body
      ctx.beginPath();
      ctx.arc(nx, ny, n.r + (isHover ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowBlur = isHover ? 20 : 10;
      ctx.shadowColor = n.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner Star core
      ctx.beginPath();
      ctx.arc(nx, ny, n.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Label
      ctx.font = isHover ? 'bold 12px "Space Mono", monospace' : '10px "Space Mono", monospace';
      ctx.fillStyle = isHover ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, nx, ny + n.r + 16);
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   4. DYNAMIC ROLE TYPING ANIMATION
   ========================================================================== */
function initRoleTyping() {
  const roleEl = document.getElementById('roleTyping');
  if (!roleEl) return;

  const roles = [
    'Aspiring AI & Machine Learning Engineer',
    'Deep Neural Network Explorer',
    'Python & Java Systems Architect',
    'Command-Line & Git Flow Power User',
    'Interstellar Technical Communicator'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      delay = 40;
    } else {
      charIdx++;
      delay = 90;
    }

    roleEl.textContent = current.substring(0, charIdx);

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 2000; // Pause at end of text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   5. INTERACTIVE CLI CONSOLE
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  const clearBtn = document.getElementById('clearTerminalBtn');
  const chips = document.querySelectorAll('.term-chip');

  if (!terminalInput || !terminalBody) return;

  const commandHistory = [];
  let historyIdx = -1;

  const commands = {
    help: `
<span class="term-highlight">DIRECTIVES DIRECTORY:</span>
  <span class="term-command">whoami</span>          - Identify the pilot and vision of this station
  <span class="term-command">skills</span>          - Display full orbital skill constellation
  <span class="term-command">ai</span> / <span class="term-command">ml</span>          - Telemetry on AI & Machine Learning specialization
  <span class="term-command">python</span>          - Inspect Python proficiency & AI data tooling
  <span class="term-command">java</span>            - Inspect Java object-oriented foundations
  <span class="term-command">cli</span>             - Terminal mastery & shell navigation
  <span class="term-command">git</span>             - Timeline governance & version control
  <span class="term-command">communication</span>   - Galactic cross-functional articulation & empathy
  <span class="term-command">missions</span>        - List flagship project trajectories
  <span class="term-command">warp</span>            - Engage / disengage hyperspace warp speed
  <span class="term-command">audio</span>           - Toggle atmospheric cosmic synthesizer
  <span class="term-command">stardate</span>        - Current galactic system timestamp
  <span class="term-command">contact</span>         - Subspace frequencies to reach Anwesha
  <span class="term-command">clear</span>           - Purge terminal display
    `,
    whoami: `
<span class="term-bold">PILOT:</span> Anwesha Joshi
<span class="term-bold">TRAJECTORY:</span> Artificial Intelligence & Machine Learning Engineer
<span class="term-bold">PHILOSOPHY:</span> Bridging mathematical rigor with scalable software craft. Venturing into neural topologies to translate raw data into intelligent machines.
<span class="term-bold">CORE ARSENAL:</span> Python, Java, CLI, Git, Professional Communication, Machine Learning.
    `,
    skills: `
<span class="term-highlight">ORBITAL SKILL TELEMETRY:</span>
  [1] <span class="term-bold">Python</span>: NumPy, Pandas, PyTorch, Scikit-Learn, Algorithms, OOP
  [2] <span class="term-bold">Java</span>: OOP Design Patterns, Collections Framework, Concurrency, JVM
  [3] <span class="term-bold">CLI</span>: Bash/Zsh power navigation, pipeline chaining, remote operations
  [4] <span class="term-bold">Git</span>: Atomic commits, branching strategies, PR etiquette, merge resolution
  [5] <span class="term-bold">AI / ML</span>: Deep Learning, CNNs, RL, NLP, Loss optimization, Model evaluation
  [6] <span class="term-bold">Communication</span>: Technical documentation, empathetic teamwork, presentations
    `,
    ai: `
<span class="term-success">AI & MACHINE LEARNING FOCUS:</span>
  • Architecture intuition: Convolutional nets, Transformer mechanics, Q-learning.
  • Feature engineering, tensor manipulation, and gradient backpropagation.
  • Dedication to interpretable, ethical, and high-impact machine intelligence.
    `,
    ml: `Redirecting to 'ai' directive... Use command: 'ai'`,
    python: `
<span class="term-info">PYTHON TELEMETRY:</span>
  • Fueling modern machine learning and data science workflows.
  • Extensive experience with vectorized math in NumPy & tabular pipelines in Pandas.
  • Model construction and evaluation using PyTorch and Scikit-Learn.
    `,
    java: `
<span class="term-info">JAVA TELEMETRY:</span>
  • Scalable, type-safe, enterprise architecture.
  • Strong command over Object-Oriented Programming (encapsulation, polymorphism, abstraction).
  • Data structures, Collections API, and multithreading fundamentals.
    `,
    cli: `
<span class="term-info">CLI MASTERY TELEMETRY:</span>
  • Terminal agility in Unix/Linux ecosystems.
  • Fluent with pipes, grep, sed, process management, SSH, shell scripting, and environment setup.
  • True command-line power: code faster without relying on graphical bloat.
    `,
    git: `
<span class="term-info">GIT VERSION CONTROL:</span>
  • Dimension-hopping version governance.
  • Clean commit hygiene, branch isolation (features/hotfixes), conflict resolution.
  • Seamless open-source collaboration on GitHub.
    `,
    communication: `
<span class="term-info">PROFESSIONAL COMMUNICATION:</span>
  • The human relay that amplifies technical genius.
  • Active listening, constructive code reviews, concise technical specs.
  • Translating mathematical model metrics into actionable business and research insights.
    `,
    missions: `
<span class="term-highlight">ACTIVE MISSIONS:</span>
  • <span class="term-bold">CosmicVision</span> [Python, PyTorch, CV] - Deep Sky Astronomical Classifier
  • <span class="term-bold">NeuroPulsar</span> [Python, RL, NumPy] - Autonomous Pathfinding Agent
  • <span class="term-bold">TitanStream</span> [Java, Multithreading] - High-Throughput Telemetry Core
  • <span class="term-bold">NebulaComms</span> [Python, Transformers] - Multi-Turn AI Assistant
    `,
    contact: `
<span class="term-highlight">DIRECT SUBSPACE FREQUENCIES:</span>
  • Email: <span class="term-bold">anweshajoshi.connect@gmail.com</span>
  • GitHub: <span class="term-bold">github.com/anweshajoshi</span>
  • LinkedIn: <span class="term-bold">linkedin.com/in/anwesha-joshi</span>
    `,
    stardate: `
<span class="term-bold">STARDATE:</span> ${new Date().toISOString()} // Sector Alpha-9
    `,
    warp: `
Toggling Hyperspace Warp Mode...
    `,
    audio: `
Toggling Cosmic Space Ambient Audio...
    `,
    sudo: `
<span class="term-warn">Permission denied: You are already a root commander of this cosmos.</span>
    `
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    commandHistory.push(rawCmd);
    historyIdx = commandHistory.length;

    // Echo input line
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line';
    echoLine.innerHTML = `<span class="prompt-user">anwesha</span><span class="prompt-at">@</span><span class="prompt-host">cosmos</span><span class="prompt-path">:~$</span> <span class="term-bold">${escapeHtml(rawCmd)}</span>`;
    terminalBody.appendChild(echoLine);

    // Process
    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
    } else if (cmd === 'warp') {
      toggleWarpMode();
      printResponse(`Hyperspace Warp Mode: ${isWarpMode ? 'ENGAGED 🚀' : 'DISENGAGED 🛰️'}`);
    } else if (cmd === 'audio') {
      const audioBtn = document.getElementById('audioToggleBtn');
      if (audioBtn) audioBtn.click();
      printResponse('Audio synthesizer state updated.');
    } else if (commands[cmd]) {
      printResponse(commands[cmd]);
    } else {
      printResponse(`<span class="term-warn">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="term-command">'help'</span> for instructions.</span>`);
    }

    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function printResponse(html) {
    const respLine = document.createElement('div');
    respLine.className = 'term-line';
    respLine.innerHTML = html;
    terminalBody.appendChild(respLine);
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = commandHistory[historyIdx] || '';
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        terminalInput.value = commandHistory[historyIdx] || '';
      } else {
        historyIdx = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalBody.innerHTML = '';
      terminalInput.focus();
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      terminalInput.focus();
    });
  });
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* ==========================================================================
   6. CARD SPOTLIGHT MOUSE TRACKING
   ========================================================================== */
function initCardSpotlight() {
  const cards = document.querySelectorAll('.skill-card, .mission-card, .telemetry-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   7. SKILLS FILTER TABS
   ========================================================================== */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let count = 0;
        const duration = 1500;
        const stepTime = 20;
        const increment = Math.ceil(target / (duration / stepTime));

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = count;
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   9. INTERACTIVE SIMULATION BUTTONS
   ========================================================================== */
function initSimulations() {
  const simBtns = document.querySelectorAll('.run-sim-btn');
  simBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const simType = btn.getAttribute('data-sim');
      btn.textContent = 'Simulating...';
      btn.style.opacity = '0.7';

      setTimeout(() => {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mini-svg"><polyline points="20 6 9 17 4 12"></polyline></svg> Telemetry Verified!`;
        btn.style.opacity = '1';
        btn.style.background = 'var(--neural-green)';
        btn.style.color = '#000';

        setTimeout(() => {
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mini-svg"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Re-run Simulation`;
          btn.style.background = '';
          btn.style.color = '';
        }, 2500);
      }, 900);
    });
  });
}

/* ==========================================================================
   10. CONTACT FORM TRANSMISSION
   ========================================================================== */
function initContactTransmission() {
  const form = document.getElementById('transmissionForm');
  const ack = document.getElementById('transmissionAck');
  const resetBtn = document.getElementById('resetFormBtn');

  if (!form || !ack) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#senderName').value.trim();
    const email = form.querySelector('#senderEmail').value.trim();
    const msg = form.querySelector('#senderMessage').value.trim();

    if (!name || !email || !msg) {
      alert('Please fill out all transmission parameters before dispatch.');
      return;
    }

    const submitBtn = document.getElementById('sendTransmissionBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Broadcasting to Deep Space...</span>`;

    setTimeout(() => {
      form.style.display = 'none';
      ack.classList.add('active');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Dispatch Transmission</span>`;
      form.reset();
    }, 1200);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      ack.classList.remove('active');
      form.style.display = 'block';
    });
  }
}

/* ==========================================================================
   11. HEADER SCROLL & MOBILE NAVIGATION
   ========================================================================== */
function initHeaderScrollAndNav() {
  const header = document.getElementById('cosmicHeader');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('cosmicNav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-active');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-active');
      });
    });
  }
}

/* ==========================================================================
   12. WEB AUDIO API AMBIENT SPACE SYNTHESIZER
   ========================================================================== */
function initCosmicAudioSynth() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let osc1 = null;
  let osc2 = null;
  let subOsc = null;
  let filter = null;
  let masterGain = null;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startSynth();
    } else {
      stopSynth();
    }
  });

  function startSynth() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 3);
      masterGain.connect(audioCtx.destination);

      filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, audioCtx.currentTime);
      filter.Q.setValueAtTime(3, audioCtx.currentTime);
      filter.connect(masterGain);

      // Deep Space Root Note (A1 = 55Hz)
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      // Fifth harmonic (E2 = 82.4Hz)
      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(82.4, audioCtx.currentTime);

      // Sub-bass rumble (27.5Hz)
      subOsc = audioCtx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(27.5, audioCtx.currentTime);

      // Gentle LFO modulating the filter for celestial breath
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(140, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      subOsc.connect(filter);

      osc1.start();
      osc2.start();
      subOsc.start();
      lfo.start();

      isPlaying = true;
      audioBtn.classList.add('playing', 'active');
      audioBtn.querySelector('.audio-label').textContent = 'COSMOS: ON';
    } catch (e) {
      console.error('Web Audio API not permitted or initialized:', e);
    }
  }

  function stopSynth() {
    if (audioCtx && isPlaying) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
      setTimeout(() => {
        if (audioCtx) {
          audioCtx.close();
          audioCtx = null;
        }
      }, 1600);
      isPlaying = false;
      audioBtn.classList.remove('playing', 'active');
      audioBtn.querySelector('.audio-label').textContent = 'COSMOS AUDIO';
    }
  }
}

/* ==========================================================================
   13. COPY EMAIL INTERACTION
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email');
    navigator.clipboard.writeText(email).then(() => {
      const textSpan = copyBtn.querySelector('.copy-text');
      if (textSpan) {
        textSpan.textContent = 'Copied!';
        setTimeout(() => {
          textSpan.textContent = 'Copy';
        }, 2000);
      }
    }).catch(() => {
      alert(`Contact address: ${email}`);
    });
  });
}
