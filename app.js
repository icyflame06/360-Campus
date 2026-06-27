// --- CAMPUS360 APPLICATION STATE ---
const State = {
  activeView: 'dashboard',
  greenPoints: 240,
  roomsFree: 12,
  
  currentRole: 'student', // student, admin, tutor, librarian
  currentTheme: 'dark', // dark, light, contrast

  userRoles: {
    student: { name: "Harshil Swami", role: "Student (ID: 4892)", avatar: "H" },
    admin: { name: "Campus Admin", role: "Security Chief (Auth)", avatar: "A" },
    tutor: { name: "Harshil Swami", role: "Peer Tutor (Math/CS)", avatar: "T" },
    librarian: { name: "Mrs. Finch", role: "Head Librarian (In-Charge)", avatar: "L" }
  },
  
  // Expanded 9 Map Pin Coordinates (Percentage based left/top positions)
  mapCoordinates: {
    library: { top: 12, left: 8 },
    stem: { top: 10, left: 70 },
    union: { top: 60, left: 8 },
    dorms: { top: 72, left: 72 },
    hub: { top: 45, left: 42 },
    science: { top: 8, left: 40 },
    gym: { top: 35, left: 72 },
    parking: { top: 72, left: 40 },
    gate: { top: 85, left: 42 },
    eng: { top: 38, left: 8 }
  },

  // Escort Walker active state
  escortActive: false,
  escortInterval: null,

  // Safety Hazard Reports
  hazardReports: [
    { id: 1, type: 'environmental', location: 'Union Plaza North Entrance', desc: 'Slippery stairs due to sprinkler leakage.', status: 'critical', time: '10 mins ago' },
    { id: 2, type: 'infrastructure', location: 'STEM Lab level 2 corridor', desc: 'Ceiling light is flickering violently.', status: 'warning', time: '1 hr ago' },
    { id: 3, type: 'infrastructure', location: 'Library Main Elevator', desc: 'Unusual grinding noise during descent.', status: 'info', time: '4 hrs ago' }
  ],

  // EcoTrack Energy & Water logs
  ecoChartData: {
    electricity: [
      { day: 'Mon', val: 420 },
      { day: 'Tue', val: 390 },
      { day: 'Wed', val: 450 },
      { day: 'Thu', val: 380 },
      { day: 'Fri', val: 320 },
      { day: 'Sat', val: 190 },
      { day: 'Sun', val: 150 }
    ],
    water: [
      { day: 'Mon', val: 1200 },
      { day: 'Tue', val: 1100 },
      { day: 'Wed', val: 1250 },
      { day: 'Thu', val: 980 },
      { day: 'Fri', val: 920 },
      { day: 'Sat', val: 650 },
      { day: 'Sun', val: 600 }
    ]
  },
  currentChartMode: 'electricity',

  // AccessEasy status logs
  accessibilityEquipment: [
    { location: 'STEM Lab Complex', equipment: 'Central Elevators (East)', status: 'online' },
    { location: 'Library Main Wing', equipment: 'Lift A (Floors 1-4)', status: 'online' },
    { location: 'Student Union Hub', equipment: 'South Wheelchair Ramp', status: 'online' },
    { location: 'Residential Halls', equipment: 'Dorm Block C Lift', status: 'maintenance' },
    { location: 'Sports Center', equipment: 'Elevated Deck Ramp', status: 'online' }
  ],

  // AutoBook study rooms booking slots
  bookingMatrix: {
    'Study Room A (Library L1)': [true, false, true, true],
    'Study Room B (Library L1)': [true, true, 'maintenance', true],
    'Study Room C (Library L2)': ['blocked', true, true, true],
    'Study Room D (STEM Block)': [true, true, true, true],
    'Study Room E (Hub Quiet Wing)': [true, false, false, true]
  },
  bookingTimeSlots: ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'],

  // Locker Assignment
  assignedLocker: null,

  // CampusBuzz board
  buzzFeed: [
    { author: 'Elena R. (Grad Rep)', text: 'Lost keys with a red leather keyring near the Union Plaza. Please contact me if found!', time: '15 mins ago', likes: 4 },
    { author: 'Prof. Davis (CS)', text: 'Study group session for CS101 Intro to Programming starting in Library Room B at 4:30 PM. All welcome!', time: '1 hr ago', likes: 12 },
    { author: 'Eco Club', text: 'Eco-Points leaderboard resets on Monday! Get your recycling logged to win the free dining hall meal vouchers.', time: '2 hrs ago', likes: 18 }
  ],

  // Peer tutor list
  tutors: [
    { name: 'Alex K.', subjects: ['CS101', 'CS102', 'Data Structures'], rate: 'Free (Peer-Tutor)' },
    { name: 'Sarah L.', subjects: ['Calculus I', 'Calculus II', 'Linear Algebra'], rate: 'Free (Peer-Tutor)' },
    { name: 'Marcus J.', subjects: ['Organic Chemistry', 'Biology 101'], rate: 'Free (Peer-Tutor)' },
    { name: 'Jasmine T.', subjects: ['Physics I', 'Intro to Statistics'], rate: 'Free (Peer-Tutor)' }
  ],

  // System Notifications
  notifications: [
    { text: 'Energy conservation target met for STEM Lab.', unread: true, time: 'Just now' },
    { text: 'Campus Shuttle Blue Line delayed by 8 mins.', unread: true, time: '10 mins ago' },
    { text: 'Locker request approved. Code generated.', unread: false, time: '1 hr ago' }
  ],

  accessibilitySettings: {
    textToSpeech: false
  }
};

// --- ROLE-BASED ACCESS CONTROL (RBAC) CONFIG MATRIX ---
const Permissions = {
  student: {
    dashboard: true,
    safety: true,
    eco: true,
    accessibility: true,
    autobook: true,
    buzz: true,
    info: true
  },
  tutor: {
    dashboard: true,
    safety: true,
    eco: true,
    accessibility: true,
    autobook: true,
    buzz: true,
    info: true
  },
  librarian: {
    dashboard: true,
    safety: false, // Locked out
    eco: false, // Locked out
    accessibility: true,
    autobook: true, // Overrides matrix
    buzz: true, // Read-only dashboard access
    info: true
  },
  admin: {
    dashboard: true,
    safety: true, // Resolves reports
    eco: false, // Locked out
    accessibility: true,
    autobook: true, // Read-only matrix
    buzz: true, // Can delete inappropriate posts
    info: true
  }
};

