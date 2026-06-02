const API_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('token');
let currentUserId = localStorage.getItem('userId');
let currentUserName = localStorage.getItem('userName');

// Initialize app on load
window.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('attendanceDate').value = today;
  document.getElementById('monthFilter').value = new Date().toISOString().slice(0, 7);

  if (authToken && currentUserId) {
    showAppSection();
  } else {
    showAuthSection();
  }
});

// Toggle between login and register forms
function toggleForms() {
  document.getElementById('loginForm').classList.toggle('hidden');
  document.getElementById('registerForm').classList.toggle('hidden');
}

// Register user
async function register() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  if (!name || !email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      authToken = data.token;
      currentUserId = data.userId;
      currentUserName = name;
      localStorage.setItem('token', authToken);
      localStorage.setItem('userId', currentUserId);
      localStorage.setItem('userName', currentUserName);
      showAppSection();
    } else {
      alert(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during registration');
  }
}

// Login user
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please fill all fields');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      authToken = data.token;
      currentUserId = data.userId;
      currentUserName = data.name;
      localStorage.setItem('token', authToken);
      localStorage.setItem('userId', currentUserId);
      localStorage.setItem('userName', currentUserName);
      showAppSection();
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during login');
  }
}

// Mark attendance
async function markAttendance() {
  const date = document.getElementById('attendanceDate').value;
  const status = document.getElementById('attendanceStatus').value;
  const notes = document.getElementById('attendanceNotes').value;

  if (!date) {
    alert('Please select a date');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ date, status, notes })
    });

    if (response.ok) {
      alert('Attendance marked successfully!');
      document.getElementById('attendanceNotes').value = '';
      loadAttendance();
      loadStats();
    } else {
      alert('Failed to mark attendance');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred');
  }
}

// Load attendance records
async function loadAttendance() {
  try {
    const response = await fetch(`${API_URL}/attendance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    displayAttendance(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Filter attendance by month
function filterAttendance() {
  loadAttendance();
}

// Display attendance records
function displayAttendance(records) {
  const container = document.getElementById('attendanceList');
  const monthFilter = document.getElementById('monthFilter').value;

  let filteredRecords = records;
  if (monthFilter) {
    filteredRecords = records.filter(r => r.date.startsWith(monthFilter));
  }

  if (filteredRecords.length === 0) {
    container.innerHTML = '<p>No attendance records found</p>';
    return;
  }

  container.innerHTML = filteredRecords.map(record => `
    <div class="attendance-item ${record.status}">
      <div>
        <div class="attendance-date">${formatDate(record.date)}</div>
        <div class="attendance-notes">${record.notes || 'No notes'}</div>
      </div>
      <div class="attendance-status status-${record.status}">${record.status}</div>
    </div>
  `).join('');
}

// Load statistics
async function loadStats() {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();
    displayStats(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Display statistics
function displayStats(stats) {
  const container = document.getElementById('statsContainer');
  const statMap = {};
  stats.forEach(s => {
    statMap[s.status] = s.count;
  });

  const total = stats.reduce((sum, s) => sum + s.count, 0);

  container.innerHTML = `
    <div class="stat-item">
      <div class="stat-label">Total</div>
      <div class="stat-value">${total}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Present</div>
      <div class="stat-value" style="color: #28a745;">${statMap.present || 0}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Absent</div>
      <div class="stat-value" style="color: #f0483f;">${statMap.absent || 0}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Leave</div>
      <div class="stat-value" style="color: #ffc107;">${statMap.leave || 0}</div>
    </div>
  `;
}

// Show app section
function showAppSection() {
  document.getElementById('authSection').classList.add('hidden');
  document.getElementById('appSection').classList.remove('hidden');
  document.getElementById('userName').textContent = currentUserName;
  loadAttendance();
  loadStats();
}

// Show auth section
function showAuthSection() {
  document.getElementById('authSection').classList.remove('hidden');
  document.getElementById('appSection').classList.add('hidden');
}

// Logout
function logout() {
  authToken = null;
  currentUserId = null;
  currentUserName = null;
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('regName').value = '';
  document.getElementById('regEmail').value = '';
  document.getElementById('regPassword').value = '';
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  showAuthSection();
}

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}
