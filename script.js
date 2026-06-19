const canvas = document.getElementById('networkCanvas');
const context = canvas.getContext('2d');
const eduItems = document.querySelectorAll('[data-edu]');
const eduTitle = document.getElementById('eduTitle');
const eduRole = document.getElementById('eduRole');
const eduMeta = document.getElementById('eduMeta');
const eduCopy = document.getElementById('eduCopy');

const educationData = {
  neu: {
    title: 'Northeastern University',
    role: 'Master of Science (MS), Data Analytics Engineering',
    meta: 'September 2025 – May 2027 · GPA: 3.5',
    copy:
      'Coursework: Foundation of Data Analytics, Data Management, Computation and Visualization, Data Mining, MLOps, Deep Learning for AI.',
  },
  met: {
    title: 'MET Institute of Engineering',
    role: "Bachelor's, Electronics and Telecommunication Engineering",
    meta: 'August 2019 – May 2022 · GPA: 3.4',
    copy: 'Focused on core engineering foundations, problem solving, and practical technical coursework.',
  },
};

const state = {
  width: 0,
  height: 0,
  nodes: [],
  paused: false,
};

// Bootline typewriter: small terminal status at top of page
function startBootline() {
  const el = document.getElementById('bootline');
  if (!el) return;
  const messages = [
    'INITIALIZING HR-OS KERNEL V1.0...',
    'LOADING SECURITY MODULES...',
    'MOUNTING FILE SYSTEM...'
  ];
  const text = messages.join(' ');
  let i = 0;
  function step() {
    const showCursor = (i % 2) === 0;
    el.textContent = text.slice(0, Math.max(0, i));
    if (showCursor) {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      el.appendChild(cursor);
    }
    i += 1;
    if (i <= text.length + 8) {
      setTimeout(() => {
        // clear appended cursor before next step
        while (el.lastChild && el.lastChild.classList && el.lastChild.classList.contains('cursor')) {
          el.removeChild(el.lastChild);
        }
        step();
      }, 26);
    } else {
      // keep the full text visible briefly then fade out the bootline
      setTimeout(() => el.classList.add('hidden'), 900);
    }
  }
  step();
}

function setEducation(selectedKey) {
  const selected = educationData[selectedKey];
  if (!selected) return;

  eduTitle.textContent = selected.title;
  eduRole.textContent = selected.role;
  eduMeta.textContent = selected.meta;
  eduCopy.textContent = selected.copy;

  eduItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.edu === selectedKey);
  });
}
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * ratio);
  canvas.height = Math.floor(state.height * ratio);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function buildNodes() {
  // slightly denser node field to better match example site
  const count = Math.max(68, Math.floor((state.width * state.height) / 12000));
  state.nodes = Array.from({ length: count }, () => ({
    x: Math.random() * state.width,
    y: Math.random() * state.height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    radius: 1.1 + Math.random() * 1.8,
  }));
}

function draw() {
  context.clearRect(0, 0, state.width, state.height);
  context.fillStyle = 'rgba(46, 211, 111, 0.9)';
  context.strokeStyle = 'rgba(46, 211, 111, 0.2)';
  context.lineWidth = 1;

  for (let index = 0; index < state.nodes.length; index += 1) {
    const node = state.nodes[index];
    if (!state.paused) {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -20) node.x = state.width + 20;
      if (node.x > state.width + 20) node.x = -20;
      if (node.y < -20) node.y = state.height + 20;
      if (node.y > state.height + 20) node.y = -20;
    }

    for (let otherIndex = index + 1; otherIndex < state.nodes.length; otherIndex += 1) {
      const other = state.nodes[otherIndex];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 210) {
        const alpha = 1 - distance / 210;
        context.strokeStyle = `rgba(46, 211, 111, ${alpha * 0.28})`;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }

    context.beginPath();
    context.globalAlpha = 0.9;
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    context.fill();
  }

  context.globalAlpha = 1;
  context.fillStyle = 'rgba(46, 211, 111, 0.06)';
  context.fillRect(0, 0, state.width, state.height);
  requestAnimationFrame(draw);
}

// start bootline sequence then initialize canvas
startBootline();
if (eduItems.length) {
  setEducation('neu');
  eduItems.forEach((item) => {
    item.addEventListener('click', () => setEducation(item.dataset.edu));
  });
}
resizeCanvas();
buildNodes();
draw();

window.addEventListener('resize', () => {
  resizeCanvas();
  buildNodes();
});