// --- AUDIO SYNTHESIS SERVICE (Web Audio API) ---
function playSynthBeep(freq, type, duration) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type || 'sine';
    oscillator.frequency.value = freq || 440;
    
    gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("AudioContext block/unsupported", e);
  }
}

// Synthesize alarm sirens for SOS Help
let alarmInterval = null;
function startAlarmSiren() {
  if (alarmInterval) return;
  let toggle = false;
  alarmInterval = setInterval(() => {
    playSynthBeep(toggle ? 900 : 650, 'sawtooth', 0.25);
    toggle = !toggle;
  }, 300);
}

function stopAlarmSiren() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
}

// --- TEXT TO SPEECH SERVICE ---
function speakText(text) {
  if (!State.accessibilitySettings.textToSpeech) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

// --- UI NAV ROUTING & RBAC ENFORCER ---
function navigateTo(targetId) {
  // Check role-based permission
  const allowed = Permissions[State.currentRole][targetId];
  
  if (!allowed) {
    playSynthBeep(220, 'sawtooth', 0.35);
    triggerNotification(`ACCESS DENIED: Role [${State.currentRole.toUpperCase()}] is blocked from [${targetId.toUpperCase()}]`);
    
    // Toggle active class on sidebar items
    document.querySelectorAll('.sidebar .menu-item').forEach(item => {
      if (item.getAttribute('data-target') === targetId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle active class on viewport sections
    document.querySelectorAll('.module-section').forEach(sec => {
      if (sec.id === `section-${targetId}`) {
        sec.classList.add('active');
        
        // Hide permissions wrapper template
        const wrapper = document.getElementById(`${targetId}-permissions-wrapper`);
        if (wrapper) wrapper.style.display = 'none';

        // Render clean access-denied screen
        let deniedPanel = sec.querySelector('.access-denied-panel');
        if (!deniedPanel) {
          deniedPanel = document.createElement('div');
          deniedPanel.className = 'access-denied-panel';
          sec.appendChild(deniedPanel);
        }
        deniedPanel.style.display = 'flex';
        deniedPanel.innerHTML = `
          <div class="access-denied-icon">🔒</div>
          <h2 style="font-size:1.4rem; font-weight:800; color:var(--accent-danger); margin-bottom:8px;">Access Denied</h2>
          <p style="color:var(--color-text-secondary); max-width:400px; font-size:0.9rem; margin-bottom:1.5rem;">
            The active role perspective <strong>${State.currentRole.toUpperCase()}</strong> does not possess access credentials for the <strong>${targetId.toUpperCase()}</strong> module.
          </p>
          <button class="btn-primary" onclick="navigateTo('dashboard')">Return to Dashboard</button>
        `;
      } else {
        sec.classList.remove('active');
      }
    });

    speakText("Access Denied.");
    return;
  }

  State.activeView = targetId;

  // Toggle active class on sidebar items
  document.querySelectorAll('.sidebar .menu-item').forEach(item => {
    if (item.getAttribute('data-target') === targetId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle active class on viewport sections
  document.querySelectorAll('.module-section').forEach(sec => {
    if (sec.id === `section-${targetId}`) {
      sec.classList.add('active');

      // Restore allowed permissions template wrapper if applicable
      const wrapper = document.getElementById(`${targetId}-permissions-wrapper`);
      if (wrapper) wrapper.style.display = 'block';

      // Hide access denied panel
      const deniedPanel = sec.querySelector('.access-denied-panel');
      if (deniedPanel) deniedPanel.style.display = 'none';
      
    } else {
      sec.classList.remove('active');
    }
  });

  playSynthBeep(520, 'sine', 0.08);
  speakText(`${targetId.toUpperCase()} module loaded.`);
}

// --- THEME & ROLE SWITCHERS ---

function changeTheme(themeName) {
  State.currentTheme = themeName;
  document.body.classList.remove('theme-light', 'theme-contrast');
  
  if (themeName === 'light') {
    document.body.classList.add('theme-light');
  } else if (themeName === 'contrast') {
    document.body.classList.add('theme-contrast');
  }
  
  // Sync accessibility options UI highlights
  const contrastBtn = document.getElementById('btn-toggle-contrast');
  if (contrastBtn) {
    if (themeName === 'contrast') contrastBtn.classList.add('active');
    else contrastBtn.classList.remove('active');
  }

  // Update dropdown value
  const themeSelect = document.getElementById('select-theme');
  if (themeSelect) themeSelect.value = themeName;

  playSynthBeep(480, 'sine', 0.1);
  speakText(`Theme changed to ${themeName}.`);
}

function changeRole(roleName) {
  State.currentRole = roleName;
  
  // Update sidebar user badge info
  const roleData = State.userRoles[roleName];
  const sidebarAvatar = document.getElementById('sidebar-user-avatar');
  const sidebarName = document.getElementById('sidebar-user-name');
  const sidebarRole = document.getElementById('sidebar-user-role');
  
  if (sidebarAvatar) sidebarAvatar.innerText = roleData.avatar;
  if (sidebarName) sidebarName.innerText = roleData.name;
  if (sidebarRole) sidebarRole.innerText = roleData.role;

  // Toggle Dashboard role banner
  const banner = document.getElementById('dashboard-role-banner');
  const bannerText = document.getElementById('dashboard-role-text');
  const bannerHelp = document.getElementById('dashboard-role-help');
  
  if (banner) {
    banner.style.display = 'flex';
    if (bannerText) bannerText.innerText = `Perspective Mode: ${roleName.toUpperCase()}`;
    
    let helpMsg = "Standard student portal view.";
    if (roleName === 'admin') helpMsg = "Authorized to publish announcements, moderate boards, and resolve safety files.";
    if (roleName === 'tutor') helpMsg = "Specialty settings and tutoring schedule database console.";
    if (roleName === 'librarian') helpMsg = "Study Room bookings override mode is active. Click slots below to update states.";
    
    if (bannerHelp) bannerHelp.innerText = helpMsg;
  }

  // Toggle Dashboard widgets visibility
  const widgetStudent = document.getElementById('dash-action-student');
  const widgetLibrarian = document.getElementById('dash-action-librarian');
  const widgetAdmin = document.getElementById('dash-action-admin');
  const widgetTutor = document.getElementById('dash-action-tutor');

  if (widgetStudent) widgetStudent.style.display = (roleName === 'student') ? 'block' : 'none';
  if (widgetLibrarian) widgetLibrarian.style.display = (roleName === 'librarian') ? 'block' : 'none';
  if (widgetAdmin) widgetAdmin.style.display = (roleName === 'admin') ? 'block' : 'none';
  if (widgetTutor) widgetTutor.style.display = (roleName === 'tutor') ? 'block' : 'none';

  // Toggle Librarian Room Booking key guidelines
  const libGuide = document.getElementById('booking-role-guide');
  const librarianKeys = document.querySelectorAll('.librarian-key-only');
  
  if (libGuide) {
    libGuide.innerText = (roleName === 'librarian') 
      ? "Librarian Overrides: Click any slot to toggle: Available → Booked → Maintenance → Blocked" 
      : "Click any available green slot below to book. You can click again to cancel your booking.";
  }
  
  librarianKeys.forEach(k => {
    k.style.display = (roleName === 'librarian') ? 'flex' : 'none';
  });

  // Sync sidebar navigation lock icons depending on permissions matrix
  document.querySelectorAll('.sidebar-menu .menu-item').forEach(item => {
    const targetView = item.getAttribute('data-target');
    const hasAccess = Permissions[roleName][targetView];
    if (hasAccess) {
      item.classList.remove('locked');
    } else {
      item.classList.add('locked');
    }
  });

  // Action level adjustments: Lock rewards card if not student/tutor
  const rewardsCard = document.getElementById('eco-rewards-card-blockable');
  if (rewardsCard) {
    if (roleName === 'admin' || roleName === 'librarian') {
      rewardsCard.style.opacity = '0.5';
    } else {
      rewardsCard.style.opacity = '1';
    }
  }

  // Hide/Show posting inputs on Buzz board depending on role
  const buzzInputBar = document.getElementById('buzz-input-bar-blockable');
  if (buzzInputBar) {
    if (roleName === 'librarian') {
      buzzInputBar.style.display = 'none'; // Librarians are Read-only on Buzz
    } else {
      buzzInputBar.style.display = 'flex';
    }
  }

  // Block locker cards for non-student roles
  const lockerCard = document.getElementById('autobook-locker-card-blockable');
  if (lockerCard) {
    if (roleName === 'admin' || roleName === 'librarian') {
      lockerCard.style.opacity = '0.5';
    } else {
      lockerCard.style.opacity = '1';
    }
  }

  // Re-sync Room Grid & Buzz Feed to apply Moderator Buttons
  renderBookingMatrix();
  renderBuzzFeed();

  // If the active view is now forbidden under this role, force navigate to Dashboard
  if (!Permissions[roleName][State.activeView]) {
    navigateTo('dashboard');
  }

  playSynthBeep(640, 'sine', 0.12);
  speakText(`Role perspective set to ${roleName}.`);
}

// --- RENDER DYNAMIC VIEWS ---

// Render active hazard reports
function renderHazardReports() {
  const reportsList = document.getElementById('hazard-reports-list');
  if (!reportsList) return;
  reportsList.innerHTML = '';

  State.hazardReports.forEach((rep, index) => {
    const item = document.createElement('div');
    item.className = 'report-item';
    
    let tagClass = 'tag-info';
    if (rep.status === 'critical') tagClass = 'tag-critical';
    if (rep.status === 'warning') tagClass = 'tag-warning';

    // Show 'Resolve' button if user is Admin
    const actionButtonHtml = (State.currentRole === 'admin') 
      ? `<button class="btn-outline resolve-hazard-btn" data-index="${index}" style="padding:4px 8px; font-size:0.7rem; border-color:var(--accent-success); color:var(--accent-success);">Resolve</button>` 
      : '';

    item.innerHTML = `
      <div>
        <div style="font-weight: 700; color: var(--color-text-primary); font-size:0.85rem;">
          ${rep.location} <span style="font-weight:400; font-size:0.75rem; color:var(--accent-primary);">[${rep.type.toUpperCase()}]</span>
        </div>
        <div style="color: var(--color-text-secondary); margin-top: 2px;">${rep.desc}</div>
        <small style="color: var(--color-text-muted); display: block; margin-top: 4px;">${rep.time}</small>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="report-tag ${tagClass}">${rep.status}</span>
        ${actionButtonHtml}
      </div>
    `;

    // Hook up Admin resolver trigger
    if (State.currentRole === 'admin') {
      const resolveBtn = item.querySelector('.resolve-hazard-btn');
      if (resolveBtn) {
        resolveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(resolveBtn.getAttribute('data-index'));
          const resolvedReport = State.hazardReports[idx];
          
          State.hazardReports.splice(idx, 1);
          renderHazardReports();
          
          triggerNotification(`Admin: Resolved safety hazard file at ${resolvedReport.location}.`);
          playSynthBeep(800, 'sine', 0.1);
        });
      }
    }

    reportsList.appendChild(item);
  });
}

// Render dynamic CSS bars charts
function renderSustainabilityChart() {
  const chartBox = document.getElementById('eco-chart-display');
  if (!chartBox) return;
  chartBox.innerHTML = '';

  const dataSet = State.ecoChartData[State.currentChartMode];
  const maxVal = Math.max(...dataSet.map(d => d.val));

  dataSet.forEach(d => {
    const heightPercent = maxVal > 0 ? (d.val / maxVal) * 100 : 0;
    
    const barContainer = document.createElement('div');
    barContainer.className = 'eco-chart-bar-container';

    const bar = document.createElement('div');
    bar.className = `eco-chart-bar ${State.currentChartMode === 'water' ? 'water' : ''}`;
    bar.setAttribute('data-val', d.val);
    
    bar.style.height = '0%';
    setTimeout(() => {
      bar.style.height = `${heightPercent}%`;
    }, 50);

    const label = document.createElement('span');
    label.className = 'eco-chart-label';
    label.innerText = d.day;

    barContainer.appendChild(bar);
    barContainer.appendChild(label);
    chartBox.appendChild(barContainer);
  });
}

// Render elevator/accessibility status list
function renderAccessibilityList() {
  const tbody = document.getElementById('access-equipment-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  State.accessibilityEquipment.forEach(eq => {
    const tr = document.createElement('tr');
    
    const statusText = eq.status === 'online' ? 'Operational' : 'Under Maintenance';
    const statusClass = eq.status === 'online' ? 'status-online' : 'status-maintenance';

    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--color-text-primary);">${eq.location}</td>
      <td style="color: var(--color-text-secondary);">${eq.equipment}</td>
      <td>
        <span class="status-indicator ${statusClass}">${statusText}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  const activeCount = State.accessibilityEquipment.filter(e => e.status === 'online').length;
  const statLifts = document.getElementById('stat-elevator-rate');
  if (statLifts) {
    statLifts.innerText = `${activeCount} / ${State.accessibilityEquipment.length}`;
  }
}

// Render study rooms booking scheduler
function renderBookingMatrix() {
  const tbody = document.getElementById('booking-matrix-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let calculatedFree = 0;

  Object.keys(State.bookingMatrix).forEach(roomName => {
    const tr = document.createElement('tr');
    
    const roomCell = document.createElement('td');
    roomCell.className = 'cell-room';
    roomCell.innerText = roomName;
    tr.appendChild(roomCell);

    const slots = State.bookingMatrix[roomName];
    slots.forEach((slotState, idx) => {
      const td = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'slot-btn';

      if (slotState === true) {
        btn.classList.add('slot-available');
        btn.innerText = 'Available';
        calculatedFree++;
      } else if (slotState === false) {
        btn.classList.add('slot-booked');
        btn.innerText = 'Occupied';
      } else if (slotState === 'me') {
        btn.classList.add('slot-my-booking');
        btn.innerText = 'My Booking';
      } else if (slotState === 'maintenance') {
        btn.classList.add('slot-maintenance');
        btn.innerText = 'Maintenance';
      } else if (slotState === 'blocked') {
        btn.classList.add('slot-blocked');
        btn.innerText = 'Blocked';
      }

      btn.addEventListener('click', () => handleRoomSlotClick(roomName, idx));

      td.appendChild(btn);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  State.roomsFree = calculatedFree;
  const statRooms = document.getElementById('stat-rooms-avail');
  if (statRooms) statRooms.innerText = calculatedFree;
}

// Room slot actions switcher based on Active Role permissions
function handleRoomSlotClick(roomName, index) {
  const currentState = State.bookingMatrix[roomName][index];

  // ADMIN ROLE LACK OF PERMISSIONS
  if (State.currentRole === 'admin') {
    playSynthBeep(250, 'triangle', 0.25);
    alert("Admin Perspective: Study Room Matrix is View-Only. Admins cannot make personal bookings.");
    return;
  }

  // LIBRARIAN ROLE OVERRIDES
  if (State.currentRole === 'librarian') {
    let nextState;
    if (currentState === true) nextState = false; // Occupied
    else if (currentState === false || currentState === 'me') nextState = 'maintenance'; // Maintenance
    else if (currentState === 'maintenance') nextState = 'blocked'; // Event Blocked
    else nextState = true; // Loop back to Available

    State.bookingMatrix[roomName][index] = nextState;
    
    playSynthBeep(700, 'sine', 0.12);
    triggerNotification(`Librarian: Updated ${roomName} slot ${State.bookingTimeSlots[index]} to ${nextState === true ? 'Available' : nextState.toString().toUpperCase()}`);
    renderBookingMatrix();
    return;
  }

  // STANDARD STUDENT/TUTOR ROLE ACTIONS
  if (currentState === true) {
    State.bookingMatrix[roomName][index] = 'me';
    playSynthBeep(640, 'sine', 0.12);
    triggerNotification(`AutoBook: Booked ${roomName} for ${State.bookingTimeSlots[index]}.`);
  } else if (currentState === 'me') {
    State.bookingMatrix[roomName][index] = true;
    playSynthBeep(420, 'sine', 0.1);
    triggerNotification(`AutoBook: Cancelled reservation in ${roomName}.`);
  } else {
    playSynthBeep(250, 'triangle', 0.25);
    let reason = "occupied";
    if (currentState === 'maintenance') reason = "under maintenance";
    if (currentState === 'blocked') reason = "blocked for a special event";
    alert(`This room slot is currently ${reason} and cannot be reserved.`);
  }

  renderBookingMatrix();
}

// Render announcements feed (Includes Moderator Delete buttons for Admins)
function renderBuzzFeed() {
  const list = document.getElementById('buzz-feed-list');
  if (!list) return;
  list.innerHTML = '';

  State.buzzFeed.forEach((post, index) => {
    const card = document.createElement('div');
    card.className = 'buzz-card';
    
    // Admin Moderator Delete Action button
    const deleteButtonHtml = (State.currentRole === 'admin') 
      ? `<button class="btn-delete-buzz delete-post-btn" data-index="${index}">
          <svg viewBox="0 0 24 24" stroke-width="2" style="width:12px;height:12px;stroke:currentColor;fill:none;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete
         </button>` 
      : '';

    card.innerHTML = `
      <div class="buzz-header">
        <span class="buzz-author">${post.author}</span>
        <span>${post.time}</span>
      </div>
      <p class="buzz-body">${post.text}</p>
      <div class="buzz-actions">
        <button class="btn-buzz-action btn-like">
          <svg viewBox="0 0 24 24" stroke-width="2" style="width:14px;height:14px;"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          <span>${post.likes} Likes</span>
        </button>
        ${deleteButtonHtml}
      </div>
    `;
    
    const likeBtn = card.querySelector('.btn-like');
    likeBtn.addEventListener('click', () => {
      post.likes++;
      likeBtn.querySelector('span').innerText = `${post.likes} Likes`;
      likeBtn.style.color = 'var(--accent-primary)';
      playSynthBeep(700, 'sine', 0.05);
    });

    if (State.currentRole === 'admin') {
      const deleteBtn = card.querySelector('.delete-post-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(deleteBtn.getAttribute('data-index'));
          State.buzzFeed.splice(idx, 1);
          renderBuzzFeed();
          triggerNotification("Admin: Deleted inappropriate buzz announcement.");
          playSynthBeep(330, 'triangle', 0.15);
        });
      }
    }

    list.appendChild(card);
  });
}

// Render Peer tutor search
function renderTutorList(filterText = '') {
  const list = document.getElementById('tutor-results-list');
  if (!list) return;
  list.innerHTML = '';

  const filtered = State.tutors.filter(t => {
    const subjectsStr = t.subjects.join(' ').toLowerCase();
    return subjectsStr.includes(filterText.toLowerCase()) || t.name.toLowerCase().includes(filterText.toLowerCase());
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div style="font-size:0.8rem; color:var(--color-text-muted);">No matching tutors found. Try searching CS101.</div>`;
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tutor-card';
    card.innerHTML = `
      <div>
        <div class="tutor-name">${t.name}</div>
        <div class="tutor-subject">${t.subjects.join(', ')}</div>
      </div>
      <button class="btn-outline" style="padding:6px 12px; font-size:0.75rem;">Contact Tutor</button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      playSynthBeep(600, 'sine', 0.1);
      alert(`Connecting you with ${t.name}. A chat invitation has been sent to their inbox!`);
    });

    list.appendChild(card);
  });
}

// Render Notification Drawer
function renderNotificationDrawer() {
  const drawerBody = document.getElementById('notification-drawer-body');
  const notiBadge = document.getElementById('noti-badge');
  if (!drawerBody) return;
  
  drawerBody.innerHTML = '';
  let unreadCount = 0;

  State.notifications.forEach(n => {
    if (n.unread) unreadCount++;
    const item = document.createElement('div');
    item.className = 'drawer-item';
    if (n.unread) item.style.borderLeft = '3px solid var(--accent-primary)';
    
    item.innerHTML = `
      <div style="color:var(--color-text-primary); font-weight:600;">${n.text}</div>
      <small style="color:var(--color-text-muted); font-size:0.65rem;">${n.time}</small>
    `;
    drawerBody.appendChild(item);
  });

  if (notiBadge) {
    notiBadge.style.display = unreadCount > 0 ? 'block' : 'none';
  }
}

// Trigger system push notifications
function triggerNotification(text) {
  State.notifications.unshift({
    text: text,
    unread: true,
    time: 'Just now'
  });
  renderNotificationDrawer();
  
  // Flash indicators
  const navNoti = document.getElementById('btn-notifications');
  if (navNoti) {
    navNoti.style.transform = 'scale(1.15)';
    setTimeout(() => navNoti.style.transform = 'scale(1)', 200);
  }
  playSynthBeep(800, 'sine', 0.15);
}

// --- DYNAMIC INTERACTIONS ---

// Green Points increment log animation
function addGreenPoints(amount) {
  const targetPoints = State.greenPoints + amount;
  const pointsEl = document.getElementById('eco-points-display');
  const dashPointsEl = document.getElementById('stat-green-points');
  
  let current = State.greenPoints;
  const diff = targetPoints - current;
  const speed = Math.max(5, Math.floor(100 / Math.abs(diff)));
  
  const timer = setInterval(() => {
    if (diff > 0) current++;
    else current--;
    
    if (pointsEl) pointsEl.innerText = current;
    if (dashPointsEl) dashPointsEl.innerText = current;
    
    if (current === targetPoints) {
      clearInterval(timer);
    }
  }, speed);

  State.greenPoints = targetPoints;
  playSynthBeep(650, 'sine', 0.15);
}

// Safe Walk live progress simulation (Handles expanded coordinates)
function initiateSafeWalkSimulation(startBld, endBld) {
  if (State.escortActive) return;
  State.escortActive = true;
  
  const progressBar = document.getElementById('escort-progress-bar');
  const progressPercent = document.getElementById('escort-percentage');
  const routeStatus = document.getElementById('escort-route-status');
  const trackerWrapper = document.getElementById('escort-tracker-status');
  const userPin = document.getElementById('map-user-pin');
  const mapStatusText = document.getElementById('map-status-txt');
  const cancelBtn = document.getElementById('btn-cancel-escort');
  const requestBtn = document.getElementById('btn-request-escort');

  if (trackerWrapper) trackerWrapper.style.display = 'block';
  if (cancelBtn) cancelBtn.style.display = 'inline-block';
  if (requestBtn) requestBtn.style.disabled = true;

  userPin.classList.add('escort');
  const startCoords = State.mapCoordinates[startBld] || State.mapCoordinates.library;
  const endCoords = State.mapCoordinates[endBld] || State.mapCoordinates.dorms;

  userPin.style.top = `${startCoords.top}%`;
  userPin.style.left = `${startCoords.left}%`;

  let progress = 0;
  progressBar.style.width = '0%';
  progressPercent.innerText = '0%';
  routeStatus.innerText = `Accompanying: ${startBld.toUpperCase()} to ${endBld.toUpperCase()}`;
  if (mapStatusText) mapStatusText.innerText = `Status: Escort Active. Live-tracking Harshil to ${endBld.toUpperCase()}.`;

  State.escortInterval = setInterval(() => {
    progress += 5;
    progressBar.style.width = `${progress}%`;
    progressPercent.innerText = `${progress}%`;

    // Interpolate current coordinate position
    const currTop = startCoords.top + ((endCoords.top - startCoords.top) * (progress / 100));
    const currLeft = startCoords.left + ((endCoords.left - startCoords.left) * (progress / 100));
    
    userPin.style.top = `${currTop}%`;
    userPin.style.left = `${currLeft}%`;

    playSynthBeep(700 + (progress * 2), 'sine', 0.04);

    if (progress >= 100) {
      clearInterval(State.escortInterval);
      State.escortActive = false;
      if (cancelBtn) cancelBtn.style.display = 'none';
      if (requestBtn) requestBtn.style.disabled = false;
      
      routeStatus.innerText = `Destination Reached!`;
      triggerNotification(`Safe-Walk: Arrived at ${endBld.toUpperCase()}. Thank you for walking safe!`);
      
      setTimeout(() => {
        if (trackerWrapper) trackerWrapper.style.display = 'none';
        userPin.classList.remove('escort');
        if (mapStatusText) mapStatusText.innerText = 'Status: GPS Active. Standard Campus Safe Walk operational.';
      }, 3000);
    }
  }, 400);
}

// Cancel Active Safe Walk
function cancelSafeWalkSimulation() {
  if (State.escortInterval) {
    clearInterval(State.escortInterval);
    State.escortInterval = null;
  }
  State.escortActive = false;

  const progressBar = document.getElementById('escort-progress-bar');
  const progressPercent = document.getElementById('escort-percentage');
  const routeStatus = document.getElementById('escort-route-status');
  const trackerWrapper = document.getElementById('escort-tracker-status');
  const userPin = document.getElementById('map-user-pin');
  const mapStatusText = document.getElementById('map-status-txt');
  const cancelBtn = document.getElementById('btn-cancel-escort');
  const requestBtn = document.getElementById('btn-request-escort');

  if (trackerWrapper) trackerWrapper.style.display = 'none';
  if (cancelBtn) cancelBtn.style.display = 'none';
  if (requestBtn) requestBtn.disabled = false;

  userPin.classList.remove('escort');
  userPin.style.top = '45%';
  userPin.style.left = '42%';
  if (mapStatusText) mapStatusText.innerText = 'Status: Safe Walk Cancelled.';
  
  triggerNotification(`Safe-Walk escort session cancelled by user.`);
  playSynthBeep(330, 'triangle', 0.35);
}

// Wellbeing Mood Motivational feedback updates
function triggerMoodRecommendation(mood, containerId = 'dash-mood-rec') {
  const recEl = document.getElementById(containerId);
  if (!recEl) return;

  let message = "";
  switch(mood) {
    case 'happy':
      message = "😊 \"Happiness is not something readymade. It comes from your own actions.\" — Dalai Lama.\nSpread that positivity around! Check out today's volunteer matches at the Student Union Hall.";
      break;
    case 'tired':
      message = "😴 \"It is okay to rest. A completely flat battery can never start a car. Take a break!\" — Unknown.\nYou look drained. Drop by the quiet study pods on Library Level 3 and claim your free hot beverage voucher.";
      break;
    case 'stressed':
      message = "😰 \"You don't have to control everything. Just breathe, focus, and let go.\" — Unknown.\nAcademic stress is tough. Stop by the MindSpace counseling center in Hub Room 10. You've got this, step by step!";
      break;
    case 'neutral':
      message = "😐 \"Focus on the step in front of you, not the whole staircase.\" — Unknown.\nA productive, calm mindset. Grab a study table in the quiet section of the Library (12 rooms free right now) to get in the zone.";
      break;
    case 'lonely':
      message = "🥺 \"Connection is why we are here; it is what gives purpose and meaning to our lives.\" — Brené Brown.\nFeeling disconnected? Join the peer board game mixer at the Dining Hall Lounge tonight at 7 PM to meet new friends!";
      break;
  }

  recEl.innerText = message;
  recEl.style.display = 'block';
  playSynthBeep(620, 'sine', 0.1);
}

// --- SETUP EVENT LISTENERS ---
function setupEventListeners() {

  // Theme Dropdown Selector
  const themeSelect = document.getElementById('select-theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      changeTheme(e.target.value);
    });
  }

  // Role Dropdown Selector
  const roleSelect = document.getElementById('select-role');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      changeRole(e.target.value);
    });
  }

  // View Navigation Toggles (Includes locked intercept logic)
  document.querySelectorAll('.sidebar .menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = item.getAttribute('data-target');
      navigateTo(target);
    });
  });

  // Top Bar Search
  const globalSearch = document.getElementById('global-search');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      const query = e.target.value;
      renderTutorList(query);
      
      const allowedBuzz = Permissions[State.currentRole]['buzz'];
      if (State.activeView !== 'buzz' && State.activeView !== 'info' && query.length > 2 && allowedBuzz) {
        navigateTo('buzz');
        const searchInput = document.getElementById('tutor-search-input');
        if (searchInput) {
          searchInput.value = query;
          renderTutorList(query);
        }
      }
    });
  }

  // Dashboard Eco Quick Log button
  const dashEcoBtn = document.getElementById('btn-dash-ecolog');
  if (dashEcoBtn) {
    dashEcoBtn.addEventListener('click', () => {
      if (State.currentRole === 'admin' || State.currentRole === 'librarian') {
        playSynthBeep(250, 'triangle', 0.25);
        alert("Action Denied: Librarians/Admins cannot register recycling points.");
        return;
      }
      const select = document.getElementById('dash-eco-select');
      const val = select.value;
      let pts = 10;
      let label = 'Plastic Bottle';
      if (val === 'can') { pts = 15; label = 'Aluminum Can'; }
      if (val === 'paper') { pts = 5; label = 'Cardboard/Paper'; }

      addGreenPoints(pts);
      triggerNotification(`EcoTrack: Logged recycling of ${label}. Earned ${pts} green points!`);
    });
  }

  // Admin Broadcast publishing to Ticker
  const adminBroadBtn = document.getElementById('btn-admin-broadcast');
  const adminBroadInput = document.getElementById('admin-broadcast-input');
  if (adminBroadBtn && adminBroadInput) {
    adminBroadBtn.addEventListener('click', () => {
      const txt = adminBroadInput.value.trim();
      if (txt === '') return;

      const tickerText = document.getElementById('ticker-text');
      if (tickerText) {
        tickerText.innerText = `📢 [ADMIN BROADCAST]: ${txt} | ${tickerText.innerText}`;
      }
      triggerNotification(`Admin: Published global broadcast announcement notice.`);
      playSynthBeep(850, 'sine', 0.15);
      adminBroadInput.value = '';
    });
  }

  // Tutor specialty adding
  const addSpecialtyBtn = document.getElementById('btn-tutor-add-sub');
  const specialtyInput = document.getElementById('tutor-new-subject');
  if (addSpecialtyBtn && specialtyInput) {
    addSpecialtyBtn.addEventListener('click', () => {
      const sub = specialtyInput.value.trim().toUpperCase();
      if (sub === '') return;

      const specialitiesEl = document.getElementById('tutor-specialty-list');
      if (specialitiesEl) {
        specialitiesEl.innerText = `${specialitiesEl.innerText}, ${sub}`;
      }

      State.tutors.push({ name: 'Harshil Swami (You)', subjects: [sub], rate: 'Free (Peer-Tutor)' });
      renderTutorList();

      triggerNotification(`TutorMatch: Added specialty ${sub} to your database profile.`);
      playSynthBeep(680, 'sine', 0.1);
      specialtyInput.value = '';
    });
  }

  // Tutor Availability toggle
  const tutorActiveBtn = document.getElementById('btn-tutor-active');
  if (tutorActiveBtn) {
    tutorActiveBtn.addEventListener('click', () => {
      const active = tutorActiveBtn.classList.toggle('active');
      tutorActiveBtn.innerText = active ? "Status: Active (Online)" : "Status: Inactive (Offline)";
      
      triggerNotification(`TutorMatch: Tutoring availability status set to ${active ? 'Online' : 'Offline'}.`);
      playSynthBeep(600, 'sine', 0.1);
    });
  }

  // Dashboard Mood selections
  document.querySelectorAll('.dash-mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      triggerMoodRecommendation(mood);
    });
  });

  // Full Wellbeing Tab Mood selectors
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mood = btn.getAttribute('data-mood');
      triggerMoodRecommendation(mood, 'wellbeing-mood-rec');
    });
  });

  // Safe Walk request button
  const reqEscortBtn = document.getElementById('btn-request-escort');
  if (reqEscortBtn) {
    reqEscortBtn.addEventListener('click', () => {
      const startBld = document.getElementById('escort-start').value;
      const endBld = document.getElementById('escort-end').value;
      
      if (startBld === endBld) {
        alert("Starting location and destination cannot be identical.");
        return;
      }
      initiateSafeWalkSimulation(startBld, endBld);
    });
  }

  // Safe Walk cancel button
  const cancelEscortBtn = document.getElementById('btn-cancel-escort');
  if (cancelEscortBtn) {
    cancelEscortBtn.addEventListener('click', () => {
      cancelSafeWalkSimulation();
    });
  }

  // Conditional custom classification toggling in safety hazard forms
  const hazardTypeSelect = document.getElementById('hazard-type');
  const customHazardGroup = document.getElementById('custom-hazard-group');
  if (hazardTypeSelect && customHazardGroup) {
    hazardTypeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'other') {
        customHazardGroup.style.display = 'block';
      } else {
        customHazardGroup.style.display = 'none';
      }
    });
  }

  // Hazard reporting submission
  const hazardForm = document.getElementById('form-hazard-report');
  if (hazardForm) {
    hazardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const typeSelect = document.getElementById('hazard-type');
      let typeLabel = typeSelect.value;
      if (typeLabel === 'other') {
        const customField = document.getElementById('custom-hazard-type');
        typeLabel = customField.value.trim() !== '' ? customField.value.trim() : 'Custom Hazard';
      }

      const location = document.getElementById('hazard-location').value;
      const desc = document.getElementById('hazard-desc').value;

      State.hazardReports.unshift({
        id: Date.now(),
        type: typeLabel,
        location: location,
        desc: desc,
        status: (typeSelect.value === 'suspicious' || typeSelect.value === 'fire') ? 'critical' : 'warning',
        time: 'Just now'
      });

      renderHazardReports();
      triggerNotification(`Safety Report: Filed hazard classified as [${typeLabel}] at ${location}.`);
      hazardForm.reset();
      if (customHazardGroup) customHazardGroup.style.display = 'none';
      
      const scoreEl = document.getElementById('stat-safety-score');
      if (scoreEl) scoreEl.innerText = "99%";
    });
  }

  // Chart view switches (Electricity / Water)
  const elecBtn = document.getElementById('btn-chart-electricity');
  const waterBtn = document.getElementById('btn-chart-water');
  if (elecBtn && waterBtn) {
    elecBtn.addEventListener('click', () => {
      elecBtn.classList.add('active');
      waterBtn.classList.remove('active');
      State.currentChartMode = 'electricity';
      renderSustainabilityChart();
      playSynthBeep(520, 'sine', 0.08);
    });
    waterBtn.addEventListener('click', () => {
      waterBtn.classList.add('active');
      elecBtn.classList.remove('active');
      State.currentChartMode = 'water';
      renderSustainabilityChart();
      playSynthBeep(580, 'sine', 0.08);
    });
  }

  // Claim Eco Rewards
  document.querySelectorAll('[id^="btn-claim-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (State.currentRole === 'admin' || State.currentRole === 'librarian') {
        playSynthBeep(250, 'triangle', 0.25);
        alert("Action Denied: Librarians/Admins cannot claim Eco incentives.");
        return;
      }
      const cost = parseInt(btn.getAttribute('data-cost'));
      const label = btn.querySelector('span').innerText;

      if (State.greenPoints >= cost) {
        addGreenPoints(-cost);
        triggerNotification(`EcoTrack: Redeemed coupon for "${label}". Code sent.`);
        alert(`Redemption Approved! Check your student email or inbox tab for access instructions.`);
      } else {
        playSynthBeep(250, 'triangle', 0.3);
        alert(`Insufficient Green Points. You need ${cost - State.greenPoints} more points for this reward.`);
      }
    });
  });

  // Accessibility Switches
  const contrastBtn = document.getElementById('btn-toggle-contrast');
  const quickContrast = document.getElementById('btn-quick-contrast');
  
  const handleContrastToggle = () => {
    const nextTheme = (State.currentTheme === 'contrast') ? 'dark' : 'contrast';
    changeTheme(nextTheme);
  };
  if (contrastBtn) contrastBtn.addEventListener('click', handleContrastToggle);
  if (quickContrast) quickContrast.addEventListener('click', handleContrastToggle);

  const fontBtn = document.getElementById('btn-toggle-font');
  const quickFont = document.getElementById('btn-quick-font');
  const handleFontToggle = () => {
    const active = document.body.classList.toggle('large-font');
    if (fontBtn) fontBtn.classList.toggle('active', active);
    playSynthBeep(active ? 650 : 500, 'sine', 0.1);
    speakText("Large font mode toggled.");
  };
  if (fontBtn) fontBtn.addEventListener('click', handleFontToggle);
  if (quickFont) quickFont.addEventListener('click', handleFontToggle);

  const ttsBtn = document.getElementById('btn-toggle-tts');
  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      State.accessibilitySettings.textToSpeech = !State.accessibilitySettings.textToSpeech;
      ttsBtn.classList.toggle('active', State.accessibilitySettings.textToSpeech);
      const indicator = document.getElementById('tts-indicator');
      if (indicator) indicator.style.display = State.accessibilitySettings.textToSpeech ? 'block' : 'none';
      
      playSynthBeep(State.accessibilitySettings.textToSpeech ? 700 : 400, 'sine', 0.15);
      if (State.accessibilitySettings.textToSpeech) {
        speakText("Voice Assist Mode activated. Hover over elements to read details.");
      }
    });
  }

  // TTS Element Hover synthesis
  document.addEventListener('mouseover', (e) => {
    if (!State.accessibilitySettings.textToSpeech) return;
    const target = e.target;
    if (target.matches('h1, h2, h3, a, button, p, span, th, td') && target.innerText.trim() !== '') {
      if (target.dataset.lastSpoken && Date.now() - parseInt(target.dataset.lastSpoken) < 2000) {
        return;
      }
      target.dataset.lastSpoken = Date.now();
      speakText(target.innerText);
    }
  });

  // Report broken access equipment
  const accessForm = document.getElementById('form-accessibility-report');
  if (accessForm) {
    accessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bld = document.getElementById('access-bld').value;
      const type = document.getElementById('access-type').value;
      const desc = document.getElementById('access-desc').value;

      let bldName = 'Library Complex';
      if (bld === 'stem') bldName = 'STEM Lab Block';
      if (bld === 'union') bldName = 'Student Union';
      if (bld === 'dorms') bldName = 'Residential Halls';

      let typeName = 'Elevator';
      if (type === 'ramp') typeName = 'Access Ramp';
      if (type === 'braille') typeName = 'Braille Audio Support';

      State.accessibilityEquipment.unshift({
        location: bldName,
        equipment: `${typeName} (${desc.substring(0, 15)}...)`,
        status: 'maintenance'
      });

      renderAccessibilityList();
      triggerNotification(`Accessibility System: Facility alerted of broken ${typeName} in ${bldName}.`);
      accessForm.reset();
    });
  }

  // Smart Digital Locker Allocation
  const reqLockerBtn = document.getElementById('btn-request-locker');
  const releaseLockerBtn = document.getElementById('btn-release-locker');
  const lockerUnassigned = document.getElementById('locker-unassigned-view');
  const lockerAssigned = document.getElementById('locker-assigned-view');

  if (reqLockerBtn && releaseLockerBtn) {
    reqLockerBtn.addEventListener('click', () => {
      if (State.currentRole === 'admin' || State.currentRole === 'librarian') {
        playSynthBeep(250, 'triangle', 0.25);
        alert("Action Denied: Librarians/Admins cannot request personal storage lockers.");
        return;
      }
      const randNum = Math.floor(100 + Math.random() * 900);
      const randPin = Math.floor(1000 + Math.random() * 9000);

      State.assignedLocker = { num: `#A-${randNum}`, pin: randPin };
      
      document.getElementById('assigned-locker-num').innerText = State.assignedLocker.num;
      document.getElementById('assigned-locker-pin').innerText = State.assignedLocker.pin;

      lockerUnassigned.style.display = 'none';
      lockerAssigned.style.display = 'block';

      playSynthBeep(850, 'sine', 0.2);
      triggerNotification(`SmartLockers: Allocated locker ${State.assignedLocker.num}. Access Pin: ${randPin}.`);
    });

    releaseLockerBtn.addEventListener('click', () => {
      State.assignedLocker = null;
      lockerUnassigned.style.display = 'flex';
      lockerAssigned.style.display = 'none';
      
      playSynthBeep(380, 'sine', 0.15);
      triggerNotification(`SmartLockers: Locker released successfully.`);
    });
  }

  // Publish Announcement Buzz
  const postBuzzBtn = document.getElementById('btn-post-buzz');
  const buzzInput = document.getElementById('buzz-input-text');
  if (postBuzzBtn && buzzInput) {
    postBuzzBtn.addEventListener('click', () => {
      const text = buzzInput.value.trim();
      if (text === '') return;

      State.buzzFeed.unshift({
        author: `${State.userRoles[State.currentRole].name} (${State.currentRole.toUpperCase()})`,
        text: text,
        time: 'Just now',
        likes: 0
      });

      renderBuzzFeed();
      triggerNotification(`CampusBuzz: Published your announcement to the bulletin feed.`);
      buzzInput.value = '';
    });
  }

  // Tutor search filters
  const tutorSearch = document.getElementById('tutor-search-input');
  if (tutorSearch) {
    tutorSearch.addEventListener('input', (e) => {
      renderTutorList(e.target.value);
    });
  }

  // Notifications Bell dropdown toggle
  const notiBell = document.getElementById('btn-notifications');
  const notiDrawer = document.getElementById('notification-drawer');
  if (notiBell && notiDrawer) {
    notiBell.addEventListener('click', (e) => {
      e.stopPropagation();
      notiDrawer.classList.toggle('active');
      playSynthBeep(600, 'sine', 0.05);
    });
  }

  // Close notifications if clicked outside
  document.addEventListener('click', () => {
    if (notiDrawer) notiDrawer.classList.remove('active');
  });
  if (notiDrawer) {
    notiDrawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Clear notifications
  const clearNotiBtn = document.getElementById('btn-clear-notifications');
  if (clearNotiBtn) {
    clearNotiBtn.addEventListener('click', () => {
      State.notifications.forEach(n => n.unread = false);
      renderNotificationDrawer();
      playSynthBeep(450, 'sine', 0.1);
    });
  }

  // SOS Modals trigger
  const sosTrigger = document.getElementById('btn-sos-trigger');
  const sosModal = document.getElementById('modal-sos-overlay');
  const closeSosBtn = document.getElementById('btn-close-sos');
  const sosPulseBtn = document.getElementById('btn-sos-pulse');
  const countdownTxt = document.getElementById('sos-countdown-txt');
  const successAlert = document.getElementById('sos-success-alert');

  let sosCountdown = 3;
  let sosTimer = null;

  const triggerSOS = () => {
    // Librarians cannot trigger SOS dispatch in this prototype
    if (State.currentRole === 'librarian') {
      playSynthBeep(250, 'triangle', 0.35);
      alert("Permission Denied: Librarians do not have SOS dispatch clearance in this system.");
      return;
    }
    sosModal.classList.add('active');
    successAlert.style.display = 'none';
    sosPulseBtn.style.background = 'var(--accent-danger)';
    sosPulseBtn.innerText = "SOS";
    sosCountdown = 3;
    countdownTxt.innerText = `Release to cancel (3)`;
    
    playSynthBeep(350, 'sawtooth', 0.2);
    
    sosTimer = setInterval(() => {
      sosCountdown--;
      countdownTxt.innerText = `Release to cancel (${sosCountdown})`;
      playSynthBeep(350 + (3 - sosCountdown) * 200, 'sawtooth', 0.15);

      if (sosCountdown <= 0) {
        clearInterval(sosTimer);
        sosTimer = null;
        sosPulseBtn.style.background = '#10b981';
        sosPulseBtn.innerText = "ACTIVE";
        countdownTxt.innerText = "POLICE & RESCUE DISPATCHED";
        successAlert.style.display = 'block';
        startAlarmSiren();
        
        // Register critical dispatch hazard
        State.hazardReports.unshift({
          id: Date.now(),
          type: 'suspicious',
          location: 'Library M1 (Active GPS Command)',
          desc: `CRITICAL BEACON FIRED BY ${State.userRoles[State.currentRole].name.toUpperCase()} (${State.currentRole.toUpperCase()})`,
          status: 'critical',
          time: 'Just now'
        });
        renderHazardReports();
        triggerNotification(`CRITICAL SOS: Emergency dispatch beacon activated.`);
      }
    }, 1000);
  };

  const cancelSOS = () => {
    if (sosTimer) {
      clearInterval(sosTimer);
      sosTimer = null;
    }
    stopAlarmSiren();
    sosModal.classList.remove('active');
  };

  if (sosTrigger) sosTrigger.addEventListener('click', triggerSOS);
  if (closeSosBtn) closeSosBtn.addEventListener('click', cancelSOS);
  if (sosModal) {
    sosModal.addEventListener('click', (e) => {
      if (e.target === sosModal) cancelSOS();
    });
  }
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  // Setup default sidebar locked state classes
  changeRole('student');

  // Render components
  renderHazardReports();
  renderSustainabilityChart();
  renderAccessibilityList();
  renderBookingMatrix();
  renderBuzzFeed();
  renderTutorList();
  renderNotificationDrawer();

  // Set up listeners
  setupEventListeners();

  console.log("Campus360 Prototype Logic Loaded successfully.");
});
